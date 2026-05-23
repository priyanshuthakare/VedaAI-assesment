import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { Result } from "../models/Result";
import { Assignment } from "../models/Assignment";
import { QuestionPaper } from "../types";

function buildPdfHtml(paper: QuestionPaper, assignment: { input: { topic: string; dueDate: string } }): string {
  const sectionsHtml = paper.sections
    .map(
      (section) => `
    <div class="section">
      <h2>${section.label}</h2>
      <p class="instruction">${section.instruction}</p>
      ${section.questions
        .map(
          (q) => `
        <div class="question">
          <div class="q-header">
            <span class="q-number">${q.number}.</span>
            <span class="q-text">${q.text}</span>
            <span class="q-marks">[${q.marks} Marks]</span>
          </div>
          ${
            q.options
              ? `<div class="options">${q.options
                  .map((opt, i) => `<div class="option">${String.fromCharCode(97 + i)}) ${opt}</div>`)
                  .join("")}</div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #2F2F2F; }
        .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #171717; padding-bottom: 16px; }
        .header h1 { font-size: 24px; margin-bottom: 8px; }
        .header .meta { font-size: 14px; color: #5D5D5D; display: flex; justify-content: space-between; margin-top: 8px; }
        .section { margin-bottom: 24px; }
        .section h2 { font-size: 18px; margin-bottom: 8px; border-bottom: 1px solid #DADADA; padding-bottom: 4px; }
        .instruction { font-size: 13px; color: #5D5D5D; margin-bottom: 12px; font-style: italic; }
        .question { margin-bottom: 16px; }
        .q-header { display: flex; gap: 8px; align-items: flex-start; }
        .q-number { font-weight: bold; min-width: 24px; }
        .q-text { flex: 1; }
        .q-marks { white-space: nowrap; font-weight: bold; color: #5D5D5D; }
        .options { margin-left: 32px; margin-top: 8px; }
        .option { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${paper.title}</h1>
        <p>Subject: ${paper.subject} | Total Marks: ${paper.totalMarks} | Duration: ${paper.duration}</p>
        <div class="meta">
          <span>Date: ${assignment.input.dueDate}</span>
          <span>All questions are compulsory unless stated otherwise.</span>
        </div>
      </div>
      ${sectionsHtml}
    </body>
    </html>
  `;
}

export async function generatePdf(req: Request, res: Response): Promise<void> {
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

    const browser = await puppeteer.launch({
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

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${result.questionPaper.title || "question-paper"}.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("[generatePdf] Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
