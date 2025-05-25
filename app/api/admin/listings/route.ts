import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/dbconnect';
import Listing from '@/models/Listing';
import User from '@/models/User';

interface ListingDocument {
  _id: any;
  sellerId: string;
  approvalStatus?: string;
  [key: string]: any;
}

// Helper function to check if user is admin
async function checkAdminAuth(userId: string | null) {
  if (!userId) {
    return { isAdmin: false, error: 'Authentication required' };
  }
  
  await connectDB();
  const user = await User.findOne({ clerkId: userId });
  
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return { isAdmin: false, error: 'Admin access required' };
  }
  
  return { isAdmin: true, user };
}

// GET: Fetch all listings for admin review
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const authCheck = await checkAdminAuth(userId);
    
    if (!authCheck.isAdmin) {
      return NextResponse.json({
        success: false,
        error: authCheck.error
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const approvalStatus = searchParams.get('approvalStatus');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';    // Build query
    const query: Record<string, any> = {};
    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject: { [key: string]: 1 | -1 } = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch listings with seller information
    const listings = await Listing.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();    // Get seller information for each listing
    const listingsWithSellers = await Promise.all(
      listings.map(async (listing: ListingDocument) => {
        const seller = await User.findOne({ clerkId: listing.sellerId })
          .select('firstName lastName email university')
          .lean();
        
        return {
          ...listing,
          _id: listing._id?.toString() || listing._id,
          seller: seller || { firstName: 'Unknown', lastName: 'User', email: 'N/A', university: 'N/A' },
          approvalStatus: listing.approvalStatus || 'pending' // Ensure this field is always present
        };
      })
    );

    // Get total count
    const total = await Listing.countDocuments(query);

    // Get approval status breakdown
    const statusBreakdown = await Listing.aggregate([
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        listings: listingsWithSellers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        statusBreakdown,
        filters: {
          approvalStatus,
          sortBy,
          sortOrder
        }
      },
      message: `Found ${total} listings for admin review`
    });

  } catch (error) {
    console.error('Error fetching admin listings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings for admin review'
    }, { status: 500 });
  }
}

// PUT: Approve or reject a listing
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    const authCheck = await checkAdminAuth(userId);
    
    if (!authCheck.isAdmin) {
      return NextResponse.json({
        success: false,
        error: authCheck.error
      }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, action, rejectionReason } = body;

    if (!listingId || !action) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: listingId and action'
      }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid action. Must be "approve" or "reject"'
      }, { status: 400 });
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json({
        success: false,
        error: 'Rejection reason is required when rejecting a listing'
      }, { status: 400 });
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Listing not found'
      }, { status: 404 });
    }    // Update listing based on action
    const updateData: Record<string, any> = {
      approvalStatus: action === 'approve' ? 'approved' : 'rejected',
      approvedBy: userId,
      approvedAt: new Date()
    };

    if (action === 'reject') {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: `Listing ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Error updating listing approval status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update listing approval status'
    }, { status: 500 });
  }
}
