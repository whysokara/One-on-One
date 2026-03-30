import test from "node:test";
import assert from "node:assert/strict";
import { GET } from "@/app/health/route";

test("/health returns a no-store success payload", async () => {
  const response = GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");

  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, "oneonone");
  assert.equal(typeof body.timestamp, "string");
});
