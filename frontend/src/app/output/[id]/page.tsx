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
            padding: isMobile ? "24px 16px" : "48px 40px",
            borderRadius: "32px",
            background: isMobile ? "#F6F6F6" : "#FFFFFF",
            color: "#2F2F2F",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          <h1 style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "56px", fontWeight: 600, lineHeight: isMobile ? "20.8px" : 1.2, letterSpacing: isMobile ? "-0.32px" : "-0.96px" }}>
            {paper.title}
          </h1>
          <p style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "56px", fontWeight: 600, lineHeight: isMobile ? "20.8px" : 1.2, letterSpacing: isMobile ? "-0.32px" : "-0.96px" }}>
            Subject: {paper.subject}
          </p>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: isMobile ? "10px" : 0, marginTop: isMobile ? "14px" : "36px", fontSize: isMobile ? "14px" : "18px", fontWeight: 600, lineHeight: isMobile ? "22.4px" : "28.8px", letterSpacing: isMobile ? "-0.56px" : "-0.72px" }}>
            <p>Time Allowed: {paper.duration}</p>
            <p>Maximum Marks: {paper.totalMarks}</p>
          </div>

          <p style={{ marginTop: isMobile ? "14px" : "28px", fontSize: isMobile ? "16px" : "18px", fontWeight: isMobile ? 400 : 600, lineHeight: isMobile ? "24px" : "28.8px", letterSpacing: isMobile ? "-0.64px" : "-0.72px" }}>
            All questions are compulsory unless stated otherwise.
          </p>

          <div style={{ marginTop: isMobile ? "14px" : "28px", fontSize: isMobile ? "16px" : "18px", fontWeight: isMobile ? 400 : 600, lineHeight: isMobile ? "24px" : "36px", letterSpacing: isMobile ? "-0.64px" : "-0.72px" }}>
            <p>Name: ____________________</p>
            <p>Roll Number: ________________</p>
          </div>

          {paper.sections.map((section, sectionIdx) => {
            const firstType = section.questions[0]?.type;
            const typeLabel =
              firstType === "mcq"
                ? "Multiple Choice Questions"
                : firstType === "long"
                  ? "Long Answer Questions"
                  : firstType === "truefalse"
                    ? "True / False Questions"
                    : "Short Answer Questions";

            return (
              <section key={section.id || sectionIdx} style={{ marginTop: "32px" }}>
                <h2 style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "36px", fontWeight: 600, lineHeight: isMobile ? "25.6px" : "42px", letterSpacing: "-0.64px" }}>
                  {section.label || `Section ${String.fromCharCode(65 + sectionIdx)}`}
                </h2>
                <p style={{ marginTop: "8px", fontSize: isMobile ? "14px" : "18px", fontWeight: 600, lineHeight: isMobile ? "22px" : "28px", letterSpacing: "-0.56px" }}>
                  {typeLabel}
                </p>
                {section.instruction && (
                  <p style={{ marginTop: "8px", fontSize: isMobile ? "16px" : "18px", lineHeight: isMobile ? "24px" : "28px", letterSpacing: "-0.64px", fontStyle: "italic" }}>
                    {section.instruction}
                  </p>
                )}
                <ol style={{ marginTop: "18px", paddingLeft: isMobile ? "22px" : "28px", fontSize: isMobile ? "16px" : "20px", lineHeight: isMobile ? "24px" : 1.7, letterSpacing: "-0.64px" }}>
                  {section.questions.map((question, questionIdx) => {
                    const difficultyLabel =
                      question.difficulty === "easy"
                        ? "Easy"
                        : question.difficulty === "hard"
                          ? "Challenging"
                          : "Moderate";

                    return (
                      <li key={question.id || questionIdx} style={{ marginBottom: "12px" }}>
                        [{difficultyLabel}] {question.text} [{question.marks} Mark{question.marks !== 1 ? "s" : ""}]
                        {question.options && question.options.length > 0 && (
                          <div
                            style={{
                              marginTop: "8px",
                              display: "grid",
                              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                              gap: "6px 20px",
                              fontSize: isMobile ? "14px" : "18px",
                              lineHeight: 1.5,
                            }}
                          >
                            {question.options.map((option, optIdx) => (
                              <div key={`${question.id || questionIdx}-opt-${optIdx}`}>
                                ({String.fromCharCode(97 + optIdx)}) {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </article>
      </div>
    </DashboardLayout>
  );
}


