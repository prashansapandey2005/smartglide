import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const videoId = params.videoId;
    
    // In a real app, verify the user's session and check if they purchased the course here!
    // For MVP, we will allow streaming if the ID is valid.

    const videoPath = join(process.cwd(), 'private', 'uploads', videoId);
    
    let stat;
    try {
      stat = statSync(videoPath);
    } catch (e) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const file = createReadStream(videoPath, { start, end });
      const ext = videoId.split('.').pop()?.toLowerCase();
      const contentType = ext === 'webm' ? 'video/webm' : ext === 'ogg' ? 'video/ogg' : 'video/mp4';

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };
      
      return new NextResponse(file as any, {
        status: 206,
        headers: head as any,
      });
    } else {
      const ext = videoId.split('.').pop()?.toLowerCase();
      const contentType = ext === 'webm' ? 'video/webm' : ext === 'ogg' ? 'video/ogg' : 'video/mp4';
      
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
      };
      const file = createReadStream(videoPath);
      return new NextResponse(file as any, {
        status: 200,
        headers: head as any,
      });
    }
  } catch (error) {
    console.error('Streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
