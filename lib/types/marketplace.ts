export interface ProductRequest {
    product: string;
    condition: 'new' | 'used' | 'refurbished';
    usedFor?: string;
    brand?: string;
    model?: string;
  }
  
  export interface PriceRange {
    min: number;
    max: number;
    average: number;
    currency: string;
  }
  
  export interface MarketplaceResult {
    source: string;
    price: number;
    currency: string;
    condition: string;
    url?: string;
    title?: string;
  }
  
  export interface PriceSuggestion {
    suggestedPrice: PriceRange;
    marketplaceData: MarketplaceResult[];
    confidence: 'high' | 'medium' | 'low';
    reasoning: string;
    found: boolean;
  }
  
  export interface ApiResponse {
    success: boolean;
    data?: PriceSuggestion;
    error?: string;
  }