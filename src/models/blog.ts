import mongoose, { Schema, models, model } from "mongoose";

const CommentSchema = new Schema(
  {
    content: { type: String },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, required: true },
    author: { type: String, required: true },
    comments: [CommentSchema],
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Full-text search
BlogPostSchema.index({ title: "text", content: "text" });

const BlogPost =
  models.BlogPost || model("BlogPost", BlogPostSchema);

export default BlogPost;
