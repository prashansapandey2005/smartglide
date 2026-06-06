import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to a private directory outside of public/ so it can't be downloaded directly
    const uploadDir = join(process.cwd(), 'private', 'uploads');
    
    // Ensure the directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if directory already exists
    }

    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Write the file to disk
    await writeFile(filePath, buffer);

    // Return the secure internal path. This path will be saved to the database.
    return NextResponse.json({ 
      success: true, 
      filePath: uniqueFilename // Only save the filename in DB, not the absolute path
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
