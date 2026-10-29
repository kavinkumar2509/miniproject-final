import express from "express";
import { createReport, getReports, deleteReport, getStats, streamReports } from "../controllers/reportController.js";

const router = express.Router();

router.get("/stream", streamReports); // Real-time Server-Sent Events stream
router.get("/stats", getStats);        // Real-time calculated epidemiological stats
router.post("/", createReport);        // Submit new report & persist
router.get("/", getReports);           // Fetch all reports
router.delete("/:id", deleteReport);   // Delete report from DB

export default router;
