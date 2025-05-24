import { NextRequest, NextResponse } from "next/server";
import { MessageModel, ConversationModel } from "@/models/Message";
import dbConnect from "@/lib/dbconnect";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before using
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      conversationId: id
    })
    .sort({ createdAt: 1 }) // Ascending order for chat
    .skip(skip)
    .limit(limit)
    .lean();

    // Manually populate sender info since we're using Clerk IDs
    const messagesWithSenderInfo = await Promise.all(
      messages.map(async (message) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?clerkId=${message.senderId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              return {
                ...message,
                senderId: {
                  _id: message.senderId,
                  name: `${result.data.firstName} ${result.data.lastName}`,
                  email: result.data.email,
                  image: result.data.image
                }
              };
            }
          }
          return {
            ...message,
            senderId: {
              _id: message.senderId,
              name: 'Unknown User',
              email: '',
              image: null
            }
          };
        } catch (error) {
          return {
            ...message,
            senderId: {
              _id: message.senderId,
              name: 'Unknown User',
              email: '',
              image: null
            }
          };
        }
      })
    );

    return NextResponse.json(messagesWithSenderInfo);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before using
    const { id } = await params;

    const { content, images } = await request.json();

    // Validate that we have either content or images
    if (!content && (!images || images.length === 0)) {
      return NextResponse.json({ 
        error: 'Message must have either content or images' 
      }, { status: 400 });
    }

    // Process images to extract Cloudinary data if available
    let processedImages = [];
    if (images && Array.isArray(images)) {
      processedImages = images.map((imageUrl: string) => {
        // If it's just a URL string, convert to object
        if (typeof imageUrl === 'string') {
          return { url: imageUrl };
        }
        // If it's already an object with Cloudinary data, use as is
        return imageUrl;
      });
    }

    const message = new MessageModel({
      conversationId: id,
      senderId: userId, // Using Clerk user ID directly
      content: content || '', // Allow empty content if we have images
      images: processedImages,
      read: false
    });

    await message.save();

    // Update conversation's last message
    let lastMessage = content;
    if (!lastMessage && processedImages.length > 0) {
      lastMessage = `📷 ${processedImages.length} image(s)`;
    }

    await ConversationModel.findByIdAndUpdate(id, {
      lastMessage: lastMessage,
      lastMessageAt: new Date()
    });

    // Fetch sender info for the response
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?clerkId=${userId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const messageWithSender = {
            ...message.toObject(),
            senderId: {
              _id: userId,
              name: `${result.data.firstName} ${result.data.lastName}`,
              email: result.data.email,
              image: result.data.image
            }
          };
          return NextResponse.json(messageWithSender);
        }
      }
    } catch (error) {
      console.error('Error fetching sender info:', error);
    }

    // Fallback response
    const messageWithSender = {
      ...message.toObject(),
      senderId: {
        _id: userId,
        name: 'User',
        email: '',
        image: null
      }
    };

    return NextResponse.json(messageWithSender);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
