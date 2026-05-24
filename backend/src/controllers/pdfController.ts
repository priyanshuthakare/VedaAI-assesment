import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { Assignment } from "../models/Assignment";
import { Result } from "../models/Result";
import { QuestionPaper } from "../types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function difficultyLabel(d: string): string {
  switch (d) {
    case "easy": return "Easy";
    case "hard": return "Challenging";
    default:     return "Moderate";
  }
}

function buildPdfHtml(
  paper: QuestionPaper,
  assignment: { input: { topic: string; dueDate: string; schoolName?: string; className?: string } }
): string {
  const title      = escapeHtml(paper.title   || "Question Paper");
  const subject    = escapeHtml(paper.subject || "General");
  const duration   = escapeHtml(paper.duration || "45 minutes");
  const dueDate    = escapeHtml(assignment.input.dueDate || "");
  const schoolName = escapeHtml((assignment.input as any).schoolName || title);
  const className  = escapeHtml((assignment.input as any).className  || "");

  const total = paper.totalMarks || paper.sections.reduce(
    (acc, s) => acc + s.questions.reduce((a, q) => a + q.marks, 0), 0
  );

  // Answer key collected while building questions
  const answerKey: { num: number; answer?: string }[] = [];
  let globalQNum = 0;

  const sectionsHtml = paper.sections.map((section) => {
    const questionsHtml = section.questions.map((q) => {
      globalQNum++;
      if (q.answer) answerKey.push({ num: globalQNum, answer: q.answer });

      const optionsHtml = q.options
        ? `<div class="options">
            ${q.options.map((opt, i) =>
              `<div class="option">
                (${String.fromCharCode(97 + i)}) ${escapeHtml(opt)}
              </div>`
            ).join("")}
           </div>`
        : "";

      return `
        <li class="question">
          [${difficultyLabel(q.difficulty)}] ${escapeHtml(q.text)}
          <span class="q-marks">[${q.marks} Mark${q.marks !== 1 ? "s" : ""}]</span>
          ${optionsHtml}
        </li>
      `;
    }).join("");

    // Determine section type label from first question type
    const typeLabel = section.questions[0]?.type === "mcq"
      ? "Multiple Choice Questions"
      : section.questions[0]?.type === "long"
      ? "Long Answer Questions"
      : section.questions[0]?.type === "truefalse"
      ? "True / False Questions"
      : "Short Answer Questions";

    return `
      <div class="section">
        <h2 class="section-title">${escapeHtml(section.label)}</h2>
        <p class="section-type">${typeLabel}</p>
        <p class="section-instruction"><em>${escapeHtml(section.instruction)}</em></p>
        <ol class="questions-list">
          ${questionsHtml}
        </ol>
      </div>
    `;
  }).join("");

  const answerKeyHtml = answerKey.length > 0
    ? `<div class="answer-key">
        <h3 class="ak-title">Answer Key:</h3>
        <ol class="ak-list">
          ${answerKey.map(a =>
            `<li class="ak-item">${escapeHtml(a.answer || "")}</li>`
          ).join("")}
        </ol>
       </div>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 20mm 18mm 22mm 18mm;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 11.5pt;
          color: #111;
          line-height: 1.55;
          background: #fff;
        }

        /* ── HEADER ── */
        .header {
          text-align: center;
          margin-bottom: 14pt;
          border-bottom: 2px solid #111;
          padding-bottom: 10pt;
        }

        .school-name {
          font-size: 17pt;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 3pt;
        }

        .header-sub {
          font-size: 12pt;
          font-weight: 700;
          line-height: 1.5;
        }

        /* ── META ROW ── */
        .meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 11pt;
          font-weight: 700;
          margin: 10pt 0 8pt;
        }

        /* ── GENERAL INSTRUCTION ── */
        .general-instruction {
          font-size: 11pt;
          font-weight: 700;
          margin-bottom: 12pt;
        }

        /* ── STUDENT INFO ── */
        .student-info {
          margin-bottom: 14pt;
          font-size: 11pt;
          font-weight: 400;
          line-height: 2.0;
        }

        .student-info div {
          display: flex;
          align-items: baseline;
          gap: 4pt;
        }

        .field-label {
          font-weight: 400;
          white-space: nowrap;
        }

        .field-line {
          display: inline-block;
          border-bottom: 1px solid #111;
          min-width: 140pt;
          height: 14pt;
          vertical-align: bottom;
        }

        /* ── SECTION ── */
        .section {
          margin-top: 16pt;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .section-title {
          text-align: center;
          font-size: 13pt;
          font-weight: 700;
          margin-bottom: 4pt;
        }

        .section-type {
          font-size: 11pt;
          font-weight: 700;
          margin-bottom: 2pt;
        }

        .section-instruction {
          font-size: 10.5pt;
          color: #333;
          margin-bottom: 8pt;
          font-style: italic;
        }

        /* ── QUESTIONS ── */
        .questions-list {
          padding-left: 20pt;
          margin: 0;
        }

        .question {
          font-size: 11pt;
          line-height: 1.6;
          margin-bottom: 7pt;
          page-break-inside: avoid;
          break-inside: avoid;
          text-align: justify;
        }

        .q-marks {
          font-weight: 400;
          margin-left: 4pt;
        }

        /* ── MCQ OPTIONS ── */
        .options {
          margin-top: 4pt;
          margin-left: 4pt;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2pt 20pt;
          font-size: 10.8pt;
        }

        .option {
          line-height: 1.5;
        }

        /* ── END LINE ── */
        .end-line {
          font-size: 11pt;
          font-weight: 700;
          margin-top: 14pt;
        }

        /* ── ANSWER KEY ── */
        .answer-key {
          margin-top: 24pt;
          border-top: 2px solid #111;
          padding-top: 12pt;
          page-break-before: always;
        }

        .ak-title {
          font-size: 13pt;
          font-weight: 700;
          margin-bottom: 8pt;
        }

        .ak-list {
          padding-left: 18pt;
        }

        .ak-item {
          font-size: 11pt;
          line-height: 1.65;
          margin-bottom: 6pt;
          text-align: justify;
          page-break-inside: avoid;
          break-inside: avoid;
        }
      </style>
    </head>
    <body>

      <!-- HEADER -->
      <div class="header">
        <div class="school-name">${schoolName}</div>
        <div class="header-sub">Subject: ${subject}</div>
        ${className ? `<div class="header-sub">Class: ${className}</div>` : ""}
      </div>

      <!-- META ROW -->
      <div class="meta-row">
        <span>Time Allowed: ${duration}</span>
        <span>Maximum Marks: ${total}</span>
      </div>

      <!-- GENERAL INSTRUCTION -->
      <p class="general-instruction">
        All questions are compulsory unless stated otherwise.
      </p>

      <!-- STUDENT INFO -->
      <div class="student-info">
        <div>
          <span class="field-label">Name:</span>
          <span class="field-line"></span>
        </div>
        <div>
          <span class="field-label">Roll Number:</span>
          <span class="field-line"></span>
        </div>
        <div>
          <span class="field-label">${className ? `Class: ${className} Section:` : "Section:"}</span>
          <span class="field-line" style="min-width:80pt;"></span>
        </div>
      </div>

      <!-- SECTIONS -->
      ${sectionsHtml}

      <!-- END LINE -->
      <p class="end-line">End of Question Paper</p>

      <!-- ANSWER KEY -->
      ${answerKeyHtml}

    </body>
    </html>
  `;
}

export async function generatePdf(req: Request, res: Response): Promise<void> {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  try {
    const id = req.params.id as string;
    const [result, assignment] = await Promise.all([
      Result.findOne({ assignmentId: id }),
      Assignment.findById(id),
    ]);

    if (!result || !assignment) {
      res.status(404).json({ error: "Result not found" });
      return;
    }

    const html = buildPdfHtml(result.questionPaper, assignment);

    browser = await puppeteer.launch({
      headless: true,
      executablePath: await puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // required on Render/Linux containers
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20mm", bottom: "22mm", left: "18mm", right: "18mm" },
      printBackground: false,
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="width:100%;font-size:8pt;color:#555;
                    display:flex;justify-content:flex-end;
                    padding:0 18mm;font-family:Times New Roman,serif;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
    });

    const safeName = (result.questionPaper.title || "question-paper")
      .replace(/[^\w\-]+/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}-${Date.now()}.pdf"`);
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("[generatePdf] Error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  } finally {
    if (browser) await browser.close();
  }
}