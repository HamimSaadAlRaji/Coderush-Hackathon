import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width?: number;
  height?: number;
  folder?: string;
}

export class CloudinaryService {  /**
   * Upload an image to Cloudinary
   * @param file - File buffer or base64 string
   * @param options - Upload options
   * @returns Promise with upload result
   */
  static async uploadImage(
    file: Buffer | string,
    options: {
      folder?: string;
      public_id?: string;
      transformation?: object;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'marketplace/products',
        resource_type: 'image' as const,
        ...options,
      };

      // Convert Buffer to base64 data URL if it's a Buffer
      let uploadData: string;
      if (Buffer.isBuffer(file)) {
        uploadData = `data:image/jpeg;base64,${file.toString('base64')}`;
      } else {
        uploadData = file;
      }

      const result = await cloudinary.uploader.upload(
        uploadData,
        uploadOptions
      );

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        resource_type: result.resource_type,
        created_at: result.created_at,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        folder: result.folder,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId - The public ID of the image to delete
   * @returns Promise with deletion result
   */
  static async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Get optimized image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Cloudinary transformations
   * @returns Optimized image URL
   */
  static getOptimizedUrl(
    publicId: string,
    transformations: object = {}
  ): string {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations,
    });
  }
}

export default cloudinary;
