"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { CloudUpload } from "lucide-react";

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
          "flex flex-col items-center justify-center gap-[8px] p-[48px]",
          "border-[2px] border-dashed border-[#DCDCDC] rounded-[32px] bg-white/60 backdrop-blur-md shadow-sm",
          "cursor-pointer transition-all duration-200 hover:bg-white/80",
          isDragging && "border-[#171717] bg-[#F6F6F6]",
          error && "border-[#FF4040]"
        )}
      >
        {/* Upload cloud icon */}
        <CloudUpload className="w-[32px] h-[32px] text-[#2F2F2F] mb-2" strokeWidth={1.5} />

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

        <label className="mt-[16px] px-[24px] py-[10px] bg-[#F5F5F5] rounded-full text-[14px] font-medium text-[#2F2F2F] cursor-pointer hover:bg-[#EBEBEB] transition-colors font-[var(--font-bricolage-grotesque)]">
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
