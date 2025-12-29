import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ REFERENCE USER
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
