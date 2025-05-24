import mongoose from "mongoose";

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  images?: {
    url: string;
    publicId?: string;
    width?: number;
    height?: number;
  }[];
  read: boolean;
  createdAt: Date;
}

interface Conversation {
  _id: string;
  participants: string[]; // Clerk user IDs (strings)
  listingId?: any; // Can be ObjectId or populated object
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
}

// Image schema for storing Cloudinary data
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String }, // For Cloudinary deletion if needed
  width: { type: Number },
  height: { type: Number },
}, { _id: false });

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: { type: String, required: true }, // String for Clerk user ID
    content: { type: String, required: false, default: '' }, // Allow empty content for image-only messages
    images: [ImageSchema], // Array of image objects with Cloudinary data
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // Array of strings for Clerk user IDs
    listingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Listing",
      required: false 
    },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add indexes for better performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });
MessageSchema.index({ conversationId: 1, createdAt: -1 });

// Clear the mongoose models cache to ensure new schema is used
delete mongoose.models.Message;
delete mongoose.models.Conversation;

export const MessageModel = mongoose.model("Message", MessageSchema);
export const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export type { Message, Conversation };
