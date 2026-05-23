"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { Spinner } from "@/components/ui";
import { useOutputStore } from "@/store/outputStore";
import { api } from "@/lib/api";
import type { QuestionPaper } from "@/types";

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

export default function OutputPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const { questionPaper, setQuestionPaper, isLoading, setLoading, error, setError } =
    useOutputStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fallbackPaper: QuestionPaper = {
    title: "Delhi Public School, Sector-4, Bokaro",
    subject: "English",
    duration: "45 minutes",
    totalMarks: 20,
    sections: [
      {
        id: "a",
        label: "Section A",
        instruction: "Short Answer Questions Attempt all questions. Each question carries 2 marks",
        questions: [
          { id: "q1", number: 1, text: "Define electroplating. Explain its purpose.", difficulty: "easy", marks: 2, type: "short" },
          { id: "q2", number: 2, text: "What is the role of a conductor in the process of electrolysis?", difficulty: "moderate", marks: 2, type: "short" },
          { id: "q3", number: 3, text: "Why does a solution of copper sulfate conduct electricity?", difficulty: "easy", marks: 2, type: "short" },
        ],
      },
    ],
  };

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= 767);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

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

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Create New" hideMobileNav>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const paper = questionPaper || fallbackPaper;

  return (
    <DashboardLayout breadcrumb="Create New" hideMobileNav>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: isMobile ? "373px" : "1100px", margin: "0 auto" }}>
        <section style={{ display: "flex", flexDirection: "column", gap: "12px", padding: isMobile ? "24px 16px" : "24px 32px", borderRadius: "32px", background: "#2F2F2F", color: "#EFEFEF" }}>
          <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: isMobile ? "14px" : "20px", fontWeight: 700, lineHeight: isMobile ? "16.8px" : "28px", letterSpacing: isMobile ? "-0.56px" : "-0.8px" }}>
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science
            classes on the NCERT chapters:
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

        <article style={{ padding: isMobile ? "24px 16px" : "48px 40px", borderRadius: "32px", background: isMobile ? "#F6F6F6" : "#FFFFFF", color: "#2F2F2F", fontFamily: "var(--font-inter), sans-serif" }}>
          <h1 style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "56px", fontWeight: 600, lineHeight: isMobile ? "20.8px" : 1.2, letterSpacing: isMobile ? "-0.32px" : "-0.96px" }}>
            Delhi Public School, Sector-4, Bokaro
          </h1>
          <p style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "56px", fontWeight: 600, lineHeight: isMobile ? "20.8px" : 1.2, letterSpacing: isMobile ? "-0.32px" : "-0.96px" }}>Subject: {paper.subject || "English"}</p>
          <p style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "56px", fontWeight: 600, lineHeight: isMobile ? "20.8px" : 1.2, letterSpacing: isMobile ? "-0.32px" : "-0.96px" }}>Class: 5th</p>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: isMobile ? "10px" : 0, marginTop: isMobile ? "14px" : "36px", fontSize: isMobile ? "14px" : "18px", fontWeight: 600, lineHeight: isMobile ? "22.4px" : "28.8px", letterSpacing: isMobile ? "-0.56px" : "-0.72px" }}>
            <p>Time Allowed: {paper.duration || "45 minutes"}</p>
            <p>Maximum Marks: {paper.totalMarks || 20}</p>
          </div>

          <p style={{ marginTop: isMobile ? "14px" : "28px", fontSize: isMobile ? "16px" : "18px", fontWeight: isMobile ? 400 : 600, lineHeight: isMobile ? "24px" : "28.8px", letterSpacing: isMobile ? "-0.64px" : "-0.72px" }}>
            All questions are compulsory unless stated otherwise.
          </p>

          <div style={{ marginTop: isMobile ? "14px" : "28px", fontSize: isMobile ? "16px" : "18px", fontWeight: isMobile ? 400 : 600, lineHeight: isMobile ? "24px" : "36px", letterSpacing: isMobile ? "-0.64px" : "-0.72px" }}>
            <p>Name: ____________________</p>
            <p>Roll Number: ________________</p>
            <p>Class: 5th Section: _________</p>
          </div>

          {paper.sections.map((section, sectionIdx) => (
            <section key={section.id || sectionIdx} style={{ marginTop: "32px" }}>
              <h2 style={{ textAlign: isMobile ? "left" : "center", fontSize: isMobile ? "16px" : "36px", fontWeight: 600, lineHeight: isMobile ? "25.6px" : "42px", letterSpacing: "-0.64px" }}>{section.label || `Section ${String.fromCharCode(65 + sectionIdx)}`}</h2>
              {section.instruction && <p style={{ marginTop: "16px", fontSize: isMobile ? "16px" : "18px", lineHeight: isMobile ? "24px" : "28px", letterSpacing: "-0.64px" }}>{section.instruction}</p>}

              <ol style={{ marginTop: "18px", paddingLeft: isMobile ? "22px" : "28px", fontSize: isMobile ? "16px" : "20px", lineHeight: isMobile ? "24px" : 1.7, letterSpacing: "-0.64px" }}>
                {section.questions.map((question, questionIdx) => (
                  <li key={question.id || questionIdx} style={{ marginBottom: "8px" }}>
                    [{question.difficulty === "hard" ? "Challenging" : question.difficulty === "easy" ? "Easy" : "Moderate"}]{" "}
                    {question.text} [{question.marks} Marks]
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </article>
      </div>
    </DashboardLayout>
  );
}
