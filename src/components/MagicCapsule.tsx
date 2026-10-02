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
  Volume2
} from 'lucide-react';
import { MagicCapsuleActivity } from '../types/launcher';
import { playTapSound } from '../utils/sound';

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

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCapsuleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound(700, 0.04);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative z-50 flex justify-center w-full">
      {/* Punch hole camera container & Magic Capsule pill */}
      <div
        onClick={handleCapsuleClick}
        className={`transition-all duration-300 ease-out cursor-pointer select-none bg-black border border-neutral-700/60 shadow-2xl text-white overflow-hidden ${
          isExpanded
            ? 'w-[94%] max-w-[370px] rounded-[28px] p-4 mt-2'
            : 'h-[30px] rounded-full px-2.5 mt-1.5 flex items-center gap-2 hover:border-neutral-500'
        }`}
      >
        {!isExpanded ? (
          /* Collapsed Pill View */
          <div className="flex items-center justify-between w-full h-full gap-2 text-xs">
            {/* Left slot: Punch hole or Mini Icon */}
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-950"></div>
              </div>

              {activity === 'music' && (
                <div className="flex items-center gap-1">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlayingMusic ? 'h-3 animate-pulse' : 'h-1.5'}`}></span>
                    <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlayingMusic ? 'h-2 animate-bounce' : 'h-1'}`}></span>
                    <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlayingMusic ? 'h-3.5 animate-pulse' : 'h-2'}`}></span>
                  </div>
                  <span className="text-[11px] font-medium text-white/90 truncate max-w-[100px]">
                    {currentTrack.title}
                  </span>
                </div>
              )}

              {activity === 'timer' && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Clock size={12} />
                  <span className="text-[11px] font-mono font-medium">
                    {formatTimer(timerSeconds)}
                  </span>
                </div>
              )}

              {activity === 'charging' && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <BatteryCharging size={13} />
                  <span className="text-[11px] font-medium">89% SuperCharge</span>
                </div>
              )}

              {activity === 'call' && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <PhoneCall size={12} className="animate-pulse" />
                  <span className="text-[11px] font-medium">Incoming Call</span>
                </div>
              )}
            </div>

            {/* Right slot indicator */}
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>
        ) : (
          /* Expanded Full Capsule Card View */
          <div className="w-full flex flex-col gap-3">
            {/* Header with activity switchers and close button */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                <span className="text-xs font-semibold tracking-wide text-neutral-200 uppercase">
                  SUNNY Magic Capsule
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="p-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300"
                  aria-label="Close Capsule"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content per activity */}
            {activity === 'music' && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border border-white/40"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                    <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
                    <div className="w-full bg-neutral-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-cyan-400 h-full w-2/5"></div>
                    </div>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="text-[10px] text-neutral-400 font-mono">01:14 / 03:42</div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTapSound(500);
                      }}
                      className="p-1.5 text-neutral-300 hover:text-white"
                      aria-label="Previous Track"
                    >
                      <SkipBack size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTapSound(700);
                        onToggleMusic();
                      }}
                      className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      aria-label={isPlayingMusic ? "Pause" : "Play"}
                    >
                      {isPlayingMusic ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTapSound(600);
                      }}
                      className="p-1.5 text-neutral-300 hover:text-white"
                      aria-label="Next Track"
                    >
                      <SkipForward size={16} />
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenApp) onOpenApp('music');
                      setIsExpanded(false);
                    }}
                    className="text-[11px] text-cyan-400 font-medium hover:underline"
                  >
                    Open App
                  </button>
                </div>
              </div>
            )}

            {activity === 'timer' && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400">Countdown Timer</span>
                    <h3 className="text-xl font-bold font-mono text-white tracking-wider">
                      {formatTimer(timerSeconds)}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTimerRunning(!isTimerRunning);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 text-xs font-medium text-neutral-200 hover:bg-neutral-700"
                  >
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimerSeconds(300);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-800 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {activity === 'charging' && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <BatteryCharging size={26} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-400 font-semibold">SUNNY SuperCharge 100W</span>
                    <h3 className="text-lg font-bold text-white">89% Charged</h3>
                  </div>
                </div>
                <div className="text-right text-[11px] text-neutral-400">
                  <span>~6 min until full</span>
                </div>
              </div>
            )}

            {activity === 'call' && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Sunny Guru</h4>
                    <span className="text-xs text-neutral-400">SUNNY Magic Voice Calling...</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onActivityChange) onActivityChange('music');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-500 shadow"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenApp) onOpenApp('phone');
                      setIsExpanded(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500 shadow"
                  >
                    Answer
                  </button>
                </div>
              </div>
            )}

            {/* Quick Activity Switcher Pills */}
            <div className="flex items-center justify-between border-t border-neutral-800/80 pt-2 gap-1 text-[11px]">
              {(['music', 'timer', 'charging', 'call'] as MagicCapsuleActivity[]).map((act) => (
                <button
                  type="button"
                  key={act}
                  onClick={(e) => {
                    e.stopPropagation();
                    playTapSound(650);
                    if (onActivityChange) onActivityChange(act);
                  }}
                  className={`flex-1 py-1 px-1.5 rounded-lg capitalize transition-colors text-center truncate ${
                    activity === act
                      ? 'bg-neutral-800 text-cyan-400 font-semibold border border-cyan-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
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
