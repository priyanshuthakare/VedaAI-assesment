"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGenerationStore } from "@/store/generationStore";

export function useWebSocket(assignmentId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const { setStatus, setProgress, setError } = useGenerationStore();

  const connect = useCallback(() => {
    if (!assignmentId) return;

    let WS_URL = process.env.NEXT_PUBLIC_WS_URL;
    if (!WS_URL) {
      if (process.env.NEXT_PUBLIC_API_URL) {
        WS_URL = process.env.NEXT_PUBLIC_API_URL.replace(/^http/, "ws").replace(/\/$/, "");
      } else if (typeof window !== "undefined") {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        WS_URL = `${protocol}//${window.location.hostname}:4000`;
      } else {
        WS_URL = "ws://localhost:4000";
      }
    }

    const ws = new WebSocket(`${WS_URL}/ws?assignmentId=${assignmentId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] Connected for assignment:", assignmentId);
      attemptRef.current = 0;
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        switch (data.event) {
          case "connected":
            break;
          case "job:queued":
            setStatus("queued");
            break;
          case "job:processing":
            setStatus("processing");
            if (data.progress !== undefined) {
              setProgress(data.progress);
            }
            break;
          case "job:completed":
            setStatus("completed");
            setProgress(100);
            break;
          case "job:failed":
            setStatus("failed");
            setError(data.error || "Generation failed");
            break;
        }
      } catch (err) {
        console.error("[WS] Failed to parse message:", err);
      }
    };

    ws.onclose = () => {
      console.log("[WS] Disconnected");
      const delay = Math.min(1000 * Math.pow(2, attemptRef.current), 30000);
      attemptRef.current += 1;
      setTimeout(() => {
        if (wsRef.current === ws) {
          connect();
        }
      }, delay);
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };
  }, [assignmentId, setStatus, setProgress, setError]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return {
    ws: wsRef.current,
  };
}
