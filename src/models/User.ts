import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    isPremium: { type: Boolean, default: false },

    // NEW
    // bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
