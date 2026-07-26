import assert from "node:assert/strict";
import test from "node:test";
import { buildGoogleAIStudioAgentPrompt } from "./agent-prompt.ts";
import { getContentItem, getContentList } from "./content.ts";

test("gallery contains one product for every listed subject or STEM field", () => {
  const items = getContentList("gallery");
  const counts = items.reduce<Record<string, number>>((result, item) => {
    const category = item.category || "missing";
    result[category] = (result[category] || 0) + 1;
    return result;
  }, {});

  assert.equal(items.length, 19);
  assert.deepEqual(counts, { "tieu-hoc": 3, "thcs-thpt": 11, stem: 5 });
  assert.equal(items.every((item) => item.subject && item.experienceType && item.difficulty), true);
});

test("every gallery product contains a readable sample prompt", () => {
  const items = getContentList("gallery");
  for (const item of items) {
    const detail = getContentItem("gallery", item.slug);
    const prompt = detail?.content.match(/```text\s*([\s\S]*?)```/)?.[1]?.trim();
    assert.ok(prompt && prompt.length >= 120, `${item.slug} is missing a complete sample prompt`);
    const agentPrompt = buildGoogleAIStudioAgentPrompt(prompt, item);
    assert.match(agentPrompt, /# AGENT PROMPT — GOOGLE AI STUDIO BUILD MODE/);
    assert.match(agentPrompt, /## 4\. Kịch bản trải nghiệm bắt buộc/);
    assert.match(agentPrompt, /## 9\. Tiêu chí hoàn thành/);
    assert.ok(agentPrompt.length >= 3500, `${item.slug} does not produce a complete Agent prompt`);
  }
});
