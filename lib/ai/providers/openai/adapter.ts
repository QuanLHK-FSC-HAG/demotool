import { AIProviderError } from "../../errors.ts";
import type { AIProviderAdapter } from "../../types.ts";
import { openAIRequest } from "./client.ts";
import { normalizeOpenAIModel, type OpenAIModel } from "./models.ts";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
};

export const openAIAdapter: AIProviderAdapter = {
  id: "openai",
  name: "OpenAI",
  async listModels(apiKey) {
    const response = await openAIRequest("/models", apiKey);
    const payload = await response.json() as { data?: OpenAIModel[] };
    return (payload.data || []).map(normalizeOpenAIModel).filter((model) => model !== null);
  },
  async runTask({ apiKey, model, prompt }) {
    const response = await openAIRequest("/responses", apiKey, {
      method: "POST",
      body: JSON.stringify({ model, input: prompt }),
    });
    const payload = await response.json() as OpenAIResponse;
    const output = payload.output_text?.trim() || payload.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("").trim();
    if (!output) throw new AIProviderError("provider_unavailable", "OpenAI returned no text", 502);
    return output;
  },
  normalizeError(error) {
    return error instanceof Error ? error : new AIProviderError("provider_unavailable", "Unknown OpenAI error", 502);
  },
};
