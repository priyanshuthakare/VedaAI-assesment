"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { Badge, Spinner } from "@/components/ui";
import { useOutputStore } from "@/store/outputStore";
import { api } from "@/lib/api";
import type { QuestionPaper } from "@/types";

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3V15M12 15L7 10M12 15L17 10M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17"
        stroke="#2F2F2F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RegenerateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 10C3 6.13401 6.13401 3 10 3C12.7614 3 15.1246 4.55339 16.3301 6.83333M17 10C17 13.866 13.866 17 10 17C7.23858 17 4.87543 15.4466 3.66987 13.1667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M14 7H17V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 13H3V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OutputPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const { questionPaper, setQuestionPaper, isLoading, setLoading, error, setError } =
    useOutputStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const res = await api.get(`/assignments/${assignmentId}/result`);
        setQuestionPaper(res.data.questionPaper as QuestionPaper);
      } catch (err: unknown) {
        console.error("Failed to fetch result:", err);
        setError("Failed to load question paper");
      }
    }
    if (assignmentId) {
      fetchResult();
    }
  }, [assignmentId, setQuestionPaper, setLoading, setError]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const res = await api.get(`/assignments/${assignmentId}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `question-paper-${assignmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("Failed to download PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await api.post(`/assignments/${assignmentId}/regenerate`);
      router.push(`/status/${assignmentId}`);
    } catch (err: unknown) {
      console.error("Failed to regenerate:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Assignment">
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !questionPaper) {
    return (
      <DashboardLayout breadcrumb="Assignment">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-bricolage text-[16px] text-secondary-text mb-16">
              {error || "No question paper found"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-24 py-12 bg-primary-dark text-white rounded-[48px] font-bricolage font-medium text-[16px] hover:opacity-90 transition-opacity"
            >
              Go Home
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout breadcrumb="Assignment">
      <div className="flex flex-col w-full max-w-[1100px] mx-auto p-20 gap-12 max-md:p-12 max-md:gap-8">
        {/* AI Message Header */}
        <div
          className="w-full rounded-[32px] p-24 px-32 max-md:rounded-[20px] max-md:p-16"
          style={{ backgroundColor: "rgba(23, 23, 23, 0.8)" }}
        >
          <div className="flex flex-col gap-16">
            <p className="font-bricolage font-bold text-[20px] leading-[28px] tracking-[-0.8px] text-white">
              Here is your customized Question Paper for{" "}
              {questionPaper.subject || questionPaper.title}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-16 max-md:flex-col max-md:gap-8">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-4 h-[44px] px-24 bg-white rounded-[100px] hover:bg-surface-secondary transition-colors disabled:opacity-50"
              >
                <DownloadIcon />
                <span className="font-bricolage font-medium text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                  {isDownloading ? "Downloading..." : "Download as PDF"}
                </span>
              </button>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-4 h-[44px] px-24 bg-transparent border border-white/30 rounded-[100px] text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RegenerateIcon />
                <span className="font-bricolage font-medium text-[16px] leading-[22px] tracking-[-0.64px]">
                  {isRegenerating ? "Regenerating..." : "Regenerate"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Paper Content */}
        <div className="w-full bg-white rounded-[32px] p-32 max-md:rounded-[20px] max-md:p-16">
          {/* Header */}
          <div className="text-center mb-24">
            <h1 className="font-inter font-semibold text-[24px] leading-[38px] tracking-[-0.96px] text-primary-text">
              {questionPaper.title}
            </h1>
            {questionPaper.subject && (
              <p className="font-inter font-semibold text-[24px] leading-[38px] tracking-[-0.96px] text-primary-text">
                Subject: {questionPaper.subject}
              </p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex justify-between items-center mb-24 pb-16 border-b border-border max-md:flex-col max-md:items-start max-md:gap-8">
            <span className="font-inter font-semibold text-[18px] leading-[29px] tracking-[-0.72px] text-primary-text">
              Time Allowed: {questionPaper.duration || "45 minutes"}
            </span>
            <span className="font-inter font-semibold text-[18px] leading-[29px] tracking-[-0.72px] text-primary-text">
              Maximum Marks: {questionPaper.totalMarks}
            </span>
          </div>

          {/* Student Info Fields */}
          <div className="flex gap-32 mb-32 max-md:flex-col max-md:gap-16">
            <div className="flex items-center gap-8">
              <span className="font-inter font-medium text-[14px] text-primary-text">
                Student Name:
              </span>
              <div className="w-[200px] border-b border-border" />
            </div>
            <div className="flex items-center gap-8">
              <span className="font-inter font-medium text-[14px] text-primary-text">
                Roll Number:
              </span>
              <div className="w-[100px] border-b border-border" />
            </div>
          </div>

          {/* Sections */}
          {questionPaper.sections.map((section, sIdx) => (
            <div key={section.id || sIdx} className="mb-32">
              <h3 className="font-inter font-semibold text-[18px] leading-[29px] tracking-[-0.72px] text-primary-text mb-8">
                {section.label}
              </h3>
              {section.instruction && (
                <p className="font-inter font-normal text-[14px] leading-[22px] text-secondary-text mb-16 italic">
                  {section.instruction}
                </p>
              )}

              {/* Questions */}
              <div className="flex flex-col gap-12">
                {section.questions.map((question, qIdx) => (
                  <div
                    key={question.id || qIdx}
                    className="font-inter font-normal text-[16px] leading-[38px] tracking-[-0.64px] text-primary-text"
                  >
                    <span>
                      <Badge
                        variant={
                          question.difficulty === "easy"
                            ? "easy"
                            : question.difficulty === "hard"
                            ? "hard"
                            : "moderate"
                        }
                      >
                        {question.difficulty === "easy"
                          ? "Easy"
                          : question.difficulty === "hard"
                          ? "Challenging"
                          : "Moderate"}
                      </Badge>{" "}
                      {question.text} [{question.marks} Marks]
                    </span>

                    {/* MCQ Options */}
                    {question.options && question.options.length > 0 && (
                      <div className="ml-24 mt-4">
                        {question.options.map((opt, oIdx) => (
                          <div key={oIdx} className="font-inter text-[14px] leading-[28px] text-primary-text">
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* End of Paper */}
          <div className="text-center mt-32 pt-16 border-t border-border">
            <p className="font-inter font-medium text-[14px] text-secondary-text">
              End of Question Paper
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
