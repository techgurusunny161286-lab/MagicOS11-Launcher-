import React, { useState } from 'react';
import { Sparkles, Zap, Headphones, Navigation, ArrowRight, Check } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

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
  const [cleaned, setCleaned] = useState(false);

  const handleQuickOptimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound(800, 0.05);
    setCleaned(true);
    setTimeout(() => setCleaned(false), 3000);
  };

  const handleOpen = () => {
    if (onOpenSunnyAssistant) onOpenSunnyAssistant();
    else if (onOpenYoyoAssistant) onOpenYoyoAssistant();
  };

  return (
    <div 
      onClick={() => {
        playTapSound(650);
        handleOpen();
      }}
      className="w-full rounded-[28px] bg-gradient-to-r from-neutral-900/80 via-indigo-950/70 to-slate-900/80 backdrop-blur-xl border border-white/20 p-4 text-white shadow-lg cursor-pointer hover:border-cyan-500/40 transition-all select-none relative overflow-hidden"
    >
      {/* Background ambient pulse */}
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-cyan-500/15 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-400 to-amber-300 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center">
              <Sparkles size={11} className="text-cyan-400 animate-spin [animation-duration:10s]" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide flex items-center gap-1">
              SUNNY Suggestions <span className="text-[9px] font-normal text-cyan-400 font-mono">AI 11</span>
            </h4>
          </div>
        </div>
        <div className="text-[10px] text-neutral-400 flex items-center gap-1">
          <span>Smart Life</span>
          <ArrowRight size={10} />
        </div>
      </div>

      {/* Suggestion Content Carousel / Grid */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* Suggestion 1: Audio / Commute */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenApp) onOpenApp('music');
          }}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Headphones size={15} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-neutral-400 block truncate">Bluetooth Earphones</span>
            <h5 className="text-[11px] font-semibold text-white truncate">SUNNY Symphony</h5>
          </div>
        </div>

        {/* Suggestion 2: MagicOS RAM Optimizer */}
        <div 
          onClick={handleQuickOptimize}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              {cleaned ? <Check size={15} className="text-emerald-400" /> : <Zap size={15} />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-neutral-400 block truncate">RAM Turbo 8GB</span>
              <h5 className="text-[11px] font-semibold text-white truncate">
                {cleaned ? 'Optimized!' : 'Boost Performance'}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const YoyoSuggestionsWidget = SunnySuggestionsWidget;
