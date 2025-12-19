import { createNewBlog } from "@/actions/blogAction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = req.headers;

    const result = await createNewBlog(body, headers);
    console.log("result on the api route:" + result);
    
    return NextResponse.json(result);
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error,create blog api route error",
      },
      { status: 500 }
    );
  }
}
