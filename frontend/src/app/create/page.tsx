"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { Button, FileUpload, DatePicker, Select, Input } from "@/components/ui";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useGenerationStore } from "@/store/generationStore";
import { api } from "@/lib/api";

const questionTypeOptions = [
  { value: "mcq", label: "Multiple Choice Questions" },
  { value: "short", label: "Short Questions" },
  { value: "long", label: "Long Questions" },
  { value: "true_false", label: "True/False" },
  { value: "fill_blank", label: "Fill in the Blanks" },
];

interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marks: number;
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { formData, updateField, setSubmitting, isSubmitting } = useAssignmentStore();
  const { setAssignmentId, setStatus } = useGenerationStore();

  const [questionTypes, setQuestionTypes] = useState<QuestionTypeRow[]>([
    { id: "1", type: "mcq", count: 5, marks: 2 },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState(formData.instructions || "");
  const [dueDate, setDueDate] = useState(formData.dueDate || "");
  const [topic, setTopic] = useState(formData.topic || "");

  const addQuestionType = useCallback(() => {
    setQuestionTypes((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "short", count: 5, marks: 2 },
    ]);
  }, []);

  const removeQuestionType = useCallback((id: string) => {
    setQuestionTypes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const updateQuestionType = useCallback(
    (id: string, field: keyof QuestionTypeRow, value: string | number) => {
      setQuestionTypes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
      );
    },
    []
  );

  const handleSubmit = async () => {
    setSubmitting(true);

    const totalQuestions = questionTypes.reduce((sum, q) => sum + q.count, 0);
    const totalMarks = questionTypes.reduce((sum, q) => sum + q.count * q.marks, 0);

    const payload = {
      topic: topic || "General Assessment",
      totalQuestions,
      marksPerQuestion: totalMarks / totalQuestions || 2,
      questionTypes: questionTypes.map((q) => ({
        type: q.type,
        count: q.count,
        marksEach: q.marks,
      })),
      difficulty: formData.difficulty || { easy: 40, medium: 40, hard: 20 },
      dueDate: dueDate || undefined,
      instructions: instructions || undefined,
    };

    try {
      const res = await api.post("/assignments", payload);
      const { assignmentId } = res.data;
      setAssignmentId(assignmentId);
      setStatus("queued");
      router.push(`/status/${assignmentId}`);
    } catch (err: unknown) {
      console.error("Failed to create assignment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout breadcrumb="Assignment">
      <div className="flex flex-col items-center w-full max-w-[1103px] mx-auto">
        {/* Header */}
        <div className="w-full p-8">
          <div className="flex items-center gap-12">
            {/* Green dot indicator */}
            <div className="relative">
              <div className="w-[12px] h-[12px] rounded-full bg-accent-green" />
              <div className="absolute inset-[-4px] rounded-full border-[4px] border-[#4BC16C66]" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bricolage font-bold text-[20px] leading-[28px] tracking-[-0.8px] text-primary-text">
                Create Assignment
              </h1>
              <p className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-label">
                Set up a new assignment for your students
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex gap-12 mt-0 px-[144px] max-md:px-16">
          <div className="flex-1 h-[5px] rounded-full bg-[#5D5D5D]" />
          <div className="flex-1 h-[5px] rounded-full bg-border" />
        </div>

        {/* Form Card */}
        <div
          className="w-full max-w-[810px] mt-32 rounded-[32px] p-32 max-md:p-16 max-md:mt-16 max-md:rounded-[24px]"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          {/* Section Title */}
          <div className="flex flex-col gap-2 mb-32">
            <h2 className="font-bricolage font-bold text-[20px] leading-[28px] tracking-[-0.8px] text-primary-text">
              Assignment Details
            </h2>
            <p className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-secondary-text">
              Basic information about your assignment
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-16">
            {/* Topic */}
            <div className="flex flex-col gap-8">
              <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                Topic
              </label>
              <Input
                placeholder="e.g. Photosynthesis, World War II, Quadratic Equations"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-12">
              <FileUpload
                onFileSelect={(f) => setFile(f)}
                accept="image/jpeg,image/png,application/pdf"
                maxSizeMB={10}
              />
              <p className="font-bricolage font-normal text-[14px] leading-[22px] tracking-[-0.56px] text-placeholder">
                Upload images of your preferred document/image
              </p>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-8">
              <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                Due Date
              </label>
              <DatePicker
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD-MM-YYYY"
              />
            </div>

            {/* Question Types */}
            <div className="flex flex-col gap-16">
              <div className="flex gap-64 max-md:flex-col max-md:gap-16">
                {/* Left - Question Type Selectors */}
                <div className="flex-1 flex flex-col gap-16">
                  <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Question Type
                  </label>

                  {questionTypes.map((qt) => (
                    <div key={qt.id} className="flex items-center gap-12">
                      <div className="flex-1">
                        <Select
                          value={qt.type}
                          onChange={(e) => updateQuestionType(qt.id, "type", e.target.value)}
                          options={questionTypeOptions}
                        />
                      </div>
                      <button
                        onClick={() => removeQuestionType(qt.id)}
                        className="w-[16px] h-[16px] flex items-center justify-center text-muted hover:text-primary-text transition-colors"
                      >
                        <XIcon />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addQuestionType}
                    className="flex items-center gap-6 font-bricolage font-bold text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text hover:opacity-70 transition-opacity"
                  >
                    <PlusIcon />
                    <span>Add Question Type</span>
                  </button>
                </div>

                {/* Right - Marks */}
                <div className="w-[211px] flex flex-col gap-16">
                  <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Marks
                  </label>

                  {questionTypes.map((qt) => (
                    <div key={qt.id} className="flex items-center gap-12">
                      <div className="flex items-center gap-8">
                        <span className="font-bricolage font-normal text-[14px] text-primary-text">
                          Qty:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={qt.count}
                          onChange={(e) =>
                            updateQuestionType(qt.id, "count", parseInt(e.target.value) || 1)
                          }
                          className="w-[48px] h-[36px] rounded-[8px] border border-border-input px-8 text-center font-bricolage text-[14px] text-primary-text bg-white focus:outline-none focus:border-primary-dark"
                        />
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="font-bricolage font-normal text-[14px] text-primary-text">
                          ×
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={qt.marks}
                          onChange={(e) =>
                            updateQuestionType(qt.id, "marks", parseInt(e.target.value) || 1)
                          }
                          className="w-[48px] h-[36px] rounded-[8px] border border-border-input px-8 text-center font-bricolage text-[14px] text-primary-text bg-white focus:outline-none focus:border-primary-dark"
                        />
                        <span className="font-bricolage font-normal text-[14px] text-primary-text">
                          marks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Instructions */}
            <div className="flex flex-col gap-8">
              <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                Additional Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                rows={4}
                className="w-full rounded-[12px] border-[1.75px] border-border-input px-16 py-12 font-bricolage text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text placeholder:text-placeholder bg-white resize-none focus:outline-none focus:border-primary-dark transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="w-full max-w-[810px] mt-32 flex justify-end pb-32">
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="min-w-[200px]"
          >
            Generate Question Paper
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
