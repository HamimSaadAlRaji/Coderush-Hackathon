import { NextRequest, NextResponse } from "next/server";
import { ConversationModel, MessageModel } from "@/models/Message";
import dbConnect from "@/lib/dbconnect";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await ConversationModel.find({
      participants: { $in: [userId] },
    })
      .populate("listingId", "title images")
      .sort({ lastMessageAt: -1 })
      .lean();

    // Manually populate participant info since we're using Clerk IDs
    const conversationsWithParticipants = await Promise.all(
      conversations.map(async (conv) => {
        const participantIds = conv.participants.filter((id) => id !== userId);
        const participantInfo = await Promise.all(
          participantIds.map(async (id) => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/users?clerkId=${id}`
              );
              if (response.ok) {
                const result = await response.json();
                if (result.success) {
                  return {
                    _id: id,
                    name: `${result.data.firstName} ${result.data.lastName}`,
                    email: result.data.email,
                    image: result.data.profilePicture,
                  };
                }
              }
              return {
                _id: id,
                name: "Unknown User",
                email: "",
                image: null,
              };
            } catch (error) {
              console.error(`Error fetching user ${id}:`, error);
              return {
                _id: id,
                name: "Unknown User",
                email: "",
                image: null,
              };
            }
          })
        );

        return {
          ...conv,
          participants: participantInfo,
        };
      })
    );

    return NextResponse.json(conversationsWithParticipants);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler for creating new conversations
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { listingId, sellerId, buyerId } = await request.json();

    // Validate required fields
    if (!listingId || !sellerId || !buyerId) {
      return NextResponse.json({ 
        error: 'Missing required fields: listingId, sellerId, buyerId' 
      }, { status: 400 });
    }

    // Check if conversation already exists
    const existingConversation = await ConversationModel.findOne({
      listingId,
      participants: { $all: [sellerId, buyerId] }
    });

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        data: existingConversation,
        message: 'Conversation already exists'
      });
    }

    // Create new conversation
    const conversation = new ConversationModel({
      listingId,
      participants: [sellerId, buyerId],
      lastMessage: '',
      lastMessageAt: new Date()
    });

    await conversation.save();

    // Populate the listing data for response
    const populatedConversation = await ConversationModel.findById(conversation._id)
      .populate('listingId', 'title images')
      .lean();

    return NextResponse.json({
      success: true,
      data: populatedConversation,
      message: 'Conversation created successfully'
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}