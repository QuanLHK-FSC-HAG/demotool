
import { NextRequest, NextResponse } from "next/server";
import {
  AnalyticsNotConfiguredError,
  recordHeartbeat,
} from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visitorId = body?.visitorId;

    if (typeof visitorId !== "string" || !visitorId.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Visitor ID is required",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    await recordHeartbeat(visitorId);

    return NextResponse.json(
      {
        success: true,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const notConfigured =
      error instanceof AnalyticsNotConfiguredError;

    return NextResponse.json(
      {
        success: false,
        error: notConfigured
          ? "Analytics service is not configured"
          : "Analytics service is unavailable",
      },
      {
        status: notConfigured ? 503 : 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
