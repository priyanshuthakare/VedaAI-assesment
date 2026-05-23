"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: "bg-[#4BC16C] text-white",
    error: "bg-[#FF4040] text-white",
    info: "bg-[#171717] text-white",
  };

  return (
    <div
      className={cn(
        "fixed bottom-[24px] right-[24px] z-50 px-[20px] py-[12px] rounded-[12px] shadow-lg",
        "text-[14px] leading-[19.6px] tracking-[-0.56px] font-medium font-[var(--font-bricolage-grotesque)]",
        "transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]",
        typeStyles[type]
      )}
    >
      <div className="flex items-center gap-[8px]">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-[8px] opacity-75 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
