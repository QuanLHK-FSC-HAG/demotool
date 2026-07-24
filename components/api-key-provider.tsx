"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ApiKeyContextValue = {
  apiKey: string;
  connected: boolean;
  localConnectionCount: number;
  modalOpen: boolean;
  openModal: () => void;
  disconnect: () => void;
  connect: (apiKey: string, remember: boolean) => Promise<void>;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);
const LOCAL_KEY = "fpt-openai-api-key";
const SESSION_KEY = "fpt-openai-api-key-session";
const HASHES_KEY = "fpt-openai-key-hashes";

async function fingerprint(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [localConnectionCount, setLocalConnectionCount] = useState(0);

  useEffect(() => {
    const savedKey = localStorage.getItem(LOCAL_KEY) || sessionStorage.getItem(SESSION_KEY) || "";
    const hashes = JSON.parse(localStorage.getItem(HASHES_KEY) || "[]") as string[];
    setApiKey(savedKey);
    setLocalConnectionCount(hashes.length);
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

    const hash = await fingerprint(key);
    const hashes = JSON.parse(localStorage.getItem(HASHES_KEY) || "[]") as string[];
    if (!hashes.includes(hash)) {
      const nextHashes = [...hashes, hash];
      localStorage.setItem(HASHES_KEY, JSON.stringify(nextHashes));
      setLocalConnectionCount(nextHashes.length);
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
    localConnectionCount,
    modalOpen,
    openModal: () => setModalOpen(true),
    disconnect,
    connect,
  }), [apiKey, connect, disconnect, localConnectionCount, modalOpen]);

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) throw new Error("useApiKey must be used inside ApiKeyProvider");
  return context;
}
