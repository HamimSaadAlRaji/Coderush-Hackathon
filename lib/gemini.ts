import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyClKj1FyNEHOklI5kmMMG7k-jVCO_BYUsw');

export interface CategoryExtractionResult {
  category: string;
  subcategory: string;
  confidence: number;
  description?: string;
  suggestedTags?: string[];
}

export interface ImageAnalysisResult {
  category: CategoryExtractionResult;
  additionalInfo?: {
    condition?: string;
    brand?: string;
    model?: string;
    estimatedPrice?: {
      min: number;
      max: number;
      currency: string;
    };
  };
}

export class GeminiVisionService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Extract product category and subcategory from image
   * @param imageUrl - URL of the uploaded image
   * @returns Promise with category extraction result
   */
  async extractCategoryFromImage(imageUrl: string): Promise<CategoryExtractionResult> {
    try {
      const prompt = `
        Analyze this product image and determine its category and subcategory for a student marketplace.
        
        Available categories and subcategories:
        
        ITEM (Physical Products):
        - textbook
        - electronics  
        - furniture
        - clothing
        - accessories
        - other
        
        SERVICE:
        - tutoring
        - skillExchange
        - techSupport
        - eventServices
        - taskHelp
        - other
        
        Instructions:
        1. Look at the image carefully
        2. Determine if this is a physical item or a service being offered
        3. Choose the most appropriate category (item or service)
        4. Choose the most appropriate subcategory from the list above
        5. Provide a confidence score (0-1)
        6. Generate 3-5 relevant tags
        7. Provide a brief description of what you see
        
        Respond ONLY with a valid JSON object in this exact format:
        {
          "category": "item" or "service",
          "subcategory": "one of the subcategories listed above",
          "confidence": 0.95,
          "description": "Brief description of the product/service",
          "suggestedTags": ["tag1", "tag2", "tag3"]
        }
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: await this.fetchImageAsBase64(imageUrl),
            mimeType: 'image/jpeg'
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }

      const categoryData = JSON.parse(jsonMatch[0]);
      
      // Validate the response
      if (!categoryData.category || !categoryData.subcategory) {
        throw new Error('Missing required fields in Gemini response');
      }

      return {
        category: categoryData.category,
        subcategory: categoryData.subcategory,
        confidence: categoryData.confidence || 0.8,
        description: categoryData.description,
        suggestedTags: categoryData.suggestedTags || [],
      };

    } catch (error) {
      console.error('Gemini category extraction error:', error);
      throw new Error('Failed to extract category from image');
    }
  }

  /**
   * Perform comprehensive image analysis
   * @param imageUrl - URL of the uploaded image
   * @returns Promise with detailed analysis result
   */
  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    try {
      const categoryResult = await this.extractCategoryFromImage(imageUrl);
      
      // Additional analysis for more details
      const detailPrompt = `
        Analyze this image for additional product details. Respond with JSON only:
        {
          "condition": "new|like new|good|fair|poor",
          "brand": "brand name if visible",
          "model": "model name/number if visible",
          "estimatedPrice": {
            "min": 0,
            "max": 0,
            "currency": "USD"
          }
        }
      `;

      const detailResult = await this.model.generateContent([
        detailPrompt,
        {
          inlineData: {
            data: await this.fetchImageAsBase64(imageUrl),
            mimeType: 'image/jpeg'
          }
        }
      ]);

      const detailResponse = await detailResult.response;
      const detailText = detailResponse.text();
      
      let additionalInfo = {};
      try {        const detailJsonMatch = detailText.match(/\{[\s\S]*\}/);
        if (detailJsonMatch) {
          additionalInfo = JSON.parse(detailJsonMatch[0]);
        }
      } catch (error) {
        console.warn('Could not parse additional details from Gemini response:', error);
      }

      return {
        category: categoryResult,
        additionalInfo,
      };

    } catch (error) {
      console.error('Gemini image analysis error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  /**
   * Fetch image as base64 string
   * @param imageUrl - URL of the image
   * @returns Promise with base64 string
   */
  private async fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString('base64');
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error('Failed to fetch image for analysis');
    }
  }
}

export default GeminiVisionService;
