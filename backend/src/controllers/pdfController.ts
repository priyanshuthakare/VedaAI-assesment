import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { Result } from "../models/Result";
import { Assignment } from "../models/Assignment";
import { QuestionPaper } from "../types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPdfHtml(paper: QuestionPaper, assignment: { input: { topic: string; dueDate: string } }): string {
  const paperTitle = escapeHtml(paper.title || "Question Paper");
  const subject = escapeHtml(paper.subject || "English");
  const duration = escapeHtml(paper.duration || "45 minutes");
  const dueDate = escapeHtml(assignment.input.dueDate || "");

  const sectionsHtml = paper.sections
    .map(
      (section) => `
    <section class="section">
      <h2>${escapeHtml(section.label || "")}</h2>
      <p class="instruction">${escapeHtml(section.instruction || "")}</p>
      <ol>
      ${section.questions
        .map(
          (q) => `
        <li class="question">
          <div class="question-text">
            [${q.difficulty === "hard" ? "Challenging" : q.difficulty === "easy" ? "Easy" : "Moderate"}]
            ${escapeHtml(q.text)} [${q.marks} Marks]
          </div>
          ${
            q.options
              ? `<div class="options">${q.options
                  .map(
                    (opt, i) =>
                      `<div class="option">${String.fromCharCode(97 + i)}) ${escapeHtml(opt)}</div>`
                  )
                  .join("")}</div>`
              : ""
          }
        </li>
      `
        )
        .join("")}
      </ol>
    </section>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 16mm 14mm 18mm 14mm;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          color: #2f2f2f;
          font-size: 12pt;
          line-height: 1.45;
          background: #fff;
        }

        .shell {
          width: 100%;
        }

        .paper {
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          padding: 18pt 18pt 20pt;
          background: #fff;
        }

        .paper-header {
          text-align: center;
          margin-bottom: 16pt;
          border-bottom: 1px solid #d9d9d9;
          padding-bottom: 10pt;
        }

        .paper-header__line {
          font-size: 15.5pt;
          line-height: 1.35;
          font-weight: 700;
        }

        .marks-row {
          display: table;
          width: 100%;
          margin: 12pt 0 10pt;
          font-size: 11pt;
          font-weight: 600;
        }

        .marks-row span {
          display: table-cell;
          vertical-align: top;
        }

        .marks-row span:last-child {
          text-align: right;
        }

        .instructions {
          margin: 8pt 0 10pt;
          font-size: 11pt;
          font-weight: 600;
        }

        .student-lines {
          margin: 8pt 0 14pt;
          font-size: 11pt;
          line-height: 1.65;
          font-weight: 600;
        }

        .section {
          margin-top: 14pt;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .section h2 {
          text-align: center;
          font-size: 13pt;
          line-height: 1.3;
          font-weight: 700;
          margin-bottom: 7pt;
        }

        .instruction {
          font-size: 10.5pt;
          line-height: 1.5;
          margin-bottom: 8pt;
          font-style: italic;
          color: #4a4a4a;
        }

        .section ol {
          margin-left: 12pt;
          padding-left: 12pt;
          font-size: 10.8pt;
          line-height: 1.6;
        }

        .question {
          margin-bottom: 9pt;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .question-text {
          text-align: justify;
        }

        .options {
          margin-top: 6pt;
          margin-left: 4pt;
          font-size: 10.2pt;
          line-height: 1.5;
        }

        .option {
          margin-bottom: 3pt;
        }

        .footer {
          margin-top: 14pt;
          padding-top: 8pt;
          border-top: 1px solid #dadada;
          font-size: 9pt;
          color: #5d5d5d;
        }
      </style>
    </head>
    <body>
      <div class="shell">
        <div class="paper">
          <div class="paper-header">
            <div class="paper-header__line">${paperTitle}</div>
            <div class="paper-header__line">Subject: ${subject}</div>
            <div class="paper-header__line">Class: 5th</div>
          </div>

          <div class="marks-row">
            <span>Time Allowed: ${duration}</span>
            <span>Maximum Marks: ${paper.totalMarks || 20}</span>
          </div>

          <p class="instructions">All questions are compulsory unless stated otherwise.</p>
          <div class="student-lines">
            <div>Name: ____________________</div>
            <div>Roll Number: ________________</div>
            <div>Class: 5th Section: _________</div>
          </div>

          ${sectionsHtml}

          <p class="footer">${dueDate ? `Due Date: ${dueDate}` : ""}</p>
        </div>
      </div>
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
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
      printBackground: true,
    });

    const safeName = (result.questionPaper.title || "question-paper").replace(/[^\w\-]+/g, "_");
    const versionedName = `${safeName}-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${versionedName}"`);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("[generatePdf] Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
