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
    const token = cookies().get("token")?.value;
    const user = await verifyAuth(token);

    if (!user) {
      return { success: false, message: "Not authorized", status: 401 };
    }

    /* ---------- ARCJET ---------- */
    const req = await request();
    const decision = await blogPostRules.protect(req, {
      rateLimit: { requested: 1 },
    });

    if (decision.isDenied()) {
      return {
        success: false,
        error: "Request blocked",
        status: 429,
      };
    }

    /* ---------- DB ---------- */
    await connectToDatabase();

    const posts = await BlogPost.find({})
      .sort({ createdAt: -1 })
      .lean();

    const serializedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      media: post.media,
      author: post.author, // string
      category: post.category,
      createdAt: post.createdAt.toISOString(),
    }));

    return {
      success: true,
      message: "Fetched posts successfully",
      status: 200,
      posts: serializedPosts,
    };

  } catch (error) {
    console.error("GET BLOG ERROR:", error);
    return {
      success: false,
      error: "failed to get the post",
      status: 500,
    };
  }
};
