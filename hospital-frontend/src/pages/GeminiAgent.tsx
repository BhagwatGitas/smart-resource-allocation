import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, ChevronRight, Info, Zap, MessageSquare, History, Search, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
}

// Mock response function to simulate Gemini without an API key
const getMockResponse = async (input: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate thinking

  const query = input.toLowerCase();

  if (query.includes('how') && query.includes('donor')) {
    return "# Becoming a Donor\n\nJoining the **Vital Life** community as a donor is a rewarding experience. Here's the process:\n\n1.  **Registration**: Complete the form on our [Register](/register) page.\n2.  **Eligibility**: We'll check basic health criteria (age, weight, and general health).\n3.  **Scheduling**: Choose a convenient time at one of our [Centers](/centers).\n4.  **Donation**: The actual process takes about 10-15 minutes for whole blood.\n\n**Did you know?** One donation can save up to three lives!";
  }

  if (query.includes('center')) {
    return "## Finding a Center\n\nVital Life has a vast network of **156+ certified centers**. \n\n*   **Manhattan Life Center**: Open 24/7 for emergency donations.\n*   **Brooklyn Hope Point**: Specializes in plasma and platelet collection.\n*   **Queens Wellness Hub**: Located near Central Station.\n\nYou can view all locations and their current blood type needs on the [Centers](/centers) map.";
  }

  if (query.includes('blood type') || query.includes('inventory')) {
    return "## Real-time Inventory Status\n\nOur system monitors blood supply across the city. Current status:\n\n| Blood Type | Status | Urgent Need |\n| :--- | :--- | :--- |\n| **O-** | Critical | YES |\n| **A+** | Stable | No |\n| **B-** | Low | YES |\n| **AB+** | Good | No |\n\nYou can track live updates on the [Hospital Dashboard](/dashboard).";
  }

  if (query.includes('organ') || query.includes('kidney')) {
    return "## Organ Donation Registry\n\nVital Life manages a prioritized **Organ Donation Registry**. We facilitate the matching process between donors and recipients using real-time medical data.\n\n*   **Express Interest**: You can join the registry during [registration](/register).\n*   **Matching Algorithm**: We use medical urgency and compatibility factors.\n*   **Support**: Our team provides counseling for both donors and families.\n\nYou can learn more about the impact of organ donation on our [Impact](/our-impact) page.";
  }

  if (query.includes('emergency') || query.includes('urgent')) {
    return "### Emergency Protocol\n\nIf you are experiencing a life-threatening situation, please call **911** immediately.\n\nFor hospital staff:\n*   Use the **Priority Queue** on the [Dashboard](/dashboard) to request immediate blood or organ transport.\n*   Our logistics engine will automatically redirect the nearest available courier.";
  }

  if (query.includes('secure') || query.includes('privacy') || query.includes('safe')) {
    return "### Your Privacy Matters\n\nVital Life employs state-of-the-art security measures:\n\n1.  **End-to-End Encryption**: All communication is secured.\n2.  **HIPAA Compliance**: We adhere to strict medical data standards.\n3.  **Data Sovereignty**: Your information is never sold to third parties.\n\nYou can review our full privacy policy in the settings menu.";
  }

  if (query.includes('hello') || query.includes('hi')) {
    return "Hello! I am **Gemini**, your Vital Life AI assistant. I'm here to provide information about our donation platform, help you navigate the system, or answer any questions about the impact of blood and organ donation. \n\nHow can I help you save a life today?";
  }

  return "I understand you're asking about **" + input + "**. \n\nVital Life is designed to use advanced resource allocation to ensure that life-saving blood and organs reach the right patients at the right time. \n\nAs your AI agent, I can help you with:\n*   Navigating the **Dashboard**\n*   Finding **Donation Centers**\n*   Understanding your **Impact**\n*   General health requirements for donors\n\nWhat would you like to explore next?";
};

