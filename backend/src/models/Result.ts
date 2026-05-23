import mongoose, { Schema, Document } from "mongoose";
import { QuestionPaper } from "../types";

export interface IResult extends Document {
  assignmentId: string;
  questionPaper: QuestionPaper;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    marks: { type: Number, required: true },
    type: { type: String, enum: ["mcq", "short", "long", "truefalse"], required: true },
    options: [{ type: String }],
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: [QuestionSchema],
  },
  { _id: false }
);

const ResultSchema = new Schema<IResult>(
  {
    assignmentId: { type: String, required: true, index: true },
    questionPaper: {
      title: { type: String, required: true },
      subject: { type: String, required: true },
      totalMarks: { type: Number, required: true },
      duration: { type: String, required: true },
      sections: [SectionSchema],
    },
  },
  { timestamps: true }
);

export const Result = mongoose.model<IResult>("Result", ResultSchema);
