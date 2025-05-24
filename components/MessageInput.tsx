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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && selectedImages.length === 0) return;

    setUploading(true);
    
    try {
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (selectedImages.length > 0) {
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
          imageUrls = uploadData.urls;
        } else {
          throw new Error('Invalid response format from upload');
        }
      }

      // Send message
      await onSendMessage(message.trim(), imageUrls);
      
      // Reset form
      setMessage('');
      setSelectedImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="mb-4">
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
          disabled={uploading || selectedImages.length >= 5}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={selectedImages.length >= 5 ? "Maximum 5 images allowed" : "Add images"}
        >
          <TbPhoto className="w-6 h-6" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!message.trim() && selectedImages.length === 0) || uploading}
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
    </div>
  );
}