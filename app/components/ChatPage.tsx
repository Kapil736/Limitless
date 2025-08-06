'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'
import { Menu, X, Sparkles, ArrowLeft, Plus, Settings, MessageSquare, Code } from 'lucide-react'
import Link from 'next/link'
import { Message, ChatProject, FileNode } from './types'
import { ChatInput } from './ChatInput'
import { MessageBubble } from './MessageBubble'
import { ProjectCard } from './ProjectCard'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { FileTree } from './FileTree'
import { CodeViewer } from './CodeViewer'

const quickPrompts = [
  "Create a React counter app",
  "Build a todo list with TypeScript", 
  "Make a weather dashboard",
  "Design a login form"
]

export default function ChatPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [projects, setProjects] = useState<ChatProject[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [projectFiles, setProjectFiles] = useState<FileNode[]>([])

  // View management state
  const [mainView, setMainView] = useState<'chat' | 'code'>('chat')
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null)

  // Load projects from localStorage on initial mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('limitless_projects')
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects).map((project: any) => ({
          ...project,
          lastModified: new Date(project.lastModified),
          messages: project.messages.map((message: any) => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }))
        }))
        setProjects(parsedProjects)
        
        if (parsedProjects.length > 0) {
          setActiveProjectId(parsedProjects[0].id)
        }
      } else {
        // If no saved projects, create a default one
        const defaultProject: ChatProject = {
          id: '1',
          name: 'Welcome Project',
          description: 'Get started with AI coding',
          lastModified: new Date(),
          messages: [
            {
              id: '1',
              role: 'assistant',
              content: "👋 Hi! I'm your AI coding assistant. Describe what you'd like to build, and I'll generate the code for you instantly!\n\nTry asking me to:\n• Create a React counter app\n• Build a todo list with TypeScript\n• Make a weather dashboard\n• Design a login form",
              timestamp: new Date()
            }
          ]
        }
        setProjects([defaultProject])
        setActiveProjectId(defaultProject.id)
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage", error)
    }
  }, [])

  // Save projects to localStorage whenever they change
  useEffect(() => {
    try {
      if (projects.length > 0) {
        localStorage.setItem('limitless_projects', JSON.stringify(projects))
      } else {
        localStorage.removeItem('limitless_projects')
      }
    } catch (error) {
      console.error("Failed to save projects to localStorage", error)
    }
  }, [projects])

  // Load files and reset view when active project changes
  useEffect(() => {
    if (activeProjectId) {
      setMainView('chat')
      setSelectedFile(null)
      fetch(`/api/projects/${activeProjectId}/files`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setProjectFiles(data || []))
        .catch(() => setProjectFiles([]))
    }
  }, [activeProjectId])

  // Get active project and its messages
  const activeProject = projects.find(p => p.id === activeProjectId)
  const activeMessages = activeProject?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (mainView === 'chat') scrollToBottom()
  }, [activeMessages, mainView])

  const handleFileSelect = async (filePath: string) => {
    if (!activeProjectId) return
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/files/${encodeURIComponent(filePath)}`)
      if (!res.ok) throw new Error('File not found')
      const data = await res.json()
      setSelectedFile({ path: filePath, content: data.content })
      setMainView('code')
    } catch (error) {
      toast.error("Could not load file.")
      console.error(error)
    }
  }

  const handleNewProject = () => {
    const newProject: ChatProject = {
      id: Date.now().toString(),
      name: 'Untitled Project',
      description: 'A new AI-powered project',
      lastModified: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "👋 Hi! I'm your AI coding assistant. What would you like to build in this new project?",
          timestamp: new Date()
        }
      ]
    }
    setProjects(currentProjects => [newProject, ...currentProjects])
    setActiveProjectId(newProject.id)
    toast.success('New project created!')
  }

  const handleDeleteProject = (projectIdToDelete: string) => {
    setProjects(currentProjects => {
      const newProjects = currentProjects.filter(p => p.id !== projectIdToDelete)
      if (activeProjectId === projectIdToDelete) {
        setActiveProjectId(newProjects[0]?.id || null)
      }
      return newProjects
    })
    toast.success('Project deleted')
    setProjectToDelete(null)
  }

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(currentProjects => 
      currentProjects.map(p => 
        p.id === projectId ? { ...p, name: newName.trim(), lastModified: new Date() } : p
      )
    )
    toast.success('Project renamed')
  }

  const handleSendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim() || isGenerating || !activeProjectId) return

    setIsGenerating(true)
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setProjects(currentProjects =>
      currentProjects.map(p =>
        p.id === activeProjectId
          ? { ...p, messages: [...p.messages, userMessage], lastModified: new Date() }
          : p
      )
    )
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputMessage, projectId: activeProjectId })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "An error occurred.")
      }
      
      const aiResponseMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.message,
        timestamp: new Date()
      }

      setProjects(currentProjects =>
        currentProjects.map(p =>
          p.id === activeProjectId ? { ...p, messages: [...p.messages, aiResponseMessage] } : p
        )
      )
      
      // Refresh the file list after generation
      const fileResponse = await fetch(`/api/projects/${activeProjectId}/files`)
      const fileData = await fileResponse.json()
      if (fileData && !fileData.error) {
        setProjectFiles(fileData)
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      toast.error(errorMessage)
      const aiErrorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, an error occurred: ${errorMessage}`,
        timestamp: new Date()
      }
      setProjects(currentProjects =>
        currentProjects.map(p =>
          p.id === activeProjectId ? { ...p, messages: [...p.messages, aiErrorMessage] } : p
        )
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <DeleteConfirmationModal
        isOpen={!!projectToDelete}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={() => projectToDelete && handleDeleteProject(projectToDelete)}
      />
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
            
      <div className={`fixed lg:relative z-40 w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Limitless AI</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleNewProject}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No projects yet.</p><p className="text-sm">Click "New Project" to start.</p>
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={activeProjectId === project.id}
                  onSelect={() => setActiveProjectId(project.id)}
                  onRename={(newName) => handleRenameProject(project.id, newName)}
                  onDelete={() => setProjectToDelete(project.id)}
                />
              ))
            )}
          </div>

          {/* File Explorer Section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              File Explorer
            </h3>
            <div className="mt-2">
              <FileTree 
                files={projectFiles} 
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">KK</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Kapil R Kaushik</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">Limitless AI</h1>
                    <p className="text-xs text-gray-500">AI Code Generator</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setMainView('chat')} 
                className={`p-2 rounded-lg flex items-center space-x-2 text-sm ${mainView === 'chat' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare size={16} /> <span>Chat</span>
              </button>
              <button 
                onClick={() => setMainView('code')} 
                disabled={!selectedFile}
                className={`p-2 rounded-lg flex items-center space-x-2 text-sm ${mainView === 'code' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Code size={16} /> <span>Code</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mainView === 'chat' ? (
            <>
              {activeMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          ) : (
            selectedFile && <CodeViewer filePath={selectedFile.path} content={selectedFile.content} />
          )}
        </div>

        {mainView === 'chat' && (
          <ChatInput 
            onSend={handleSendMessage} 
            isGenerating={isGenerating} 
            quickPrompts={activeMessages.length <= 1 ? quickPrompts : []} 
          />
        )}
      </div>
    </div>
  )
}