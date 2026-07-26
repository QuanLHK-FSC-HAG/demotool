"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Bot, CheckCircle2, ExternalLink, Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useAIConnection } from "@/components/ai-connection-provider";
import type { AIProviderId, ModelMode } from "@/lib/ai/types";

const providerInfo = {
  google: { name: "Google Gemini", keyUrl: "https://aistudio.google.com/app/apikey", hint: "Khuyên dùng cho Google AI Studio" },
  openai: { name: "OpenAI", keyUrl: "https://platform.openai.com/api-keys", hint: "Dùng tài khoản OpenAI Platform" },
} as const;

export function AIConnectionModal() {
  const { modalOpen, closeModal, connection, connected, models, connect, refreshModels } = useAIConnection();
  const [provider, setProvider] = useState<AIProviderId>("google");
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [modelMode, setModelMode] = useState<ModelMode>("auto");
  const [preferredModel, setPreferredModel] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!modalOpen) return;
    setProvider(connection?.provider || "google");
    setRemember(connection?.remember || false);
    setModelMode(connection?.modelMode || "auto");
    setPreferredModel(connection?.preferredModel || "");
    setApiKey("");
    setError("");
    if (connection) refreshModels().catch((caught) => setError(caught instanceof Error ? caught.message : "Không thể tải danh sách model."));
  }, [connection, modalOpen, refreshModels]);

  if (!modalOpen) return null;

  const availableModels = connection?.provider === provider ? models : [];
  const providerChanged = Boolean(connection && connection.provider !== provider);
  const needsKey = !connected || providerChanged;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await connect({ provider, apiKey, remember, modelMode, preferredModel: preferredModel || null });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể kết nối nhà cung cấp AI.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="key-modal-backdrop" role="presentation">
    <section className="key-modal ai-connection-modal" role="dialog" aria-modal="true" aria-labelledby="ai-connection-title">
      <button className="modal-close" type="button" onClick={closeModal} aria-label="Đóng"><X/></button>
      <div className="key-modal-brand"><span><Bot/></span><div><small>KẾT NỐI TÙY CHỌN</small><b>Trợ lý AI cho giáo viên</b></div></div>
      <div className="key-modal-copy"><span className="key-kicker"><ShieldCheck/> API key thuộc quyền kiểm soát của bạn</span><h2 id="ai-connection-title">Kết nối AI khi bạn cần</h2><p>API key không bắt buộc để học khóa học hoặc sử dụng Prompt Builder cơ bản. Khóa chỉ được dùng khi bạn chủ động bấm một tính năng hỗ trợ AI.</p></div>
      <form onSubmit={submit}>
        <fieldset className="provider-picker"><legend>Nhà cung cấp AI</legend>{(["google", "openai"] as AIProviderId[]).map((id) => <label className={provider === id ? "selected" : ""} key={id}><input type="radio" name="provider" value={id} checked={provider === id} onChange={() => { setProvider(id); setModelMode("auto"); setPreferredModel(""); setError(""); }}/><span><b>{providerInfo[id].name}</b><small>{providerInfo[id].hint}</small></span></label>)}</fieldset>
        <label htmlFor="ai-api-key">API key {connected && !providerChanged && <small>— để trống nếu chỉ đổi model</small>}</label>
        <div className="secret-input"><LockKeyhole/><input id="ai-api-key" type={visible ? "text" : "password"} autoComplete="off" spellCheck={false} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={provider === "google" ? "Nhập Google AI API key" : "Nhập OpenAI API key"}/><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ẩn API key" : "Hiện API key"}>{visible ? <EyeOff/> : <Eye/>}</button></div>
        <fieldset className="model-mode-picker"><legend>Model</legend><label><input type="radio" name="model-mode" checked={modelMode === "auto"} onChange={() => setModelMode("auto")}/><span><b>Tự động chọn</b><small>Ưu tiên ổn định và chi phí thấp.</small></span></label><label className={!availableModels.length ? "disabled" : ""}><input type="radio" name="model-mode" disabled={!availableModels.length} checked={modelMode === "manual"} onChange={() => setModelMode("manual")}/><span><b>Chọn thủ công</b><small>{availableModels.length ? `${availableModels.length} model khả dụng` : "Kết nối lần đầu để tải model"}</small></span></label></fieldset>
        {modelMode === "manual" && <label className="model-select-label">Model được API key cho phép<select value={preferredModel} onChange={(event) => setPreferredModel(event.target.value)} required><option value="">Chọn model</option>{availableModels.map((model) => <option value={model.id} key={model.id}>{model.displayName}{model.preview ? " · Preview" : ""}{model.freeOrLowCost ? " · Chi phí thấp" : ""}</option>)}</select></label>}
        <label className="remember-choice"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)}/><span><b>Ghi nhớ trên thiết bị này</b><small>Nếu không chọn, khóa chỉ được lưu đến khi đóng phiên trình duyệt.</small></span></label>
        <p className="ai-key-purpose"><ShieldCheck/> API key không được gửi đến Redis, analytics, GitHub hoặc nhà cung cấp khác.</p>
        {error && <p className="key-error" role="alert">{error}</p>}
        <button className="button key-submit" type="submit" disabled={loading || (needsKey && apiKey.trim().length < 20) || (modelMode === "manual" && !preferredModel)}>{loading ? <><LoaderCircle className="spin"/>Đang kiểm tra...</> : connected ? <><CheckCircle2/>Lưu kết nối</> : <><KeyRound/>Kết nối và tiếp tục</>}</button>
      </form>
      <div className="key-modal-footer"><a href={providerInfo[provider].keyUrl} target="_blank" rel="noreferrer">Lấy API key tại {providerInfo[provider].name} <ExternalLink/></a><p>Không chia sẻ API key trong ảnh chụp, email hoặc tài liệu công khai.</p></div>
    </section>
  </div>;
}
