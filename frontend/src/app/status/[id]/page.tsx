"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { ProgressBar, Spinner } from "@/components/ui";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useGenerationStore } from "@/store/generationStore";

export default function StatusPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const { status, progress, error, setAssignmentId } = useGenerationStore();

  useEffect(() => {
    if (assignmentId) {
      setAssignmentId(assignmentId);
    }
  }, [assignmentId, setAssignmentId]);

  useWebSocket(assignmentId);

  useEffect(() => {
    if (status === "completed") {
      const timer = setTimeout(() => {
        router.push(`/output/${assignmentId}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, assignmentId, router]);

  const getStatusMessage = () => {
    switch (status) {
      case "queued":
        return "Your assignment is in the queue...";
      case "processing":
        return "AI is generating your question paper...";
      case "completed":
        return "Generation complete! Redirecting...";
      case "failed":
        return "Generation failed";
      default:
        return "Connecting...";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "queued":
        return "Please wait while we prepare to generate your question paper. This usually takes a few seconds.";
      case "processing":
        return "Our AI is analyzing your requirements and creating a comprehensive question paper tailored to your specifications.";
      case "completed":
        return "Your question paper has been generated successfully. You'll be redirected to view it shortly.";
      case "failed":
        return error || "Something went wrong. Please try again.";
      default:
        return "Establishing connection to the server...";
    }
  };

  return (
    <DashboardLayout breadcrumb="Assignment">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-[500px] w-full">
          {/* Status Icon */}
          <div className="mb-32">
            {status === "failed" ? (
              <div className="w-[80px] h-[80px] rounded-full bg-[#FF404015] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M10 10L22 22M22 10L10 22"
                    stroke="#FF4040"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : status === "completed" ? (
              <div className="w-[80px] h-[80px] rounded-full bg-[#4BC16C15] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M8 16L14 22L24 10"
                    stroke="#4BC16C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-[80px] h-[80px] rounded-full bg-surface-secondary flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            )}
          </div>

          {/* Status Text */}
          <h2 className="font-bricolage font-bold text-[20px] leading-[28px] tracking-[-0.8px] text-primary-text text-center mb-8">
            {getStatusMessage()}
          </h2>
          <p className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-secondary-text text-center mb-32">
            {getStatusDescription()}
          </p>

          {/* Progress Bar */}
          {(status === "processing" || status === "queued") && (
            <div className="w-full">
              <ProgressBar
                progress={status === "queued" ? 5 : progress}
              />
            </div>
          )}

          {/* Retry Button for Failed */}
          {status === "failed" && (
            <button
              onClick={() => router.back()}
              className="mt-24 px-24 py-12 bg-primary-dark text-white rounded-[48px] font-bricolage font-medium text-[16px] leading-[22px] tracking-[-0.64px] hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
