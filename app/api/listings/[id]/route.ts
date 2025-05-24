import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/dbconnect';
import Listing from '@/models/Listing';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;

    // Connect to database
    await connectDB();

    // Find listing by ID
    const listing = await Listing.findById(listingId).lean();
    
    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Listing not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: listing
    });

  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listing'
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const listingId = params.id;
    const body = await request.json();

    // Connect to database
    await connectDB();

    // Find listing and verify ownership
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Listing not found'
      }, { status: 404 });
    }

    if (listing.sellerId !== userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: You can only edit your own listings'
      }, { status: 403 });
    }

    // Define allowed updates
    const allowedUpdates = [
      'title', 'description', 'price', 'condition', 
      'tags', 'status', 'visibility'
    ];
    
    const updates: any = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid updates provided'
      }, { status: 400 });
    }

    // Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updates,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: 'Listing updated successfully'
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update listing'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const listingId = params.id;

    // Connect to database
    await connectDB();

    // Find listing and verify ownership
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Listing not found'
      }, { status: 404 });
    }

    if (listing.sellerId !== userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: You can only delete your own listings'
      }, { status: 403 });
    }

    // Soft delete by updating status
    await Listing.findByIdAndUpdate(listingId, { 
      status: 'removed' 
    });

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete listing'
    }, { status: 500 });
  }
}
