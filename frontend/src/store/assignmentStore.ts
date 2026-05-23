import { create } from "zustand";
import { AssignmentInput } from "@/types";

interface AssignmentStore {
  formData: Partial<AssignmentInput>;
  isSubmitting: boolean;
  errors: Record<string, string>;
  setFormData: (data: Partial<AssignmentInput>) => void;
  updateField: <K extends keyof AssignmentInput>(key: K, value: AssignmentInput[K]) => void;
  setErrors: (errors: Record<string, string>) => void;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

const defaultFormData: Partial<AssignmentInput> = {
  topic: "",
  totalQuestions: 10,
  marksPerQuestion: 2,
  questionTypes: [],
  difficulty: { easy: 40, medium: 40, hard: 20 },
  dueDate: "",
  instructions: "",
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  formData: { ...defaultFormData },
  isSubmitting: false,
  errors: {},
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  updateField: (key, value) =>
    set((state) => ({ formData: { ...state.formData, [key]: value } })),
  setErrors: (errors) => set({ errors }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () => set({ formData: { ...defaultFormData }, errors: {}, isSubmitting: false }),
}));
