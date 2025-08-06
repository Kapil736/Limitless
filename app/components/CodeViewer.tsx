// components/CodeViewer.tsx
'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeViewerProps {
  filePath: string;
  content: string;
}

// A simple function to guess the language from the file extension
const getLanguage = (filePath: string) => {
  const extension = filePath.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'tsx': return 'tsx';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'html': return 'html';
    case 'md': return 'markdown';
    default: return 'plaintext';
  }
};

export const CodeViewer = ({ filePath, content }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = getLanguage(filePath);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-gray-900 px-4 py-2 flex justify-between items-center text-xs text-gray-400">
        <span>{filePath}</span>
        <button onClick={handleCopy} className="flex items-center space-x-1 hover:text-white">
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers>
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};