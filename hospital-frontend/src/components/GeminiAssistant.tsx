import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Trash2, Zap, MessageSquare, Minimize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
}

const PAGE_CONTEXTS: Record<string, string> = {
  '/': 'Home Page: Overview of Vital Life.',
  '/centers': 'Donation Centers: Find locations.',
  '/dashboard': 'Hospital Dashboard: Real-time inventory.',
  '/register': 'Donor Registration: Join the community.',
  '/our-impact': 'Our Impact: Success stories.',
  '/my-impact': 'My Impact: Personal contributions.',
};

const GREETINGS: Record<string, string> = {
  '/': 'Hi! I\'m your **Vital Life Assistant**. How can I help you save lives today?',
  '/centers': 'Need help finding a donation center near you?',
  '/dashboard': 'I can help you analyze inventory or manage requests.',
  '/register': 'Ready to register? I can guide you through the form.',
};

const getMockResponse = async (input: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const q = input.toLowerCase();
  if (q.includes('donor')) return "To become a donor, just [register here](/register). It takes less than 5 minutes!";
  if (q.includes('center')) return "You can find all our 156+ centers on the [Centers page](/centers).";
  if (q.includes('blood')) return "O-Negative is currently in high demand. All types are needed!";
  return "I'm your AI assistant for **Vital Life**. I can help you find centers, register, or track your impact. What's on your mind?";
};

export default function GeminiAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'ai',
        content: GREETINGS[location.pathname] || 'Hello! I am your Vital Life AI Assistant. How can I help you today?',
      }]);
    }
  }, [location.pathname, messages.length]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener('toggle-gemini-chat', handleToggle);
    return () => window.removeEventListener('toggle-gemini-chat', handleToggle);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim() || isLoading) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);
    const response = await getMockResponse(text);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg overflow-hidden group border border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#4285f4] via-[#9b72cb] to-[#d96570] animate-gradient-xy" />
        <div className="relative z-10 flex items-center gap-2 font-bold text-sm">
          {isOpen ? <Minimize2 size={18} /> : <Sparkles size={18} className="animate-pulse" />}
          <span>{isOpen ? 'Close Chat' : 'Ask AI'}</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-[350px] h-[500px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 flex flex-col overflow-hidden"
          >
            {/* Mini Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-black/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Vital AI Agent</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase">Online</p>
                </div>
              </div>
              <button onClick={() => setMessages([{ id: '1', role: 'ai', content: GREETINGS[location.pathname] || 'Hello!' }])} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
                <Trash2 size={14} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    <div className="markdown-mini">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Compact Input */}
            <div className="p-3 bg-white border-t border-black/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xs"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 top-1 bottom-1 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-slate-800 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy { background-size: 200% 200%; animation: gradient-xy 5s ease infinite; }
        .markdown-mini p { margin-bottom: 0.25rem; }
        .markdown-mini p:last-child { margin-bottom: 0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  );
}
