import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generativeModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.3,   // lower = faster & more deterministic, less hallucination
    maxOutputTokens: 3000, // question papers are compact; 8192 was wasteful
  },
});
