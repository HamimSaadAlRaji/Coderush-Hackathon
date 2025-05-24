import { NextRequest, NextResponse } from 'next/server';
import { MessageModel, ConversationModel } from '@/models/Message';
import { connectToMongoDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      conversationId: params.id
    })
    .populate('senderId', 'name email image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, images } = await request.json();

    const message = new MessageModel({
      conversationId: params.id,
      senderId: session.user.id,
      content,
      images: images || [],
      read: false
    });

    await message.save();
    await message.populate('senderId', 'name email image');

    // Update conversation's last message
    await ConversationModel.findByIdAndUpdate(params.id, {
      lastMessage: content,
      lastMessageAt: new Date()
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}