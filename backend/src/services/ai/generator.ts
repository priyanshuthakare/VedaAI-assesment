import { generativeModel } from "./client";
import { buildPrompt } from "./promptBuilder";
import { parseQuestionPaper } from "./parser";
import { AssignmentInput, QuestionPaper } from "../../types";

export async function generateQuestionPaper(
  input: AssignmentInput
): Promise<QuestionPaper> {
  const prompt = buildPrompt(input);
  const result = await generativeModel.generateContent(prompt);
  const raw = result.response.text();
  return parseQuestionPaper(raw);
}
