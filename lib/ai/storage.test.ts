import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { clearConnection, loadConnection, saveConnection } from "./storage.ts";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: new MemoryStorage() });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: new MemoryStorage() });
});

test("connection without remember is stored only for the browser session", () => {
  saveConnection({ provider: "google", apiKey: "test-google-key-123456789", modelMode: "auto", preferredModel: null, remember: false });
  assert.equal(localStorage.getItem("fpt-ai-connection"), null);
  assert.equal(loadConnection()?.provider, "google");
});

test("remembered connection is stored locally and can be disconnected", () => {
  saveConnection({ provider: "openai", apiKey: "test-openai-key-123456789", modelMode: "manual", preferredModel: "allowed-model", remember: true });
  assert.equal(sessionStorage.getItem("fpt-ai-connection-session"), null);
  assert.equal(loadConnection()?.preferredModel, "allowed-model");
  clearConnection();
  assert.equal(loadConnection(), null);
});

test("legacy OpenAI key migrates without losing the selected storage scope", () => {
  localStorage.setItem("fpt-openai-api-key", "legacy-openai-key-123456789");
  const connection = loadConnection();
  assert.equal(connection?.provider, "openai");
  assert.equal(connection?.modelMode, "auto");
  assert.equal(connection?.remember, true);
  assert.equal(localStorage.getItem("fpt-openai-api-key"), null);
  assert.ok(localStorage.getItem("fpt-ai-connection"));
});
