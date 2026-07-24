"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ApiKeyContextValue = {
  apiKey: string;
  connected: boolean;
  modalOpen: boolean;
  openModal: () => void;
  disconnect: () => void;
  connect: (apiKey: string, remember: boolean) => Promise<void>;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);
const LOCAL_KEY = "fpt-openai-api-key";
const SESSION_KEY = "fpt-openai-api-key-session";

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(LOCAL_KEY) || sessionStorage.getItem(SESSION_KEY) || "";
    setApiKey(savedKey);
    setModalOpen(!savedKey);
  }, []);

  const connect = useCallback(async (key: string, remember: boolean) => {
    const response = await fetch("/api/openai/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: key }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({ error: "Không thể kiểm tra API key." })) as { error?: string };
      throw new Error(result.error || "API key không hợp lệ.");
    }

    if (remember) {
      localStorage.setItem(LOCAL_KEY, key);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, key);
      localStorage.removeItem(LOCAL_KEY);
    }

    setApiKey(key);
    setModalOpen(false);
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(LOCAL_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setApiKey("");
    setModalOpen(true);
  }, []);

  const value = useMemo(() => ({
    apiKey,
    connected: Boolean(apiKey),
    modalOpen,
    openModal: () => setModalOpen(true),
    disconnect,
    connect,
  }), [apiKey, connect, disconnect, modalOpen]);

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) throw new Error("useApiKey must be used inside ApiKeyProvider");
  return context;
}
