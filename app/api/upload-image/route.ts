import { NextRequest, NextResponse } from 'next/server';
import { CloudinaryService } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Cloudinary configuration missing'
      }, { status: 500 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No image file provided'
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        error: 'File must be an image'
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size must be less than 10MB'
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    console.log('Uploading image to Cloudinary...');
    const cloudinaryResult = await CloudinaryService.uploadImage(buffer, {
      folder: 'marketplace/products',
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
        width: 1000,
        height: 1000,
        crop: 'limit'
      }
    });

    console.log('Image uploaded successfully:', cloudinaryResult.secure_url);

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Configure the API route to handle large files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
