'use client';

import { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '@/models/Message';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
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
  const [isTyping, setIsTyping] = useState(false);

  const otherParticipant = conversation.participants.find(
    (p: any) => p._id !== currentUserId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getConversationTitle = () => {
    const productName = conversation.listingId?.title || 'Unknown Product';
    return `${otherParticipant?.name || 'Unknown User'} (${productName})`;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {otherParticipant?.image ? (
                <img
                  src={otherParticipant.image}
                  alt={otherParticipant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {otherParticipant?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {getConversationTitle()}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>

          {/* Product Info */}
          {conversation.listingId && (
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              {conversation.listingId.images?.[0] && (
                <img
                  src={conversation.listingId.images[0]}
                  alt={conversation.listingId.title}
                  className="w-8 h-8 rounded object-cover"
                />
              )}
              <span className="text-sm text-gray-700 font-medium">
                {conversation.listingId.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Start the conversation
              </h3>
              <p className="text-sm text-gray-500">
                Send a message to begin chatting about {conversation.listingId?.title || 'this product'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId === currentUserId}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].senderId !== message.senderId
                }
                senderInfo={
                  message.senderId === currentUserId
                    ? { name: user?.firstName + ' ' + user?.lastName || 'You', image: user?.imageUrl }
                    : { name: otherParticipant?.name || 'Unknown', image: otherParticipant?.image }
                }
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {otherParticipant?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}