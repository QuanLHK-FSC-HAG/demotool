import type { AIProviderId, ModelCapability } from "./types.ts";

type CatalogRule = {
  pattern: RegExp;
  capabilities?: ModelCapability[];
  preview?: boolean;
  deprecated?: boolean;
  freeOrLowCost?: boolean;
};

// Provider APIs expose different metadata depths. These centralized rules are
// only a fallback when an API does not publish a capability or lifecycle flag.
export const providerCatalog: Record<AIProviderId, { include?: RegExp[]; exclude: RegExp[]; rules: CatalogRule[] }> = {
  google: {
    exclude: [/embedding/i, /aqa/i],
    rules: [
      { pattern: /(?:flash|lite)/i, freeOrLowCost: true },
      { pattern: /(?:vision|image|multimodal)/i, capabilities: ["vision"] },
      { pattern: /(?:preview|experimental|exp)/i, preview: true },
      { pattern: /(?:deprecated|legacy)/i, deprecated: true },
    ],
  },
  openai: {
    include: [/^gpt-/i, /^o\d/i, /^chatgpt-/i],
    exclude: [/embedding/i, /moderation/i, /whisper/i, /tts/i, /audio/i, /image/i, /realtime/i, /transcribe/i],
    rules: [
      { pattern: /(?:mini|nano)/i, freeOrLowCost: true },
      { pattern: /(?:vision|multimodal)/i, capabilities: ["vision"] },
      { pattern: /(?:preview|experimental)/i, preview: true },
      { pattern: /(?:deprecated|legacy)/i, deprecated: true },
    ],
  },
};

export function catalogMetadata(provider: AIProviderId, id: string, description = "") {
  const value = `${id} ${description}`;
  const metadata = { capabilities: [] as ModelCapability[], preview: false, deprecated: false, freeOrLowCost: false };
  for (const rule of providerCatalog[provider].rules) {
    if (!rule.pattern.test(value)) continue;
    if (rule.capabilities) metadata.capabilities.push(...rule.capabilities);
    if (rule.preview) metadata.preview = true;
    if (rule.deprecated) metadata.deprecated = true;
    if (rule.freeOrLowCost) metadata.freeOrLowCost = true;
  }
  return { ...metadata, capabilities: [...new Set(metadata.capabilities)] };
}

export function isExcludedModel(provider: AIProviderId, id: string) {
  const catalog = providerCatalog[provider];
  if (catalog.include && !catalog.include.some((pattern) => pattern.test(id))) return true;
  return catalog.exclude.some((pattern) => pattern.test(id));
}
