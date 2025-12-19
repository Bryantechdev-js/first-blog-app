"use server";

import { blogPostRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/blog";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(10),
  content: z.string().min(20),
  category: z.string().min(1),
  media: z.array(z.string()).optional(),
});

export async function createNewBlog(data: any, headers: Headers) {
  /* ---------------- Auth ---------------- */
  const cookiestore = await cookies()
  const token = cookiestore.get("token")?.value as string ;
  
  const user = await verifyAuth(token);
  console.log("user token:" + user);

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  /* ---------------- Validate ---------------- */
  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
      message:"blog validation failed"
    };
  }

  const { title, content, category, media } = parsed.data;

  /* ---------------- Arcjet ---------------- */
  const req = await request();

  const suspiciousHeader =
    headers.get("x-arcjet-suspicious") === "true";

  const decision = await blogPostRules.protect(req, {
    shield: {
      params: {
        title,
        content,
        suspicious: suspiciousHeader,
      },
    },
  });

  if (decision.isDenied()) {
    console.error("🛑 Arcjet blocked request:", decision.reason);
    return {
      success: false,
      error: "Suspicious activity detected",
      status:400,
    };
  }

  /* ---------------- DB ---------------- */
  try{

      await connectToDatabase();
      const post = await BlogPost.create({
        title,
        content,
        category,
        coverImage: media?.[0] ?? null,
        author: user?.userName ?? user?.email,
      });
      return { success: true, post,message:"blog created successfully", status:200 };
  } catch(err){
    console.error("DB ERROR:", err);
    return { success: false, error: "Internal server error, create blog error" };
  }

}
