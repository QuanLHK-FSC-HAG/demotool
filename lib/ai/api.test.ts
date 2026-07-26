import assert from "node:assert/strict";
import test from "node:test";
import { readJsonBody, isSafeApiKey } from "./api.ts";
import { AIProviderError } from "./errors.ts";

test("readJsonBody parses a valid bounded payload", async () => {
  const request = new Request("https://example.test", { method: "POST", body: JSON.stringify({ provider: "google" }) });
  assert.deepEqual(await readJsonBody(request, 100), { provider: "google" });
});

test("readJsonBody rejects an oversized body even without content-length", async () => {
  const request = new Request("https://example.test", { method: "POST", body: JSON.stringify({ input: "x".repeat(200) }) });
  await assert.rejects(() => readJsonBody(request, 50), (error) => error instanceof AIProviderError && error.status === 413);
});

test("API key validation rejects short keys and line breaks", () => {
  assert.equal(isSafeApiKey("short"), false);
  assert.equal(isSafeApiKey(`${"a".repeat(24)}\nsecret`), false);
  assert.equal(isSafeApiKey("a".repeat(24)), true);
});
