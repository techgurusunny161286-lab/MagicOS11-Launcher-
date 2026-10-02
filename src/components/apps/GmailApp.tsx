import React, { useState } from 'react';
import { X, Search, Mail, Edit3, ArrowLeft, Star, Trash2, Archive, Send, Paperclip } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface GmailAppProps {
  onClose: () => void;
}

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  time: string;
  unread: boolean;
  avatarBg: string;
  category: 'primary' | 'social' | 'promotions';
}

const INITIAL_EMAILS: Email[] = [
  {
    id: 'e1',
    sender: 'Google Security',
    senderEmail: 'no-reply@accounts.google.com',
    subject: 'Security alert: New sign-in on Honor Magic6 Pro',
    snippet: 'Your Google Account was successfully signed in on a new device...',
    body: 'We noticed a new sign-in to your Google Account on an Honor Magic6 Pro running MagicOS 11. If this was you, you don’t need to do anything. If not, we will help you secure your account.',
    time: '12:30 PM',
    unread: true,
    avatarBg: 'bg-red-600',
    category: 'primary'
  },
  {
    id: 'e2',
    sender: 'Honor Cloud Team',
    senderEmail: 'cloud-team@honor.com',
    subject: 'MagicRing multi-device collaboration is now ready',
    snippet: 'Connect your tablet, PC, and smartphone with seamless one-drag transfer...',
    body: 'Welcome to MagicRing on MagicOS 11. Seamlessly share your clipboard, notifications, and camera feeds across your personal devices with zero latency.',
    time: '10:15 AM',
    unread: true,
    avatarBg: 'bg-blue-600',
    category: 'primary'
  },
  {
    id: 'e3',
    sender: 'GitHub',
    senderEmail: 'notifications@github.com',
    subject: '[GitHub] Release v2.4.0 published successfully',
    snippet: 'Your release is now live with 14 updated assets and changelog notes...',
    body: 'The new release has been deployed to the CDN. All automated CI/CD test suites completed with 0 errors.',
    time: 'Yesterday',
    unread: false,
    avatarBg: 'bg-neutral-800',
    category: 'primary'
  },
  {
    id: 'e4',
    sender: 'Spotify',
    senderEmail: 'discover@spotify.com',
    subject: 'Your Release Radar is ready',
    snippet: 'Fresh music picked just for you including new releases from your favorite artists...',
    body: 'Listen to 30 new tracks personalized to your weekly listening habits on Spotify.',
    time: 'Sep 30',
    unread: false,
    avatarBg: 'bg-emerald-600',
    category: 'social'
  }
];

export const GmailApp: React.FC<GmailAppProps> = ({ onClose }) => {
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [activeTab, setActiveTab] = useState<'primary' | 'social' | 'promotions'>('primary');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const handleSendEmail = () => {
    if (!composeTo.trim() || !composeSubject.trim()) return;
    triggerHaptic('doubleTick');
    playTapSound(700);

    const sentEmail: Email = {
      id: `sent-${Date.now()}`,
      sender: 'Me',
      senderEmail: 'techgurusunny@gmail.com',
      subject: composeSubject.trim(),
      snippet: composeBody.slice(0, 60),
      body: composeBody.trim(),
      time: 'Just now',
      unread: false,
      avatarBg: 'bg-cyan-600',
      category: 'primary'
    };

    setEmails(prev => [sentEmail, ...prev]);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setIsComposing(false);
  };

  const filtered = emails.filter(e => {
    const matchesTab = e.category === activeTab;
    const matchesSearch = !searchQuery || e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || e.sender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        {selectedEmail ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setSelectedEmail(null);
              }}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-300"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-sm text-white">Back to Inbox</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
              <Mail size={16} />
            </div>
            <h2 className="font-bold text-base text-white">Gmail</h2>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {selectedEmail ? (
        /* EMAIL DETAILS VIEW */
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950">
          <div className="border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-white leading-snug">{selectedEmail.subject}</h3>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${selectedEmail.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {selectedEmail.sender.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{selectedEmail.sender}</h4>
                  <p className="text-[10px] text-neutral-400">{selectedEmail.senderEmail}</p>
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">{selectedEmail.time}</span>
            </div>
          </div>

          <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {selectedEmail.body}
          </div>
        </div>
      ) : (
        /* INBOX LIST VIEW */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 bg-neutral-900/60 border-b border-neutral-800/80">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-neutral-800 border border-neutral-700/60 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Categories Tab */}
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900/40 border-b border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('primary')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                activeTab === 'primary' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Primary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                activeTab === 'social' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Social
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('promotions')}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                activeTab === 'promotions' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Promotions
            </button>
          </div>

          {/* Emails List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-500">
                Inbox is clean
              </div>
            ) : (
              filtered.map((email) => (
                <div
                  key={email.id}
                  onClick={() => {
                    triggerHaptic('tick');
                    playTapSound(600);
                    setSelectedEmail(email);
                    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, unread: false } : e));
                  }}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-neutral-900 cursor-pointer transition-colors ${
                    email.unread ? 'bg-neutral-900/40' : ''
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full ${email.avatarBg} flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-md`}>
                    {email.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={`text-xs truncate ${email.unread ? 'font-bold text-white' : 'font-medium text-neutral-300'}`}>
                        {email.sender}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">{email.time}</span>
                    </div>
                    <p className={`text-xs truncate ${email.unread ? 'font-semibold text-neutral-100' : 'text-neutral-300'}`}>
                      {email.subject}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{email.snippet}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Compose Button */}
          <div className="p-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('doubleTick');
                playTapSound(600);
                setIsComposing(true);
              }}
              className="px-4 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-xl active:scale-95 transition-all"
            >
              <Edit3 size={15} />
              <span>Compose</span>
            </button>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {isComposing && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xl flex flex-col justify-end p-4 animate-in fade-in"
          onClick={() => setIsComposing(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] mx-auto bg-neutral-900 border border-neutral-700/80 rounded-[32px] p-5 flex flex-col gap-3 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Compose Email</h3>
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            <input
              type="email"
              placeholder="To: (recipient email)"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Subject"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
            />
            <textarea
              rows={4}
              placeholder="Compose your message here..."
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400 resize-none"
            />

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={!composeTo.trim() || !composeSubject.trim()}
              className="w-full py-2.5 rounded-xl bg-rose-500 disabled:opacity-50 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Send size={14} />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
