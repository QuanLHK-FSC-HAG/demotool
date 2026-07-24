"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, ExternalLink, Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useApiKey } from "@/components/api-key-provider";

export function ApiKeyModal() {
  const { modalOpen, connected, connect } = useApiKey();
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!modalOpen) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await connect(value.trim(), remember);
      setValue("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể kết nối API key.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="key-modal-backdrop" role="presentation"><section className="key-modal" role="dialog" aria-modal="true" aria-labelledby="api-key-title"><div className="key-modal-brand"><span><KeyRound/></span><div><small>FPT EDUCATION</small><b>Tập huấn Google AI Studio</b></div></div><div className="key-modal-copy"><span className="key-kicker"><ShieldCheck/> Kết nối tài khoản cá nhân</span><h2 id="api-key-title">Nhập OpenAI API key để bắt đầu</h2><p>Khóa được kiểm tra trực tiếp với OpenAI. Hệ thống không ghi khóa vào cơ sở dữ liệu hoặc GitHub.</p></div><form onSubmit={submit}><label htmlFor="openai-api-key">OpenAI API key</label><div className="secret-input"><LockKeyhole/><input id="openai-api-key" type={visible ? "text" : "password"} autoComplete="off" spellCheck={false} value={value} onChange={(event) => setValue(event.target.value)} placeholder="sk-••••••••••••••••••••••••"/><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Ẩn API key" : "Hiện API key"}>{visible ? <EyeOff/> : <Eye/>}</button></div><label className="remember-choice"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)}/><span><b>Lưu API key trên trình duyệt này</b><small>Chỉ chọn trên thiết bị cá nhân. Nếu không chọn, khóa sẽ bị xóa khi đóng phiên trình duyệt.</small></span></label>{error && <p className="key-error" role="alert">{error}</p>}<button className="button key-submit" type="submit" disabled={loading || value.trim().length < 20}>{loading ? <><LoaderCircle className="spin"/>Đang kiểm tra...</> : connected ? <><CheckCircle2/>Kết nối lại</> : <><KeyRound/>Kiểm tra và tiếp tục</>}</button></form><div className="key-modal-footer"><a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">Lấy API key tại OpenAI <ExternalLink/></a><p>API key là thông tin nhạy cảm. Không chia sẻ khóa trong ảnh chụp, email hoặc tài liệu công khai.</p></div></section></div>;
}
