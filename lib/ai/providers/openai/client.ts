import { fetchWithTimeout, responseError } from "../shared.ts";

const OPENAI_API_BASE = "https://api.openai.com/v1";

export async function openAIRequest(path: string, apiKey: string, init: RequestInit = {}) {
  const response = await fetchWithTimeout(`${OPENAI_API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, ...init.headers },
  });
  if (!response.ok) throw await responseError(response);
  return response;
}
