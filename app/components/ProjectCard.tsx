import { Trash2, Pencil } from 'lucide-react'
import { ChatProject } from './types'
import { useState } from 'react'

interface ProjectCardProps {
    project: ChatProject
    isActive: boolean
    onSelect: () => void
    onRename: (newName: string) => void
    onDelete: () => void
  }

export function ProjectCard({ project, isActive, onSelect, onRename, onDelete }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(project.name)

  const handleRename = () => {
    if (editedName.trim()) {
      onRename(editedName)
    }
    setIsEditing(false)
  }

  return (
    <div 
        onClick={isEditing ? undefined : onSelect}
        className={`relative group p-4 rounded-xl cursor-pointer border-2 transition-all ${
        isActive 
          ? 'bg-blue-50 border-blue-400' 
          : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
     }`}
    >
      {isEditing ? (
        <input 
          type="text" 
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          autoFocus
          className="w-full bg-transparent text-lg font-semibold text-gray-900 outline-none"
        />
      ) : (
        <>
          <h3 className="font-semibold text-gray-900 mb-1 pr-16">{project.name}</h3>
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-gray-50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { 
                e.stopPropagation()
                setIsEditing(true)
                setEditedName(project.name)
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full" 
              aria-label="Rename project"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 text-gray-500 hover:text-red-600 rounded-full" 
              aria-label="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{project.messages.length} messages</span> {/* Updated to show actual count */}
        <span>{project.lastModified.toLocaleDateString()}</span>
      </div>
    </div>
  )
}