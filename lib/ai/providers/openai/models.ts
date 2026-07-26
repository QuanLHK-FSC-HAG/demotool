import { catalogMetadata, isExcludedModel } from "../../catalog.ts";
import type { AIModelInfo, ModelCapability } from "../../types.ts";

export type OpenAIModel = { id: string };

export function normalizeOpenAIModel(model: OpenAIModel): AIModelInfo | null {
  if (isExcludedModel("openai", model.id)) return null;
  const catalog = catalogMetadata("openai", model.id);
  const capabilities: ModelCapability[] = ["text", ...catalog.capabilities];
  return {
    id: model.id,
    provider: "openai",
    displayName: model.id,
    capabilities: [...new Set(capabilities)],
    stable: !catalog.preview && !catalog.deprecated,
    preview: catalog.preview,
    deprecated: catalog.deprecated,
    freeOrLowCost: catalog.freeOrLowCost,
    inputTypes: ["text"],
    outputTypes: ["text"],
  };
}
