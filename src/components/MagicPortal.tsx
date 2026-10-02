import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Share2, 
  MessageSquare, 
  MapPin, 
  Check, 
  Sparkles,
  ArrowRight,
  Laptop,
  Camera,
  Compass,
  Zap,
  Globe
} from 'lucide-react';
import { playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

interface MagicPortalProps {
  isOpen: boolean;
  onClose: () => void;
  draggedContent: string | null;
  onDropAction: (targetApp: string, content: string) => void;
}

export const MagicPortal: React.FC<MagicPortalProps> = ({
  isOpen,
  onClose,
  draggedContent,
  onDropAction,
}) => {
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'share' | 'travel'>('all');

  // AI Intent Analysis Engine
  const aiIntent = useMemo(() => {
    if (!draggedContent) return { type: 'general', label: 'MagicOS AI General Intent', recommendedApp: 'yoyo' };
    const lower = draggedContent.toLowerCase();

    if (lower.includes('road') || lower.includes('street') || lower.includes('avenue') || lower.includes('airport') || lower.includes('hotel') || lower.includes('park') || lower.includes('st.') || lower.includes('ave') || lower.includes('station') || lower.includes('map')) {
      return {
        type: 'location',
        label: 'Detected Location · One-Step Navigation Intent',
        recommendedApp: 'maps'
      };
    }
    if (lower.includes('http') || lower.includes('www.') || lower.includes('.com') || lower.includes('.org') || lower.includes('.net')) {
      return {
        type: 'link',
        label: 'Detected URL · Instant Browser & Read Later Intent',
        recommendedApp: 'browser'
      };
    }
    if (lower.includes('photo') || lower.includes('image') || lower.includes('pic') || lower.includes('camera') || lower.includes('scan')) {
      return {
        type: 'media',
        label: 'Detected Media · Multimodal Visual Search Intent',
        recommendedApp: 'yoyo'
      };
    }
    if (lower.includes('meeting') || lower.includes('tomorrow') || lower.includes('call') || lower.includes('phone') || lower.includes('hello') || lower.includes('schedule')) {
      return {
        type: 'communication',
        label: 'Detected Conversation · Instant Chat & Scheduling Intent',
        recommendedApp: 'messages'
      };
    }
    return {
      type: 'productivity',
      label: 'Detected Text · Smart Notes & YOYO Analysis Intent',
      recommendedApp: 'notes'
    };
  }, [draggedContent]);

  if (!isOpen) return null;

  const targets = [
    {
      id: 'maps',
      name: 'Navigation & Maps',
      desc: 'One-step route & traffic ETA',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
      category: 'travel',
      highlight: aiIntent.recommendedApp === 'maps'
    },
    {
      id: 'yoyo',
      name: 'YOYO Visual Search',
      desc: 'MagicOS 11 Multimodal AI Search',
      icon: Search,
      color: 'from-cyan-500 to-blue-600',
      category: 'ai',
      highlight: aiIntent.recommendedApp === 'yoyo'
    },
    {
      id: 'magicring',
      name: 'MagicRing Cross-Device',
      desc: 'Push to MagicBook Pro & MagicPad',
      icon: Laptop,
      color: 'from-indigo-500 to-purple-600',
      category: 'share',
      highlight: false
    },
    {
      id: 'messages',
      name: 'Messages & Social',
      desc: 'Send to contacts or WhatsApp',
      icon: MessageSquare,
      color: 'from-sky-500 to-blue-500',
      category: 'share',
      highlight: aiIntent.recommendedApp === 'messages'
    },
    {
      id: 'notes',
      name: 'Magic Notes',
      desc: 'Save to rich Markdown clip',
      icon: FileText,
      color: 'from-amber-500 to-amber-600',
      category: 'ai',
      highlight: aiIntent.recommendedApp === 'notes'
    },
    {
      id: 'browser',
      name: 'Smart Browser',
      desc: 'Open link with AI summary',
      icon: Globe,
      color: 'from-blue-600 to-indigo-700',
      category: 'travel',
      highlight: aiIntent.recommendedApp === 'browser'
    },
  ];

  const filteredTargets = targets.filter(t => activeCategory === 'all' || t.category === activeCategory);

  const handleSelect = (targetId: string, targetName: string) => {
    triggerHaptic('doubleTick');
    playTapSound(750, 0.05);
    const content = draggedContent || 'MagicOS 11 Selection';
    setToastMessage(`Routed to ${targetName} via Magic Portal!`);
    setTimeout(() => {
      onDropAction(targetId, content);
      onClose();
      setToastMessage(null);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-end select-none"
      onClick={onClose}
    >
      {/* Dim backdrop with subtle gradient glow */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md transition-opacity"></div>

      {/* Floating Magic Portal Arc (Right Bezel Curved Screen Signature) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-80 h-[88%] max-h-[640px] mr-2 rounded-[36px] bg-neutral-900/95 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-4 flex flex-col justify-between backdrop-blur-2xl animate-in slide-in-from-right duration-300 ring-2 ring-cyan-400/40"
      >
        {/* Magic Portal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-neutral-950 shadow-md">
              <Sparkles size={16} className="fill-neutral-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                Magic Portal <span className="text-[10px] font-mono text-cyan-400 px-1 py-0.2 rounded bg-cyan-500/20">任意门</span>
              </h3>
              <p className="text-[10px] text-neutral-300">MagicOS 11 AI Intent Recognition</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => {
              triggerHaptic('tick');
              onClose();
            }}
            className="text-xs text-neutral-300 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>

        {/* AI Intent Prediction Banner */}
        <div className="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-400/40 rounded-2xl p-2.5 my-2 shadow-inner">
          <div className="flex items-center gap-1.5 text-cyan-300 text-[11px] font-bold">
            <Zap size={13} className="fill-cyan-300" />
            <span>{aiIntent.label}</span>
          </div>
          <p className="text-xs text-neutral-200 font-medium truncate mt-1">
            "{draggedContent || 'Selected text or photo from screen'}"
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl mb-1 text-[11px]">
          {(['all', 'ai', 'share', 'travel'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setActiveCategory(cat);
              }}
              className={`flex-1 py-1 rounded-lg capitalize transition-all text-center ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All' : cat === 'ai' ? 'YOYO' : cat === 'share' ? 'Share' : 'Travel'}
            </button>
          ))}
        </div>

        {/* Destination Portals List */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar py-1">
          {filteredTargets.map((tgt) => {
            const Icon = tgt.icon;
            const isHover = hoveredTarget === tgt.id;
            return (
              <div
                key={tgt.id}
                onMouseEnter={() => {
                  setHoveredTarget(tgt.id);
                  playTapSound(800, 0.02);
                }}
                onMouseLeave={() => setHoveredTarget(null)}
                onClick={() => handleSelect(tgt.id, tgt.name)}
                className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-150 border ${
                  tgt.highlight
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] translate-x-[-2px]'
                    : isHover
                      ? 'bg-white/10 border-white/30 translate-x-[-2px]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${tgt.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                    <Icon size={19} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{tgt.name}</h4>
                      {tgt.highlight && (
                        <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/30 px-1.5 py-0.2 rounded-full border border-cyan-400/50">
                          AI Best Match
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-300">{tgt.desc}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-400 group-hover:text-cyan-400" />
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="pt-2 border-t border-white/10 text-center">
          <p className="text-[10px] text-neutral-400">
            MagicOS 11 · Drag to right bezel for instant service hopping
          </p>
        </div>

        {/* Success toast */}
        {toastMessage && (
          <div className="absolute inset-0 bg-neutral-950/95 rounded-[36px] flex flex-col items-center justify-center gap-2 text-center p-4 z-20 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/50 shadow-lg">
              <Check size={28} />
            </div>
            <p className="text-sm font-bold text-white">{toastMessage}</p>
            <span className="text-xs text-cyan-300 font-mono">MagicOS 11 Intent Handled</span>
          </div>
        )}
      </div>
    </div>
  );
};
