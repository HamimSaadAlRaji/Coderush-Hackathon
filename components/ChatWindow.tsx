'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { TbSend, TbPhoto, TbFile } from 'react-icons/tb';
import MessageInput from './MessageInput';
import { Conversation, Message } from '@/models/Message';
import { useUser } from '@clerk/nextjs';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, images?: string[]) => void;
  currentUserId: string;
}

export default function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  currentUserId
}: ChatWindowProps) {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; imageUrl: string; }>({
    isOpen: false,
    imageUrl: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageClick = (imageUrl: string) => {
    setImageModal({ isOpen: true, imageUrl });
  };

  const closeModal = () => {
    setImageModal({ isOpen: false, imageUrl: '' });
  };

  const renderMessage = (message: any) => {
    const isOwnMessage = message.senderId._id === currentUserId;
    const senderName = typeof message.senderId === 'object' 
      ? message.senderId.name 
      : 'Unknown User';

    return (
      <div
        key={message._id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}>
          {!isOwnMessage && (
            <div className="text-xs text-gray-600 mb-1">{senderName}</div>
          )}
          
          {/* Text content */}
          {message.content && (
            <div className="mb-2">{message.content}</div>
          )}
          
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="space-y-2">
              {message.images.map((image: any, index: number) => {
                const imageUrl = typeof image === 'string' ? image : image.url;
                return (
                  <div key={index} className="relative">
                    <Image
                      src={imageUrl}
                      alt={`Chat image ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover"
                      onClick={() => handleImageClick(imageUrl)}
                    />
                    {/* Optional: Show image dimensions if available */}
                    {typeof image === 'object' && image.width && image.height && (
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {image.width}×{image.height}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {format(new Date(message.createdAt), 'HH:mm')}
          </div>
        </div>
      </div>
    );
  };

  const otherParticipant = conversation.participants.find(
    (p: any) => p._id !== currentUserId
  );

  const getConversationTitle = () => {
    const productName = conversation.listingId?.title || 'Unknown Product';
    return `${otherParticipant?.name || 'Unknown User'} (${productName})`;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {conversation.listingId?.title || 'Chat'}
        </h2>
        <p className="text-sm text-gray-600">
          {conversation.participants.length} participants
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <TbPhoto className="mx-auto text-4xl mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-4xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors z-10"
            >
              ×
            </button>
            <Image
              src={imageModal.imageUrl}
              alt="Full size image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}