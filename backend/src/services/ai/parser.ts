import { Question, QuestionPaper } from "../../types";

const VALID_TYPES = new Set(["mcq", "short", "long", "truefalse"]);

/**
 * Normalizes LLM type aliases to our valid enum.
 * Prevents Mongoose validation failures from minor AI hallucinations.
 */
function normalizeQuestionType(raw: string): Question["type"] {
  const t = (raw || "").toLowerCase().replace(/[\s-]/g, "_");
  if (VALID_TYPES.has(t)) return t as Question["type"];

  // Known alias map
  const aliases: Record<string, Question["type"]> = {
    fill_blank:          "short",
    fill_in_the_blank:   "short",
    fill_in_blank:       "short",
    fillblank:           "short",
    true_false:          "truefalse",
    true_or_false:       "truefalse",
    tf:                  "truefalse",
    essay:               "long",
    descriptive:         "long",
    multiple_choice:     "mcq",
    multiple_choice_question: "mcq",
    short_answer:        "short",
    short_question:      "short",
  };

  return aliases[t] ?? "short"; // fallback to short
}

function extractJsonObject(raw: string): string | undefined {
  for (let start = raw.indexOf("{"); start !== -1; start = raw.indexOf("{", start + 1)) {
    let depth = 0;
    let isInsideString = false;
    let isEscaped = false;

    for (let index = start; index < raw.length; index += 1) {
      const character = raw[index];

      if (isInsideString) {
        if (isEscaped) {
          isEscaped = false;
        } else if (character === "\\") {
          isEscaped = true;
        } else if (character === "\"") {
          isInsideString = false;
        }
        continue;
      }

      if (character === "\"") {
        isInsideString = true;
      } else if (character === "{") {
        depth += 1;
      } else if (character === "}") {
        depth -= 1;

        if (depth === 0) {
          const candidate = raw.slice(start, index + 1);
          try {
            JSON.parse(candidate);
            return candidate;
          } catch {
            break;
          }
        }
      }
    }
  }

  return undefined;
}

export function parseQuestionPaper(raw: string): QuestionPaper {
  // Strip any accidental markdown fences
  const clean = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let parsed: QuestionPaper;

  try {
    parsed = JSON.parse(clean);
  } catch {
    const jsonObject = extractJsonObject(clean);
    if (!jsonObject) throw new Error("AI response is not valid JSON");
    parsed = JSON.parse(jsonObject);
  }

  // Validate required fields
  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid question paper structure from AI model");
  }

  if (!parsed.title || !parsed.subject || !parsed.totalMarks || !parsed.duration) {
    throw new Error("Missing required fields in question paper");
  }

  // Normalize question types and validate each section has questions
  for (const section of parsed.sections) {
    if (!section.questions || !Array.isArray(section.questions) || section.questions.length === 0) {
      throw new Error(`Section "${section.label}" has no questions`);
    }
    for (const q of section.questions) {
      q.type = normalizeQuestionType(q.type);
    }
  }

  return parsed;
}
