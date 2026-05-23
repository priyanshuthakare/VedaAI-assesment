import { AssignmentInput } from "../../types";

export function buildPrompt(input: AssignmentInput): string {
  return `
You are an expert teacher creating a structured question paper.
Generate a question paper strictly as a JSON object. No markdown, no explanation,
no preamble. Only output the raw JSON.

Assignment Details:
- Subject/Topic: ${input.topic}
- Total Questions: ${input.totalQuestions}
- Marks per Question: ${input.marksPerQuestion}
- Question Types: ${input.questionTypes.map((qt) => typeof qt === "string" ? qt : `${qt.type} (${qt.count} questions, ${qt.marksEach} marks each)`).join(", ")}
- Difficulty Distribution: Easy ${input.difficulty.easy}%, Medium ${input.difficulty.medium}%, Hard ${input.difficulty.hard}%
- Additional Instructions: ${input.instructions || "None"}
${input.fileContent ? `- Reference Material:\n${input.fileContent}` : ""}

Output ONLY this JSON structure, nothing else:
{
  "title": "string",
  "subject": "string",
  "totalMarks": number,
  "duration": "string",
  "sections": [
    {
      "id": "string",
      "label": "Section A",
      "instruction": "string",
      "questions": [
        {
          "id": "string",
          "number": number,
          "text": "string",
          "difficulty": "easy" | "medium" | "hard",
          "marks": number,
          "type": "mcq" | "short" | "long" | "truefalse",
          "options": ["string"]
        }
      ]
    }
  ]
}

Group questions by type into sections (Section A = MCQ, Section B = Short Answer, etc.).
Every question must have difficulty and marks assigned.
`.trim();
}
