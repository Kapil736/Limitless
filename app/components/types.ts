// types.ts
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  code?: string
  language?: string
  timestamp: Date
}
 
export interface ChatProject {
  id: string
  name: string
  description: string
  lastModified: Date
  messages: Message[]
}

// Add this new type for the file explorer
export type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};