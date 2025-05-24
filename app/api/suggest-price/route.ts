import { NextRequest, NextResponse } from "next/server";
import { PriceSuggestionChain } from "@/lib/langchain/chain";
import { validateProductRequest } from "@/lib/utils/validation";
import { ApiResponse } from "@/lib/types/marketplace";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateProductRequest(body);
    if (!validation.success) {
        console.log(validation.error)
      return NextResponse.json({
        success: false,
        error: "Invalid request data",
      } as ApiResponse, { status: 400 });
    }

    // Initialize price suggestion chain
    const chain = new PriceSuggestionChain();
    
    // Get price suggestion
    const suggestion = await chain.suggestPrice(validation.data);

    return NextResponse.json({
      success: true,
      data: suggestion,
    } as ApiResponse);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    } as ApiResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price suggestion API is running",
    endpoints: {
      POST: "/api/suggest-price - Get price suggestions for products"
    }
  });
}