export default function GeminiAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const content = text || input;
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getMockResponse(content);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'system', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { title: "Understand Blood Donation", desc: "How does it help people?", icon: <Zap className="text-amber-500" size={20} /> },
    { title: "Find Centers Near Me", desc: "Where can I go today?", icon: <Search className="text-blue-500" size={20} /> },
    { title: "Medical Requirements", desc: "Can I donate with my history?", icon: <Info className="text-emerald-500" size={20} /> },
    { title: "Platform Features", desc: "What can Vital Life do?", icon: <Sparkles className="text-purple-500" size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white flex text-slate-800">
      {/* Sidebar - Desktop Only */}
      <aside className="w-72 hidden lg:flex flex-col bg-[#f0f4f9] p-4 border-r border-slate-200">
        <button onClick={() => setMessages([])} className="mb-8 flex items-center gap-3 px-4 py-3 bg-[#e3eefc] hover:bg-[#d3e3fd] text-[#041e49] rounded-full font-semibold transition-all shadow-sm">
          <Plus size={20} />
          <span>New Chat</span>
        </button>

        <div className="flex-1 space-y-1">
          <div className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Recent</div>
          {messages.length > 0 ? (
            <div className="px-4 py-2 text-sm text-slate-500 bg-white/50 rounded-xl border border-white/20 italic">
              Active Session
            </div>
          ) : (
            <p className="px-4 text-xs text-slate-400 italic">No recent chats</p>
          )}
        </div>

        <div className="space-y-1 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors text-sm font-medium">
            <History size={18} />
            <span>Activity</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors text-sm font-medium">
            <Info size={18} />
            <span>Help</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tighter text-slate-900">Gemini</span>
            <div className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-tighter">Vital Life</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">settings</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-[15%] space-y-12">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-start justify-center max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 bg-clip-text text-transparent"
              >
                Hello, how can I help you today?
              </motion.h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleSendMessage(s.title)}
                    className="p-6 bg-[#f0f4f9] hover:bg-[#e3eefc] rounded-3xl cursor-pointer transition-all border border-transparent hover:border-blue-200 group relative"
                  >
                    <div className="mb-4">{s.icon}</div>
                    <h3 className="font-bold text-slate-800 mb-1">{s.title}</h3>
                    <p className="text-sm text-slate-500">{s.desc}</p>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <ChevronRight size={18} className="text-blue-600" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10 pb-32">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'bg-[#f8fafd] -mx-6 px-6 py-8 rounded-3xl' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white'
                    }`}>
                    {msg.role === 'user' ? <span className="material-symbols-outlined">person</span> : <Sparkles size={20} />}
                  </div>
                  <div className="flex-1 pt-1 overflow-hidden">
                    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-white">
                      <div className="markdown-content text-[16px] text-slate-700">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-6 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Sparkles size={20} className="text-slate-300" />
                  </div>
                  <div className="flex-1 space-y-4 pt-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter a prompt here"
                className="w-full pl-6 pr-24 py-5 bg-[#f0f4f9] border-2 border-transparent focus:border-blue-500/20 rounded-[32px] outline-none transition-all text-slate-700 font-medium"
              />
              <div className="absolute right-3 flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined">image</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${input.trim() && !isLoading ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300'
                    }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-400 mt-4 font-medium">
              Gemini AI Agent is ready to assist you. Ask anything about Vital Life!
            </p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .markdown-content p { margin-bottom: 1.25rem; }
        .markdown-content ul, .markdown-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content strong { color: #0f172a; font-weight: 800; }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 { 
          color: #0f172a; 
          font-weight: 900; 
          margin-top: 2rem; 
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        .markdown-content h1 { font-size: 2.25rem; }
        .markdown-content h2 { font-size: 1.875rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        .markdown-content h3 { font-size: 1.5rem; }
        .markdown-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .markdown-content th, .markdown-content td { padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left; }
        .markdown-content th { background: #f8fafc; font-weight: 700; }
      `}} />
    </div>
  );
}
