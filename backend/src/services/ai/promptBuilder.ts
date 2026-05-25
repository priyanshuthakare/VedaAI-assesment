import { AssignmentInput } from "../../types";

export function buildPrompt(input: AssignmentInput): string {
  const typeList = input.questionTypes
    .map((qt) =>
      typeof qt === "string"
        ? qt
        : `${qt.count} × ${qt.type} (${qt.marksEach} marks each)`
    )
    .join(", ");

  return `Output ONLY valid JSON. No markdown, no explanation, no code fences.

Create a question paper with:
- Topic: ${input.topic}
- Total questions: ${input.totalQuestions}
- Marks per question: ${input.marksPerQuestion}
- Types: ${typeList}
- Difficulty: Easy=${input.difficulty.easy}%, Medium=${input.difficulty.medium}%, Hard=${input.difficulty.hard}%
${input.instructions ? `- Extra instructions: ${input.instructions}` : ""}
${input.fileContent ? `- Reference material: ${input.fileContent.slice(0, 1000)}` : ""}

STRICT RULES:
1. "type" field MUST be exactly one of: "mcq", "short", "long", "truefalse" — no other values allowed.
2. "difficulty" field MUST be exactly one of: "easy", "medium", "hard".
3. MCQ questions MUST have an "options" array with exactly 4 strings.
4. Group questions by type into sections (Section A = MCQ, Section B = Short Answer, etc.).
5. Every question needs: id, number, text, type, difficulty, marks.

JSON schema to follow exactly:
{"title":"string","subject":"string","totalMarks":0,"duration":"string","sections":[{"id":"string","label":"Section A","instruction":"string","questions":[{"id":"string","number":1,"text":"string","type":"mcq","difficulty":"easy","marks":1,"options":["a","b","c","d"]}]}]}`.trim();
}

