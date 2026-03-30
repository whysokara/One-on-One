import test from "node:test";
import assert from "node:assert/strict";
import { consumeRateLimit } from "@/lib/rate-limit";

test("consumeRateLimit allows requests up to the limit and then blocks", () => {
  const store = new Map<string, number[]>();

  assert.equal(consumeRateLimit(store, "login:1.2.3.4", 2, 1000, 100).allowed, true);
  assert.equal(consumeRateLimit(store, "login:1.2.3.4", 2, 1000, 200).allowed, true);

  const blocked = consumeRateLimit(store, "login:1.2.3.4", 2, 1000, 300);
  assert.equal(blocked.allowed, false);
  assert.ok((blocked.retryAfterMs ?? 0) > 0);
});

test("consumeRateLimit resets after the window passes", () => {
  const store = new Map<string, number[]>();

  assert.equal(consumeRateLimit(store, "signup:1.2.3.4", 1, 1000, 100).allowed, true);
  assert.equal(consumeRateLimit(store, "signup:1.2.3.4", 1, 1000, 1200).allowed, true);
});
