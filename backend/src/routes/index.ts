import { Router } from "express";
import {
  createAssignment,
  getAssignment,
  getAssignmentResult,
  listAssignments,
  regenerateAssignment,
} from "../controllers/assignmentController";
import { generatePdf } from "../controllers/pdfController";

const router = Router();

router.get("/assignments", listAssignments);
router.post("/assignments", createAssignment);
router.get("/assignments/:id", getAssignment);
router.get("/assignments/:id/result", getAssignmentResult);
router.post("/assignments/:id/regenerate", regenerateAssignment);
router.get("/assignments/:id/pdf", generatePdf);

export default router;
