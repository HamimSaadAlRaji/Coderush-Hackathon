import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbconnect';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering and pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const university = searchParams.get('university');
    const status = searchParams.get('status') || 'active';
    const pricingType = searchParams.get('pricingType');
    const condition = searchParams.get('condition');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Connect to database
    await connectDB();

    // Build query filter
    interface QueryFilter {
      status?: string;
      category?: string;
      subCategory?: string;
      sellerUniversity?: string;
      pricingType?: string;
      condition?: string;
      price?: { $gte?: number; $lte?: number };
      $or?: Array<{ 
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
        tags?: { $in: string[] };
      }>;
    }

    const query: QueryFilter = {};

    // Status filter (default to active)
    if (status) {
      query.status = status;
    }

    // Category filters
    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    // University filter
    if (university) {
      query.sellerUniversity = university;
    }

    // Pricing type filter
    if (pricingType) {
      query.pricingType = pricingType;
    }

    // Condition filter (for items)
    if (condition) {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Search functionality
    if (search) {
      const searchTerms = search.split(' ').filter(term => term.length > 0);
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: searchTerms.map(term => new RegExp(term, 'i')) } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject: { [key: string]: 1 | -1 } = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch listings with all applied filters
    const listings = await Listing.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Get total count for pagination
    const total = await Listing.countDocuments(query);

    // Get aggregated data for statistics
    const stats = await Listing.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalListings: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          categories: { $addToSet: '$category' },
          universities: { $addToSet: '$sellerUniversity' }
        }
      }
    ]);

    // Get category breakdown
    const categoryStats = await Listing.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        listings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: stats[0] || {
          totalListings: 0,
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0,
          categories: [],
          universities: []
        },
        categoryBreakdown: categoryStats,
        filters: {
          category,
          subCategory,
          university,
          status,
          pricingType,
          condition,
          search,
          minPrice,
          maxPrice,
          sortBy,
          sortOrder
        }
      },
      message: `Found ${total} listings`
    });

  } catch (error) {
    console.error('Error fetching all listings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add method to get listings without pagination (for admin purposes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { getAllListings = false, filters = {} } = body;

    if (!getAllListings) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Apply any filters from request body
    const query = { ...filters };

    // Fetch all listings without pagination
    const allListings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      data: {
        listings: allListings,
        total: allListings.length
      },
      message: `Retrieved ${allListings.length} total listings`
    });

  } catch (error) {
    console.error('Error fetching all listings (POST):', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch all listings'
    }, { status: 500 });
  }
}