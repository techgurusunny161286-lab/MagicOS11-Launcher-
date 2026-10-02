import React from 'react';
import { Trash2, X, Smartphone, Sparkles } from 'lucide-react';
import { ActiveApp } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { playTapSound } from '../utils/sound';

interface RecentAppsProps {
  isOpen: boolean;
  onClose: () => void;
  openApps: string[];
  onSelectApp: (app: string) => void;
  onCloseApp: (app: string) => void;
  onClearAll: () => void;
}

export const RecentApps: React.FC<RecentAppsProps> = ({
  isOpen,
  onClose,
  openApps,
  onSelectApp,
  onCloseApp,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex flex-col justify-between p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs text-white/80 pt-2 px-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5 font-semibold">
          <Sparkles size={14} className="text-cyan-400" />
          <span>RAM Turbo: 16GB + 8GB Active</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* App Cards Horizontal Carousel */}
      <div 
        className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar py-6 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {openApps.length === 0 ? (
          <div className="mx-auto text-center text-neutral-400 text-xs">
            No recent apps in memory
          </div>
        ) : (
          openApps.map((appId) => (
            <div
              key={appId}
              onClick={() => {
                playTapSound(600);
                onSelectApp(appId);
              }}
              className="w-64 h-96 rounded-[32px] bg-neutral-900 border border-neutral-700/80 shadow-2xl flex flex-col overflow-hidden shrink-0 cursor-pointer hover:border-cyan-400/50 hover:scale-[1.02] transition-all group"
            >
              {/* App Card Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-neutral-800 bg-neutral-950/60">
                <div className="flex items-center gap-2">
                  <AppIcon iconName={appId} size="mini" isDraggable={false} />
                  <span className="text-xs font-bold text-white capitalize">{appId}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTapSound(500);
                    onCloseApp(appId);
                  }}
                  className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-rose-400"
                >
                  <X size={12} />
                </button>
              </div>

              {/* App Card Viewport Preview Mock */}
              <div className="flex-1 bg-gradient-to-br from-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-4 text-center">
                <AppIcon iconName={appId} size="lg" isDraggable={false} />
                <p className="text-xs text-neutral-400 mt-3 font-medium capitalize">
                  SUNNY {appId}
                </p>
                <span className="text-[10px] text-cyan-400/80 mt-1">Tap card to resume</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Clear All Button */}
      <div className="flex justify-center pb-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => {
            playTapSound(700, 0.05);
            onClearAll();
            onClose();
          }}
          disabled={openApps.length === 0}
          className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-md border border-white/20 shadow-xl disabled:opacity-40 transition-all"
        >
          <Trash2 size={16} className="text-rose-400" />
          <span>Clear All ({openApps.length})</span>
        </button>
      </div>
    </div>
  );
};
