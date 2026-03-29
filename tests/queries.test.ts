import test from "node:test";
import assert from "node:assert/strict";
import { filterEntries, normalizeEntryCategoryFilter, normalizeEntryVisibilityFilter, summarizeBoardHealth, summarizeBoardYearMetrics } from "@/lib/queries";

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

test("filterEntries narrows by category and visibility", () => {
  const entries = [
    { id: "1", category: "achievement", visibility: "shared", title: "", description: "", entryDate: "", updatedAt: "" },
    { id: "2", category: "learning", visibility: "shared", title: "", description: "", entryDate: "", updatedAt: "" },
    { id: "3", category: "coaching_note", visibility: "manager_private", title: "", description: "", entryDate: "", updatedAt: "" },
  ] as const;

  assert.equal(filterEntries([...entries], "all", "shared").length, 2);
  assert.equal(filterEntries([...entries], "learning", "all").length, 1);
  assert.equal(filterEntries([...entries], "learning", "manager_private").length, 0);
});

test("summarizeBoardHealth reports active and stale reportees", () => {
  const summary = summarizeBoardHealth({
    boardUpdatedAt: "2026-03-01T00:00:00.000Z",
    members: [
      { lastUpdated: "2026-03-20T00:00:00.000Z" },
      { lastUpdated: "2026-01-15T00:00:00.000Z" },
    ],
    entries: [
      { id: "1", updatedAt: "2026-03-18T00:00:00.000Z" } as never,
      { id: "2", updatedAt: "2026-03-25T00:00:00.000Z" } as never,
    ],
    announcements: [
      { id: "a1", updatedAt: "2026-03-26T00:00:00.000Z" } as never,
    ],
    now: new Date("2026-03-29T00:00:00.000Z"),
  });

  assert.equal(summary.activeReportees, 1);
  assert.equal(summary.staleReportees, 1);
  assert.equal(summary.latestActivityAt, "2026-03-26T00:00:00.000Z");
});

test("summarizeBoardYearMetrics counts the current year's important items", () => {
  const metrics = summarizeBoardYearMetrics(
    [
      { id: "1", visibility: "shared", category: "certification", entryDate: "2026-03-01", updatedAt: "2026-03-01T00:00:00.000Z" } as never,
      { id: "2", visibility: "shared", category: "appreciation", entryDate: "2026-03-02", updatedAt: "2026-03-02T00:00:00.000Z" } as never,
      { id: "3", visibility: "shared", category: "issue", entryDate: "2026-03-03", updatedAt: "2026-03-03T00:00:00.000Z" } as never,
      { id: "4", visibility: "shared", category: "achievement", entryDate: "2025-12-31", updatedAt: "2025-12-31T00:00:00.000Z" } as never,
      { id: "5", visibility: "manager_private", category: "coaching_note", entryDate: "2026-03-04", updatedAt: "2026-03-04T00:00:00.000Z" } as never,
    ],
    new Date("2026-03-29T00:00:00.000Z"),
  );

  assert.equal(metrics.total, 3);
  assert.equal(metrics.certifications, 1);
  assert.equal(metrics.awards, 1);
  assert.equal(metrics.needsAttention, 1);
});
