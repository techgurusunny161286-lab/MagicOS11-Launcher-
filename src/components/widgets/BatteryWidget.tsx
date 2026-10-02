import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface BatteryWidgetProps {
  onOpenSettings?: () => void;
  batteryLevel?: number;
  isCharging?: boolean;
}

export const BatteryWidget: React.FC<BatteryWidgetProps> = ({
  onOpenSettings,
  batteryLevel = 80,
  isCharging = false
}) => {
  return (
    <div
      onClick={() => {
        triggerHaptic('tick');
        onOpenSettings?.();
      }}
      className="w-full h-full rounded-[28px] bg-white/15 dark:bg-black/40 backdrop-blur-2xl border-t border-t-white/50 border-b-[2px] border-b-black/40 shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_1.5px_2px_rgba(255,255,255,0.3)] p-3 flex items-center justify-between text-white select-none cursor-pointer hover:border-emerald-400/40 transition-all group"
    >
      {/* 3D Circular Energy Ring */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-1 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.4)] relative">
        <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center border border-white/20">
          <Zap size={20} className="text-emerald-400 fill-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Battery Information */}
      <div className="text-left flex-1 pl-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
          Battery
        </span>
        <h3 className="text-xl font-black text-white font-mono leading-none my-0.5">
          {batteryLevel}%
        </h3>
        <span className="text-[10px] text-neutral-300">
          {isCharging ? 'SuperCharging 100W' : 'Not charging'}
        </span>
      </div>
    </div>
  );
};
