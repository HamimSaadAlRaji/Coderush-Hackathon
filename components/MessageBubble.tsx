'use client';

import { Message } from '@/models/Message';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  senderInfo: {
    name: string;
    image?: string;
  };
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
  senderInfo
}: MessageBubbleProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
          {/* Avatar */}
          {showAvatar && !isOwn && (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
              {senderInfo.image ? (
                <img
                  src={senderInfo.image}
                  alt={senderInfo.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  {senderInfo.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}

          {/* Message Content */}
          <div className={`${showAvatar && !isOwn ? 'ml-2' : showAvatar && isOwn ? 'mr-2' : ''}`}>
            {/* Sender Name */}
            {showAvatar && !isOwn && (
              <div className="text-xs text-gray-500 mb-1 px-1">
                {senderInfo.name}
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {/* Text Content */}
              {message.content && (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}

              {/* Images */}
              {message.images && message.images.length > 0 && (
                <div className={`${message.content ? 'mt-2' : ''} space-y-2`}>
                  {message.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Shared image ${index + 1}`}
                        className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openImageModal(image)}
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              {isOwn && (
                <span className="ml-1">
                  {message.read ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}