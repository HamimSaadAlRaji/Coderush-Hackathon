const mongoose = require('mongoose');
require('dotenv').config();

// User Schema (simplified for this script)
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'superadmin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Listing Schema (simplified)
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
}, { timestamps: true });

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check users and their roles
    const users = await User.find({}, 'clerkId email firstName lastName role isVerified').limit(10);
    console.log('\n=== USERS ===');
    console.log(`Total users: ${await User.countDocuments()}`);
    
    if (users.length > 0) {
      console.log('\nFirst 10 users:');
      users.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role} - Verified: ${user.isVerified}`);
      });
    } else {
      console.log('No users found');
    }

    // Check admin users specifically
    const adminUsers = await User.find({ role: { $in: ['admin', 'superadmin'] } });
    console.log(`\nAdmin users: ${adminUsers.length}`);
    adminUsers.forEach(admin => {
      console.log(`- ${admin.firstName} ${admin.lastName} (${admin.email}) - Role: ${admin.role}`);
    });

    // Check listings
    const listings = await Listing.find({}, 'title approvalStatus seller').populate('seller', 'firstName lastName email').limit(10);
    console.log('\n=== LISTINGS ===');
    console.log(`Total listings: ${await Listing.countDocuments()}`);
    
    if (listings.length > 0) {
      console.log('\nFirst 10 listings:');
      listings.forEach(listing => {
        const seller = listing.seller;
        console.log(`- "${listing.title}" by ${seller.firstName} ${seller.lastName} - Status: ${listing.approvalStatus}`);
      });
    } else {
      console.log('No listings found');
    }

    // Check approval status distribution
    const statusCounts = await Listing.aggregate([
      { $group: { _id: '$approvalStatus', count: { $sum: 1 } } }
    ]);
    console.log('\nListing status distribution:');
    statusCounts.forEach(status => {
      console.log(`- ${status._id}: ${status.count}`);
    });

  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkDatabase();
