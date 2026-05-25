"use client";

import { cn } from "@/lib/utils";
import { forwardRef, SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-[6px]">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[14px] leading-[19.6px] tracking-[-0.56px] font-medium text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full border-[1.75px] border-[#00000033] rounded-[24px] px-[16px] py-[12px] pr-[40px]",
              "text-[14px] leading-[19.6px] tracking-[-0.56px] font-normal text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]",
              "focus:outline-none focus:border-[#171717] focus:ring-0",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F6F6F6]",
              "appearance-none bg-white cursor-pointer",
              "transition-colors duration-200",
              error && "border-[#FF4040] focus:border-[#FF4040]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="#2F2F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-[12px] leading-[16.8px] text-[#FF4040] font-[var(--font-bricolage-grotesque)]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
