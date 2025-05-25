const mongoose = require('mongoose');
require('dotenv').config();

// User Schema (simplified for this script)
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'superadmin'], default: 'student' },
  university: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Listing Schema (simplified)
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['item', 'service'], required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  pricingType: { type: String, enum: ['fixed', 'bidding', 'hourly'], required: true },
  condition: { type: String, enum: ['new', 'likeNew', 'good', 'fair', 'poor'] },
  images: [{ type: String }],
  sellerId: { type: String, required: true },
  sellerUniversity: { type: String, required: true },
  visibility: { type: String, enum: ['university', 'all'], default: 'university' },
  status: { type: String, enum: ['active', 'sold', 'expired', 'removed'], default: 'active' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

async function createTestListings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a sample user to create listings for
    const users = await User.find({ role: 'student' }).limit(3);
    
    if (users.length === 0) {
      console.log('No student users found. Please ensure you have users in your database first.');
      return;
    }

    console.log(`Found ${users.length} users to create listings for`);

    const testListings = [
      {
        title: "MacBook Pro 13-inch - Like New",
        description: "Barely used MacBook Pro in excellent condition. Perfect for students. Comes with original charger and box.",
        category: "item",
        subCategory: "Laptops",
        price: 1200,
        pricingType: "fixed",
        condition: "likeNew",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"],
        sellerId: users[0].clerkId,
        sellerUniversity: users[0].university,
        tags: ["laptop", "apple", "macbook"],
        approvalStatus: "pending"
      },
      {
        title: "Calculus Tutoring Services",
        description: "Experienced math tutor offering calculus help. Perfect scores in Calc I, II, and III. $30/hour.",
        category: "service",
        subCategory: "Tutoring",
        price: 30,
        pricingType: "hourly",
        sellerId: users[1] ? users[1].clerkId : users[0].clerkId,
        sellerUniversity: users[1] ? users[1].university : users[0].university,
        tags: ["tutoring", "math", "calculus"],
        approvalStatus: "pending"
      },
      {
        title: "Chemistry Textbook - Organic Chemistry",
        description: "Organic Chemistry textbook by Clayden. Used but in good condition. All pages intact.",
        category: "item",
        subCategory: "Textbooks",
        price: 85,
        pricingType: "fixed",
        condition: "good",
        images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500"],
        sellerId: users[2] ? users[2].clerkId : users[0].clerkId,
        sellerUniversity: users[2] ? users[2].university : users[0].university,
        tags: ["textbook", "chemistry", "organic"],
        approvalStatus: "pending"
      },
      {
        title: "Gaming Chair - RGB Lighting",
        description: "High-quality gaming chair with RGB lighting and lumbar support. Very comfortable for long study sessions.",
        category: "item",
        subCategory: "Furniture",
        price: 150,
        pricingType: "bidding",
        condition: "good",
        images: ["https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500"],
        sellerId: users[0].clerkId,
        sellerUniversity: users[0].university,
        tags: ["gaming", "chair", "furniture"],
        approvalStatus: "pending"
      },
      {
        title: "Web Development Services",
        description: "Professional web development services for small businesses and personal projects. React, Node.js, and more.",
        category: "service",
        subCategory: "Programming",
        price: 50,
        pricingType: "hourly",
        sellerId: users[1] ? users[1].clerkId : users[0].clerkId,
        sellerUniversity: users[1] ? users[1].university : users[0].university,
        tags: ["programming", "web", "development"],
        approvalStatus: "pending"
      }
    ];

    // Delete existing test listings to avoid duplicates
    await Listing.deleteMany({ 
      title: { 
        $in: testListings.map(listing => listing.title) 
      } 
    });

    // Create new test listings
    const createdListings = await Listing.insertMany(testListings);
    
    console.log(`\n✅ Successfully created ${createdListings.length} test listings:`);
    createdListings.forEach((listing, index) => {
      console.log(`${index + 1}. "${listing.title}" - Status: ${listing.approvalStatus}`);
    });

    console.log('\n📋 Summary:');
    console.log(`- All listings created with "pending" approval status`);
    console.log(`- You can now test the admin panel at http://localhost:3000/admin`);
    console.log(`- Try approving and rejecting different listings`);
    console.log(`- Check how the status filters work`);

  } catch (error) {
    console.error('Error creating test listings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

createTestListings();
