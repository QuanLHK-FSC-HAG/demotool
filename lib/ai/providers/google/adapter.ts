import { AIProviderError } from "../../errors.ts";
import type { AIProviderAdapter } from "../../types.ts";
import { googleRequest } from "./client.ts";
import { normalizeGoogleModel, type GoogleModel } from "./models.ts";

export const googleAdapter: AIProviderAdapter = {
  id: "google",
  name: "Google Gemini",
  async listModels(apiKey) {
    const models: GoogleModel[] = [];
    let pageToken = "";
    for (let page = 0; page < 5; page += 1) {
      const query = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : "";
      const response = await googleRequest(`/models${query}`, apiKey);
      const payload = await response.json() as { models?: GoogleModel[]; nextPageToken?: string };
      models.push(...(payload.models || []));
      if (!payload.nextPageToken) break;
      pageToken = payload.nextPageToken;
    }
    return models.map(normalizeGoogleModel).filter((model) => model !== null);
  },
  async runTask({ apiKey, model, prompt }) {
    const response = await googleRequest(`/models/${encodeURIComponent(model)}:generateContent`, apiKey, {
      method: "POST",
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
    });
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const output = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!output) throw new AIProviderError("provider_unavailable", "Google returned no text", 502);
    return output;
  },
  normalizeError(error) {
    return error instanceof Error ? error : new AIProviderError("provider_unavailable", "Unknown Google error", 502);
  },
};
