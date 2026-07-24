"use client";
import { useEffect, useState } from "react";
export function useLocalStorage<T>(key: string, initialValue: T) { const [value, setValue] = useState(initialValue); const [ready, setReady] = useState(false); useEffect(() => { try { const saved = localStorage.getItem(key); if (saved) setValue(JSON.parse(saved)); } finally { setReady(true); } }, [key]); useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, ready, value]); return [value, setValue, ready] as const; }
