import express from "express";
import { getWorkers, getCamps, createCamp } from "../controllers/communityController.js";

const router = express.Router();

router.get("/workers", getWorkers);
router.get("/camps", getCamps);
router.post("/camps", createCamp);

export default router;
