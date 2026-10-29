import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import reportRoutes from "./routes/reportRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ml", mlRoutes);

app.get("/", (req, res) => res.send("Smart Health Backend Running"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
