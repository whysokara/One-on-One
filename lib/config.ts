type OptionalEnvKey =
  | "AWS_REGION"
  | "COGNITO_USER_POOL_ID"
  | "COGNITO_USER_POOL_CLIENT_ID"
  | "DDB_USERS_TABLE"
  | "DDB_BOARDS_TABLE"
  | "DDB_MEMBERSHIPS_TABLE"
  | "DDB_ENTRIES_TABLE"
  | "DDB_ANNOUNCEMENTS_TABLE";

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

function readOptional(key: OptionalEnvKey) {
  const value = process.env[key];
  return value?.trim() ? value.trim() : null;
}

export function getAwsConfig(): AwsAppConfig | null {
  const awsRegion = readOptional("AWS_REGION");
  const cognitoUserPoolId = readOptional("COGNITO_USER_POOL_ID");
  const cognitoUserPoolClientId = readOptional("COGNITO_USER_POOL_CLIENT_ID");
  const usersTable = readOptional("DDB_USERS_TABLE");
  const boardsTable = readOptional("DDB_BOARDS_TABLE");
  const membershipsTable = readOptional("DDB_MEMBERSHIPS_TABLE");
  const entriesTable = readOptional("DDB_ENTRIES_TABLE");
  const announcementsTable = readOptional("DDB_ANNOUNCEMENTS_TABLE");
  if (
    !awsRegion ||
    !cognitoUserPoolId ||
    !cognitoUserPoolClientId ||
    !usersTable ||
    !boardsTable ||
    !membershipsTable ||
    !entriesTable ||
    !announcementsTable
  ) {
    return null;
  }

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
