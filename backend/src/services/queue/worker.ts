import { Worker, Job } from "bullmq";
import { redis } from "../../config/redis";
import { generateQuestionPaper } from "../ai/generator";
import { Assignment } from "../../models/Assignment";
import { Result } from "../../models/Result";
import { emitToRoom } from "../../websocket";
import { AssignmentInput } from "../../types";

interface GenerationJobData {
  assignmentId: string;
  input: AssignmentInput;
}

export function startWorker(): Worker {
  const worker = new Worker<GenerationJobData>(
    "assignment-generation",
    async (job: Job<GenerationJobData>) => {
      const { assignmentId, input } = job.data;

      try {
        // Update status to processing
        await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });
        emitToRoom(assignmentId, {
          event: "job:processing",
          assignmentId,
          progress: 10,
        });

        // Generate question paper
        emitToRoom(assignmentId, {
          event: "job:processing",
          assignmentId,
          progress: 30,
        });

        const questionPaper = await generateQuestionPaper(input);

        emitToRoom(assignmentId, {
          event: "job:processing",
          assignmentId,
          progress: 80,
        });

        // Store result
        const result = await Result.create({
          assignmentId,
          questionPaper,
        });

        // Update assignment with result
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: "completed",
          resultId: result._id.toString(),
        });

        emitToRoom(assignmentId, {
          event: "job:completed",
          assignmentId,
          resultId: result._id.toString(),
        });

        return { resultId: result._id.toString() };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        await Assignment.findByIdAndUpdate(assignmentId, {
          status: "failed",
          error: errorMessage,
        });

        emitToRoom(assignmentId, {
          event: "job:failed",
          assignmentId,
          error: errorMessage,
        });

        throw error;
      }
    },
    {
      connection: redis,
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed for assignment ${job.data.assignmentId}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  console.log("✅ BullMQ worker started");
  return worker;
}
