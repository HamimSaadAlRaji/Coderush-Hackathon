import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
    title: string;
    description: string;
    category: 'item' | 'service';
    subCategory: string;
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
    tags?: string[];
    locations?: Array<{
      type: 'Point';
      coordinates: [number, number];
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const BidSchema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const LocationSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], required: true } // [longitude, latitude]
});

const ListingSchema = new Schema<IListing>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: { 
    type: String, 
    required: true,
    enum: ['item', 'service']
  },
  subCategory: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  pricingType: { 
    type: String, 
    required: true,
    enum: ['fixed', 'bidding', 'hourly']
  },
  currentBid: { 
    type: Number,
    min: 0
  },
  bids: [BidSchema],
  condition: { 
    type: String,
    enum: ['new', 'likeNew', 'good', 'fair', 'poor']
  },
  images: [{ 
    type: String,
    required: true
  }],
  sellerId: { 
    type: String, 
    required: true
  },
  sellerUniversity: { 
    type: String, 
    required: true,
    trim: true
  },
  visibility: { 
    type: String, 
    required: true,
    enum: ['university', 'all'],
    default: 'university'
  },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'sold', 'expired', 'removed'],
    default: 'active'
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  locations: [LocationSchema]
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Create indexes for better query performance
ListingSchema.index({ category: 1, subCategory: 1 });
ListingSchema.index({ sellerId: 1 });
ListingSchema.index({ sellerUniversity: 1 });
ListingSchema.index({ status: 1, visibility: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ 'locations': '2dsphere' });

// Export the model
export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);