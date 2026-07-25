import { NextResponse } from "next/server";
import {
  AnalyticsNotConfiguredError,
  getVisitStats,
} from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getVisitStats();

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
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
