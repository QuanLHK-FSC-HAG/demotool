import assert from "node:assert/strict";
import test from "node:test";
import { AIProviderError } from "../errors.ts";
import { googleAdapter } from "./google/adapter.ts";
import { openAIAdapter } from "./openai/adapter.ts";

async function useFetchResponse(response: Response, run: () => Promise<void>) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => response) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("Google adapter validates a usable key by listing accessible content models", async () => {
  const response = Response.json({ models: [{ name: "models/provider-model", displayName: "Provider Model", inputTokenLimit: 120000, supportedGenerationMethods: ["generateContent"] }] });
  await useFetchResponse(response, async () => {
    const models = await googleAdapter.listModels("valid-google-key");
    assert.equal(models.length, 1);
    assert.deepEqual(models[0].capabilities, ["text", "long-context"]);
  });
});

test("Google adapter normalizes an invalid key response", async () => {
  const response = Response.json({ error: { message: "invalid API key" } }, { status: 401 });
  await useFetchResponse(response, async () => {
    await assert.rejects(() => googleAdapter.listModels("invalid-google-key"), (error) => error instanceof AIProviderError && error.code === "invalid_key");
  });
});

test("OpenAI adapter keeps only accessible text-generation model families", async () => {
  const response = Response.json({ data: [{ id: "gpt-provider-model" }, { id: "text-embedding-provider" }] });
  await useFetchResponse(response, async () => {
    const models = await openAIAdapter.listModels("valid-openai-key");
    assert.deepEqual(models.map((model) => model.id), ["gpt-provider-model"]);
  });
});

test("OpenAI adapter normalizes an invalid key response", async () => {
  const response = Response.json({ error: { message: "invalid bearer token" } }, { status: 401 });
  await useFetchResponse(response, async () => {
    await assert.rejects(() => openAIAdapter.listModels("invalid-openai-key"), (error) => error instanceof AIProviderError && error.code === "invalid_key");
  });
});
