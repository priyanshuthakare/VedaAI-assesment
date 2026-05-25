"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              "w-full border-[1.75px] border-[#00000033] rounded-[24px] px-[16px] py-[12px]",
              "text-[14px] leading-[19.6px] tracking-[-0.56px] font-normal text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]",
              "focus:outline-none focus:border-[#171717] focus:ring-0",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F6F6F6]",
              "transition-colors duration-200",
              error && "border-[#FF4040] focus:border-[#FF4040]",
              className
            )}
            {...props}
          />
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

DatePicker.displayName = "DatePicker";
export { DatePicker };
