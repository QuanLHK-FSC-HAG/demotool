import { NextResponse } from "next/server";
import { isSafeApiKey, readJsonBody } from "@/lib/ai/api";
import { publicErrorMessage } from "@/lib/ai/errors";
import { getProvider, isProviderId } from "@/lib/ai/provider-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<{ provider?: unknown; apiKey?: unknown }>(request, 2048);
    if (!isProviderId(body.provider) || !isSafeApiKey(body.apiKey)) {
      return NextResponse.json({ error: "Nhà cung cấp hoặc API key chưa hợp lệ." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    const models = await getProvider(body.provider).listModels(body.apiKey);
    return NextResponse.json({ models }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ error: publicErrorMessage(error) }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
