"use server";

import { commentsRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/blog";
import { request } from "@arcjet/next";
import { cookies } from "next/headers";
import z from "zod";

/* ---------------- Validation ---------------- */

const schema = z.object({
  postId: z.string(),
  content: z.string().min(5),
});

/* ---------------- Action ---------------- */

export async function commentAction(input: {
  postId: string;
  comment: string;
}) {
  try {
    /* ---------- Auth ---------- */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await verifyAuth(token);

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    /* ---------- Validate ---------- */
    const parsed = schema.safeParse({
      postId: input.postId,
      content: input.comment,
    });

    if (!parsed.success) {
      return { success: false, error: "Invalid input" };
    }

    /* ---------- Arcjet ---------- */
    const req = await request();
    const decision = await commentsRules.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isBot())
        return { success: false, error: "Bot activity detected" };

      if (decision.reason.isShield())
        return { success: false, error: "Shield detected" };

      if (decision.reason.isRateLimit())
        return { success: false, error: "Too many requests" };
    }

    /* ---------- DB ---------- */
    await connectToDatabase();

    const post = await BlogPost.findById(parsed.data.postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    /* ---------- PUSH COMMENT (CORRECT) ---------- */
    post.comments.push({
      content: parsed.data.content,
      author: user.id, // ✅ ObjectId reference
    });

    await post.save();

    /* ---------- SAFE RESPONSE ---------- */
    return {
      success: true,
      message: "Comment added",
    };
  } catch (err) {
    console.error("commentAction error:", err);

    // ✅ NEVER return Error objects
    return {
      success: false,
      error: "Internal server error",
      status:500
    };
  }
}
