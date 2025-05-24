interface AIInteraction {
    _id: string;
    userId?: string;
    type: 'price-suggestion' | 'search-query' | 'condition-estimation' | 'chatbot';
    input: any;
    output: any;
    metadata?: {
      listingId?: string;
      images?: string[];
      modelUsed?: string;
      confidence?: number;
    };
    createdAt: Date;
  }