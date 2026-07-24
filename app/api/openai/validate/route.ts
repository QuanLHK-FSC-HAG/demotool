import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json() as { apiKey?: string };
    if (!apiKey || !apiKey.startsWith("sk-") || apiKey.length < 20) {
      return NextResponse.json({ error: "API key không đúng định dạng." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "OpenAI không chấp nhận API key này." }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ error: "Không thể kết nối OpenAI. Vui lòng thử lại." }, { status: 500 });
  }
}
