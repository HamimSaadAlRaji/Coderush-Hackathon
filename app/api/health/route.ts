import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      groq: process.env.GROQ_API_KEY ? "configured" : "missing",
      tavily: process.env.TAVILY_API_KEY ? "configured" : "missing",
    }
  });
}