import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smarthealth";
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log("✅ MongoDB connected successfully to", uri);
  } catch (error) {
    console.warn("⚠️ MongoDB not available (" + error.message + "). Running with in-memory fallback store.");
  }
};

export default connectDB;
