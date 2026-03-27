const OPTIONAL_ENV_KEYS = [
  "AWS_REGION",
  "COGNITO_USER_POOL_ID",
  "COGNITO_USER_POOL_CLIENT_ID",
  "DDB_USERS_TABLE",
  "DDB_BOARDS_TABLE",
  "DDB_MEMBERSHIPS_TABLE",
  "DDB_ENTRIES_TABLE",
  "DDB_ANNOUNCEMENTS_TABLE",
  "APP_BASE_URL",
] as const;

type OptionalEnvKey = (typeof OPTIONAL_ENV_KEYS)[number];

export type AwsAppConfig = {
  awsRegion: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
  usersTable: string;
  boardsTable: string;
  membershipsTable: string;
  entriesTable: string;
  announcementsTable: string;
  appBaseUrl: string;
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
  const appBaseUrl = readOptional("APP_BASE_URL");

  if (
    !awsRegion ||
    !cognitoUserPoolId ||
    !cognitoUserPoolClientId ||
    !usersTable ||
    !boardsTable ||
    !membershipsTable ||
    !entriesTable ||
    !announcementsTable ||
    !appBaseUrl
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
    appBaseUrl,
  };
}

export function requireAwsConfig() {
  const config = getAwsConfig();
  if (!config) {
    throw new Error("AWS configuration is missing. Set the Oneonone environment variables before using the app.");
  }
  return config;
}
