// filepath: e:\Important\Hackathon\Hackathon_Onsite\Coderush-Hackathon\app\api\chat\upload-image\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const files: File[] = data.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `chat_${timestamp}_${randomString}_${file.name}`;
      
      // Save to public/uploads/chat directory
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'chat');
      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);
      
      // Return public URL
      const url = `/uploads/chat/${filename}`;
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}