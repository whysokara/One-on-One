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

const PAGE_SIZE = 100;
const BATCH_GET_SIZE = 100;

async function queryAll<T>(commandFactory: (exclusiveStartKey?: Record<string, unknown>) => QueryCommand) {
  const client = getDocumentClient();
  const items: T[] = [];
  let exclusiveStartKey: Record<string, unknown> | undefined;

  do {
    const result = await client.send(commandFactory(exclusiveStartKey));
    items.push(...((result.Items ?? []) as T[]));
    exclusiveStartKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (exclusiveStartKey);

  return items;
}

async function batchGetUsers(userIds: string[]) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const users: User[] = [];
  let remainingIds = [...new Set(userIds)];

  for (let attempts = 0; remainingIds.length && attempts < 10; attempts += 1) {
    const keys = remainingIds.slice(0, BATCH_GET_SIZE).map((id) => ({ id }));
    remainingIds = remainingIds.slice(BATCH_GET_SIZE);

    const batch = await client.send(
      new BatchGetCommand({
        RequestItems: {
          [config.usersTable]: { Keys: keys },
        },
      }),
    );

    users.push(...((batch.Responses?.[config.usersTable] as User[] | undefined) ?? []));

    const unprocessed = batch.UnprocessedKeys?.[config.usersTable]?.Keys ?? [];
    if (unprocessed.length) {
      remainingIds = [
        ...unprocessed.map((key) => key.id as string),
        ...remainingIds,
      ];
    }
  }

  if (remainingIds.length) {
    throw new Error("Unable to load all board members right now.");
  }

  return users;
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
  const existingBoard = await getManagerBoard(input.managerId);

  if (existingBoard) {
    throw new Error("You already have a board.");
  }

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

  try {
    await client.send(
      new PutCommand({
        TableName: config.membershipsTable,
        Item: membership,
        ConditionExpression: "attribute_not_exists(id)",
      }),
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") {
      throw new Error("You have already joined this board.");
    }
    throw error;
  }

  return {
    id: membership.id,
    boardId: membership.boardId,
    userId: membership.userId,
    joinedAt: membership.joinedAt,
  } satisfies BoardMember;
}

export async function getBoardMembers(boardId: string) {
  const config = requireAwsConfig();
  const memberships = await queryAll<MembershipItem>((exclusiveStartKey) =>
    new QueryCommand({
      TableName: config.membershipsTable,
      KeyConditionExpression: "boardId = :boardId",
      ExpressionAttributeValues: {
        ":boardId": boardId,
      },
      Limit: PAGE_SIZE,
      ExclusiveStartKey: exclusiveStartKey,
    }),
  );

  if (!memberships.length) {
    return [];
  }

  return batchGetUsers(memberships.map((member) => member.userId));
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

export async function removeBoardMember(boardId: string, userId: string) {
  const client = getDocumentClient();
  const config = requireAwsConfig();
  const membership = await getMembership(boardId, userId);

  if (!membership) {
    throw new Error("This person is no longer part of the board.");
  }

  const employeeEntries = await getEntriesForEmployee(userId);
  const boardEntries = employeeEntries.filter((entry) => entry.boardId === boardId);

  await Promise.all(boardEntries.map((entry) => deleteEntry(entry.id)));

  await client.send(
    new DeleteCommand({
      TableName: config.membershipsTable,
      Key: {
        boardId,
        id: `${boardId}#${userId}`,
      },
    }),
  );

  return {
    removedEntries: boardEntries.length,
  };
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
  const config = requireAwsConfig();
  const items = await queryAll<EntryItem>((exclusiveStartKey) =>
    new QueryCommand({
      TableName: config.entriesTable,
      IndexName: "boardId-boardSortKey-index",
      KeyConditionExpression: "boardId = :boardId",
      ExpressionAttributeValues: {
        ":boardId": boardId,
      },
      Limit: PAGE_SIZE,
      ExclusiveStartKey: exclusiveStartKey,
      ScanIndexForward: false,
    }),
  );

  return items.map(stripEntryMetadata);
}

export async function getEntriesForEmployee(employeeId: string) {
  const config = requireAwsConfig();
  const items = await queryAll<EntryItem>((exclusiveStartKey) =>
    new QueryCommand({
      TableName: config.entriesTable,
      IndexName: "employeeId-employeeSortKey-index",
      KeyConditionExpression: "employeeId = :employeeId",
      ExpressionAttributeValues: {
        ":employeeId": employeeId,
      },
      Limit: PAGE_SIZE,
      ExclusiveStartKey: exclusiveStartKey,
      ScanIndexForward: false,
    }),
  );

  return items.map(stripEntryMetadata);
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
  const config = requireAwsConfig();
  const items = await queryAll<AnnouncementItem>((exclusiveStartKey) =>
    new QueryCommand({
      TableName: config.announcementsTable,
      IndexName: "boardId-boardSortKey-index",
      KeyConditionExpression: "boardId = :boardId",
      ExpressionAttributeValues: {
        ":boardId": boardId,
      },
      Limit: PAGE_SIZE,
      ExclusiveStartKey: exclusiveStartKey,
      ScanIndexForward: false,
    }),
  );

  return items.map(stripAnnouncementMetadata);
}

function stripEntryMetadata(item: EntryItem): Entry {
  const { boardSortKey, employeeSortKey, ...entry } = item;
  void boardSortKey;
  void employeeSortKey;
  return entry;
}

function stripAnnouncementMetadata(item: AnnouncementItem): Announcement {
  const { boardSortKey, ...announcement } = item;
  void boardSortKey;
  return announcement;
}
