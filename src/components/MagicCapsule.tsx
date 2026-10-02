import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  BatteryCharging, 
  PhoneCall, 
  X,
  Plane,
  Car,
  Zap,
  Volume2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { MagicCapsuleActivity } from '../types/launcher';
import { playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

interface MagicCapsuleProps {
  activity: MagicCapsuleActivity;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  currentTrack: { title: string; artist: string };
  onOpenApp?: (app: string) => void;
  onActivityChange?: (act: MagicCapsuleActivity) => void;
}

export const MagicCapsule: React.FC<MagicCapsuleProps> = ({
  activity,
  isPlayingMusic,
  onToggleMusic,
  currentTrack,
  onOpenApp,
  onActivityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(274); // 4m 34s
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [musicProgress, setMusicProgress] = useState(38); // 38%
  const [flightEta, setFlightEta] = useState(25); // 25 mins to boarding
  const [rideEta, setRideEta] = useState(3); // 3 mins arrival

  // Timer countdown simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activity === 'timer' && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activity, isTimerRunning, timerSeconds]);

  // Live music progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activity === 'music' && isPlayingMusic) {
      interval = setInterval(() => {
        setMusicProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activity, isPlayingMusic]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCapsuleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('tick');
    playTapSound(700, 0.04);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative z-50 flex justify-center w-full">
      {/* Punch hole camera container & Magic Capsule pill */}
      <div
        onClick={handleCapsuleClick}
        className={`transition-all duration-300 ease-out cursor-pointer select-none bg-black/95 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-white overflow-hidden backdrop-blur-2xl ${
          isExpanded
            ? 'w-[96%] max-w-[390px] rounded-[32px] p-4 mt-1 ring-1 ring-cyan-500/30'
            : 'h-[32px] rounded-full px-3 mt-1 flex items-center gap-2 hover:border-cyan-400/50'
        }`}
      >
        {!isExpanded ? (
          /* Collapsed Pill View */
          <div className="flex items-center justify-between w-full h-full gap-2 text-xs">
            {/* Left slot: Punch hole + Mini Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80"></div>
              </div>

              {activity === 'music' && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlayingMusic ? 'h-3 animate-pulse' : 'h-1.5'}`}></span>
                    <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlayingMusic ? 'h-2 animate-bounce' : 'h-1'}`}></span>
                    <span className={`w-0.5 bg-cyan-400 rounded-full transition-all ${isPlayingMusic ? 'h-3.5 animate-pulse' : 'h-2'}`}></span>
                  </div>
                  <span className="text-[11px] font-medium text-white/90 truncate max-w-[110px]">
                    {currentTrack.title}
                  </span>
                </div>
              )}

              {activity === 'timer' && (
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Clock size={12} className="animate-spin [animation-duration:8s]" />
                  <span className="text-[11px] font-mono font-medium">
                    {formatTimer(timerSeconds)}
                  </span>
                </div>
              )}

              {activity === 'charging' && (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Zap size={12} className="fill-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-tight">89% · 100W SuperCharge</span>
                </div>
              )}

              {activity === 'flight' && (
                <div className="flex items-center gap-1.5 text-sky-400">
                  <Plane size={12} />
                  <span className="text-[11px] font-semibold tracking-tight">CA1832 · Gate B12 ({flightEta}m)</span>
                </div>
              )}

              {activity === 'ride' && (
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Car size={12} />
                  <span className="text-[11px] font-semibold tracking-tight">Silver Model Y · {rideEta} min</span>
                </div>
              )}

              {activity === 'call' && (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <PhoneCall size={12} className="animate-pulse" />
                  <span className="text-[11px] font-medium">Incoming Call</span>
                </div>
              )}
            </div>

            {/* Right slot indicator */}
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>
        ) : (
          /* Expanded Full Capsule Card View */
          <div className="w-full flex flex-col gap-3.5">
            {/* Header with activity brand badge and close button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
                <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1">
                  MagicOS 11 <span className="text-cyan-400 font-mono font-normal text-[10px]">Magic Capsule</span>
                </span>
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('tick');
                  setIsExpanded(false);
                }}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
                aria-label="Close Capsule"
              >
                <X size={15} />
              </button>
            </div>

            {/* 1. MUSIC ACTIVITY */}
            {activity === 'music' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden shrink-0 border border-white/10">
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full border border-white/40 flex items-center justify-center ${isPlayingMusic ? 'animate-spin [animation-duration:6s]' : ''}`}>
                        <div className="w-2 h-2 rounded-full bg-cyan-300"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
                    <p className="text-xs text-neutral-300 truncate">{currentTrack.artist}</p>
                    
                    {/* Interactive music scrubber bar */}
                    <div 
                      className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden cursor-pointer relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        setMusicProgress(Math.min(100, Math.max(0, pct)));
                      }}
                    >
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${musicProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-between px-1 pt-0.5">
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {Math.floor((musicProgress * 2.2) / 60)}:{(Math.floor(musicProgress * 2.2) % 60).toString().padStart(2, '0')} / 03:42
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('tick');
                        playTapSound(500);
                        setMusicProgress(prev => Math.max(0, prev - 15));
                      }}
                      className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                      aria-label="Previous Track"
                    >
                      <SkipBack size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('smooth');
                        playTapSound(700);
                        onToggleMusic();
                      }}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      aria-label={isPlayingMusic ? "Pause" : "Play"}
                    >
                      {isPlayingMusic ? <Pause size={18} className="fill-neutral-950" /> : <Play size={18} className="fill-neutral-950 translate-x-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('tick');
                        playTapSound(600);
                        setMusicProgress(prev => Math.min(100, prev + 15));
                      }}
                      className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                      aria-label="Next Track"
                    >
                      <SkipForward size={18} />
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenApp) onOpenApp('music');
                      setIsExpanded(false);
                    }}
                    className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>App</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            )}

            {/* 2. LIVE FLIGHT TRACKER ACTIVITY */}
            {activity === 'flight' && (
              <div className="flex flex-col gap-2.5 py-1">
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="text-left">
                    <span className="text-[10px] text-neutral-400 font-mono">PEK · BEIJING</span>
                    <h4 className="text-lg font-black text-white">09:15</h4>
                    <span className="text-[10px] text-neutral-300">Terminal 3</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 px-3">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-400"></div>
                      <Plane size={14} className="text-sky-400" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">CA1832 ON TIME</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 font-mono">SHA · SHANGHAI</span>
                    <h4 className="text-lg font-black text-white">11:35</h4>
                    <span className="text-[10px] text-neutral-300">Hongqiao T2</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-400/30">
                      Gate B12
                    </span>
                    <span className="text-neutral-300 text-[11px]">Seat 12A · Priority</span>
                  </div>
                  <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                    <Clock size={12} />
                    Boarding in {flightEta} min
                  </span>
                </div>
              </div>
            )}

            {/* 3. LIVE RIDE HAILING ACTIVITY */}
            {activity === 'ride' && (
              <div className="flex flex-col gap-2.5 py-1">
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                      <Car size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Tesla Model Y · Silver</h4>
                      <p className="text-[11px] font-mono text-cyan-400 font-semibold">HONOR 8888 · 4.99★</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400">{rideEta} min</span>
                    <span className="text-[10px] text-neutral-400 block">to pickup</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-neutral-300 text-[11px] flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin size={12} className="text-cyan-400 shrink-0" />
                    Pickup at South Entrance Gate 2
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('doubleTick');
                      if (onOpenApp) onOpenApp('phone');
                      setIsExpanded(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[11px] font-semibold text-white shadow"
                  >
                    Call Driver
                  </button>
                </div>
              </div>
            )}

            {/* 4. TIMER ACTIVITY */}
            {activity === 'timer' && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400">MagicOS Timer</span>
                    <h3 className="text-2xl font-black font-mono text-white tracking-wider">
                      {formatTimer(timerSeconds)}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('tick');
                      setIsTimerRunning(!isTimerRunning);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('tick');
                      setTimerSeconds(300);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* 5. 100W SUPERCHARGE ACTIVITY */}
            {activity === 'charging' && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 relative">
                    <Zap size={26} className="fill-emerald-400 animate-pulse" />
                    <div className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-ping [animation-duration:3s]"></div>
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                      MagicOS SuperCharge 100W Max
                    </span>
                    <h3 className="text-xl font-black text-white">89% Charged</h3>
                    <span className="text-[10px] text-neutral-400">11V · 9.1A Dual-Cell Silicon-Carbon Battery</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-neutral-400">
                  <span className="font-semibold text-white">~5 min</span>
                  <span className="block text-[10px]">until 100%</span>
                </div>
              </div>
            )}

            {/* 6. CALL ACTIVITY */}
            {activity === 'call' && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sunny Tech Guru</h4>
                    <span className="text-xs text-neutral-300">MagicOS VoLTE HD Calling...</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('tick');
                      if (onActivityChange) onActivityChange('music');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('doubleTick');
                      if (onOpenApp) onOpenApp('phone');
                      setIsExpanded(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
                  >
                    Answer
                  </button>
                </div>
              </div>
            )}

            {/* Quick Activity Switcher Pills */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2.5 gap-1 text-[11px]">
              {(['music', 'flight', 'ride', 'charging', 'timer', 'call'] as MagicCapsuleActivity[]).map((act) => (
                <button
                  type="button"
                  key={act}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('tick');
                    playTapSound(650);
                    if (onActivityChange) onActivityChange(act);
                  }}
                  className={`flex-1 py-1 px-1 rounded-xl capitalize transition-all text-center truncate ${
                    activity === act
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
