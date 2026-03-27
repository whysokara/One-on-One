import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEntryCategoryFilter, normalizeEntryVisibilityFilter } from "@/lib/queries";

test("normalizeEntryCategoryFilter falls back to all for unknown values", () => {
  assert.equal(normalizeEntryCategoryFilter(undefined), "all");
  assert.equal(normalizeEntryCategoryFilter("achievement"), "achievement");
  assert.equal(normalizeEntryCategoryFilter("nonsense"), "all");
});

test("normalizeEntryVisibilityFilter allows only supported visibility values", () => {
  assert.equal(normalizeEntryVisibilityFilter(undefined), "all");
  assert.equal(normalizeEntryVisibilityFilter("shared"), "shared");
  assert.equal(normalizeEntryVisibilityFilter("manager_private"), "manager_private");
  assert.equal(normalizeEntryVisibilityFilter("secret"), "all");
});
