import React from 'react';
import { Flame, Footprints, Timer, Heart } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

interface HealthWidgetProps {
  onOpenHealth?: () => void;
}

export const HealthWidget: React.FC<HealthWidgetProps> = ({ onOpenHealth }) => {
  const steps = 7420;
  const goalSteps = 10000;
  const stepPercent = Math.min(100, Math.round((steps / goalSteps) * 100));

  const calories = 485;
  const activeMinutes = 42;

  return (
    <div
      onClick={() => {
        playTapSound(600);
        if (onOpenHealth) onOpenHealth();
      }}
      className="w-full h-full rounded-[28px] bg-white/15 dark:bg-black/35 backdrop-blur-xl border border-white/20 dark:border-white/10 p-3.5 flex flex-col justify-between text-white shadow-lg cursor-pointer hover:border-white/30 transition-all select-none relative group"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Heart size={14} className="text-rose-400 fill-rose-500" />
          <span className="text-xs font-semibold tracking-tight text-white/90">SUNNY Health</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono font-medium">{stepPercent}%</span>
      </div>

      {/* Center rings & Steps */}
      <div className="flex items-center justify-between my-1">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {steps.toLocaleString()}
            </span>
            <span className="text-[10px] text-white/60">/ 10k</span>
          </div>
          <span className="text-[10px] text-white/70 block">Daily Steps</span>
        </div>

        {/* SUNNY 3 Concentric Activity Rings SVG */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
            {/* Background tracks */}
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />

            {/* Move (Red/Coral) */}
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 * (1 - 0.74)}
              strokeLinecap="round"
            />
            {/* Exercise (Yellow/Amber) */}
            <circle
              cx="20"
              cy="20"
              r="12"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray="75.4"
              strokeDashoffset={75.4 * (1 - 0.85)}
              strokeLinecap="round"
            />
            {/* Stand (Cyan) */}
            <circle
              cx="20"
              cy="20"
              r="8"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeDasharray="50.2"
              strokeDashoffset={50.2 * (1 - 0.65)}
              strokeLinecap="round"
            />
          </svg>
          <Footprints size={12} className="absolute text-white/80" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/80">
        <div className="flex items-center gap-1">
          <Flame size={11} className="text-rose-400" />
          <span>{calories} kcal</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer size={11} className="text-amber-400" />
          <span>{activeMinutes} min</span>
        </div>
      </div>
    </div>
  );
};
