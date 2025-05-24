// filepath: e:\Important\Hackathon\Hackathon_Onsite\Coderush-Hackathon\app\api\chat\upload-image\route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@clerk/nextjs/server";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    // Use Clerk authentication instead of NextAuth
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const files: File[] = data.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Validate file types and sizes
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `File type ${file.type} not allowed. Only JPEG, PNG, GIF, and WebP images are supported.` 
        }, { status: 400 });
      }

      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: `File ${file.name} is too large. Maximum size is 5MB.` 
        }, { status: 400 });
      }
    }

    const urls: string[] = [];

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "chat");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with user ID for better organization
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `chat_${userId}_${timestamp}_${randomString}.${fileExtension}`;

      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);

      // Return public URL
      const url = `/uploads/chat/${filename}`;
      urls.push(url);
    }

    return NextResponse.json({ 
      success: true,
      urls,
      message: `${files.length} image(s) uploaded successfully`
    });
  } catch (error) {
    console.error("Error uploading chat images:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Configure the API route to handle large files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
