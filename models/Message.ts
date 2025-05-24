interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    content: string;
    images?: string[];
    read: boolean;
    createdAt: Date;
  }
  
  interface Conversation {
    _id: string;
    participants: string[]; // user IDs
    listingId?: string; // if related to a listing
    lastMessage: string;
    lastMessageAt: Date;
    createdAt: Date;
  }