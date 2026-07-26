import assert from "node:assert/strict";
import test from "node:test";
import { selectModels } from "./model-selector.ts";
import type { AIModelInfo, AITaskRequirement } from "./types.ts";

const requirement: AITaskRequirement = {
  capabilities: ["text"],
  preferStable: true,
  preferFreeOrLowCost: true,
  allowPreview: false,
};

const models: AIModelInfo[] = [
  { id: "stable-standard", provider: "google", displayName: "Stable", capabilities: ["text"], stable: true, preview: false, deprecated: false, freeOrLowCost: false },
  { id: "stable-low-cost", provider: "google", displayName: "Low cost", capabilities: ["text"], stable: true, preview: false, deprecated: false, freeOrLowCost: true },
  { id: "preview-low-cost", provider: "google", displayName: "Preview", capabilities: ["text"], stable: false, preview: true, deprecated: false, freeOrLowCost: true },
];

test("auto selection prioritizes compatible stable low-cost models", () => {
  const selection = selectModels(models, requirement);
  assert.equal(selection.candidates[0].id, "stable-low-cost");
  assert.equal(selection.candidates.some((model) => model.preview), false);
});

test("manual selection remains first when available", () => {
  const selection = selectModels(models, requirement, "stable-standard");
  assert.equal(selection.candidates[0].id, "stable-standard");
  assert.equal(selection.notice, undefined);
});

test("missing manual model falls back to auto with a notice", () => {
  const selection = selectModels(models, requirement, "removed-model");
  assert.equal(selection.candidates[0].id, "stable-low-cost");
  assert.match(selection.notice || "", /Tự động/);
});

test("throws when no model satisfies the requirement", () => {
  assert.throws(() => selectModels(models, { ...requirement, capabilities: ["vision"] }), /No compatible model/);
});
