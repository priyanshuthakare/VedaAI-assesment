import { create } from "zustand";
import { QuestionPaper } from "@/types";

interface OutputStore {
  questionPaper: QuestionPaper | null;
  isLoading: boolean;
  error: string | null;
  setQuestionPaper: (paper: QuestionPaper) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useOutputStore = create<OutputStore>((set) => ({
  questionPaper: null,
  isLoading: false,
  error: null,
  setQuestionPaper: (questionPaper) => set({ questionPaper, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ questionPaper: null, isLoading: false, error: null }),
}));
