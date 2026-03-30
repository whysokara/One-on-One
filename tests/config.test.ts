import test from "node:test";
import assert from "node:assert/strict";
import { getAwsConfig } from "@/lib/config";

test("aws config prefers the Amplify-safe region variable when present", () => {
  const originalRegion = process.env.AWS_REGION;
  const originalSafeRegion = process.env.ONEONONE_AWS_REGION;
  const originalPool = process.env.COGNITO_USER_POOL_ID;
  const originalClient = process.env.COGNITO_USER_POOL_CLIENT_ID;
  const originalUsersTable = process.env.DDB_USERS_TABLE;
  const originalBoardsTable = process.env.DDB_BOARDS_TABLE;
  const originalMembershipsTable = process.env.DDB_MEMBERSHIPS_TABLE;
  const originalEntriesTable = process.env.DDB_ENTRIES_TABLE;
  const originalAnnouncementsTable = process.env.DDB_ANNOUNCEMENTS_TABLE;

  process.env.AWS_REGION = "";
  process.env.ONEONONE_AWS_REGION = "ap-south-1";
  process.env.COGNITO_USER_POOL_ID = "pool";
  process.env.COGNITO_USER_POOL_CLIENT_ID = "client";
  process.env.DDB_USERS_TABLE = "users";
  process.env.DDB_BOARDS_TABLE = "boards";
  process.env.DDB_MEMBERSHIPS_TABLE = "memberships";
  process.env.DDB_ENTRIES_TABLE = "entries";
  process.env.DDB_ANNOUNCEMENTS_TABLE = "announcements";

  try {
    const config = getAwsConfig();
    assert.ok(config);
    assert.equal(config.awsRegion, "ap-south-1");
  } finally {
    process.env.AWS_REGION = originalRegion;
    process.env.ONEONONE_AWS_REGION = originalSafeRegion;
    process.env.COGNITO_USER_POOL_ID = originalPool;
    process.env.COGNITO_USER_POOL_CLIENT_ID = originalClient;
    process.env.DDB_USERS_TABLE = originalUsersTable;
    process.env.DDB_BOARDS_TABLE = originalBoardsTable;
    process.env.DDB_MEMBERSHIPS_TABLE = originalMembershipsTable;
    process.env.DDB_ENTRIES_TABLE = originalEntriesTable;
    process.env.DDB_ANNOUNCEMENTS_TABLE = originalAnnouncementsTable;
  }
});
