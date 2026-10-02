import React, { useState, useEffect } from 'react';
import { Calendar, BellRing, Globe, Sun, Moon } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface ClockWidgetProps {
  onOpenClock?: () => void;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ onOpenClock }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}`;

  const isDay = time.getHours() >= 6 && time.getHours() < 18;

  // Timezone string (e.g. GMT+5:30)
  const offsetMinutes = -time.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMinsRemainder = Math.abs(offsetMinutes) % 60;
  const tzFormatted = `GMT${offsetMinutes >= 0 ? '+' : '-'}${offsetHours}${offsetMinsRemainder > 0 ? `:${offsetMinsRemainder}` : ''}`;

  return (
    <div
      onClick={() => {
        triggerHaptic('click');
        playTapSound(600);
        if (onOpenClock) onOpenClock();
      }}
      className="w-full h-full rounded-[28px] bg-white/15 dark:bg-black/35 backdrop-blur-xl border border-white/20 dark:border-white/10 p-3.5 flex flex-col justify-between text-white shadow-lg cursor-pointer hover:border-white/30 transition-all select-none relative overflow-hidden group"
    >
      {/* Top row: Date & Live Timezone Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/90">
          <Calendar size={13} className="text-cyan-400" />
          <span className="text-xs font-semibold tracking-tight">{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isDay ? (
            <Sun size={12} className="text-amber-400" />
          ) : (
            <Moon size={12} className="text-indigo-400" />
          )}
          <span className="text-[10px] text-cyan-300 font-mono tracking-wider font-semibold">
            {time.getHours() >= 12 ? 'PM' : 'AM'}
          </span>
        </div>
      </div>

      {/* Big Digital Real-Time with ticking seconds */}
      <div className="flex items-baseline gap-1 my-0.5">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-white">
          {hours}:{minutes}
        </span>
        <span className="text-xs font-mono text-cyan-400 font-medium animate-pulse">
          :{seconds}
        </span>
        <span className="text-[10px] font-mono text-neutral-400 ml-auto">
          {tzFormatted}
        </span>
      </div>

      {/* Bottom schedule / world time status */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] text-white/80">
        <div className="flex items-center gap-1.5 truncate">
          <BellRing size={11} className="text-amber-400 shrink-0" />
          <span className="truncate">Alarm: 06:30 AM · Active</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-cyan-400 font-mono">
          <Globe size={10} />
          <span>Live Sync</span>
        </div>
      </div>
    </div>
  );
};
