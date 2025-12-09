import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in environment variables.");
}

let isConnected = false;

export default async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw new Error(err.message);
  }
}
