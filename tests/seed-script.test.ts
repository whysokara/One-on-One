import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

test("live seed script requires explicit confirmation", () => {
  const contents = readFileSync(path.join(root, "scripts/seed-aditya.mjs"), "utf8");

  assert.match(contents, /ONEONONE_ALLOW_LIVE_SEED/);
  assert.match(contents, /--confirm-live-seed/);
  assert.match(contents, /Refusing to run the live seed script without confirmation/);
  assert.match(contents, /SEED_BOARD_ID/);
  assert.match(contents, /SEED_EMAIL/);
  assert.match(contents, /SEED_FULL_NAME/);
  assert.match(contents, /SEED_PASSWORD/);
  assert.match(contents, /SEED_ENTRY_DATE/);
  assert.doesNotMatch(contents, /aditya\.ojha@example\.com/);
  assert.doesNotMatch(contents, /Aditya2026A/);
  assert.doesNotMatch(contents, /10817604-46c4-4356-a560-0a85818921fe/);
});
