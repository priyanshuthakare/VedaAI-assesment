import mongoose, { Schema, Document } from "mongoose";
import { AssignmentInput, JobStatus } from "../types";

export interface IAssignment extends Document {
  input: AssignmentInput;
  status: JobStatus;
  resultId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    input: {
      topic: { type: String, required: true },
      totalQuestions: { type: Number, required: true },
      marksPerQuestion: { type: Number, required: true },
      questionTypes: [
        {
          type: { type: String, required: true },
          count: { type: Number, required: true },
          marksEach: { type: Number, required: true },
        },
      ],
      difficulty: {
        easy: { type: Number, required: true },
        medium: { type: Number, required: true },
        hard: { type: Number, required: true },
      },
      dueDate: { type: String },
      instructions: { type: String },
      fileContent: { type: String },
      className: { type: String },
      subject: { type: String },
      timeAllowed: { type: String },
    },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    resultId: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
