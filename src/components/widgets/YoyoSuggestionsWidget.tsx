import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  Headphones, 
  Navigation, 
  ArrowRight, 
  Check, 
  Plane, 
  Calendar, 
  CloudSun, 
  ChevronRight,
  ChevronLeft,
  Volume2
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface SunnySuggestionsWidgetProps {
  onOpenApp?: (app: string) => void;
  onOpenSunnyAssistant?: () => void;
  onOpenYoyoAssistant?: () => void;
}

export const SunnySuggestionsWidget: React.FC<SunnySuggestionsWidgetProps> = ({
  onOpenApp,
  onOpenSunnyAssistant,
  onOpenYoyoAssistant
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cleaned, setCleaned] = useState(false);
  const [ancMode, setAncMode] = useState<'anc' | 'transparency' | 'off'>('anc');

  const handleQuickOptimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('doubleTick');
    playTapSound(800, 0.05);
    setCleaned(true);
    setTimeout(() => setCleaned(false), 3000);
  };

  const handleOpen = () => {
    triggerHaptic('tick');
    if (onOpenSunnyAssistant) onOpenSunnyAssistant();
    else if (onOpenYoyoAssistant) onOpenYoyoAssistant();
  };

  const nextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('tick');
    playTapSound(600);
    setActiveCardIndex(prev => (prev + 1) % 4);
  };

  const prevCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('tick');
    playTapSound(600);
    setActiveCardIndex(prev => (prev - 1 + 4) % 4);
  };

  return (
    <div 
      className="w-full rounded-[30px] bg-gradient-to-r from-neutral-900/90 via-slate-900/85 to-indigo-950/85 backdrop-blur-2xl border border-white/20 p-4 text-white shadow-xl select-none relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-8 -right-8 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div 
          onClick={handleOpen}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-amber-300 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center">
              <Sparkles size={13} className="text-cyan-400 animate-spin [animation-duration:12s]" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              YOYO Suggestions <span className="text-[9px] font-mono text-cyan-300 px-1.5 py-0.2 rounded-full bg-cyan-500/20 border border-cyan-400/40">AI 11</span>
            </h4>
          </div>
        </div>

        {/* Carousel indicators & navigation */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCardIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeCardIndex === idx ? 'w-4 bg-cyan-400' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
          <button 
            type="button" 
            onClick={nextCard} 
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Next Suggestion"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Dynamic Multi-Card Carousel */}
      <div className="min-h-[72px]">
        {/* CARD 0: DAILY AI BRIEFING */}
        {activeCardIndex === 0 && (
          <div 
            onClick={handleOpen}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                <CloudSun size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Sunny & Mild · 24°C</span>
                  <span className="text-[10px] text-cyan-400 font-mono">AQI 28 Excellent</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-0.5 truncate max-w-[210px]">
                  Next: Tech Architecture Review at 3:30 PM
                </p>
              </div>
            </div>
            <ArrowRight size={14} className="text-neutral-400 shrink-0" />
          </div>
        )}

        {/* CARD 1: LIVE TRAVEL & FLIGHT TRACKER */}
        {activeCardIndex === 1 && (
          <div 
            onClick={() => onOpenApp?.('weather')}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
                <Plane size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Flight CA1832 · PEK → SHA</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1 rounded">On Time</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Gate B12 · Boarding in 25 mins · Seat 12A
                </p>
              </div>
            </div>
            <ArrowRight size={14} className="text-neutral-400 shrink-0" />
          </div>
        )}

        {/* CARD 2: CONNECTED EARBUDS 3 PRO */}
        {activeCardIndex === 2 && (
          <div 
            onClick={() => onOpenApp?.('music')}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-400/30">
                <Headphones size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Earbuds 3 Pro</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">98% Battery</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {(['anc', 'transparency', 'off'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('tick');
                        setAncMode(m);
                      }}
                      className={`text-[9px] px-2 py-0.5 rounded-full capitalize transition-all ${
                        ancMode === m 
                          ? 'bg-cyan-500 text-neutral-950 font-bold' 
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {m === 'anc' ? 'Noise Cancelling' : m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CARD 3: RAM TURBO 16GB ONE-TAP OPTIMIZER */}
        {activeCardIndex === 3 && (
          <div 
            onClick={handleQuickOptimize}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                {cleaned ? <Check size={20} className="text-emerald-400" /> : <Zap size={20} className="fill-amber-400" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">MagicOS RAM Turbo</span>
                  <span className="text-[10px] text-amber-300 font-mono">16GB + 8GB Virtual</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  {cleaned ? 'Purged 1.8GB cache · System at peak 120Hz' : 'Tap to optimize RAM & clear background processes'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                cleaned ? 'bg-emerald-500 text-neutral-950' : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400'
              }`}
            >
              {cleaned ? 'Done' : 'Boost'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const YoyoSuggestionsWidget = SunnySuggestionsWidget;
