import assert from "node:assert/strict";
import test from "node:test";
import { AIProviderError, isFallbackError } from "./errors.ts";

test("fallback is allowed for quota and model availability errors", () => {
  assert.equal(isFallbackError(new AIProviderError("quota_exceeded", "quota")), true);
  assert.equal(isFallbackError(new AIProviderError("model_unavailable", "model")), true);
  assert.equal(isFallbackError(new AIProviderError("model_access_denied", "permission")), true);
});

test("fallback is blocked for invalid keys and policy errors", () => {
  assert.equal(isFallbackError(new AIProviderError("invalid_key", "key")), false);
  assert.equal(isFallbackError(new AIProviderError("policy_rejected", "policy")), false);
});
