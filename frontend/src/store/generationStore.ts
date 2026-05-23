import { create } from "zustand";
import { JobStatus } from "@/types";

interface GenerationStore {
  status: JobStatus | "idle";
  progress: number;
  assignmentId: string | null;
  error: string | null;
  setStatus: (status: JobStatus | "idle") => void;
  setProgress: (progress: number) => void;
  setAssignmentId: (id: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  status: "idle",
  progress: 0,
  assignmentId: null,
  error: null,
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setAssignmentId: (assignmentId) => set({ assignmentId }),
  setError: (error) => set({ error }),
  reset: () => set({ status: "idle", progress: 0, assignmentId: null, error: null }),
}));
