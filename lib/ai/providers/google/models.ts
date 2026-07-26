import { catalogMetadata, isExcludedModel } from "../../catalog.ts";
import type { AIModelInfo, ModelCapability } from "../../types.ts";

export type GoogleModel = {
  name: string;
  displayName?: string;
  description?: string;
  inputTokenLimit?: number;
  supportedGenerationMethods?: string[];
};

export function normalizeGoogleModel(model: GoogleModel): AIModelInfo | null {
  const id = model.name.replace(/^models\//, "");
  if (!model.supportedGenerationMethods?.includes("generateContent") || isExcludedModel("google", id)) return null;
  const catalog = catalogMetadata("google", id, model.description);
  const capabilities: ModelCapability[] = ["text", ...catalog.capabilities];
  if ((model.inputTokenLimit || 0) >= 100_000) capabilities.push("long-context");

  return {
    id,
    provider: "google",
    displayName: model.displayName || id,
    capabilities: [...new Set(capabilities)],
    stable: !catalog.preview && !catalog.deprecated,
    preview: catalog.preview,
    deprecated: catalog.deprecated,
    freeOrLowCost: catalog.freeOrLowCost,
    contextWindow: model.inputTokenLimit,
    inputTypes: ["text"],
    outputTypes: ["text"],
  };
}
