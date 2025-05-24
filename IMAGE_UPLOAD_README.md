# Image Upload Feature Implementation

## Overview
This document describes the implementation of a simplified image upload feature for the marketplace application. The feature allows sellers to upload product images to Cloudinary without AI analysis.

## Features Implemented

### 1. Cloudinary Integration
- **File**: `lib/cloudinary.ts`
- **Purpose**: Handles image uploads to Cloudinary cloud storage
- **Key Methods**:
  - `uploadImage()`: Uploads images with automatic optimization
  - `deleteImage()`: Removes images from Cloudinary
  - `getOptimizedUrl()`: Generates optimized image URLs

### 2. Image Upload API Endpoint
- **File**: `app/api/upload-image/route.ts`
- **Purpose**: Handles POST requests for image uploads
- **Features**:
  - File validation (type and size limits)
  - Cloudinary upload integration
  - Error handling and response formatting
  - Maximum file size: 10MB
  - Supported formats: PNG, JPG, WEBP

### 3. Custom Upload Hook
- **File**: `lib/hooks/useImageUpload.ts`
- **Purpose**: React hook for managing upload state
- **Features**:
  - Upload progress tracking
  - Error handling
  - File validation
  - TypeScript interfaces for type safety

### 4. Image Upload Component
- **File**: `components/ImageUpload.tsx`
- **Purpose**: Drag-and-drop image upload UI component
- **Features**:
  - Drag and drop functionality
  - Multiple file upload (max 5 images)
  - Upload progress indicators
  - Image preview with success/error states
  - Retry functionality for failed uploads
  - Remove uploaded images

### 5. Create Listings Integration
- **File**: `app/(root)/create-listings/page.tsx`
- **Purpose**: Integrated image upload into the listing creation flow
- **Features**:
  - Step-by-step listing creation
  - Image upload in step 3
  - Form data includes uploaded image URLs
  - Automatic form submission with image data

## Environment Variables Required

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install cloudinary multer @types/multer
   ```

2. **Configure Environment Variables**:
   - Sign up for a free Cloudinary account at https://cloudinary.com
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - Add them to your `.env` file

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Usage

### For Users
1. Navigate to `/create-listings`
2. Fill in basic information (Step 1)
3. Set pricing and visibility (Step 2)
4. Upload images (Step 3):
   - Drag and drop images or click to browse
   - Support for up to 5 images
   - Each image max 10MB
   - Automatic upload to Cloudinary
   - Real-time upload progress
5. Submit listing with uploaded image URLs

### For Developers

#### Using the Upload Hook
```tsx
import useImageUpload from '@/lib/hooks/useImageUpload';

function MyComponent() {
  const { uploadImage, isUploading, error, progress } = useImageUpload();

  const handleFileSelect = async (file: File) => {
    try {
      const result = await uploadImage(file);
      console.log('Upload successful:', result.url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      {isUploading && <p>Uploading... {progress}%</p>}
      {error && <p>Error: {error}</p>}
      <input type="file" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
    </div>
  );
}
```

#### Using the Upload Component
```tsx
import ImageUploadComponent from '@/components/ImageUpload';

function MyListingForm() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUploadSuccess = (result) => {
    setUploadedImages(prev => [...prev, result]);
    console.log('New image uploaded:', result.url);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <ImageUploadComponent
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      maxFiles={5}
    />
  );
}
```

## API Reference

### POST /api/upload-image

Upload an image file to Cloudinary.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'image' field containing the file

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/marketplace/products/abc123.jpg",
    "publicId": "marketplace/products/abc123",
    "width": 1000,
    "height": 800,
    "format": "jpg",
    "bytes": 156789
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "File must be an image"
}
```

## File Structure

```
├── app/
│   └── api/
│       └── upload-image/
│           └── route.ts          # Upload API endpoint
├── components/
│   └── ImageUpload.tsx           # Upload component
├── lib/
│   ├── cloudinary.ts             # Cloudinary service
│   └── hooks/
│       └── useImageUpload.ts     # Upload hook
└── app/(root)/
    └── create-listings/
        └── page.tsx              # Integrated listing form
```

## Testing

1. **Manual Testing**:
   - Navigate to http://localhost:3000/create-listings
   - Go to step 3 (Images)
   - Try uploading different image formats
   - Test drag and drop functionality
   - Verify error handling with invalid files

2. **API Testing**:
   ```bash
   curl -X POST http://localhost:3000/api/upload-image \
     -F "image=@/path/to/your/image.jpg"
   ```

## Troubleshooting

### Common Issues

1. **Upload fails with "Cloudinary configuration missing"**:
   - Check that all Cloudinary environment variables are set
   - Restart the development server after adding variables

2. **Images not uploading**:
   - Check file size (must be < 10MB)
   - Verify file type (PNG, JPG, WEBP only)
   - Check browser console for errors

3. **Slow uploads**:
   - Large files take longer to upload
   - Consider implementing image compression before upload

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
DEBUG=cloudinary,upload
```

## Security Considerations

1. **File Validation**: All uploads are validated for type and size
2. **Cloudinary Security**: Uses secure upload URLs and API keys
3. **Error Handling**: Sensitive information is not exposed in error messages
4. **Rate Limiting**: Consider implementing rate limiting for production

## Future Enhancements

1. **Image Compression**: Add client-side image compression
2. **Batch Upload**: Allow multiple file selection at once
3. **Progress Enhancement**: More detailed upload progress
4. **Image Editing**: Basic crop/resize functionality
5. **Thumbnail Generation**: Automatic thumbnail creation
6. **Metadata Extraction**: EXIF data extraction for analytics

## Support

For issues or questions related to the image upload feature:
1. Check this documentation first
2. Review the browser console for errors
3. Check server logs for backend issues
4. Verify Cloudinary account status and quotas
