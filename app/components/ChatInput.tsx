import { Send } from 'lucide-react'
import { useState, useRef, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  isGenerating: boolean
  quickPrompts?: string[]
}

export function ChatInput({ onSend, isGenerating, quickPrompts = [] }: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!inputMessage.trim() || isGenerating) return
    onSend(inputMessage)
    setInputMessage('')
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white/80 backdrop-blur-md p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to build..."
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 min-h-[52px]"
              rows={1}
              disabled={isGenerating}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isGenerating}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {quickPrompts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {quickPrompts.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}