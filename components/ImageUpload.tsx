"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { TbCloudUpload, TbX, TbCheck, TbAlertCircle } from 'react-icons/tb';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import useImageUpload, { ImageUploadResult } from '@/lib/hooks/useImageUpload';

interface ImageUploadProps {
  onUploadSuccess?: (result: ImageUploadResult) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  className?: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  result?: ImageUploadResult;
  isUploading?: boolean;
  error?: string;
}

export default function ImageUploadComponent({
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
  className = ''
}: ImageUploadProps) {
  const { uploadImage, isUploading } = useImageUpload();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (uploadedImages.length + fileArray.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Create preview objects for all files
    const newImages: UploadedImage[] = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: true
    }));

    setUploadedImages(prev => [...prev, ...newImages]);

    // Process each file
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const imageIndex = uploadedImages.length + i;

      try {
        const result = await uploadImage(file);
        
        setUploadedImages(prev => 
          prev.map((img, idx) => 
            idx === imageIndex 
              ? { ...img, result, isUploading: false }
              : img
          )
        );

        onUploadSuccess?.(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setUploadedImages(prev => 
          prev.map((img, idx) => 
            idx === imageIndex 
              ? { ...img, error: errorMessage, isUploading: false }
              : img
          )
        );

        onUploadError?.(errorMessage);
      }
    }
  }, [uploadedImages.length, maxFiles, uploadImage, onUploadSuccess, onUploadError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const retryUpload = useCallback(async (index: number) => {
    const image = uploadedImages[index];
    if (!image || image.isUploading) return;

    setUploadedImages(prev => 
      prev.map((img, idx) => 
        idx === index 
          ? { ...img, isUploading: true, error: undefined }
          : img
      )
    );

    try {
      const result = await uploadImage(image.file);
      
      setUploadedImages(prev => 
        prev.map((img, idx) => 
          idx === index 
            ? { ...img, result, isUploading: false }
            : img
        )
      );

      onUploadSuccess?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setUploadedImages(prev => 
        prev.map((img, idx) => 
          idx === index 
            ? { ...img, error: errorMessage, isUploading: false }
            : img
        )
      );

      onUploadError?.(errorMessage);
    }
  }, [uploadedImages, uploadImage, onUploadSuccess, onUploadError]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
          ${uploadedImages.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
        whileHover={{ scale: uploadedImages.length >= maxFiles ? 1 : 1.01 }}
        whileTap={{ scale: uploadedImages.length >= maxFiles ? 1 : 0.98 }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploadedImages.length >= maxFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ 
              rotate: dragActive ? 360 : 0,
              scale: dragActive ? 1.1 : 1 
            }}
            transition={{ duration: 0.3 }}
          >
            <TbCloudUpload className="text-6xl text-blue-500" />
          </motion.div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {dragActive ? 'Drop your images here' : 'Upload Product Images'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop images or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports: PNG, JPG, WEBP (Max {maxFiles} images, 10MB each)
            </p>
          </div>

          {uploadedImages.length < maxFiles && (
            <motion.button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCamera className="inline mr-2" />
              Choose Images
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Uploaded Images */}
      <AnimatePresence>
        {uploadedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {uploadedImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
              >                {/* Image Preview */}
                <Image
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />                {/* Loading Overlay */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <FaSpinner className="text-2xl animate-spin mx-auto mb-2" />
                      <p className="text-xs">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Success Indicator */}
                {image.result && !image.isUploading && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <TbCheck size={16} />
                    </div>
                  </div>
                )}

                {/* Error Indicator */}
                {image.error && !image.isUploading && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <TbAlertCircle className="text-2xl mx-auto mb-1" />
                      <p className="text-xs">Failed</p>
                      <button
                        onClick={() => retryUpload(index)}
                        className="text-xs underline mt-1 hover:text-blue-200"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <TbX size={16} />
                </button>

                {/* Main Image Indicator */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Summary */}
      {uploadedImages.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            {uploadedImages.filter(img => img.result).length} of {uploadedImages.length} images processed
            {uploadedImages.some(img => img.error) && (
              <span className="text-red-500 ml-2">
                ({uploadedImages.filter(img => img.error).length} failed)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
