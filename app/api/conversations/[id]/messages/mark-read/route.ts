import { NextRequest, NextResponse } from 'next/server';
import { MessageModel } from '@/models/Message';
import { connectToMongoDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await request.json();

    await MessageModel.updateMany(
      { 
        conversationId: conversationId,
        senderId: { $ne: session.user.id },
        read: false
      },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}