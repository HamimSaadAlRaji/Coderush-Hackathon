import { NextRequest, NextResponse } from "next/server";
import { MessageModel } from "@/models/Message";
import dbConnect from "@/lib/dbconnect";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params before using
    const { id } = await params;

    await MessageModel.updateMany(
      {
        conversationId: id,
        senderId: { $ne: userId }, // Using Clerk user ID
        read: false,
      },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
