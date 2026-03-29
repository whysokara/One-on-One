import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function routeFile(...segments: string[]) {
  return path.join(root, ...segments);
}

test("core app routes exist", () => {
  const files = [
    "app/page.tsx",
    "app/employee/page.tsx",
    "app/join/page.tsx",
    "app/login/page.tsx",
    "app/workspace/page.tsx",
    "app/signup/page.tsx",
    "app/manager/page.tsx",
    "app/manager/create-board/page.tsx",
    "app/manager/board/[boardId]/page.tsx",
    "app/manager/board/[boardId]/employee/[employeeId]/page.tsx",
  ];

  for (const file of files) {
    assert.ok(existsSync(routeFile(file)), `Expected route file to exist: ${file}`);
  }
});

test("global error and not-found pages exist", () => {
  assert.ok(existsSync(routeFile("app/error.tsx")), "Expected app/error.tsx to exist");
  assert.ok(existsSync(routeFile("app/not-found.tsx")), "Expected app/not-found.tsx to exist");
});

test("next config allows the local dev origin", () => {
  const contents = readFileSync(routeFile("next.config.ts"), "utf8");
  assert.match(contents, /allowedDevOrigins/);
  assert.match(contents, /192\.168\.1\.3:3000/);
  assert.match(contents, /192\.168\.1\.9:3000/);
});

test("amplify build ignores the next lockfile patch step", () => {
  const contents = readFileSync(routeFile("amplify.yml"), "utf8");
  assert.match(contents, /NEXT_IGNORE_INCORRECT_LOCKFILE=true npm run build/);
});

test("shared shell stays mobile-friendly and does not show enterprise branding", () => {
  const ui = readFileSync(routeFile("components/ui.tsx"), "utf8");
  const css = readFileSync(routeFile("app/globals.css"), "utf8");

  assert.doesNotMatch(ui, /Enterprise/);
  assert.match(css, /min-h-dvh/);
  assert.doesNotMatch(css, /h-screen/);
});
