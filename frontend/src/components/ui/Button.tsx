"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary-dark" | "primary-white";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary-dark", size = "default", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[100px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          // Variant styles
          variant === "primary-dark" && [
            "bg-[#171717] text-white font-[var(--font-inter)]",
            "hover:bg-[#2A2A2A] active:bg-[#000000]",
            "border-[1.5px] border-transparent",
            "text-[16px] leading-[28px] tracking-[-0.64px] font-medium",
          ],
          variant === "primary-white" && [
            "bg-[#F6F6F6] text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]",
            "hover:bg-[#EFEFEF] active:bg-[#E6E6E6]",
            "text-[14px] leading-[19.6px] tracking-[-0.56px] font-medium",
          ],
          // Size styles
          size === "default" && "px-[24px] py-[12px]",
          size === "sm" && "px-[16px] py-[8px] text-[14px]",
          size === "lg" && "px-[32px] py-[16px]",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
