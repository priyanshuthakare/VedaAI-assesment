import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generativeModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemma-4-26b-a4b-it",
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 8192,
  },
});
