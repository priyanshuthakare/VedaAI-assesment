export interface QuestionTypeSpec {
  type: string;
  count: number;
  marksEach: number;
}

export interface AssignmentInput {
  topic: string;
  totalQuestions: number;
  marksPerQuestion: number;
  questionTypes: QuestionTypeSpec[];
  difficulty: { easy: number; medium: number; hard: number };
  dueDate: string;
  instructions?: string;
  fileContent?: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  type: "mcq" | "short" | "long" | "truefalse";
  options?: string[];
}

export interface Section {
  id: string;
  label: string;
  instruction: string;
  questions: Question[];
}

export interface QuestionPaper {
  title: string;
  subject: string;
  totalMarks: number;
  duration: string;
  sections: Section[];
}

export interface Assignment {
  _id: string;
  input: AssignmentInput;
  status: "queued" | "processing" | "completed" | "failed";
  resultId?: string;
  error?: string;
  createdAt: string;
}

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface WSEvent {
  event: "job:queued" | "job:processing" | "job:completed" | "job:failed";
  assignmentId: string;
  position?: number;
  progress?: number;
  resultId?: string;
  error?: string;
}
