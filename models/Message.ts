import mongoose from 'mongoose';

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

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  read: { type: Boolean, default: false },
}, { timestamps: true });

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const ConversationModel = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

export type { Message, Conversation };