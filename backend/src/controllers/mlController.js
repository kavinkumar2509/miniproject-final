import mongoose from "mongoose";
import { getPredictionFromML } from "../services/mlService.js";
import Report from "../models/Report.js";

export const predictOutbreak = async (req, res) => {
  try {
    const features = req.body.features;

    if (!features) {
      return res.status(400).json({ error: "Features are required" });
    }

    // Call ML microservice
    let prediction;
    try {
      prediction = await getPredictionFromML(features);
    } catch (mlErr) {
      console.warn("⚠️ ML microservice error, using fallback prediction:", mlErr.message);
      prediction = { probability: 0.72, status: "fallback" };
    }

    // Attempt to save report + prediction in MongoDB if available
    if (mongoose.connection.readyState === 1) {
      try {
        const newReport = new Report({
          reporterId: features.reporterId || "anonymous",
          patientAge: features.patientAge || 0,
          patientGender: features.patientGender || "Unknown",
          symptoms: features.symptoms || [],
          location: features.location || {},
          date: new Date(),
        });
        await newReport.save();
      } catch (dbErr) {
        console.warn("⚠️ Could not persist report to MongoDB:", dbErr.message);
      }
    }

    res.json({
      success: true,
      data: prediction,
    });
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
