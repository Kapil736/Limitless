'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Code2, 
  Zap, 
  Eye, 
  Users, 
  ArrowRight, 
  Play, 
  Sparkles,
  Terminal,
  Layers,
  Globe,
  ChevronRight,
  Star,
  Check
} from 'lucide-react'
import Image from 'next/image'

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const router = useRouter()
  
  const demoPrompts = [
    "Build me a counter app with React...",
    "Create a todo list with TypeScript...",
    "Make a weather dashboard with Next.js...",
    "Design a login form with Tailwind..."
  ]

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Natural Language → Code",
      description: "Simply describe what you want to build, and our AI generates production-ready code instantly.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Instant Preview",
      description: "See your app come to life in real-time with our sandboxed execution environment.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "No-Code Interface",
      description: "Adjust your app with visual controls - no coding required. Perfect for non-developers.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Persistent Workspaces",
      description: "Your projects, chat history, and preferences are saved. Pick up exactly where you left off.",
      color: "from-orange-500 to-red-500"
    }
  ]

  const techStack = [
    { name: "Next.js", color: "bg-black text-white" },
    { name: "TypeScript", color: "bg-blue-600 text-white" },
    { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
    { name: "Convex", color: "bg-purple-600 text-white" },
    { name: "Clerk", color: "bg-indigo-600 text-white" },
    { name: "Ollama", color: "bg-green-600 text-white" }
  ]

  const stats = [
    { value: "10K+", label: "Apps Generated" },
    { value: "99.9%", label: "Uptime" },
    { value: "< 2s", label: "Generation Time" },
    { value: "5★", label: "User Rating" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoPrompts.length)
    }, 3000)
    return () => clearInterval(interval)      
  }, [])

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
    setIsLoading(false)
    console.log('Navigate to chatbot interface')
    router.push('/chat')
    }, 2000)
    }

  const handleWatchDemo = () => {
    // TODO: Show demo modal or navigate to demo page
    console.log('Show demo')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Limitless AI
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              <a href="#tech" className="text-gray-600 hover:text-gray-900 transition-colors">Tech Stack</a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                onClick={handleGetStarted}
              >
                Try Now
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 text-sm text-gray-600 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Built by Kapil R Kaushik </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Turn Ideas into{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Live Apps
              </span>
              <br />
              with AI Magic
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The most advanced AI-powered code generation platform. Describe your app in plain English, 
              see it running instantly, and deploy with zero configuration.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Starting...' : 'Start Building'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchDemo}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-all flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Live Demo Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-1">
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-sm font-mono">Limitless AI Terminal</div>
                    <div className="w-16"></div>
                  </div>
                  
                  {/* Terminal Content */}
                  <div className="p-6 font-mono text-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-green-400">$</span>
                      <span className="text-gray-300">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={currentDemo}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-blue-300"
                          >
                            {demoPrompts[currentDemo]}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-5 bg-blue-400"
                      />
                    </div>
                    
                    <div className="text-gray-400 mb-2">✨ Generating code...</div>
                    <div className="text-green-400 mb-2">✅ Created React component</div>
                    <div className="text-green-400 mb-2">✅ Applied styling with Tailwind</div>
                    <div className="text-green-400 mb-4">✅ Ready for preview!</div>
                    
                    {/* Code Preview */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-purple-400">const</div>
                      <div className="text-blue-300 ml-4">CounterApp = () =&gt; </div>
                      <div className="text-gray-300 ml-8">// Generated AI code...</div>
                      <div className="text-blue-300 ml-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Everything you need to build
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> faster</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              From idea to deployment in minutes, not hours. Our AI handles the complexity so you can focus on creativity.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity -z-10`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Built with Modern Tech Stack
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Leveraging the best tools and frameworks for performance, scalability, and developer experience.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${tech.color} px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all`}
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to transform your ideas into reality?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of developers who are building faster with AI. Start your first project today, completely free.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Building Now</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Limitless AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Built by Kapil R Kaushik 
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="https://github.com/Kapil736" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://linkedin.com/in/kapil-kaushik" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Portfolio</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage