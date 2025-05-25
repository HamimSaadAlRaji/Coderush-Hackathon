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
    sellerUniversity: string;    visibility: 'university' | 'all';
    status: 'active' | 'sold' | 'expired' | 'removed';
    approvalStatus: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;
    tags?: string[];
    locations?: Array<{
      type: 'Point';
      coordinates: [number, number];
      name?: string;
      isUniversity?: boolean;
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
  type: { 
    type: String, 
    enum: ['Point'], 
    default: 'Point',
    required: true 
  },
  coordinates: { 
    type: [Number], 
    required: true,
    validate: {
      validator: function(coords: number[]) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && // longitude
               coords[1] >= -90 && coords[1] <= 90;     // latitude
      },
      message: 'Coordinates must be [longitude, latitude] with valid ranges'
    }
  },
  name: { type: String, trim: true },
  isUniversity: { type: Boolean, default: false }
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
  },  status: { 
    type: String, 
    required: true,
    enum: ['active', 'sold', 'expired', 'removed'],
    default: 'active'
  },
  approvalStatus: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: String,
    required: false
  },
  approvedAt: {
    type: Date,
    required: false
  },
  rejectionReason: {
    type: String,
    trim: true,
    required: false
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  locations: [LocationSchema]
}, {
  timestamps: true
});

// Create indexes for better query performance
ListingSchema.index({ category: 1, subCategory: 1 });
ListingSchema.index({ sellerId: 1 });
ListingSchema.index({ sellerUniversity: 1 });
ListingSchema.index({ status: 1, visibility: 1 });
ListingSchema.index({ approvalStatus: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ 'locations': '2dsphere' });

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);