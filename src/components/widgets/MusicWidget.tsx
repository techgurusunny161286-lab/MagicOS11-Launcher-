import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface MusicWidgetProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrack?: { title: string; artist: string };
  onOpenApp?: () => void;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  isPlaying,
  onTogglePlay,
  currentTrack = { title: 'Play your world', artist: 'Sunny UI' },
  onOpenApp
}) => {
  return (
    <div
      onClick={() => {
        triggerHaptic('tick');
        onOpenApp?.();
      }}
      className="w-full h-full rounded-[28px] bg-white/15 dark:bg-black/40 backdrop-blur-2xl border-t border-t-white/50 border-b-[2px] border-b-black/40 shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_1.5px_2px_rgba(255,255,255,0.3)] p-3 flex flex-col justify-between text-white select-none cursor-pointer hover:border-cyan-400/40 transition-all group"
    >
      <div className="flex items-center gap-2.5">
        {/* Album Artwork */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-indigo-700 p-0.5 flex items-center justify-center shadow-lg relative overflow-hidden shrink-0 border border-white/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 to-transparent"></div>
          <Music size={18} className="text-white drop-shadow" />
        </div>

        {/* Track info */}
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 block">
            Music
          </span>
          <h4 className="text-xs font-bold text-white truncate">{currentTrack.title}</h4>
          {/* Animated waveform bars */}
          <div className="flex items-end gap-0.5 h-2.5 mt-1">
            <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlaying ? 'h-2.5 animate-pulse' : 'h-1'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlaying ? 'h-1.5 animate-bounce' : 'h-1'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1.5'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlaying ? 'h-2 animate-bounce' : 'h-1'}`}></span>
            <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlaying ? 'h-2.5 animate-pulse' : 'h-1'}`}></span>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between px-2 pt-1 border-t border-white/10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('tick');
            playTapSound(500);
          }}
          className="text-white/70 hover:text-white transition-colors"
          title="Previous"
        >
          <SkipBack size={14} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('doubleTick');
            playTapSound(700);
            onTogglePlay();
          }}
          className="w-7 h-7 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-md active:scale-90 transition-transform"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={12} className="fill-neutral-950" /> : <Play size={12} className="fill-neutral-950 translate-x-0.5" />}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('tick');
            playTapSound(600);
          }}
          className="text-white/70 hover:text-white transition-colors"
          title="Next"
        >
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
};
