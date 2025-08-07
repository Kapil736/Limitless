import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');
    return NextResponse.json({ content: fileContent });
  } catch (error) {
    console.error('Failed to read file content:', error);
    return NextResponse.json({ error: 'Failed to read file content' }, { status: 500 });
  }
}