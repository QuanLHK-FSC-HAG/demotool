export type AIErrorCode =
  | "invalid_key"
  | "quota_exceeded"
  | "rate_limited"
  | "model_unavailable"
  | "model_access_denied"
  | "unsupported_input"
  | "invalid_request"
  | "policy_rejected"
  | "provider_unavailable"
  | "no_compatible_model";

export class AIProviderError extends Error {
  code: AIErrorCode;
  status: number;

  constructor(code: AIErrorCode, message: string, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const FALLBACK_ERROR_CODES = new Set<AIErrorCode>([
  "quota_exceeded",
  "rate_limited",
  "model_unavailable",
  "model_access_denied",
  "unsupported_input",
  "provider_unavailable",
]);

export function isFallbackError(error: unknown) {
  return error instanceof AIProviderError && FALLBACK_ERROR_CODES.has(error.code);
}

export function publicErrorMessage(error: unknown) {
  if (!(error instanceof AIProviderError)) return "Dịch vụ AI đang tạm thời không khả dụng.";
  const messages: Record<AIErrorCode, string> = {
    invalid_key: "API key không hợp lệ hoặc đã bị thu hồi.",
    quota_exceeded: "Tài khoản đã hết hạn mức cho các model phù hợp.",
    rate_limited: "Dịch vụ AI đang giới hạn tốc độ. Vui lòng thử lại sau.",
    model_unavailable: "Model đã chọn hiện không còn khả dụng.",
    model_access_denied: "API key không có quyền sử dụng model đã chọn.",
    unsupported_input: "Model hiện tại không hỗ trợ loại dữ liệu này.",
    invalid_request: "Nội dung yêu cầu chưa hợp lệ.",
    policy_rejected: "Nhà cung cấp từ chối nội dung yêu cầu.",
    provider_unavailable: "Không thể kết nối nhà cung cấp AI lúc này.",
    no_compatible_model: "API key không có model phù hợp với tác vụ này.",
  };
  return messages[error.code];
}
