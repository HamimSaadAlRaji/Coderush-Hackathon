import { NextRequest, NextResponse } from "next/server";
import { MessageModel, ConversationModel } from "@/models/Message";
import dbConnect from "@/lib/dbconnect";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      conversationId: params.id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Manually populate sender info since we're using Clerk IDs
    const messagesWithSenderInfo = await Promise.all(
      messages.map(async (message) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/users?clerkId=${message.senderId}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              return {
                ...message.toObject(),
                senderId: {
                  _id: message.senderId,
                  name: `${result.data.firstName} ${result.data.lastName}`,
                  email: result.data.email,
                  image: result.data.image,
                },
              };
            }
          }
          return {
            ...message.toObject(),
            senderId: {
              _id: message.senderId,
              name: "Unknown User",
              email: "",
              image: null,
            },
          };
        } catch (error) {
          return {
            ...message.toObject(),
            senderId: {
              _id: message.senderId,
              name: "Unknown User",
              email: "",
              image: null,
            },
          };
        }
      })
    );

    return NextResponse.json(messagesWithSenderInfo.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, images } = await request.json();

    const message = new MessageModel({
      conversationId: params.id,
      senderId: userId, // Using Clerk user ID directly
      content,
      images: images || [],
      read: false,
    });

    await message.save();

    // Update conversation's last message
    await ConversationModel.findByIdAndUpdate(params.id, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });

    // Fetch sender info for the response
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users?clerkId=${userId}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const messageWithSender = {
            ...message.toObject(),
            senderId: {
              _id: userId,
              name: `${result.data.firstName} ${result.data.lastName}`,
              email: result.data.email,
              image: result.data.image,
            },
          };
          return NextResponse.json(messageWithSender);
        }
      }
    } catch (error) {
      console.error("Error fetching sender info:", error);
    }

    // Fallback response
    const messageWithSender = {
      ...message.toObject(),
      senderId: {
        _id: userId,
        name: "User",
        email: "",
        image: null,
      },
    };

    return NextResponse.json(messageWithSender);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
