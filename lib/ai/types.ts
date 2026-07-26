export type AIProviderId = "google" | "openai";
export type ModelMode = "auto" | "manual";
export type ModelCapability = "text" | "vision" | "file" | "json" | "tools" | "long-context";

export type AIConnection = {
  provider: AIProviderId;
  apiKey: string;
  modelMode: ModelMode;
  preferredModel: string | null;
  remember: boolean;
};

export type AIModelInfo = {
  id: string;
  provider: AIProviderId;
  displayName: string;
  capabilities: ModelCapability[];
  stable: boolean;
  preview: boolean;
  deprecated: boolean;
  freeOrLowCost: boolean;
  contextWindow?: number;
  inputTypes?: string[];
  outputTypes?: string[];
};

export type AITaskRequirement = {
  capabilities: ModelCapability[];
  preferStable?: boolean;
  preferFreeOrLowCost?: boolean;
  allowPreview?: boolean;
  minContextWindow?: number;
};

export type AITaskId = "improve-learning-objectives" | "summarize-lesson" | "review-prompt";

export type AITaskRequest = {
  task: AITaskId;
  requirement: AITaskRequirement;
  input: Record<string, unknown>;
};

export type AITaskResult = {
  output: string;
  model: string;
  provider: AIProviderId;
  mode: ModelMode;
  notice?: string;
};

export type ProviderRunArgs = {
  apiKey: string;
  model: string;
  prompt: string;
};

export interface AIProviderAdapter {
  id: AIProviderId;
  name: string;
  listModels(apiKey: string): Promise<AIModelInfo[]>;
  runTask(args: ProviderRunArgs): Promise<string>;
  normalizeError(error: unknown): Error;
}
