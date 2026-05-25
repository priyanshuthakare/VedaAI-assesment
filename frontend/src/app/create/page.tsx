"use client";

import { DashboardLayout } from "@/components/layout";
import { Button, DatePicker, FileUpload, Input, Select } from "@/components/ui";
import { api } from "@/lib/api";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useGenerationStore } from "@/store/generationStore";
import { useRouter } from "next/navigation";
import { useCallback, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

function MicIcon({ isListening }: { isListening?: boolean }) {
  return (
    <svg width="16" height="18" viewBox="0 0 14 18" fill="none">
      <path d="M7 11.5C8.65685 11.5 10 10.1569 10 8.5V3.5C10 1.84315 8.65685 0.5 7 0.5C5.34315 0.5 4 1.84315 4 3.5V8.5C4 10.1569 5.34315 11.5 7 11.5Z" fill={isListening ? "#E23D3D" : "#2F2F2F"}/>
      <path d="M13 8.5V9.5C13 12.8137 10.3137 15.5 7 15.5C3.68629 15.5 1 12.8137 1 9.5V8.5M7 15.5V17.5M4 17.5H10" stroke={isListening ? "#E23D3D" : "#2F2F2F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
  const [step, setStep] = useState(1);
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [timeAllowed, setTimeAllowed] = useState("");

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInstructions((prev) => (prev ? prev + " " + transcript : transcript));
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

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
      className: className || undefined,
      subject: subject || undefined,
      timeAllowed: timeAllowed || undefined,
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
          <div className={`flex-1 h-[5px] rounded-full ${step >= 1 ? "bg-[#5D5D5D]" : "bg-border"}`} />
          <div className={`flex-1 h-[5px] rounded-full ${step >= 2 ? "bg-[#5D5D5D]" : "bg-border"}`} />
        </div>

        {/* Form Card */}
        <div
          className="w-full max-w-[810px] mt-32 rounded-[32px] p-32 max-md:p-16 max-md:mt-16 max-md:rounded-[24px]"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          {/* Section Title */}
          <div className="flex flex-col gap-2 mb-32">
            <h2 className="font-bricolage font-bold text-[20px] leading-[28px] tracking-[-0.8px] text-primary-text">
              {step === 1 ? "Assignment Details" : "Paper Details"}
            </h2>
            <p className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-secondary-text">
              {step === 1 ? "Basic information about your assignment" : "Enter details for the question paper header"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-16">
            {step === 1 ? (
              <>
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
            <div className="flex flex-col gap-12">
              {/* ── Desktop header row ── hidden on mobile */}
              <div className="hidden md:flex items-center gap-0">
                <div className="flex-1">
                  <span className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Question Type
                  </span>
                </div>
                <div className="flex gap-8 mr-8">
                  <span className="w-[120px] text-center font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-secondary-text">
                    No. of Questions
                  </span>
                  <span className="w-[80px] text-center font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-secondary-text">
                    Marks
                  </span>
                </div>
              </div>

              {/* ── Desktop rows ── */}
              <div className="hidden md:flex flex-col gap-12">
                {questionTypes.map((qt) => (
                  <div key={qt.id} className="flex items-center gap-12">
                    {/* Dropdown */}
                    <div className="flex-1">
                      <Select
                        value={qt.type}
                        onChange={(e) => updateQuestionType(qt.id, "type", e.target.value)}
                        options={questionTypeOptions}
                      />
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => removeQuestionType(qt.id)}
                      className="flex items-center justify-center w-[20px] h-[20px] text-muted hover:text-primary-text transition-colors flex-shrink-0"
                    >
                      <XIcon />
                    </button>
                    {/* Steppers */}
                    <div className="flex gap-8">
                      {/* Count stepper */}
                      <div className="flex items-center w-[120px] h-[44px] rounded-full bg-surface-secondary border border-border-input overflow-hidden">
                        <button
                          onClick={() => updateQuestionType(qt.id, "count", Math.max(1, qt.count - 1))}
                          className="flex-1 h-full flex items-center justify-center font-bricolage font-normal text-[18px] text-primary-text hover:bg-border-input/20 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-[32px] text-center font-bricolage font-semibold text-[14px] text-primary-text select-none">
                          {qt.count}
                        </span>
                        <button
                          onClick={() => updateQuestionType(qt.id, "count", Math.min(50, qt.count + 1))}
                          className="flex-1 h-full flex items-center justify-center font-bricolage font-normal text-[18px] text-primary-text hover:bg-border-input/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {/* Marks stepper */}
                      <div className="flex items-center w-[80px] h-[44px] rounded-full bg-surface-secondary border border-border-input overflow-hidden">
                        <button
                          onClick={() => updateQuestionType(qt.id, "marks", Math.max(1, qt.marks - 1))}
                          className="flex-1 h-full flex items-center justify-center font-bricolage font-normal text-[18px] text-primary-text hover:bg-border-input/20 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-[24px] text-center font-bricolage font-semibold text-[14px] text-primary-text select-none">
                          {qt.marks}
                        </span>
                        <button
                          onClick={() => updateQuestionType(qt.id, "marks", Math.min(20, qt.marks + 1))}
                          className="flex-1 h-full flex items-center justify-center font-bricolage font-normal text-[18px] text-primary-text hover:bg-border-input/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Mobile cards ── */}
              <div className="flex md:hidden flex-col gap-8">
                {questionTypes.map((qt) => (
                  <div
                    key={qt.id}
                    className="flex flex-col gap-10 rounded-[32px] bg-white p-20"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)" }}
                  >
                    {/* Card header: select + X */}
                    <div className="flex items-center gap-10">
                      <div className="flex-1">
                        <Select
                          value={qt.type}
                          onChange={(e) => updateQuestionType(qt.id, "type", e.target.value)}
                          options={questionTypeOptions}
                          className="border-0 bg-transparent focus:border-0 px-0 text-[15px] font-semibold"
                        />
                      </div>
                      <button
                        onClick={() => removeQuestionType(qt.id)}
                        className="flex items-center justify-center w-[18px] h-[18px] text-muted hover:text-primary-text transition-colors flex-shrink-0"
                      >
                        <XIcon />
                      </button>
                    </div>

                    {/* Card body: gray inset with labels + steppers */}
                    <div className="flex gap-10 rounded-[20px] bg-[#EBEBEB] p-16">
                      {/* No. of Questions column */}
                      <div className="flex-1 flex flex-col gap-10 items-center">
                        <span className="font-bricolage font-medium text-[14px] leading-[18px] tracking-[-0.52px] text-[#5D5D5D]">
                          No. of Questions
                        </span>
                        <div className="flex items-center w-full h-[52px] rounded-full bg-[#F5F5F5] overflow-hidden">
                          <button
                            onClick={() => updateQuestionType(qt.id, "count", Math.max(1, qt.count - 1))}
                            className="flex-1 h-full flex items-center justify-center font-bricolage font-light text-[24px] leading-none text-primary-text active:opacity-60"
                          >
                            –
                          </button>
                          <span className="w-[36px] text-center font-bricolage font-semibold text-[16px] text-primary-text select-none">
                            {qt.count}
                          </span>
                          <button
                            onClick={() => updateQuestionType(qt.id, "count", Math.min(50, qt.count + 1))}
                            className="flex-1 h-full flex items-center justify-center font-bricolage font-light text-[24px] leading-none text-primary-text active:opacity-60"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Marks column */}
                      <div className="flex-1 flex flex-col gap-10 items-center">
                        <span className="font-bricolage font-medium text-[14px] leading-[18px] tracking-[-0.52px] text-[#5D5D5D]">
                          Marks
                        </span>
                        <div className="flex items-center w-full h-[52px] rounded-full bg-[#F5F5F5] overflow-hidden">
                          <button
                            onClick={() => updateQuestionType(qt.id, "marks", Math.max(1, qt.marks - 1))}
                            className="flex-1 h-full flex items-center justify-center font-bricolage font-light text-[24px] leading-none text-primary-text active:opacity-60"
                          >
                            –
                          </button>
                          <span className="w-[36px] text-center font-bricolage font-semibold text-[16px] text-primary-text select-none">
                            {qt.marks}
                          </span>
                          <button
                            onClick={() => updateQuestionType(qt.id, "marks", Math.min(20, qt.marks + 1))}
                            className="flex-1 h-full flex items-center justify-center font-bricolage font-light text-[24px] leading-none text-primary-text active:opacity-60"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


              {/* Add Question Type */}
              <button
                onClick={addQuestionType}
                className="flex items-center gap-8 font-bricolage font-bold text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text hover:opacity-70 transition-opacity mt-4"
              >
                <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-primary-dark text-white flex-shrink-0">
                  <PlusIcon />
                </span>
                <span>Add Question Type</span>
              </button>

              {/* Totals row */}
              <div className="flex flex-col items-end gap-2 mt-8">
                <span className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text">
                  Total Questions :{" "}
                  <strong>{questionTypes.reduce((s, q) => s + q.count, 0)}</strong>
                </span>
                <span className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text">
                  Total Marks :{" "}
                  <strong>{questionTypes.reduce((s, q) => s + q.count * q.marks, 0)}</strong>
                </span>
              </div>
            </div>

            {/* Additional Information */}
            <div className="flex flex-col gap-8">
              <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                Additional Information <span className="font-normal text-[#5D5D5D]">(For better output)</span>
              </label>
              <div className="relative">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  rows={4}
                  className="w-full rounded-[16px] border border-dashed border-[#DCDCDC] bg-[#F5F5F5] px-16 py-12 pr-48 font-bricolage text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text placeholder:text-[#A9A9A9] resize-none focus:outline-none focus:border-primary-dark transition-colors"
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-12 bottom-12 w-[32px] h-[32px] rounded-full bg-white flex items-center justify-center transition-all ${isListening ? 'shadow-[0_0_0_4px_rgba(226,61,61,0.15)]' : 'shadow-sm hover:shadow'}`}
                  title={isListening ? "Stop listening" : "Start Voice Typing"}
                >
                  <MicIcon isListening={isListening} />
                </button>
              </div>
            </div>
              </>
            ) : (
              <>
                {/* Topic */}
                <div className="flex flex-col gap-8">
                  <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Topic Name
                  </label>
                  <Input
                    placeholder="e.g. Photosynthesis, World War II, Quadratic Equations"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                {/* Class */}
                <div className="flex flex-col gap-8">
                  <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Class
                  </label>
                  <Input
                    placeholder="e.g. Class 10, Grade 8"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-8">
                  <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Subject
                  </label>
                  <Input
                    placeholder="e.g. Science, History, Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Time Allowed */}
                <div className="flex flex-col gap-8">
                  <label className="font-bricolage font-bold text-[16px] leading-[22px] tracking-[-0.64px] text-primary-text">
                    Time Allowed
                  </label>
                  <Input
                    placeholder="e.g. 2 Hours, 45 Minutes"
                    value={timeAllowed}
                    onChange={(e) => setTimeAllowed(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="w-full max-w-[810px] mt-32 flex justify-between pb-32">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-[8px] px-[24px] py-[12px] bg-white rounded-full font-bricolage font-medium text-[16px] text-[#2F2F2F] hover:bg-[#F5F5F5] transition-colors shadow-sm"
            >
              <ArrowLeft className="w-[20px] h-[20px]" strokeWidth={2} />
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-[8px] px-[24px] py-[12px] bg-[#171717] rounded-full font-bricolage font-medium text-[16px] text-white hover:bg-black transition-colors"
            >
              Next
              <ArrowRight className="w-[20px] h-[20px]" strokeWidth={2} />
            </button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="min-w-[200px]"
            >
              Generate Question Paper
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
