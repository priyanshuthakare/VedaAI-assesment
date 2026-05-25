"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-[6px]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] leading-[19.6px] tracking-[-0.56px] font-medium text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full border-[1.75px] border-[#00000033] rounded-[16px] px-[16px] py-[12px]",
            "text-[14px] leading-[19.6px] tracking-[-0.56px] font-normal text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]",
            "placeholder:text-[#2F2F2F99]",
            "focus:outline-none focus:border-[#171717] focus:ring-0",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F6F6F6]",
            "transition-colors duration-200",
            error && "border-[#FF4040] focus:border-[#FF4040]",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[12px] leading-[16.8px] text-[#FF4040] font-[var(--font-bricolage-grotesque)]">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-[12px] leading-[16.8px] text-[#5D5D5D8C] font-[var(--font-bricolage-grotesque)]">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
