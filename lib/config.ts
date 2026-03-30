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

function readValue(value: string | undefined) {
  return value?.trim() ? value.trim() : null;
}

export function getAwsConfig(): AwsAppConfig | null {
  const awsRegion = readValue(process.env.ONEONONE_AWS_REGION) ?? readValue(process.env.AWS_REGION);
  const cognitoUserPoolId = readValue(process.env.COGNITO_USER_POOL_ID);
  const cognitoUserPoolClientId = readValue(process.env.COGNITO_USER_POOL_CLIENT_ID);
  const usersTable = readValue(process.env.DDB_USERS_TABLE);
  const boardsTable = readValue(process.env.DDB_BOARDS_TABLE);
  const membershipsTable = readValue(process.env.DDB_MEMBERSHIPS_TABLE);
  const entriesTable = readValue(process.env.DDB_ENTRIES_TABLE);
  const announcementsTable = readValue(process.env.DDB_ANNOUNCEMENTS_TABLE);
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
