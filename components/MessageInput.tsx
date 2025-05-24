'use client';

import React, { useState, useRef } from 'react';
import { TbSend, TbPhoto, TbX, TbLoader2 } from 'react-icons/tb';

interface MessageInputProps {
  onSendMessage: (content: string, images?: string[]) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAndSendImages = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const uploadResponse = await fetch('/api/chat/upload-image', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload images');
      }

      if (uploadData.success && uploadData.urls) {
        // Send images immediately without text
        await onSendMessage('', uploadData.urls);
        
        // Clear selected images after successful upload and send
        setSelectedImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Invalid response format from upload');
      }
    } catch (error) {
      console.error('Error uploading and sending images:', error);
      alert(`Failed to send images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there's only text (no images), send the text message
    if (message.trim() && selectedImages.length === 0) {
      try {
        await onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error sending text message:', error);
        alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      return;
    }

    // If there are both text and images, upload images and send together
    if (message.trim() && selectedImages.length > 0) {
      setUploading(true);
      
      try {
        const formData = new FormData();
        selectedImages.forEach((file) => {
          formData.append('images', file);
        });

        const uploadResponse = await fetch('/api/chat/upload-image', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Failed to upload images');
        }

        if (uploadData.success && uploadData.urls) {
          await onSendMessage(message.trim(), uploadData.urls);
          
          // Reset form
          setMessage('');
          setSelectedImages([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          throw new Error('Invalid response format from upload');
        }
      } catch (error) {
        console.error('Error sending message with images:', error);
        alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Please select only JPEG, PNG, GIF, or WebP images.');
      return;
    }

    // Validate file sizes (5MB each)
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert('Please select images smaller than 5MB each.');
      return;
    }

    // Limit total number of images
    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      alert('You can only send up to 5 images at once.');
      return;
    }

    // Add to selected images for preview
    setSelectedImages(prev => [...prev, ...files]);

    // Immediately upload and send the images
    await uploadAndSendImages(files);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Send images immediately when they are in selectedImages (for manual send)
  const handleSendImagesOnly = async () => {
    if (selectedImages.length > 0) {
      await uploadAndSendImages(selectedImages);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Selected images:</span>
            <button
              type="button"
              onClick={handleSendImagesOnly}
              disabled={uploading}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Sending...' : 'Send Images'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  <TbX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={uploading}
          />
        </div>

        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Add images (will send immediately)"
        >
          <TbPhoto className="w-6 h-6" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || uploading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {uploading ? (
            <TbLoader2 className="w-6 h-6 animate-spin" />
          ) : (
            <TbSend className="w-6 h-6" />
          )}
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />
      </form>

      {/* Status indicator */}
      {uploading && (
        <div className="mt-2 text-sm text-blue-600 flex items-center">
          <TbLoader2 className="w-4 h-4 animate-spin mr-2" />
          Uploading and sending images...
        </div>
      )}
    </div>
  );
}