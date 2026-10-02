import React, { useState } from 'react';
import { X, Search, Send, Plus, ArrowLeft, MoreVertical, Phone, Video, Image, CheckCheck, Smile } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface MessagesAppProps {
  onClose: () => void;
  onOpenPhone?: (num: string) => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatarColor: string;
  phone: string;
  unreadCount?: number;
  lastMessage: string;
  time: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    avatarColor: 'bg-emerald-500',
    phone: '+1 (555) 234-5678',
    unreadCount: 2,
    lastMessage: 'Are we still meeting for coffee at 3 PM?',
    time: '12:45 PM',
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey Sunny! Hope you are having a productive day.', time: '12:40 PM' },
      { id: 'm2', sender: 'them', text: 'Are we still meeting for coffee at 3 PM?', time: '12:45 PM' }
    ]
  },
  {
    id: 'c2',
    name: 'Alex Rivera',
    avatarColor: 'bg-blue-600',
    phone: '+1 (555) 876-5432',
    unreadCount: 1,
    lastMessage: 'The new MagicOS 11 launcher update looks stunning!',
    time: '11:15 AM',
    messages: [
      { id: 'm3', sender: 'me', text: 'Did you check out the new iOS 27 toggles and editable notification panel?', time: '11:10 AM' },
      { id: 'm4', sender: 'them', text: 'The new MagicOS 11 launcher update looks stunning!', time: '11:15 AM' }
    ]
  },
  {
    id: 'c3',
    name: 'Google Verification',
    avatarColor: 'bg-indigo-600',
    phone: '22000',
    lastMessage: 'G-749201 is your Google verification code.',
    time: 'Yesterday',
    messages: [
      { id: 'm5', sender: 'them', text: 'G-749201 is your Google verification code. Do not share it with anyone.', time: 'Yesterday' }
    ]
  },
  {
    id: 'c4',
    name: 'David Chen',
    avatarColor: 'bg-amber-600',
    phone: '+1 (555) 345-9876',
    lastMessage: 'Sent you the project design files.',
    time: 'Oct 1',
    messages: [
      { id: 'm6', sender: 'them', text: 'Sent you the project design files. Let me know when you review them.', time: 'Oct 1' }
    ]
  }
];

export const MessagesApp: React.FC<MessagesAppProps> = ({ onClose, onOpenPhone }) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSelectConv = (id: string) => {
    triggerHaptic('tick');
    playTapSound(600);
    setActiveConvId(id);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConvId) return;
    triggerHaptic('doubleTick');
    playTapSound(700);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          time: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');

    // Realistic auto-reply simulation after 1.5 seconds
    setTimeout(() => {
      triggerHaptic('tick');
      playTapSound(600);
      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: 'Sounds great! Received your message on MagicOS.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: replyMsg.text,
            time: replyMsg.time,
            messages: [...c.messages, replyMsg]
          };
        }
        return c;
      }));
    }, 1500);
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-xl">
        {activeConv ? (
          <div className="flex items-center gap-3 flex-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                playTapSound(500);
                setActiveConvId(null);
              }}
              className="p-1 rounded-full hover:bg-white/10 active:scale-95 transition-all text-neutral-300"
            >
              <ArrowLeft size={20} />
            </button>
            <div className={`w-9 h-9 rounded-full ${activeConv.avatarColor} flex items-center justify-center font-bold text-sm shadow-md`}>
              {activeConv.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm text-white truncate">{activeConv.name}</h3>
              <p className="text-[10px] text-emerald-400 font-medium">RCS chat · Connected</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  if (onOpenPhone) onOpenPhone(activeConv.phone);
                }}
                className="p-2 rounded-full hover:bg-white/10 text-cyan-400"
                title="Call"
              >
                <Phone size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  playTapSound(600);
                }}
                className="p-2 rounded-full hover:bg-white/10 text-cyan-400"
                title="Video Call"
              >
                <Video size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                M
              </div>
              <h2 className="font-bold text-lg text-white">Messages</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Close Messages"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* 2. MAIN BODY */}
      {activeConv ? (
        /* CONVERSATION CHAT VIEW */
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-neutral-950">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] text-neutral-500 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
                End-to-end encrypted · Google Messages
              </span>
            </div>

            {activeConv.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs shadow-md leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-cyan-600 text-white rounded-br-xs'
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[9px] text-neutral-500 font-mono">{m.time}</span>
                  {m.sender === 'me' && <CheckCheck size={11} className="text-cyan-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-neutral-900 border-t border-neutral-800/80 flex items-center gap-2">
            <button
              type="button"
              onClick={() => triggerHaptic('tick')}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400"
            >
              <Image size={18} />
            </button>
            <input
              type="text"
              placeholder="Text message (RCS)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 px-4 py-2 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-full transition-all shadow-md ${
                inputText.trim()
                  ? 'bg-cyan-500 text-neutral-950 font-bold active:scale-95'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      ) : (
        /* CONVERSATIONS LIST VIEW */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 bg-neutral-900/50">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search conversations & contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-neutral-800 border border-neutral-700/60 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {filteredConversations.length === 0 ? (
              <div className="py-16 text-center text-neutral-500 text-xs">
                No messages found
              </div>
            ) : (
              filteredConversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConv(c.id)}
                  className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-neutral-900/80 cursor-pointer transition-colors active:bg-neutral-800/80"
                >
                  <div className={`w-11 h-11 rounded-full ${c.avatarColor} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-white truncate">{c.name}</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{c.lastMessage}</p>
                  </div>
                  {Boolean(c.unreadCount && c.unreadCount > 0) && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-neutral-950 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Floating Action Button: Start Chat */}
          <div className="p-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('doubleTick');
                playTapSound(600);
                if (conversations.length > 0) setActiveConvId(conversations[0].id);
              }}
              className="px-4 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-xl active:scale-95 transition-all"
            >
              <Plus size={16} strokeWidth={3} />
              <span>Start Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
