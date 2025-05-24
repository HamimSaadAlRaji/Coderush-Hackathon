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
      participants: { $in: [userId] }, // Use $in to find conversations where userId is in the participants array
    })
      .populate("listingId", "title images")
      .sort({ lastMessageAt: -1 })
      .lean(); // Use lean() for better performance

    // Manually populate participant info since we're using Clerk IDs
    const conversationsWithParticipants = await Promise.all(
      conversations.map(async (conv) => {
        const participantIds = conv.participants.filter((id) => id !== userId);
        const participantInfo = await Promise.all(
          participantIds.map(async (id) => {
            try {
              // Fetch user info from your users API
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
                    image: result.data.image,
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sellerId, listingId } = await request.json();

    console.log("Creating conversation:", { userId, sellerId, listingId });

    // Validate input
    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Ensure sellerId and userId are strings
    const userIdStr = String(userId);
    const sellerIdStr = String(sellerId);

    // Check if conversation already exists
    const existingConversation = await ConversationModel.findOne({
      participants: { $all: [userIdStr, sellerIdStr] },
      listingId: listingId,
    }).populate("listingId", "title images");

    if (existingConversation) {
      console.log("Found existing conversation:", existingConversation._id);
      return NextResponse.json({
        success: true,
        data: existingConversation,
      });
    }

    // Create new conversation with string participants
    const conversation = new ConversationModel({
      participants: [userIdStr, sellerIdStr],
      listingId: listingId,
      lastMessage: "",
      lastMessageAt: new Date(),
    });

    await conversation.save();

    // Populate the listing data
    await conversation.populate("listingId", "title images");

    console.log("Conversation created successfully:", conversation._id);

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
