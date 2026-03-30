import test from "node:test";
import assert from "node:assert/strict";
import { buildInviteLink } from "@/lib/urls";

test("buildInviteLink uses the request host when available", () => {
  const headers = new Headers({
    host: "192.168.1.9:3000",
    "x-forwarded-proto": "http",
  });

  assert.equal(buildInviteLink("board-1", headers), "http://192.168.1.9:3000/join?boardId=board-1");
});

test("buildInviteLink falls back to the configured base url when host headers are missing", () => {
  const headers = new Headers();

  assert.equal(
    buildInviteLink("board-2", headers, "https://example.com"),
    "https://example.com/join?boardId=board-2",
  );
});

test("buildInviteLink rejects missing host and fallback url", () => {
  const headers = new Headers();

  assert.throws(() => buildInviteLink("board-3", headers, ""), /Cannot build an invite link/);
});
