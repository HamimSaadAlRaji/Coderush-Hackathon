import { NextRequest, NextResponse } from 'next/server';
import { ConversationModel, MessageModel } from '@/models/Message';
import dbConnect from '@/lib/dbconnect';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await ConversationModel.find({
      participants: userId
    })
    .populate('participants', 'name email image')
    .populate('listingId', 'title images')
    .sort({ lastMessageAt: -1 });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sellerId, listingId } = await request.json();

    // Check if conversation already exists
    const existingConversation = await ConversationModel.findOne({
      participants: { $all: [userId, sellerId] },
      listingId: listingId
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create new conversation
    const conversation = new ConversationModel({
      participants: [userId, sellerId],
      listingId: listingId,
      lastMessage: '',
      lastMessageAt: new Date()
    });

    await conversation.save();
    await conversation.populate('participants', 'name email image');
    await conversation.populate('listingId', 'title images');

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}