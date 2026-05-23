"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant: "easy" | "moderate" | "hard";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  easy: "bg-[#4BC16C1A] text-[#4BC16C] border-[#4BC16C66]",
  moderate: "bg-[#FF56231A] text-[#FF5623] border-[#FF562366]",
  hard: "bg-[#FF40401A] text-[#FF4040] border-[#FF404066]",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-[10px] py-[4px] rounded-[100px] border-[1px]",
        "text-[12px] leading-[16.8px] tracking-[-0.48px] font-semibold font-[var(--font-bricolage-grotesque)]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
