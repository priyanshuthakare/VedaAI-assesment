"use client";

import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, className, showLabel = true }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-[8px]">
          <span className="text-[14px] leading-[19.6px] tracking-[-0.56px] font-medium text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]">
            Generating...
          </span>
          <span className="text-[14px] leading-[19.6px] text-[#5D5D5DCC] font-[var(--font-bricolage-grotesque)]">
            {clampedProgress}%
          </span>
        </div>
      )}
      <div className="w-full h-[8px] bg-[#EFEFEF] rounded-[100px] overflow-hidden">
        <div
          className="h-full bg-[#171717] rounded-[100px] transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
