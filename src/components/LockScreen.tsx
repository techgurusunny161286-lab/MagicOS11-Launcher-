import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Flashlight, 
  Fingerprint, 
  Disc, 
  Bell, 
  Wifi, 
  Battery, 
  Lock
} from 'lucide-react';
import { playTapSound, playUnlockSound } from '../utils/sound';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  onOpenApp: (app: string) => void;
  wallpaperClass: string;
  isPlayingMusic: boolean;
  currentTrack: { title: string; artist: string };
  isFlashlightOn: boolean;
  onToggleFlashlight: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  onOpenApp,
  wallpaperClass,
  isPlayingMusic,
  currentTrack,
  isFlashlightOn,
  onToggleFlashlight,
}) => {
  const [time, setTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLocked) return null;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}`;

  const handleFingerprintUnlock = () => {
    setIsUnlocking(true);
    playTapSound(900, 0.04);
    setTimeout(() => {
      playUnlockSound();
      onUnlock();
      setIsUnlocking(false);
    }, 280);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 select-none text-white ${wallpaperClass} animate-in fade-in duration-300`}
      onClick={handleFingerprintUnlock}
    >
      {/* Top Status Bar in Lock Screen */}
      <div className="flex items-center justify-between text-xs px-2 pt-2">
        <div className="flex items-center gap-1.5 text-white/80">
          <Lock size={12} />
          <span className="text-[11px] font-medium tracking-tight">SUNNY 5G</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={14} />
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span>89%</span>
            <Battery size={14} className="fill-white" />
          </div>
        </div>
      </div>

      {/* SUNNY MagicOS Signature Big Lock Clock */}
      <div className="flex flex-col items-center pt-8 text-center">
        <span className="text-sm font-semibold tracking-wider uppercase text-cyan-300 drop-shadow">
          {dateStr}
        </span>
        <div className="flex items-baseline justify-center text-7xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-2xl my-1 font-sans">
          <span>{hours}</span>
          <span className="text-cyan-400 mx-1">:</span>
          <span>{minutes}</span>
        </div>
        <span className="text-xs text-white/70 tracking-wide font-medium">
          MagicOS 11 · AI Privacy Protection
        </span>
      </div>

      {/* Lock Screen Music Pill */}
      {isPlayingMusic && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onOpenApp('music');
            onUnlock();
          }}
          className="mx-auto max-w-xs w-full p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-2xl cursor-pointer hover:bg-black/50"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shrink-0">
              <Disc size={16} className="text-white animate-spin [animation-duration:8s]" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-semibold text-white truncate">{currentTrack.title}</h5>
              <p className="text-[10px] text-white/60 truncate">{currentTrack.artist}</p>
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Playing</span>
        </div>
      )}

      {/* Center/Lower: In-Display Fingerprint Scanner */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFingerprintUnlock();
          }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isUnlocking
              ? 'bg-cyan-400 text-neutral-950 scale-125 shadow-[0_0_40px_rgba(6,182,212,0.8)]'
              : 'bg-white/10 text-cyan-400 border border-cyan-400/40 hover:bg-white/20'
          }`}
          aria-label="Unlock Phone"
        >
          {/* Glowing Ripple ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-30 pointer-events-none"></div>
          <Fingerprint size={32} className={isUnlocking ? 'animate-pulse' : ''} />
        </button>
        <span className="text-[11px] text-white/70 font-medium">Touch sensor or swipe to unlock</span>
      </div>

      {/* Bottom Shortcuts: Torch & Camera */}
      <div className="flex items-center justify-between px-4 pb-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => {
            playTapSound(600);
            onToggleFlashlight();
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all ${
            isFlashlightOn 
              ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-lg shadow-amber-400/30' 
              : 'bg-black/30 text-white border-white/20 hover:bg-black/50'
          }`}
          aria-label="Torch"
        >
          <Flashlight size={20} />
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound(600);
            onUnlock();
            onOpenApp('camera');
          }}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-black/50 active:scale-95 transition-transform"
          aria-label="Quick Camera"
        >
          <Camera size={20} />
        </button>
      </div>
    </div>
  );
};
