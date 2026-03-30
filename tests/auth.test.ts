import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function file(...segments: string[]) {
  return path.join(root, ...segments);
}

test("signup sends a cognito verification link instead of auto-confirming", () => {
  const contents = readFileSync(file("lib/auth.ts"), "utf8");

  assert.match(contents, /SignUpCommand/);
  assert.match(contents, /ResendConfirmationCodeCommand/);
  assert.doesNotMatch(contents, /AdminConfirmSignUpCommand/);
  assert.doesNotMatch(contents, /UserPoolId:\s*config\.cognitoUserPoolId/);
  assert.match(contents, /Username:\s*email/);
});
