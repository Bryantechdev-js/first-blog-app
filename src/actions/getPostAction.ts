"use server";

import { blogPostRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/blog";
import { request } from "@arcjet/next";
import { cookies } from "next/headers";

export const getBlogPostAction = async () => {
  try {
    /* ---------- AUTH ---------- */
    const token =( await cookies()).get("token")?.value as string;
    const user = await verifyAuth(token);

    if (!user) {
      return { success: false, message: "Not authorized", status: 401 };
    }

    /* ---------- ARCJET ---------- */
    const req = await request();
    const decision = await blogPostRules.protect(req);

    if (decision.isDenied()) {
      return {
        success: false,
        error: "Request blocked",
        status: 429,
      };
    }

    /* ---------- DB ---------- */
    await connectToDatabase();

    // First, let's fix any posts with string authors
    await BlogPost.updateMany(
      { author: { $type: "string" } },
      { $unset: { author: 1 } }
    );

    const posts = await BlogPost.find({})
      .populate({
        path: "author",
        select: "username",
        match: { _id: { $exists: true } }
      })
      .sort({ createdAt: -1 })
      .lean();

    const serializedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      coverImage: post.coverImage,
      author: post.author?.username ?? "Unknown Author",
      category: post.category,
      createdAt: post.createdAt.toISOString(),
    }));

    return {
      success: true,
      message: "Fetched posts successfully",
      status: 200,
      posts: serializedPosts,
    };

  } catch (error:unknown) {
    console.error("GET BLOG ERROR:", error);
    return {
      success: false,
      error: "failed to get the post",
      status: 500,
    };
  }
};
