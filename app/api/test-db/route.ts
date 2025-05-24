import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbconnect';
import User from '@/models/User';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Test database queries
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        message: 'Database connection successful',
        collections: {
          users: userCount,
          listings: listingCount
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
