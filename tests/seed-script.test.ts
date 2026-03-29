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
});
