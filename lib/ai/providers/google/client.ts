import { fetchWithTimeout, responseError } from "../shared.ts";

const GOOGLE_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function googleRequest(path: string, apiKey: string, init: RequestInit = {}) {
  const response = await fetchWithTimeout(`${GOOGLE_API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey, ...init.headers },
  });
  if (!response.ok) throw await responseError(response);
  return response;
}
