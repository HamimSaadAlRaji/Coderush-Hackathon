import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/dbconnect';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Get user data from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found in Clerk'
      }, { status: 404 });
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Create new user
      user = new User({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        profilePicture: clerkUser.imageUrl,
        isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        role: 'student'
      });

      await user.save();
    } else {
      // Update existing user with latest Clerk data
      user.email = clerkUser.emailAddresses[0]?.emailAddress || user.email;
      user.firstName = clerkUser.firstName || user.firstName;
      user.lastName = clerkUser.lastName || user.lastName;
      user.profilePicture = clerkUser.imageUrl || user.profilePicture;
      user.isVerified = clerkUser.emailAddresses[0]?.verification?.status === 'verified';

      await user.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to sync user'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if a specific user is requested via query parameter
    const { searchParams } = new URL(request.url);
    const requestedClerkId = searchParams.get('clerkId');

    let user;
    
    if (requestedClerkId) {
      // Fetch specific user by clerkId
      user = await User.findOne({ clerkId: requestedClerkId });
    } else {
      // Fetch current authenticated user
      user = await User.findOne({ clerkId: userId });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        academicInfo: user.academicInfo,
        role: user.role,
        isVerified: user.isVerified,
        rating: user.rating,
        reviewCount: user.reviewCount
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const allowedUpdates = ['university', 'academicInfo', 'phoneNumber', 'dateOfBirth'];
    const updates: any = {};

    // Filter allowed updates
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

    // Connect to database
    await connectDB();

    // Update user
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        academicInfo: user.academicInfo,
        role: user.role,
        isVerified: user.isVerified
      },
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
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
      error: 'Failed to update user'
    }, { status: 500 });
  }
}