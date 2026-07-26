"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { clearConnection, loadConnection, saveConnection } from "@/lib/ai/storage";
import type { AIConnection, AIModelInfo, AIProviderId, AITaskRequest, AITaskResult, ModelMode } from "@/lib/ai/types";

type ConnectionDraft = {
  provider: AIProviderId;
  apiKey?: string;
  remember: boolean;
  modelMode: ModelMode;
  preferredModel?: string | null;
};

type PendingTask = {
  request: AITaskRequest;
  resolve: (value: AITaskResult) => void;
  reject: (reason?: unknown) => void;
};

type AIConnectionContextValue = {
  connection: AIConnection | null;
  connected: boolean;
  models: AIModelInfo[];
  modalOpen: boolean;
  notice: string;
  openModal: () => void;
  closeModal: () => void;
  connect: (draft: ConnectionDraft) => Promise<void>;
  disconnect: () => void;
  refreshModels: () => Promise<AIModelInfo[]>;
  updateModelPreference: (mode: ModelMode, preferredModel?: string | null) => void;
  runTask: (request: AITaskRequest) => Promise<AITaskResult>;
};

const AIConnectionContext = createContext<AIConnectionContextValue | null>(null);

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({})) as { error?: string };
  return body.error || fallback;
}

export function AIConnectionProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<AIConnection | null>(null);
  const [models, setModels] = useState<AIModelInfo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const pendingTask = useRef<PendingTask | null>(null);

  useEffect(() => {
    setConnection(loadConnection());
  }, []);

  const executeTask = useCallback(async (activeConnection: AIConnection, request: AITaskRequest) => {
    const response = await fetch("/api/ai/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...activeConnection, ...request }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(await readError(response, "Không thể thực hiện tác vụ AI."));
    const result = await response.json() as AITaskResult;
    if (result.notice) setNotice(result.notice);
    if (result.mode === "auto" && activeConnection.modelMode === "manual") {
      const updated = { ...activeConnection, modelMode: "auto" as const, preferredModel: null };
      setConnection(updated);
      saveConnection(updated);
    }
    return result;
  }, []);

  const connect = useCallback(async (draft: ConnectionDraft) => {
    const apiKey = draft.apiKey?.trim() || (connection?.provider === draft.provider ? connection.apiKey : "");
    if (!apiKey) throw new Error("Vui lòng nhập API key.");

    const response = await fetch("/api/ai/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: draft.provider, apiKey }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(await readError(response, "API key không hợp lệ."));
    const payload = await response.json() as { models: AIModelInfo[] };
    const preferredAvailable = draft.preferredModel && payload.models.some((model) => model.id === draft.preferredModel);
    const nextConnection: AIConnection = {
      provider: draft.provider,
      apiKey,
      remember: draft.remember,
      modelMode: draft.modelMode === "manual" && preferredAvailable ? "manual" : "auto",
      preferredModel: draft.modelMode === "manual" && preferredAvailable ? draft.preferredModel || null : null,
    };

    if (draft.modelMode === "manual" && draft.preferredModel && !preferredAvailable) {
      setNotice("Model đã chọn không còn khả dụng. Hệ thống đã chuyển về chế độ Tự động.");
    }
    setConnection(nextConnection);
    setModels(payload.models);
    saveConnection(nextConnection);
    setModalOpen(false);

    const pending = pendingTask.current;
    if (pending) {
      pendingTask.current = null;
      executeTask(nextConnection, pending.request).then(pending.resolve, pending.reject);
    }
  }, [connection, executeTask]);

  const refreshModels = useCallback(async () => {
    if (!connection) return [];
    const response = await fetch("/api/ai/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: connection.provider, apiKey: connection.apiKey }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(await readError(response, "Không thể tải danh sách model."));
    const payload = await response.json() as { models: AIModelInfo[] };
    setModels(payload.models);
    if (connection.modelMode === "manual" && !payload.models.some((model) => model.id === connection.preferredModel)) {
      const updated = { ...connection, modelMode: "auto" as const, preferredModel: null };
      setConnection(updated);
      saveConnection(updated);
      setNotice("Model đã chọn trước đây không còn khả dụng. Hệ thống đã chuyển về chế độ Tự động.");
    }
    return payload.models;
  }, [connection]);

  const updateModelPreference = useCallback((mode: ModelMode, preferredModel?: string | null) => {
    if (!connection) return;
    const updated = { ...connection, modelMode: mode, preferredModel: mode === "manual" ? preferredModel || null : null };
    setConnection(updated);
    saveConnection(updated);
  }, [connection]);

  const disconnect = useCallback(() => {
    clearConnection();
    setConnection(null);
    setModels([]);
    setNotice("");
    setModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    const pending = pendingTask.current;
    if (pending) {
      pendingTask.current = null;
      pending.reject(new Error("Bạn đã hủy kết nối AI."));
    }
  }, []);

  const runTask = useCallback((request: AITaskRequest) => {
    if (connection) return executeTask(connection, request);
    setModalOpen(true);
    return new Promise<AITaskResult>((resolve, reject) => {
      pendingTask.current = { request, resolve, reject };
    });
  }, [connection, executeTask]);

  const value = useMemo(() => ({
    connection,
    connected: Boolean(connection),
    models,
    modalOpen,
    notice,
    openModal: () => setModalOpen(true),
    closeModal,
    connect,
    disconnect,
    refreshModels,
    updateModelPreference,
    runTask,
  }), [closeModal, connect, connection, disconnect, modalOpen, models, notice, refreshModels, runTask, updateModelPreference]);

  return <AIConnectionContext.Provider value={value}>{children}</AIConnectionContext.Provider>;
}

export function useAIConnection() {
  const context = useContext(AIConnectionContext);
  if (!context) throw new Error("useAIConnection must be used inside AIConnectionProvider");
  return context;
}
