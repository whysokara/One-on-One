import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function loadEnv(filePath) {
  const contents = fs.readFileSync(filePath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnv(path.join(root, ".env.local"));

const boardId = "10817604-46c4-4356-a560-0a85818921fe";
const email = "aditya.ojha@example.com";
const fullName = "Aditya Ojha";
const password = "Aditya2026A";
const today = "2026-03-29";
const now = new Date().toISOString();

const requiredEnv = [
  "AWS_REGION",
  "COGNITO_USER_POOL_ID",
  "DDB_USERS_TABLE",
  "DDB_BOARDS_TABLE",
  "DDB_MEMBERSHIPS_TABLE",
  "DDB_ENTRIES_TABLE",
  "DDB_ANNOUNCEMENTS_TABLE",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key} in .env.local`);
  }
}

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

async function ensureAditya() {
  try {
    await cognito.send(
      new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
      }),
    );

    await cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true,
      }),
    );

    await cognito.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: fullName },
          { Name: "custom:role", Value: "reportee" },
        ],
      }),
    );
  } catch (error) {
    const name = error?.name ?? error?.constructor?.name;
    if (name !== "UserNotFoundException") {
      throw error;
    }

    await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        TemporaryPassword: password,
        MessageAction: "SUPPRESS",
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: fullName },
          { Name: "custom:role", Value: "reportee" },
        ],
      }),
    );

    await cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true,
      }),
    );
  }

  const user = await cognito.send(
    new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
    }),
  );

  const sub = user.UserAttributes?.find((attr) => attr.Name === "sub")?.Value;
  if (!sub) {
    throw new Error("Unable to determine Aditya Cognito sub.");
  }

  return sub;
}

async function main() {
  const board = await ddb.send(
    new GetCommand({
      TableName: process.env.DDB_BOARDS_TABLE,
      Key: { id: boardId },
    }),
  );

  const managerId = board.Item?.managerId;
  if (!managerId) {
    throw new Error(`Board ${boardId} not found.`);
  }

  const adityaSub = await ensureAditya();

  await ddb.send(
    new PutCommand({
      TableName: process.env.DDB_USERS_TABLE,
      Item: {
        id: adityaSub,
        cognitoSub: adityaSub,
        fullName,
        email,
        role: "reportee",
        createdAt: now,
        updatedAt: now,
      },
    }),
  );

  await ddb.send(
    new PutCommand({
      TableName: process.env.DDB_MEMBERSHIPS_TABLE,
      Item: {
        id: `${boardId}#${adityaSub}`,
        boardId,
        userId: adityaSub,
        joinedAt: now,
        membershipKey: adityaSub,
        userJoinedAt: now,
      },
    }),
  );

  const entries = [
    {
      id: "aditya-aws-certified-20260329",
      category: "certification",
      title: "AWS Certified",
      description: "Completed AWS certification and logged the credential for the review cycle.",
    },
    {
      id: "aditya-client-5-star-award-20260329",
      category: "appreciation",
      title: "Received a 5 star Houns award from client",
      description: "Client shared excellent feedback and gave a 5-star recognition for the work delivered.",
    },
  ];

  for (const entry of entries) {
    await ddb.send(
      new PutCommand({
        TableName: process.env.DDB_ENTRIES_TABLE,
        Item: {
          id: entry.id,
          boardId,
          employeeId: adityaSub,
          createdByUserId: adityaSub,
          visibility: "shared",
          category: entry.category,
          title: entry.title,
          description: entry.description,
          entryDate: today,
          createdAt: now,
          updatedAt: now,
          boardSortKey: `${today}#${now}#${entry.id}`,
          employeeSortKey: `${today}#${now}#${entry.id}`,
        },
      }),
    );
  }

  await ddb.send(
    new PutCommand({
      TableName: process.env.DDB_ENTRIES_TABLE,
      Item: {
        id: "rajeev-note-aditya-20260329",
        boardId,
        employeeId: adityaSub,
        createdByUserId: managerId,
        visibility: "manager_private",
        category: "coaching_note",
        title: "Keep surfacing strong client feedback",
        description: "Aditya is already showing certification momentum and client impact. Keep documenting wins and blockers clearly.",
        entryDate: today,
        createdAt: now,
        updatedAt: now,
        boardSortKey: `${today}#${now}#rajeev-note-aditya-20260329`,
        employeeSortKey: `${today}#${now}#rajeev-note-aditya-20260329`,
      },
    }),
  );

  await ddb.send(
    new PutCommand({
      TableName: process.env.DDB_ANNOUNCEMENTS_TABLE,
      Item: {
        id: "announcement-aditya-welcome-20260329",
        boardId,
        createdByUserId: managerId,
        title: "Welcome Aditya to the board",
        message: "Aditya Ojha has joined the board. Please keep entries current and share blockers early.",
        createdAt: now,
        updatedAt: now,
        boardSortKey: `${now}#announcement-aditya-welcome-20260329`,
      },
    }),
  );

  console.log(
    JSON.stringify(
      {
        boardId,
        managerId,
        adityaSub,
        email,
        password,
        entries: entries.map((entry) => entry.id),
        privateNote: "rajeev-note-aditya-20260329",
        announcement: "announcement-aditya-welcome-20260329",
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
