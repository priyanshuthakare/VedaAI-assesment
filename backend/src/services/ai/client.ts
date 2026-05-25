import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generationConfig = {
  temperature: 0.3, // lower = faster & more deterministic, less hallucination
  maxOutputTokens: 3000, // question papers are compact; 8192 was wasteful
};

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemma-4-31b-it";
const BACKUP_MODEL = process.env.GEMINI_BACKUP_MODEL || "gemma-3-27b-it";

export const generativeModel = genAI.getGenerativeModel({
  model: PRIMARY_MODEL,
  generationConfig,
});

export async function generateWithFallback(prompt: string) {
  try {
    return await generativeModel.generateContent(prompt);
  } catch (primaryError) {
    const backupModel = genAI.getGenerativeModel({
      model: BACKUP_MODEL,
      generationConfig,
    });
    try {
      return await backupModel.generateContent(prompt);
    } catch (backupError) {
      throw backupError ?? primaryError;
    }
  }
}
