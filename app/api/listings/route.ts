import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/dbconnect';
import Listing, { IListing } from '@/models/Listing';
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

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      category,
      subCategory,
      price,
      pricingType,
      condition,
      images,
      visibility,
      tags,
      locations
    } = body;

    // Validate required fields
    if (!title || !description || !category || !subCategory || !price || !pricingType) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate price
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid price value'
      }, { status: 400 });
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one image is required'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Get user information or create if doesn't exist
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Get user data from Clerk and create new user
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json({
          success: false,
          error: 'User not found in Clerk'
        }, { status: 404 });
      }

      user = new User({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        profilePicture: clerkUser.imageUrl,
        isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        role: 'student',
        university: 'Unknown University' // Default value, user can update later
      });

      await user.save();
    }

    // Process tags
    const processedTags = tags 
      ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      : [];

    // Process locations - ensure proper GeoJSON format with numeric coordinates
    const processedLocations = locations && Array.isArray(locations) 
      ? locations.map((location: any) => {
          // Ensure coordinates are valid numbers
          let longitude = 0;
          let latitude = 0;

          if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
            longitude = parseFloat(location.coordinates[0]);
            latitude = parseFloat(location.coordinates[1]);
            
            // Validate coordinate ranges
            if (isNaN(longitude) || isNaN(latitude) || 
                longitude < -180 || longitude > 180 || 
                latitude < -90 || latitude > 90) {
              console.warn('Invalid coordinates:', location.coordinates);
              longitude = 0;
              latitude = 0;
            }
          }
          
          return {
            type: 'Point',
            coordinates: [longitude, latitude], // [longitude, latitude] as numbers
            name: location.name || 'Unnamed Location',
            isUniversity: Boolean(location.isUniversity)
          };
        }).filter(loc => loc.coordinates[0] !== 0 || loc.coordinates[1] !== 0) // Remove invalid coordinates
      : [];

    // Create listing data
    const listingData: Partial<IListing> = {
      title: title.trim(),
      description: description.trim(),
      category,
      subCategory,
      price: Number(price),
      pricingType,
      condition: category === 'item' ? condition : undefined,
      images,
      sellerId: userId,
      sellerUniversity: user.university || 'Unknown University',
      visibility: visibility || 'university',
      status: 'active',
      tags: processedTags,
      locations: processedLocations
    };

    // Create new listing
    const listing = new Listing(listingData);
    await listing.save();

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: listing._id,
        title: listing.title,
        category: listing.category,
        price: listing.price,
        status: listing.status,
        createdAt: listing.createdAt
      },
      message: 'Listing created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating listing:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.message
      }, { status: 400 });
    }

    // Handle MongoDB geospatial errors
    if (error instanceof Error && (error.message.includes('geo keys') || error.message.includes('Point must only contain numeric elements'))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid location data format',
        details: 'Location coordinates must be valid numbers'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create listing'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const university = searchParams.get('university');
    const sellerId = searchParams.get('sellerId');
    
    // Connect to database
    await connectDB();

    // Build query
    interface QueryFilter {
      status: string;
      category?: string;
      $or?: Array<{ visibility: string; sellerUniversity?: string }>;
      sellerId?: string;
    }

    const query: QueryFilter = { status: 'active' };
    
    if (category) {
      query.category = category;
    }
    
    if (university) {
      query.$or = [
        { visibility: 'all' },
        { sellerUniversity: university, visibility: 'university' }
      ];
    }
    
    if (sellerId) {
      query.sellerId = sellerId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch listings
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Listing.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        listings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings'
    }, { status: 500 });
  }
}
