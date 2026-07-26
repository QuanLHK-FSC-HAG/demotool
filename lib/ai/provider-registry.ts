import { googleAdapter } from "@/lib/ai/providers/google/adapter";
import { openAIAdapter } from "@/lib/ai/providers/openai/adapter";
import type { AIProviderAdapter, AIProviderId } from "@/lib/ai/types";

const providers: Record<AIProviderId, AIProviderAdapter> = {
  google: googleAdapter,
  openai: openAIAdapter,
};

export function getProvider(provider: AIProviderId) {
  return providers[provider];
}

export function isProviderId(value: unknown): value is AIProviderId {
  return value === "google" || value === "openai";
}
