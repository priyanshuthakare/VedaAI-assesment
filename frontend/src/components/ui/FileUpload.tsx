"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  label?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.png,.jpg,.jpeg",
  maxSizeMB = 10,
  error,
  label,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return;
      }
      setFileName(file.name);
      onFileSelect(file);
    },
    [maxSizeMB, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label className="text-[14px] leading-[19.6px] tracking-[-0.56px] font-medium text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]">
          {label}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex flex-col items-center justify-center gap-[8px] p-[32px]",
          "border-[1.75px] border-dashed border-[#00000033] rounded-[12px]",
          "cursor-pointer transition-colors duration-200",
          isDragging && "border-[#171717] bg-[#F6F6F6]",
          error && "border-[#FF4040]"
        )}
      >
        {/* Upload cloud icon */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 26V14M20 14L15 19M20 14L25 19"
            stroke="#A9A9A9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M33.333 28.333C33.333 31.095 31.095 33.333 28.333 33.333H11.667C8.905 33.333 6.667 31.095 6.667 28.333V28.333"
            stroke="#A9A9A9"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {fileName ? (
          <p className="text-[14px] text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]">
            {fileName}
          </p>
        ) : (
          <>
            <p className="text-[16px] leading-[22.4px] tracking-[-0.64px] font-medium text-[#2F2F2F] font-[var(--font-bricolage-grotesque)]">
              Choose a file or drag &amp; drop it here
            </p>
            <p className="text-[14px] text-[#A9A9A9] font-[var(--font-bricolage-grotesque)]">
              JPEG, PNG, upto {maxSizeMB}MB
            </p>
          </>
        )}

        <label className="mt-[8px] px-[16px] py-[8px] border-[1.75px] border-[#00000033] rounded-[100px] text-[14px] font-medium text-[#2F2F2F] cursor-pointer hover:bg-[#F6F6F6] transition-colors font-[var(--font-bricolage-grotesque)]">
          Browse Files
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>
      {error && (
        <span className="text-[12px] leading-[16.8px] text-[#FF4040] font-[var(--font-bricolage-grotesque)]">
          {error}
        </span>
      )}
    </div>
  );
}
