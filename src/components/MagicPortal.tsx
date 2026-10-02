import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Share2, 
  MessageSquare, 
  MapPin, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { playTapSound } from '../utils/sound';

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

  if (!isOpen) return null;

  const targets = [
    {
      id: 'notes',
      name: 'SUNNY Notes',
      desc: 'Save as new note',
      icon: FileText,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-400',
    },
    {
      id: 'yoyo',
      name: 'SUNNY Search',
      desc: 'AI visual & web search',
      icon: Search,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
    },
    {
      id: 'messages',
      name: 'Messages',
      desc: 'Share with contacts',
      icon: MessageSquare,
      color: 'from-sky-500 to-blue-500',
      textColor: 'text-sky-400',
    },
    {
      id: 'share',
      name: 'SUNNY Share',
      desc: 'Fast wireless transfer',
      icon: Share2,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
    },
    {
      id: 'browser',
      name: 'Browser',
      desc: 'Open web link',
      icon: MapPin,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
    },
  ];

  const handleSelect = (targetId: string, targetName: string) => {
    playTapSound(750, 0.05);
    const content = draggedContent || 'SUNNY MagicOS 11 Selection';
    setToastMessage(`Transferred to ${targetName} via Magic Portal!`);
    setTimeout(() => {
      onDropAction(targetId, content);
      onClose();
      setToastMessage(null);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-end"
      onClick={onClose}
    >
      {/* Dim backdrop with subtle gradient glow */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"></div>

      {/* Floating Magic Portal Arc */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-72 h-[82%] max-h-[560px] mr-2 rounded-[32px] bg-neutral-900/90 border border-neutral-700/80 shadow-2xl p-4 flex flex-col justify-between backdrop-blur-xl animate-in slide-in-from-right duration-300 ring-2 ring-cyan-500/20"
      >
        {/* Magic Portal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Magic Portal</h3>
              <p className="text-[10px] text-cyan-400">SUNNY AI Intent Engine</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-md bg-neutral-800/80"
          >
            Close
          </button>
        </div>

        {/* Dragged item preview */}
        <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-2.5 my-2">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
            Dragged Content
          </span>
          <p className="text-xs text-neutral-200 font-medium truncate">
            {draggedContent || 'Selected text / item from screen'}
          </p>
        </div>

        {/* Destination Portals List */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar py-1">
          <span className="text-[11px] text-neutral-400 font-medium">Drop or tap target service:</span>
          {targets.map((tgt) => {
            const Icon = tgt.icon;
            const isHover = hoveredTarget === tgt.id;
            return (
              <div
                key={tgt.id}
                onMouseEnter={() => setHoveredTarget(tgt.id)}
                onMouseLeave={() => setHoveredTarget(null)}
                onClick={() => handleSelect(tgt.id, tgt.name)}
                className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-150 border ${
                  isHover
                    ? 'bg-neutral-800 border-cyan-500/60 translate-x-[-2px] shadow-lg'
                    : 'bg-neutral-800/40 border-neutral-700/40 hover:bg-neutral-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tgt.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{tgt.name}</h4>
                    <p className="text-[10px] text-neutral-400">{tgt.desc}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-500 group-hover:text-cyan-400" />
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="pt-2 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-500">
            MagicOS 11 · Any-door one-step sharing
          </p>
        </div>

        {/* Success toast */}
        {toastMessage && (
          <div className="absolute inset-0 bg-neutral-950/90 rounded-[32px] flex flex-col items-center justify-center gap-2 text-center p-4 z-20">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Check size={24} />
            </div>
            <p className="text-sm font-semibold text-white">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
