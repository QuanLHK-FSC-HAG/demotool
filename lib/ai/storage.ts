import type { AIConnection } from "@/lib/ai/types";

const LOCAL_CONNECTION_KEY = "fpt-ai-connection";
const SESSION_CONNECTION_KEY = "fpt-ai-connection-session";
const LEGACY_LOCAL_KEY = "fpt-openai-api-key";
const LEGACY_SESSION_KEY = "fpt-openai-api-key-session";

function parseConnection(value: string | null): AIConnection | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as AIConnection;
    if (!parsed.apiKey || !["google", "openai"].includes(parsed.provider)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadConnection() {
  const current = parseConnection(localStorage.getItem(LOCAL_CONNECTION_KEY)) || parseConnection(sessionStorage.getItem(SESSION_CONNECTION_KEY));
  if (current) return current;

  const legacyLocal = localStorage.getItem(LEGACY_LOCAL_KEY);
  const legacySession = sessionStorage.getItem(LEGACY_SESSION_KEY);
  const legacyKey = legacyLocal || legacySession;
  if (!legacyKey) return null;

  const migrated: AIConnection = { provider: "openai", apiKey: legacyKey, modelMode: "auto", preferredModel: null, remember: Boolean(legacyLocal) };
  saveConnection(migrated);
  localStorage.removeItem(LEGACY_LOCAL_KEY);
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
  return migrated;
}

export function saveConnection(connection: AIConnection) {
  const serialized = JSON.stringify(connection);
  if (connection.remember) {
    localStorage.setItem(LOCAL_CONNECTION_KEY, serialized);
    sessionStorage.removeItem(SESSION_CONNECTION_KEY);
  } else {
    sessionStorage.setItem(SESSION_CONNECTION_KEY, serialized);
    localStorage.removeItem(LOCAL_CONNECTION_KEY);
  }
}

export function clearConnection() {
  localStorage.removeItem(LOCAL_CONNECTION_KEY);
  sessionStorage.removeItem(SESSION_CONNECTION_KEY);
  localStorage.removeItem(LEGACY_LOCAL_KEY);
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
}
