import {
  BatchGetCommand,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getDocumentClient } from "@/lib/aws-clients";
import { requireAwsConfig } from "@/lib/config";
import {
  Announcement,
  Board,
  BoardMember,
  Entry,
  EntryCategory,
  EntryVisibility,
  User,
  UserRole,
} from "@/lib/types";
import { generateId, generateInviteCode } from "@/lib/utils";

type BoardItem = Board;

type MembershipItem = BoardMember & {
  membershipKey: string;
  userJoinedAt: string;
};

type EntryItem = Entry & {
  boardSortKey: string;
  employeeSortKey: string;
};

type AnnouncementItem = Announcement & {
  boardSortKey: string;
};

function now() {
  return new Date().toISOString();
}

function buildSortKey(dateValue: string, createdAt: string, id: string) {
  return `${dateValue}#${createdAt}#${id}`;
}

async function uniqueInviteCode() {
  let inviteCode = generateInviteCode();
  while (await getBoardByInviteCode(inviteCode)) {
    inviteCode = generateInviteCode();
  }
  return inviteCode;
}

export async function createUserProfile(input: {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const timestamp = now();

  const user: User = {
    id: input.id,
    cognitoSub: input.id,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await client.send(
    new PutCommand({
      TableName: config.usersTable,
      Item: user,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  return user;
}

export async function ensureUserProfile(input: {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}) {
  const existing = await getUserById(input.id);
  if (existing) {
    return existing;
  }

  try {
    return await createUserProfile(input);
  } catch {
    const current = await getUserById(input.id);
    if (!current) {
      throw new Error("Unable to create One-on-One user profile.");
    }
    return current;
  }
}

export async function getUserById(id: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new GetCommand({
      TableName: config.usersTable,
      Key: { id },
    }),
  );

  return (result.Item as User | undefined) ?? null;
}

export async function createBoard(input: {
  managerId: string;
  name: string;
  description: string;
}) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const timestamp = now();

  const board: BoardItem = {
    id: generateId(),
    managerId: input.managerId,
    name: input.name.trim(),
    description: input.description.trim(),
    inviteCode: await uniqueInviteCode(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await client.send(
    new PutCommand({
      TableName: config.boardsTable,
      Item: board,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  return board;
}

export async function getBoardById(id: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new GetCommand({
      TableName: config.boardsTable,
      Key: { id },
    }),
  );

  return (result.Item as Board | undefined) ?? null;
}

export async function getBoardByInviteCode(code: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new QueryCommand({
      TableName: config.boardsTable,
      IndexName: "inviteCode-index",
      KeyConditionExpression: "inviteCode = :inviteCode",
      ExpressionAttributeValues: {
        ":inviteCode": code.trim().toUpperCase(),
      },
      Limit: 1,
    }),
  );

  return ((result.Items ?? [])[0] as Board | undefined) ?? null;
}

export async function getManagerBoard(managerId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new QueryCommand({
      TableName: config.boardsTable,
      IndexName: "managerId-index",
      KeyConditionExpression: "managerId = :managerId",
      ExpressionAttributeValues: {
        ":managerId": managerId,
      },
      Limit: 1,
    }),
  );

  return ((result.Items ?? [])[0] as Board | undefined) ?? null;
}

export async function getBoardForReportee(userId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const membership = await client.send(
    new QueryCommand({
      TableName: config.membershipsTable,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      Limit: 1,
    }),
  );

  const item = (membership.Items ?? [])[0] as MembershipItem | undefined;
  if (!item) {
    return null;
  }

  return getBoardById(item.boardId);
}

export async function joinBoard(boardId: string, userId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const [board, existingBoard] = await Promise.all([getBoardById(boardId), getBoardForReportee(userId)]);
  if (!board) {
    throw new Error("Board not found.");
  }

  if (board.managerId === userId) {
    throw new Error("Managers cannot join their own board as a reportee.");
  }

  if (existingBoard && existingBoard.id !== boardId) {
    throw new Error(`You are already attached to "${existingBoard.name}". One-on-One currently supports one board per reportee.`);
  }

  const membership: MembershipItem = {
    id: `${boardId}#${userId}`,
    boardId,
    userId,
    joinedAt: now(),
    membershipKey: userId,
    userJoinedAt: now(),
  };

  await client.send(
    new PutCommand({
      TableName: config.membershipsTable,
      Item: membership,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  return {
    id: membership.id,
    boardId: membership.boardId,
    userId: membership.userId,
    joinedAt: membership.joinedAt,
  } satisfies BoardMember;
}

export async function getBoardMembers(boardId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const membershipResult = await client.send(
    new QueryCommand({
      TableName: config.membershipsTable,
      KeyConditionExpression: "boardId = :boardId",
      ExpressionAttributeValues: {
        ":boardId": boardId,
      },
    }),
  );

  const memberships = (membershipResult.Items ?? []) as MembershipItem[];
  if (!memberships.length) {
    return [];
  }

  const batch = await client.send(
    new BatchGetCommand({
      RequestItems: {
        [config.usersTable]: {
          Keys: memberships.map((member) => ({ id: member.userId })),
        },
      },
    }),
  );

  return (batch.Responses?.[config.usersTable] as User[] | undefined) ?? [];
}

export async function getMembership(boardId: string, userId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new GetCommand({
      TableName: config.membershipsTable,
      Key: {
        boardId,
        id: `${boardId}#${userId}`,
      },
    }),
  );

  const item = result.Item as MembershipItem | undefined;
  if (!item) {
    return null;
  }

  return {
    id: item.id,
    boardId: item.boardId,
    userId: item.userId,
    joinedAt: item.joinedAt,
  } satisfies BoardMember;
}

export async function createEntry(input: {
  boardId: string;
  employeeId: string;
  createdByUserId: string;
  visibility: EntryVisibility;
  category: EntryCategory;
  title: string;
  description: string;
  entryDate: string;
}) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const timestamp = now();
  const id = generateId();

  const entry: EntryItem = {
    id,
    boardId: input.boardId,
    employeeId: input.employeeId,
    createdByUserId: input.createdByUserId,
    visibility: input.visibility,
    category: input.category,
    title: input.title.trim(),
    description: input.description.trim(),
    entryDate: input.entryDate,
    createdAt: timestamp,
    updatedAt: timestamp,
    boardSortKey: buildSortKey(input.entryDate, timestamp, id),
    employeeSortKey: buildSortKey(input.entryDate, timestamp, id),
  };

  await client.send(
    new PutCommand({
      TableName: config.entriesTable,
      Item: entry,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  return entry;
}

export async function updateEntry(input: {
  entryId: string;
  title: string;
  description: string;
  category: EntryCategory;
  entryDate: string;
}) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const existing = await getEntryById(input.entryId);
  if (!existing) {
    throw new Error("Entry not found.");
  }

  const updatedAt = now();
  const updated = await client.send(
    new UpdateCommand({
      TableName: config.entriesTable,
      Key: { id: input.entryId },
      UpdateExpression:
        "SET title = :title, description = :description, category = :category, entryDate = :entryDate, updatedAt = :updatedAt, boardSortKey = :boardSortKey, employeeSortKey = :employeeSortKey",
      ExpressionAttributeValues: {
        ":title": input.title.trim(),
        ":description": input.description.trim(),
        ":category": input.category,
        ":entryDate": input.entryDate,
        ":updatedAt": updatedAt,
        ":boardSortKey": buildSortKey(input.entryDate, existing.createdAt, input.entryId),
        ":employeeSortKey": buildSortKey(input.entryDate, existing.createdAt, input.entryId),
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return updated.Attributes as Entry;
}

export async function deleteEntry(entryId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  await client.send(
    new DeleteCommand({
      TableName: config.entriesTable,
      Key: { id: entryId },
    }),
  );
}

export async function getEntriesForBoard(boardId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new QueryCommand({
      TableName: config.entriesTable,
      IndexName: "boardId-boardSortKey-index",
      KeyConditionExpression: "boardId = :boardId",
      ExpressionAttributeValues: {
        ":boardId": boardId,
      },
      ScanIndexForward: false,
    }),
  );

  return ((result.Items ?? []) as EntryItem[]).map(stripEntryMetadata);
}

export async function getEntryById(entryId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new GetCommand({
      TableName: config.entriesTable,
      Key: { id: entryId },
    }),
  );

  const item = result.Item as EntryItem | undefined;
  return item ? stripEntryMetadata(item) : null;
}

export async function createAnnouncement(input: {
  boardId: string;
  createdByUserId: string;
  title: string;
  message: string;
}) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const timestamp = now();
  const id = generateId();

  const announcement: AnnouncementItem = {
    id,
    boardId: input.boardId,
    createdByUserId: input.createdByUserId,
    title: input.title.trim(),
    message: input.message.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    boardSortKey: buildSortKey(timestamp, timestamp, id),
  };

  await client.send(
    new PutCommand({
      TableName: config.announcementsTable,
      Item: announcement,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  return stripAnnouncementMetadata(announcement);
}

export async function getAnnouncementsForBoard(boardId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const result = await client.send(
    new QueryCommand({
      TableName: config.announcementsTable,
      IndexName: "boardId-boardSortKey-index",
      KeyConditionExpression: "boardId = :boardId",
      ExpressionAttributeValues: {
        ":boardId": boardId,
      },
      ScanIndexForward: false,
    }),
  );

  return ((result.Items ?? []) as AnnouncementItem[]).map(stripAnnouncementMetadata);
}

function stripEntryMetadata(item: EntryItem): Entry {
  const { boardSortKey: _boardSortKey, employeeSortKey: _employeeSortKey, ...entry } = item;
  return entry;
}

function stripAnnouncementMetadata(item: AnnouncementItem): Announcement {
  const { boardSortKey: _boardSortKey, ...announcement } = item;
  return announcement;
}
