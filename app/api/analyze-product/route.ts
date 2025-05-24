import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Type definitions
export type ProductCondition = 'new' | 'likeNew' | 'good' | 'fair' | 'poor';

export interface ProductAnalysisRequest {
  imageUrl: string;
}

export interface ProductAnalysisResult {
  productName: string;
  condition: ProductCondition;
  description: string;
}

export interface ApiResponse {
  success: boolean;
  data?: ProductAnalysisResult;
  error?: string;
  details?: string;
  rawResponse?: string;
}

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Valid condition values
const VALID_CONDITIONS: ProductCondition[] = ['new', 'likeNew', 'good', 'fair', 'poor'];

// Prompt template
const ANALYSIS_PROMPT = `
You want to add a product to a second-hand marketplace listing. Analyze the provided product image and return the following information in JSON format: 
1. Product name (be specific about brand, model, type). If the product name is not clear, use a generic name like "Smartphone" or "Laptop.
2. Condition assessment (choose ONE: 'new', 'likeNew', 'good', 'fair', 'poor')
3. Description of the product and its condition

Condition criteria:
- new: Unopened, unused, perfect condition
- likeNew: Minimal to no signs of wear, excellent condition
- good: Light wear, fully functional, good overall condition
- fair: Moderate wear, some imperfections but functional
- poor: Heavy wear, significant damage, may have functionality issues

Return your response in this exact JSON format:
{
  "productName": "specific product name with brand/model or generic name",
  "condition": "one of the five condition values",
  "description": "Description of the product and its condition"
}
`;

// Helper function to analyze product image
async function analyzeProductImage(imageUrl: string): Promise<ProductAnalysisResult> {
  // Validate API key
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('Google AI API key not configured');
  }

  // Get the generative model
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Fetch the image
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image from URL: ${imageResponse.statusText}`);
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');

  // Determine the image mime type
  const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

  // Generate content using the image and prompt
  const result = await model.generateContent([
    ANALYSIS_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType: contentType
      }
    }
  ]);

  const response = await result.response;
  const text = response.text();

  // Try to parse the JSON response
  let productInfo: Partial<ProductAnalysisResult>;
  try {
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      productInfo = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (parseError) {
    throw new Error(`Failed to parse AI response: ${parseError}`);
  }

  // Validate and sanitize the response
  const validatedResult: ProductAnalysisResult = {
    productName: productInfo.productName || 'Unknown Product',
    condition: VALID_CONDITIONS.includes(productInfo.condition as ProductCondition) 
      ? (productInfo.condition as ProductCondition) 
      : 'good',
    description: productInfo.description || 'No description available'
  };

  return validatedResult;
}
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: ProductAnalysisRequest = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return Response.json({ 
        success: false, 
        error: 'Image URL is required' 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      return Response.json({ 
        success: false, 
        error: 'Invalid image URL format' 
      }, { status: 400 });
    }

    const productInfo = await analyzeProductImage(imageUrl);

    return Response.json({
      success: true,
      data: productInfo
    });

  } catch (error) {
    console.error('Error analyzing product:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return Response.json({ 
      success: false,
      error: 'Failed to analyze product image',
      details: errorMessage
    }, { status: 500 });
  }
}