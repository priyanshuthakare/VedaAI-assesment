"use client";

import { DashboardLayout } from "@/components/layout";
import { Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { useOutputStore } from "@/store/outputStore";
import type { Assignment, QuestionPaper } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function DownloadIcon({ stroke = "#2F2F2F" }: { stroke?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3V15M12 15L7 10M12 15L17 10M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @intent Displays the generated question paper output for a given assignment ID.
 * Fetches both the question paper result and the original assignment input to
 * build a fully dynamic AI summary message and paper metadata.
 */
export default function OutputPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const { questionPaper, setQuestionPaper, isLoading, setLoading, setError } =
    useOutputStore();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= 767);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!assignmentId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [resultRes, assignmentRes] = await Promise.all([
          api.get(`/assignments/${assignmentId}/result`),
          api.get(`/assignments/${assignmentId}`),
        ]);
        setQuestionPaper(resultRes.data.questionPaper as QuestionPaper);
        setAssignment(assignmentRes.data as Assignment);
      } catch (err: unknown) {
        console.error("Failed to fetch output:", err);
        setError("Failed to load question paper");
      }
    }

    fetchData();
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

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Create New" hideMobileNav>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!questionPaper) return null;

  const paper = questionPaper;
  const topic = assignment?.input?.topic || paper.subject;
  const totalQuestions = paper.sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
  const previewUrl = `${apiOrigin}/api/assignments/${assignmentId}/pdf/preview`;

  // Dynamic AI banner message
  const aiMessage = `Here is your customized Question Paper on "${topic}" — ${totalQuestions} question${totalQuestions !== 1 ? "s" : ""}, ${paper.totalMarks} marks (${paper.duration}).`;

  return (
    <DashboardLayout breadcrumb="Create New" hideMobileNav>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: isMobile ? "373px" : "1100px", margin: "0 auto" }}>
        {/* AI summary banner */}
        <section style={{ display: "flex", flexDirection: "column", gap: "12px", padding: isMobile ? "24px 16px" : "24px 32px", borderRadius: "32px", background: "#2F2F2F", color: "#EFEFEF" }}>
          <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: isMobile ? "14px" : "20px", fontWeight: 700, lineHeight: isMobile ? "16.8px" : "28px", letterSpacing: isMobile ? "-0.56px" : "-0.8px" }}>
            {aiMessage}
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", width: isMobile ? "36px" : "fit-content", minWidth: isMobile ? "36px" : undefined, height: isMobile ? "36px" : "44px", padding: isMobile ? 0 : "0 24px", border: 0, borderRadius: "100px", background: isMobile ? "#F6F6F619" : "#F6F6F6", color: isMobile ? "#FFFFFF" : "#2F2F2F", fontFamily: "var(--font-bricolage), sans-serif", fontSize: "14px", fontWeight: 500, letterSpacing: "-0.56px" }}
          >
            <DownloadIcon stroke={isMobile ? "#FFFFFF" : "#2F2F2F"} />
            {!isMobile && <span>{isDownloading ? "Downloading..." : "Download as PDF"}</span>}
          </button>
        </section>

        <article
          style={{
            borderRadius: "32px",
            background: isMobile ? "#F6F6F6" : "#FFFFFF",
            overflow: "hidden",
            border: "1px solid #E8E8E8",
          }}
        >
          <iframe
            title="PDF Preview"
            src={previewUrl}
            style={{
              width: "100%",
              minHeight: isMobile ? "900px" : "1200px",
              border: "0",
              background: "#fff",
            }}
          />
        </article>
      </div>
    </DashboardLayout>
  );
}


