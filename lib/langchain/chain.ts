import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { createGroqModel } from "./llm";
import { MarketplaceSearch } from "./search";
import { ProductRequest, PriceSuggestion } from "../types/marketplace";

export class PriceSuggestionChain {
  private llm;
  private search;
  private chain;

  constructor() {
    this.llm = createGroqModel();
    this.search = new MarketplaceSearch();
    this.chain = this.createChain();
  }

  private createChain() {
    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a marketplace price analyst. Analyze the following search results for a product and provide price suggestions.

      Product Details:
      - Product: {product}
      - Condition: {condition}
      - Used for: {usedFor}

      Search Results:
      {searchResults}

      Please analyze the data and provide a JSON response with the following structure:
      {{
        "found": boolean,
        "suggestedPrice": {{
          "min": number,
          "max": number,
          "average": number,
          "currency": "BDT"
        }}, 
        "confidence": "high|medium|low",
        "reasoning": "string explaining your analysis"
      }}

      Instructions:
      1. Extract actual prices from the search results
      2. Focus on similar condition items ({condition})
      3. If no prices found, set "found": false
      4. Calculate min, max, and average prices
      5. Rate confidence based on data quality and quantity
      6. Provide clear reasoning for your suggestion

      Return only valid JSON, no additional text.
    `);

    return RunnableSequence.from([
      prompt,
      this.llm,
      new StringOutputParser(),
    ]);
  }

  async suggestPrice(productRequest: ProductRequest): Promise<PriceSuggestion> {
    try {
      // Search for marketplace data
      const searchResults = await this.search.searchMarketplaces(productRequest);

      if (!searchResults || searchResults.trim().length === 0) {
        return this.createNotFoundResponse();
      }

      // Analyze with LLM
      const response = await this.chain.invoke({
        product: productRequest.product,
        condition: productRequest.condition,
        usedFor: productRequest.usedFor || "Not specified",
        searchResults,
      });

      // Parse and validate response
      const parsedResponse = JSON.parse(response);
      return this.validateAndFormatResponse(parsedResponse);

    } catch (error) {
      console.error("Price suggestion failed:", error);
      return this.createNotFoundResponse();
    }
  }

  private createNotFoundResponse(): PriceSuggestion {
    return {
      suggestedPrice: {
        min: 0,
        max: 0,
        average: 0,
        currency: "BDT"
      },
      marketplaceData: [],
      confidence: "low",
      reasoning: "No price data found for this product in current marketplaces.",
      found: false
    };
  }

  private validateAndFormatResponse(response: any): PriceSuggestion {
    // Add validation logic here
    if (!response.found || !response.suggestedPrice) {
      return this.createNotFoundResponse();
    }

    return {
      suggestedPrice: response.suggestedPrice,
      marketplaceData: response.marketplaceData || [],
      confidence: response.confidence || "low",
      reasoning: response.reasoning || "Price analysis completed",
      found: response.found
    };
  }
}