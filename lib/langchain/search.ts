import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ProductRequest } from "../types/marketplace";

export class MarketplaceSearch {
  private searchTool: TavilySearchResults;

  constructor() {
    this.searchTool = new TavilySearchResults({
      apiKey: process.env.TAVILY_API_KEY,
      maxResults: 3,
    });
  }

  async searchMarketplaces(product: ProductRequest): Promise<string> {
    const searchQueries = this.generateSearchQueries(product);
    const results = [];

    for (const query of searchQueries) {
      try {
        const searchResult = await this.searchTool.invoke(query);
        console.log("Search result: " + searchResult);
        results.push(searchResult);
      } catch (error) {
        console.error(`Search failed for query: ${query}`, error);
      }
    }

    return results.join('\n\n');
  }

  private generateSearchQueries(product: ProductRequest): string[] {
    const { product: productName, condition, usedFor } = product;
    
    const baseQueries = [
      `${productName} ${condition} price marketplace second hand bangladesh`,
      `${productName} ${condition} for sale second hand`,
      `buy ${productName} ${condition} price range`,
    ];

    // Add specific marketplace searches
    const marketplaces = ['bikroy.com', 'facebook marketplace', 'swap.com.bd', 'keeno.app'];
    const marketplaceQueries = marketplaces.map(marketplace => 
      `${productName} ${condition} price ${marketplace}`
    );

    // Add usage-specific queries if provided
    if (usedFor) {
      baseQueries.push(`${productName} used ${usedFor} price`);
    }

    return [...baseQueries, ...marketplaceQueries];
  }
}