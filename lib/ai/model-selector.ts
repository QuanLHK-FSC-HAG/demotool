import { AIProviderError } from "./errors.ts";
import type { AIModelInfo, AITaskRequirement } from "./types.ts";

export function supportsRequirement(model: AIModelInfo, requirement: AITaskRequirement) {
  if (model.deprecated) return false;
  if (!requirement.allowPreview && model.preview) return false;
  if (requirement.minContextWindow && (model.contextWindow || 0) < requirement.minContextWindow) return false;
  return requirement.capabilities.every((capability) => model.capabilities.includes(capability));
}

function scoreModel(model: AIModelInfo, requirement: AITaskRequirement) {
  let score = 0;
  if (requirement.preferStable && model.stable) score += 40;
  if (requirement.preferFreeOrLowCost && model.freeOrLowCost) score += 25;
  if (model.preview) score -= 30;
  if (model.contextWindow) score += Math.min(model.contextWindow / 100_000, 12);
  score += model.capabilities.length;
  return score;
}

export function rankModels(models: AIModelInfo[], requirement: AITaskRequirement) {
  return models
    .filter((model) => supportsRequirement(model, requirement))
    .sort((left, right) => scoreModel(right, requirement) - scoreModel(left, requirement) || left.id.localeCompare(right.id));
}

export function selectModels(models: AIModelInfo[], requirement: AITaskRequirement, preferredModel?: string | null) {
  const ranked = rankModels(models, requirement);
  if (!ranked.length) throw new AIProviderError("no_compatible_model", "No compatible model", 422);
  if (!preferredModel) return { candidates: ranked, notice: undefined };

  const preferred = ranked.find((model) => model.id === preferredModel);
  if (!preferred) {
    return {
      candidates: ranked,
      notice: "Model đã chọn trước đây không còn khả dụng. Hệ thống đã chuyển về chế độ Tự động.",
    };
  }
  return { candidates: [preferred, ...ranked.filter((model) => model.id !== preferred.id)], notice: undefined };
}
