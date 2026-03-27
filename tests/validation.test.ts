import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBoardName,
  validateEmail,
  validateEntryTitle,
  validateInviteCode,
  validateIsoDate,
  validatePassword,
} from "@/lib/validation";

test("validateEmail rejects malformed addresses", () => {
  assert.throws(() => validateEmail("not-an-email"), /valid work email/i);
});

test("validatePassword enforces minimum length", () => {
  assert.throws(() => validatePassword("short"), /at least 8 characters/i);
});

test("validateBoardName enforces a minimum length", () => {
  assert.throws(() => validateBoardName("ab"), /at least 3 characters/i);
});

test("validateEntryTitle enforces a minimum length", () => {
  assert.throws(() => validateEntryTitle("ok"), /at least 3 characters/i);
});

test("validateInviteCode accepts only six uppercase letters or digits", () => {
  assert.doesNotThrow(() => validateInviteCode("AB12CD"));
  assert.throws(() => validateInviteCode("abc"), /6 letters or numbers/i);
});

test("validateIsoDate rejects non-ISO dates", () => {
  assert.doesNotThrow(() => validateIsoDate("2026-03-28"));
  assert.throws(() => validateIsoDate("28/03/2026"), /invalid date/i);
});
