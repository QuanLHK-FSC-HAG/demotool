import { NextResponse } from "next/server";
import { isSafeApiKey, readJsonBody } from "@/lib/ai/api";
import { isFallbackError, publicErrorMessage } from "@/lib/ai/errors";
import { selectModels } from "@/lib/ai/model-selector";
import { getProvider, isProviderId } from "@/lib/ai/provider-registry";
import { buildTaskPrompt } from "@/lib/ai/tasks";
import type { AITaskId, AITaskRequirement, ModelMode } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RunBody = {
  provider?: unknown;
  apiKey?: unknown;
  modelMode?: ModelMode;
  preferredModel?: string | null;
  task?: AITaskId;
  requirement?: AITaskRequirement;
  input?: Record<string, unknown>;
};

const taskIds = new Set<AITaskId>(["improve-learning-objectives", "summarize-lesson", "review-prompt"]);

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<RunBody>(request);
    if (!isProviderId(body.provider) || !isSafeApiKey(body.apiKey) || !body.task || !taskIds.has(body.task) || !body.requirement || !body.input) {
      return NextResponse.json({ error: "Yêu cầu AI chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const adapter = getProvider(body.provider);
    const models = await adapter.listModels(body.apiKey);
    const manualModel = body.modelMode === "manual" ? body.preferredModel : null;
    const selection = selectModels(models, body.requirement, manualModel);
    const prompt = buildTaskPrompt(body.task, body.input);
    let lastError: unknown;

    for (const [index, model] of selection.candidates.slice(0, 4).entries()) {
      try {
        const output = await adapter.runTask({ apiKey: body.apiKey, model: model.id, prompt });
        const usedFallback = index > 0 || Boolean(selection.notice);
        return NextResponse.json({
          output,
          model: model.id,
          provider: body.provider,
          mode: usedFallback ? "auto" : body.modelMode || "auto",
          notice: selection.notice || (index > 0 ? "Model ban đầu không khả dụng; hệ thống đã tự động chuyển sang model phù hợp khác." : undefined),
        }, { headers: { "Cache-Control": "no-store" } });
      } catch (error) {
        lastError = error;
        if (!isFallbackError(error)) throw error;
      }
    }
    throw lastError;
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ error: publicErrorMessage(error) }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
