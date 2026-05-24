import { Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { Result } from "../models/Result";
import { assignmentQueue } from "../services/queue/assignmentQueue";
import { emitToRoom } from "../websocket";
import { AssignmentInput } from "../types";

export async function listAssignments(req: Request, res: Response): Promise<void> {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    res.json({ assignments });
  } catch (error) {
    console.error("[listAssignments] Error:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}

export async function createAssignment(req: Request, res: Response): Promise<void> {
  try {
    const input: AssignmentInput = req.body;

    // Validate input
    if (!input.topic || !input.totalQuestions || !input.marksPerQuestion || !input.questionTypes?.length) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (input.totalQuestions <= 0 || input.marksPerQuestion <= 0) {
      res.status(400).json({ error: "Questions and marks must be positive" });
      return;
    }

    const { easy = 0, medium = 0, hard = 0 } = input.difficulty || {};
    if (easy + medium + hard !== 100) {
      res.status(400).json({ error: "Difficulty distribution must sum to 100%" });
      return;
    }

    // Create assignment
    const assignment = await Assignment.create({ input, status: "queued" });

    // Enqueue job
    const job = await assignmentQueue.add("generate", {
      assignmentId: assignment._id.toString(),
      input,
    });

    // Emit queued event
    emitToRoom(assignment._id.toString(), {
      event: "job:queued",
      assignmentId: assignment._id.toString(),
      position: await assignmentQueue.count(),
    });

    res.status(201).json({
      assignmentId: assignment._id.toString(),
      status: "queued",
      jobId: job.id,
    });
  } catch (error) {
    console.error("[createAssignment] Error:", error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
}

export async function getAssignment(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    res.json(assignment);
  } catch (error) {
    console.error("[getAssignment] Error:", error);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
}

export async function getAssignmentResult(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await Result.findOne({ assignmentId: id });

    if (!result) {
      res.status(404).json({ error: "Result not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("[getAssignmentResult] Error:", error);
    res.status(500).json({ error: "Failed to fetch result" });
  }
}

export async function regenerateAssignment(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    // Reset assignment status
    assignment.status = "queued";
    assignment.resultId = undefined;
    assignment.error = undefined;
    await assignment.save();

    // Delete old result
    await Result.deleteMany({ assignmentId: id });

    // Re-enqueue job
    const job = await assignmentQueue.add("generate", {
      assignmentId: id,
      input: assignment.input,
    });

    emitToRoom(id, {
      event: "job:queued",
      assignmentId: id,
      position: await assignmentQueue.count(),
    });

    res.json({
      assignmentId: id,
      status: "queued",
      jobId: job.id,
    });
  } catch (error) {
    console.error("[regenerateAssignment] Error:", error);
    res.status(500).json({ error: "Failed to regenerate assignment" });
  }
}

export async function deleteAssignment(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    // Also delete associated results
    await Result.deleteMany({ assignmentId: id });

    res.json({ success: true });
  } catch (error) {
    console.error("[deleteAssignment] Error:", error);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
}
