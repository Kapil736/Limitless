import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

function readDirectory(dirPath: string, relativePath: string = ''): FileNode[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      const newRelativePath = path.join(relativePath, entry.name);
      if (entry.isDirectory()) {
        nodes.push({
          name: entry.name,
          path: newRelativePath,
          type: 'folder',
          children: readDirectory(entryPath, newRelativePath),
        });
      } else {
        nodes.push({
          name: entry.name,
          path: newRelativePath,
          type: 'file',
        });
      }
    }
    return nodes;
  } catch (error) {
    // If the directory doesn't exist yet, return an empty array
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params; // This is now safe
    const projectDir = path.join(process.cwd(), 'projects', projectId);

    if (!fs.existsSync(projectDir)) {
      return NextResponse.json([]);
    }

    const fileTree = readDirectory(projectDir);
    return NextResponse.json(fileTree);
  } catch (error) {
    console.error('Failed to read project files:', error);
    return NextResponse.json({ error: 'Failed to read project files' }, { status: 500 });
  }
}