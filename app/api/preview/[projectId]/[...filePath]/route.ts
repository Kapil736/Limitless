import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types'; 

export async function GET(
  request: Request,
  { params }: { params: { projectId: string; filePath: string[] } }
) {
  try {
    const { projectId, filePath } = params;
    const relativeFilePath = path.join(...filePath);
    const projectDir = path.join(process.cwd(), 'projects', projectId);
    const absoluteFilePath = path.join(projectDir, relativeFilePath);

    if (!fs.existsSync(absoluteFilePath) || fs.lstatSync(absoluteFilePath).isDirectory()) {
      return new Response('Not Found', { status: 404 });
    }

    // Read the file content
    const fileContent = fs.readFileSync(absoluteFilePath);

    // Determine the correct content-type (e.g., 'text/html', 'text/css')
    const contentType = mime.lookup(absoluteFilePath) || 'application/octet-stream';

    // Return the file content with the correct header
    return new Response(fileContent, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });

  } catch (error) {
    console.error('Failed to serve file:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}