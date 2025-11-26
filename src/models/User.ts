import mongoose from "mongoose";
import { lowercase } from "zod";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,lowercase: true },
  email: { type: String, required: true},
  password: { type: String, required: true ,select: false,lowercase: true},
  createdAt: { type: Date, default: Date.now },
    isPrenium: { type: Boolean, default: false }
});

export default  mongoose.model("User", UserSchema);