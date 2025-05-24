'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Conversation } from '@/models/Message';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationUpdate: () => void;
}

export default function ChatSidebar({ 
  conversations, 
  activeConversationId,
  onConversationUpdate 
}: ChatSidebarProps) {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(
      (p: any) => p._id !== user?.id
    );
    const productName = conversation.listingId?.title || '';
    
    return (
      otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getConversationTitle = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(
      (p: any) => p._id !== user?.id
    );
    const productName = conversation.listingId?.title || 'Unknown Product';
    
    return `${otherParticipant?.name || 'Unknown User'} (${productName})`;
  };

  const getConversationSubtitle = (conversation: Conversation) => {
    return conversation.lastMessage || 'No messages yet';
  };

  if (conversations.length === 0) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No conversations yet</h3>
            <p className="text-sm text-gray-500">
              Start chatting with sellers by visiting product pages
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">Messages</h1>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p: any) => p._id !== user?.id
          );
          const isActive = conversation._id === activeConversationId;
          
          return (
            <Link
              key={conversation._id}
              href={`/chat/${conversation._id}`}
              className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {otherParticipant?.image ? (
                      <img
                        src={otherParticipant.image}
                        alt={otherParticipant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {otherParticipant?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {getConversationTitle(conversation)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {getConversationSubtitle(conversation)}
                  </p>

                  {/* Product Image */}
                  {conversation.listingId?.images?.[0] && (
                    <div className="mt-2">
                      <img
                        src={conversation.listingId.images[0]}
                        alt={conversation.listingId.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}