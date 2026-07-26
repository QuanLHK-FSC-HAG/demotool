import { AIProviderError } from "../errors.ts";

const REQUEST_TIMEOUT_MS = 15_000;

export async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new AIProviderError("provider_unavailable", "Provider request timed out", 504);
    }
    throw new AIProviderError("provider_unavailable", "Provider request failed", 502);
  } finally {
    clearTimeout(timeout);
  }
}

export async function responseError(response: Response) {
  const payload = await response.json().catch(() => ({})) as { error?: { code?: string; status?: string; message?: string } | string };
  const detail = typeof payload.error === "string" ? payload.error : `${payload.error?.code || ""} ${payload.error?.status || ""} ${payload.error?.message || ""}`;
  const normalized = detail.toLowerCase();

  if (response.status === 401) return new AIProviderError("invalid_key", "Provider rejected API key", 401);
  if (response.status === 403 && /model.*(?:permission|access|allowed|authoriz)/i.test(normalized)) {
    return new AIProviderError("model_access_denied", "API key cannot access model", 403);
  }
  if (response.status === 403) return new AIProviderError("invalid_key", "Provider rejected API key", 401);
  if (response.status === 404 || /model.*(?:not found|unavailable|deprecat)/i.test(normalized)) return new AIProviderError("model_unavailable", "Model unavailable", 404);
  if (response.status === 429 && /quota|billing|insufficient/i.test(normalized)) return new AIProviderError("quota_exceeded", "Quota exceeded", 429);
  if (response.status === 429) return new AIProviderError("rate_limited", "Rate limited", 429);
  if (/policy|safety|content_filter/i.test(normalized)) return new AIProviderError("policy_rejected", "Content rejected", 400);
  if (/unsupported|not support/i.test(normalized)) return new AIProviderError("unsupported_input", "Unsupported input", 400);
  if (response.status >= 500) return new AIProviderError("provider_unavailable", "Provider unavailable", 502);
  return new AIProviderError("invalid_request", "Provider rejected request", 400);
}
