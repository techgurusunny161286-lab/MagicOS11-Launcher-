import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  CheckCheck, 
  ArrowLeft,
  MessageSquare,
  Users,
  CircleDot,
  PhoneCall
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface WhatsAppAppProps {
  onClose: () => void;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: { id: string; sender: 'me' | 'them'; text: string; time: string }[];
}

const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: '1',
    name: 'Sunny Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    lastMessage: 'MagicOS 11 feels super smooth on touch!',
    time: '10:42 AM',
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey! Did you check out the new MagicOS 11 update?', time: '10:40 AM' },
      { id: 'm2', sender: 'me', text: 'Yes, the tactile haptics and real-time clock & weather are insane!', time: '10:41 AM' },
      { id: 'm3', sender: 'them', text: 'MagicOS 11 feels super smooth on touch!', time: '10:42 AM' },
    ],
  },
  {
    id: '2',
    name: 'MagicOS Engineering Lab',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    lastMessage: 'All third-party and system APIs integrated successfully.',
    time: '09:15 AM',
    unread: 0,
    online: true,
    messages: [
      { id: 'm1', sender: 'them', text: 'Release Candidate deployed for live test.', time: '09:12 AM' },
      { id: 'm2', sender: 'them', text: 'All third-party and system APIs integrated successfully.', time: '09:15 AM' },
    ],
  },
  {
    id: '3',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    lastMessage: 'See you at the conference today!',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', sender: 'them', text: 'Are we still meeting at 3 PM?', time: 'Yesterday' },
      { id: 'm2', sender: 'me', text: 'Yes, looking forward to it.', time: 'Yesterday' },
      { id: 'm3', sender: 'them', text: 'See you at the conference today!', time: 'Yesterday' },
    ],
  },
  {
    id: '4',
    name: 'Mom ❤️',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    lastMessage: 'Have a wonderful day beta!',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', sender: 'them', text: 'Have a wonderful day beta!', time: 'Yesterday' },
    ],
  },
];

export const WhatsAppApp: React.FC<WhatsAppAppProps> = ({ onClose }) => {
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'updates' | 'calls'>('chats');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    triggerHaptic('smooth');
    playTapSound(700);

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedContact = {
      ...activeContact,
      lastMessage: newMsg.text,
      time: newMsg.time,
      messages: [...activeContact.messages, newMsg],
    };

    setContacts(prev => prev.map(c => c.id === activeContact.id ? updatedContact : c));
    setActiveContact(updatedContact);
    setInputText('');

    // Simulate instant intelligent response
    setTimeout(() => {
      triggerHaptic('tick');
      playTapSound(600);
      const responses = [
        "Awesome! That sounds great.",
        "Got it, thanks for the update!",
        "Perfect, let's sync up soon.",
        "MagicOS is really fast and responsive!",
        "Agreed! Have a wonderful day."
      ];
      const botReply = {
        id: `reply-${Date.now()}`,
        sender: 'them' as const,
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setContacts(prev => prev.map(c => {
        if (c.id === activeContact.id) {
          return {
            ...c,
            lastMessage: botReply.text,
            time: botReply.time,
            messages: [...c.messages, botReply],
          };
        }
        return c;
      }));

      setActiveContact(prev => prev ? {
        ...prev,
        lastMessage: botReply.text,
        time: botReply.time,
        messages: [...prev.messages, botReply],
      } : null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111b21] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* If in active chat */}
      {activeContact ? (
        <div className="flex flex-col h-full bg-[#0b141a]">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-3 pt-4 pb-3 bg-[#202c33] border-b border-neutral-700/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTapSound(500);
                  setActiveContact(null);
                }}
                className="p-1 text-neutral-300 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-700">
                <img src={activeContact.avatar} alt={activeContact.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-xs font-bold text-white block">{activeContact.name}</span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {activeContact.online ? 'Online' : 'Last seen recently'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-300">
              <button type="button" onClick={() => playTapSound(600)} className="hover:text-emerald-400">
                <Video size={18} />
              </button>
              <button type="button" onClick={() => playTapSound(600)} className="hover:text-emerald-400">
                <Phone size={16} />
              </button>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[radial-gradient(#202c33_1px,transparent_1px)] [background-size:16px_16px]">
            {activeContact.messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs shadow ${
                      isMe
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : 'bg-[#202c33] text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-white/60">
                      <span>{m.time}</span>
                      {isMe && <CheckCheck size={12} className="text-cyan-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-2 bg-[#202c33] flex items-center gap-2">
            <button type="button" className="p-2 text-neutral-400 hover:text-white">
              <Smile size={20} />
            </button>
            <button type="button" className="p-2 text-neutral-400 hover:text-white">
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full bg-[#2a3942] text-xs text-white placeholder-neutral-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-[#00a884] disabled:opacity-40 text-black flex items-center justify-center font-bold active:scale-95 transition-all shadow"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        /* Contacts & Chats Main List */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-5 pt-4 pb-2 bg-[#202c33] flex items-center justify-between">
            <span className="text-base font-extrabold text-[#00a884] tracking-tight">WhatsApp</span>
            <div className="flex items-center gap-3 text-neutral-300">
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-700 bg-[#202c33] text-xs font-bold text-neutral-400">
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'chats' ? 'text-[#00a884] border-b-2 border-[#00a884]' : ''
              }`}
            >
              Chats
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('updates')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'updates' ? 'text-[#00a884] border-b-2 border-[#00a884]' : ''
              }`}
            >
              Updates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calls')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'calls' ? 'text-[#00a884] border-b-2 border-[#00a884]' : ''
              }`}
            >
              Calls
            </button>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-neutral-800">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  triggerHaptic('click');
                  playTapSound(600);
                  setActiveContact(contact);
                }}
                className="flex items-center gap-3 p-3.5 hover:bg-[#202c33] cursor-pointer transition-colors"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-700 shrink-0">
                  <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111b21]"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{contact.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{contact.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{contact.lastMessage}</p>
                </div>

                {contact.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#00a884] text-black font-extrabold text-[10px] flex items-center justify-center shrink-0">
                    {contact.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
