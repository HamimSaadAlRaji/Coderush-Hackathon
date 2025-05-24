import { useState } from 'react';

export interface ImageUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
}

export interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<ImageUploadResult>;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<ImageUploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      setProgress(25);

      // Upload to API
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      setProgress(75);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setProgress(100);
      return result.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
    progress,
  };
}

export default useImageUpload;
