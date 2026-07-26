import { AIProviderError } from "./errors.ts";

export async function readJsonBody<T>(request: Request, maxBytes = 200_000): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new AIProviderError("invalid_request", "Request body is too large", 413);

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
      throw new AIProviderError("invalid_request", "Request body is too large", 413);
    }
    return JSON.parse(rawBody) as T;
  } catch (error) {
    if (error instanceof AIProviderError) throw error;
    throw new AIProviderError("invalid_request", "Invalid JSON body", 400);
  }
}

export function isSafeApiKey(value: unknown): value is string {
  return typeof value === "string" && value.length >= 20 && value.length <= 500 && !/[\r\n]/.test(value);
}
