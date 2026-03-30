export type AwsAppConfig = {
  awsRegion: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
  usersTable: string;
  boardsTable: string;
  membershipsTable: string;
  entriesTable: string;
  announcementsTable: string;
};

const DEFAULT_AWS_CONFIG: AwsAppConfig = {
  awsRegion: "ap-south-1",
  cognitoUserPoolId: "ap-south-1_jtsxZCyUB",
  cognitoUserPoolClientId: "6vrj0ldklvtg5f81epkctkoeut",
  usersTable: "oneonone-users",
  boardsTable: "oneonone-boards",
  membershipsTable: "oneonone-memberships",
  entriesTable: "oneonone-entries",
  announcementsTable: "oneonone-announcements",
};

function readValue(value: string | undefined) {
  return value?.trim() ? value.trim() : null;
}

export function getAwsConfig(): AwsAppConfig | null {
  const awsRegion = readValue(process.env.ONEONONE_AWS_REGION) ?? readValue(process.env.AWS_REGION) ?? DEFAULT_AWS_CONFIG.awsRegion;
  const cognitoUserPoolId = readValue(process.env.COGNITO_USER_POOL_ID) ?? DEFAULT_AWS_CONFIG.cognitoUserPoolId;
  const cognitoUserPoolClientId =
    readValue(process.env.COGNITO_USER_POOL_CLIENT_ID) ?? DEFAULT_AWS_CONFIG.cognitoUserPoolClientId;
  const usersTable = readValue(process.env.DDB_USERS_TABLE) ?? DEFAULT_AWS_CONFIG.usersTable;
  const boardsTable = readValue(process.env.DDB_BOARDS_TABLE) ?? DEFAULT_AWS_CONFIG.boardsTable;
  const membershipsTable = readValue(process.env.DDB_MEMBERSHIPS_TABLE) ?? DEFAULT_AWS_CONFIG.membershipsTable;
  const entriesTable = readValue(process.env.DDB_ENTRIES_TABLE) ?? DEFAULT_AWS_CONFIG.entriesTable;
  const announcementsTable =
    readValue(process.env.DDB_ANNOUNCEMENTS_TABLE) ?? DEFAULT_AWS_CONFIG.announcementsTable;

  return {
    awsRegion,
    cognitoUserPoolId,
    cognitoUserPoolClientId,
    usersTable,
    boardsTable,
    membershipsTable,
    entriesTable,
    announcementsTable,
  };
}

export function requireAwsConfig() {
  const config = getAwsConfig();
  if (!config) {
    throw new Error("AWS configuration is missing. Set the One-on-One environment variables before using the app.");
  }
  return config;
}
