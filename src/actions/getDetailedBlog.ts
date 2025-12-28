"use server";

import User from "@/models/User";
import BlogPost from "@/models/blog";
import { blogPostRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { request } from "@arcjet/next";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function getDetailedBlogPost(id: string) {
  /* ---------------- Auth ---------------- */
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = await verifyAuth(token);
  if (!user) {
    return { success: false, error: "Unauthorized", status: 401 };
  }

  /* ---------------- Validate ID ---------------- */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { success: false, error: "Invalid post ID", status: 400 };
  }

  /* ---------------- Arcjet ---------------- */
  const req = await request();
  const decision = await blogPostRules.protect(req);
  if (decision.isDenied()) {
    return { success: false, error: "Request blocked", status: 403 };
  }

  /* ---------------- DB ---------------- */
  await connectToDatabase();

  const post = await BlogPost.findById(id)
    .populate("author", "username email")
    .populate("comments.author", "username")
    .lean();

  if (!post) {
    return { success: false, error: "Post not found", status: 404 };
  }

  /* ---------------- SERIALIZE ---------------- */
  return {
    success: true,
    status: 200,
    post: {
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      coverImage: post.coverImage ?? null,
      category: post.category ?? null,

      author: post.author
        ? { username: post.author.username }
        : { username: "Deleted user" },

      createdAt: post.createdAt.toISOString(),

      comments: post.comments.map((c: any) => ({
        _id: c._id.toString(),
        content: c.content,
        author: c.author?.username ?? "Anonymous",
        createdAt: c.createdAt.toISOString(),
      })),
    },
  };
}
