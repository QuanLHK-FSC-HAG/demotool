import assert from "node:assert/strict";
import test from "node:test";
import { getContentList } from "./content.ts";

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
