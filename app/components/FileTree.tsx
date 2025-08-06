'use client';

import { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { FileNode } from './types';

interface FileTreeProps {
  files: FileNode[];
  onFileSelect: (filePath: string) => void; // <-- New prop added
}

const TreeNode = ({ node, onFileSelect }: { node: FileNode; onFileSelect: (filePath: string) => void; }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'folder') {
    return (
      <li className="ml-4 my-1">
        <div 
          className="flex items-center cursor-pointer text-gray-700 hover:text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
          <Folder size={16} className="mr-2 text-blue-500" />
          <span>{node.name}</span>
        </div>
        {isOpen && (
          <ul>
            {node.children?.map(child => <TreeNode key={child.path} node={child} onFileSelect={onFileSelect} />)}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li 
      className="ml-4 my-1 flex items-center text-gray-600 hover:text-black cursor-pointer"
      onClick={() => onFileSelect(node.path)} // <-- New onClick handler added
    >
      <File size={16} className="mr-2 text-gray-500" />
      <span>{node.name}</span>
    </li>
  );
};

export const FileTree = ({ files, onFileSelect }: FileTreeProps) => {
  if (files.length === 0) {
    return <div className="p-4 text-sm text-gray-500">No files generated yet.</div>;
  }
  return (
    <ul className="text-sm">
      {files.map(node => <TreeNode key={node.path} node={node} onFileSelect={onFileSelect} />)}
    </ul>
  );
};