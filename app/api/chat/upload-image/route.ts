// filepath: e:\Important\Hackathon\Hackathon_Onsite\Coderush-Hackathon\app\api\chat\upload-image\route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CloudinaryService } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    // Use Clerk authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for required Cloudinary environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary configuration missing",
        },
        { status: 500 }
      );
    }

    const data = await request.formData();
    const files: File[] = data.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Validate file types and sizes
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File type ${file.type} not allowed. Only JPEG, PNG, GIF, and WebP images are supported.`,
          },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: `File ${file.name} is too large. Maximum size is 5MB.`,
          },
          { status: 400 }
        );
      }
    }

    const urls: string[] = [];
    const uploadResults = [];

    for (const file of files) {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary with chat-specific folder
        console.log("Uploading chat image to Cloudinary...");
        const cloudinaryResult = await CloudinaryService.uploadImage(buffer, {
          folder: `marketplace/chat/${userId}`, // Organize by user ID
          transformation: {
            quality: "auto",
            fetch_format: "auto",
            width: 800,
            height: 600,
            crop: "limit",
          },
        });

        console.log(
          "Chat image uploaded successfully:",
          cloudinaryResult.secure_url
        );

        // Store the secure URL for the message
        urls.push(cloudinaryResult.secure_url);

        // Store full result for response
        uploadResults.push({
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format,
          bytes: cloudinaryResult.bytes,
        });
      } catch (uploadError) {
        console.error("Error uploading file to Cloudinary:", uploadError);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to upload ${file.name}: ${
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error"
            }`,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      urls,
      uploadResults,
      message: `${files.length} image(s) uploaded successfully to Cloudinary`,
    });
  } catch (error) {
    console.error("Error uploading chat images:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Configure the API route to handle large files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
