import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface ChatGPTAppProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    text: "Hello! I am your MagicOS AI Assistant. How can I assist you with code, ideas, writing, or system tasks today?",
    time: '10:00 AM',
  },
];

export const ChatGPTApp: React.FC<ChatGPTAppProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    triggerHaptic('smooth');
    playTapSound(600);

    const userText = inputVal.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Generate intelligent contextual response
    setTimeout(() => {
      triggerHaptic('doubleTick');
      playTapSound(700);

      let reply = "I can certainly help you with that! ";
      const lower = userText.toLowerCase();

      if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('react')) {
        reply = `Here is a modern TypeScript snippet demonstrating state management in MagicOS:\n\n\`\`\`ts\nconst [status, setStatus] = useState<'active' | 'idle'>('active');\nuseEffect(() => {\n  console.log('System initialized smoothly');\n}, []);\n\`\`\`\n\nLet me know if you would like me to expand this further!`;
      } else if (lower.includes('weather') || lower.includes('temperature')) {
        reply = "Your live weather widget is actively syncing with Open-Meteo satellite feeds for real-time temperature, wind, and humidity updates!";
      } else if (lower.includes('time') || lower.includes('clock')) {
        reply = `The current system time is ${new Date().toLocaleTimeString()} with millisecond synchronization across global timezones.`;
      } else if (lower.includes('who are you') || lower.includes('magicos')) {
        reply = "I am the MagicOS 11 Intelligent Companion, integrated seamlessly into your flagship operating system experience with tactile feedback and real-time APIs.";
      } else {
        reply = `Here is an insightful perspective on "${userText}":\n\n1. Innovation: Seamless tactile interaction and real-time cloud data pipelines elevate user experience.\n2. Efficiency: High-throughput background workers ensure zero-latency execution.\n3. Elegance: Fluid physics and glassmorphism create a delightful interface.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const copyToClipboard = (text: string, id: string) => {
    triggerHaptic('tick');
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#202123] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-700 bg-[#343541]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center shadow-md">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>ChatGPT 4.5</span>
              <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-1.5 py-0.2 rounded-full border border-teal-500/40">AI Engine</span>
            </h2>
            <p className="text-[10px] text-neutral-400">Intelligent Conversational Agent</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 p-3 rounded-2xl ${
                isAi ? 'bg-[#343541] border border-neutral-700/60' : 'bg-[#444654] ml-8'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isAi ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {isAi ? <Bot size={15} /> : <User size={15} />}
              </div>

              <div className="flex-1 space-y-1.5 overflow-hidden">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="font-bold">{isAi ? 'ChatGPT' : 'You'}</span>
                  <span>{msg.time}</span>
                </div>
                <div className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {isAi && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#343541] border border-neutral-700/60 w-32">
            <Bot size={15} className="text-teal-400 animate-spin" />
            <span className="text-xs text-neutral-400 animate-pulse">Thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-neutral-700/60 bg-[#343541]/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          "Explain Quantum Computing",
          "Write TypeScript function",
          "Plan a trip to Japan",
          "Give me a creative idea"
        ].map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setInputVal(prompt);
            }}
            className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 whitespace-nowrap active:scale-95 transition-all border border-neutral-700"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-[#343541] border-t border-neutral-700 flex items-center gap-2">
        <input
          type="text"
          placeholder="Message ChatGPT..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full bg-[#40414f] text-xs text-white placeholder-neutral-400 focus:outline-none border border-neutral-600 focus:border-teal-400"
        />

        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="w-9 h-9 rounded-full bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-neutral-950 flex items-center justify-center font-bold active:scale-95 transition-all shadow"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
