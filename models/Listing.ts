interface Listing {
    _id: string;
    title: string;
    description: string;
    category: 'item' | 'service';
    subCategory: string; // e.g., 'textbook', 'electronics', 'tutoring'
    price: number;
    pricingType: 'fixed' | 'bidding' | 'hourly';
    currentBid?: number;
    bids?: Array<{
      userId: string;
      amount: number;
      createdAt: Date;
    }>;
    condition?: 'new' | 'likeNew' | 'good' | 'fair' | 'poor';
    images: string[];
    sellerId: string;
    sellerUniversity: string;
    visibility: 'university' | 'all';
    status: 'active' | 'sold' | 'expired' | 'removed';
    createdAt: Date;
    updatedAt: Date;
    aiSuggestedPrice?: number;
    aiConditionEstimate?: string;
    tags?: string[];
    location?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    meetupPreferences?: {
      campusLocations: string[];
      availableTimes: string[];
    };
  }