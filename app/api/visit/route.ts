import { NextResponse } from "next/server";
import { AnalyticsNotConfiguredError, recordVisit } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1024) {
    return NextResponse.json({ success: false, error: "Request body is too large" }, {
      status: 413,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    let body: { visitorId?: unknown };
    try {
      body = await request.json() as { visitorId?: unknown };
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    }
    if (typeof body.visitorId !== "string" || body.visitorId.length > 64 || !UUID_PATTERN.test(body.visitorId)) {
      return NextResponse.json({ success: false, error: "Invalid visitor ID" }, {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const counted = await recordVisit(body.visitorId);
    return NextResponse.json({ success: true, counted }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const notConfigured = error instanceof AnalyticsNotConfiguredError;
    return NextResponse.json({
      success: false,
      error: notConfigured ? "Analytics service is not configured" : "Analytics service is unavailable",
    }, {
      status: notConfigured ? 503 : 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
