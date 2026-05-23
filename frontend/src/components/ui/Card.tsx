"use client";

import { cn } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "note";
  hover?: boolean;
}

export function Card({ children, className, variant = "default", hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[12px]",
        variant === "default" && "p-[16px]",
        variant === "note" && "p-[24px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)]",
        hover && "transition-shadow duration-200 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
