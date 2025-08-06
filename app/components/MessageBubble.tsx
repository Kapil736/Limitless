import { User, Bot, Copy, Play, Code, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Message } from './types'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy code.')
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-4 ${
        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        message.role === 'user' 
          ? 'bg-blue-500' 
          : 'bg-gradient-to-r from-purple-500 to-pink-500'
      }`}>
        {message.role === 'user' ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-3xl ${
        message.role === 'user' ? 'text-right' : ''
      }`}>
        <div className={`inline-block p-4 rounded-2xl ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white shadow-sm border border-gray-200'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.code && (
          <div className="mt-4 bg-gray-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{message.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyCode(message.code!)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-1"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-all">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
            <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
              <code>{message.code}</code>
            </pre>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  )
}