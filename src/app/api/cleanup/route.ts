import { cleanupDatabase } from "@/lib/cleanup-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await cleanupDatabase();
    
    return NextResponse.json({
      success: result.success,
      message: result.message || result.error,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Cleanup failed",
      details: error.message
    }, { status: 500 });
  }
}