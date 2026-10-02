import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock as ClockIcon, 
  Globe, 
  AlarmClock, 
  Timer as TimerIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Check, 
  Bell, 
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface ClockAppProps {
  onClose: () => void;
}

interface WorldCityClock {
  id: string;
  name: string;
  country: string;
  timeZone: string;
}

const WORLD_CITIES: WorldCityClock[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { id: 'new_york', name: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { id: 'paris', name: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { id: 'delhi', name: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata' },
];

export const ClockApp: React.FC<ClockAppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'world' | 'alarm' | 'stopwatch' | 'timer'>('world');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Live Time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0); // in ms
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    } else if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [isStopwatchRunning]);

  const handleToggleStopwatch = () => {
    triggerHaptic('click');
    playTapSound(600);
    setIsStopwatchRunning(!isStopwatchRunning);
  };

  const handleResetStopwatch = () => {
    triggerHaptic('heavy');
    playTapSound(500);
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const handleAddLap = () => {
    triggerHaptic('tick');
    playTapSound(700);
    setLaps((prev) => [stopwatchTime, ...prev]);
  };

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return {
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      centi: centis.toString().padStart(2, '0'),
    };
  };

  // 3. Timer State
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            triggerHaptic('error');
            playTapSound(900);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    triggerHaptic('click');
    playTapSound(600);
    if (timerRemaining === 0) setTimerRemaining(timerSeconds);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    triggerHaptic('heavy');
    playTapSound(500);
    setIsTimerRunning(false);
    setTimerRemaining(timerSeconds);
  };

  // 4. Alarms list state
  const [alarms, setAlarms] = useState([
    { id: '1', time: '06:30', period: 'AM', label: 'Morning Workout', days: 'Mon, Tue, Wed, Thu, Fri', enabled: true },
    { id: '2', time: '08:00', period: 'AM', label: 'Work Standup', days: 'Mon, Tue, Wed, Thu, Fri', enabled: true },
    { id: '3', time: '10:00', period: 'PM', label: 'Wind Down & Read', days: 'Everyday', enabled: false },
  ]);

  const handleToggleAlarm = (id: string) => {
    triggerHaptic('smooth');
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  // World time helper
  const getWorldCityTime = (timeZone: string) => {
    try {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const parts = timeFormatter.formatToParts(now);
      const hour = parts.find((p) => p.type === 'hour')?.value || '12';
      const minute = parts.find((p) => p.type === 'minute')?.value || '00';
      const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';

      // Hour calculation for day/night
      const hour24 = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hour12: false }).format(now),
        10
      );
      const isDay = hour24 >= 6 && hour24 < 18;

      return {
        time: `${hour}:${minute}`,
        period: dayPeriod,
        isDay,
      };
    } catch {
      return { time: '12:00', period: 'PM', isDay: true };
    }
  };

  // Analog Clock angles
  const sec = currentTime.getSeconds();
  const min = currentTime.getMinutes();
  const hr = currentTime.getHours() % 12;

  const secAngle = sec * 6;
  const minAngle = min * 6 + sec * 0.1;
  const hrAngle = hr * 30 + min * 0.5;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ClockIcon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">MagicOS Clock</h2>
            <p className="text-[10px] text-neutral-400">Live Precision Timekeeper</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs Switcher: World Clock, Alarm, Stopwatch, Timer */}
      <div className="grid grid-cols-4 px-4 pt-3 pb-1 border-b border-neutral-800/80 bg-neutral-900/30 gap-1">
        {[
          { id: 'world', label: 'World', icon: Globe },
          { id: 'alarm', label: 'Alarm', icon: AlarmClock },
          { id: 'stopwatch', label: 'Stopwatch', icon: TimerIcon },
          { id: 'timer', label: 'Timer', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic('smooth');
                playTapSound(600);
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
              }`}
            >
              <Icon size={16} />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        {/* TAB 1: WORLD CLOCK & ANALOG DIAL */}
        {activeTab === 'world' && (
          <div className="space-y-6">
            {/* Live Interactive Analog Clock Dial */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-44 h-44 rounded-full bg-neutral-900 border-2 border-neutral-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center">
                {/* Clock Hour Ticks */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-2 bg-neutral-600 rounded-full"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-80px)`,
                    }}
                  />
                ))}

                {/* 12, 3, 6, 9 Cardinal Labels */}
                <span className="absolute top-2 text-[10px] font-bold text-neutral-400">12</span>
                <span className="absolute right-2.5 text-[10px] font-bold text-neutral-400">3</span>
                <span className="absolute bottom-2 text-[10px] font-bold text-neutral-400">6</span>
                <span className="absolute left-2.5 text-[10px] font-bold text-neutral-400">9</span>

                {/* Hour Hand */}
                <div
                  className="absolute w-1.5 h-12 bg-white rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${hrAngle}deg) translateY(-24px)`,
                    transition: 'transform 0.2s cubic-bezier(0.4, 2, 0.55, 0.44)',
                  }}
                />

                {/* Minute Hand */}
                <div
                  className="absolute w-1 h-16 bg-cyan-400 rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${minAngle}deg) translateY(-32px)`,
                    transition: 'transform 0.2s cubic-bezier(0.4, 2, 0.55, 0.44)',
                  }}
                />

                {/* Second Hand */}
                <div
                  className="absolute w-0.5 h-20 bg-rose-500 rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${secAngle}deg) translateY(-40px)`,
                  }}
                />

                {/* Center Pin */}
                <div className="absolute w-3 h-3 rounded-full bg-rose-500 border-2 border-white z-10 shadow" />
              </div>

              {/* Digital Time readout below dial */}
              <div className="mt-3 text-center">
                <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {currentTime.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-[10px] text-cyan-400 mt-1 font-mono">
                  Local Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              </div>
            </div>

            {/* World Cities Live Clock Grid */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block px-1">
                Global Cities Live
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WORLD_CITIES.map((city) => {
                  const cityData = getWorldCityTime(city.timeZone);
                  return (
                    <div
                      key={city.id}
                      className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-colors shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          {cityData.isDay ? (
                            <Sun size={13} className="text-amber-400" />
                          ) : (
                            <Moon size={13} className="text-indigo-400" />
                          )}
                          <span className="text-xs font-bold text-white">{city.name}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">{city.country}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-white">
                          {cityData.time}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-semibold ml-1">
                          {cityData.period}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALARMS */}
        {activeTab === 'alarm' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Scheduled Alarms
              </span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('click');
                  playTapSound(600);
                  const newAlarm = {
                    id: `alarm-${Date.now()}`,
                    time: '07:00',
                    period: 'AM',
                    label: 'Morning Alarm',
                    days: 'Mon - Fri',
                    enabled: true,
                  };
                  setAlarms((prev) => [newAlarm, ...prev]);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30"
              >
                <Plus size={13} />
                <span>Add Alarm</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-4 rounded-[28px] border transition-all flex items-center justify-between ${
                    alarm.enabled
                      ? 'bg-neutral-900 border-cyan-500/40 shadow-md'
                      : 'bg-neutral-900/50 border-neutral-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                        {alarm.time}
                      </span>
                      <span className="text-xs font-bold text-cyan-400">{alarm.period}</span>
                    </div>
                    <span className="text-xs font-semibold text-white/90 block mt-0.5">{alarm.label}</span>
                    <span className="text-[10px] text-neutral-400">{alarm.days}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAlarm(alarm.id)}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                      alarm.enabled ? 'bg-cyan-500' : 'bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        alarm.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STOPWATCH */}
        {activeTab === 'stopwatch' && (
          <div className="space-y-6">
            {/* Big Stopwatch Timer readout */}
            <div className="flex flex-col items-center justify-center py-6">
              {(() => {
                const s = formatStopwatch(stopwatchTime);
                return (
                  <div className="flex items-baseline justify-center font-mono">
                    <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white">
                      {s.min}:{s.sec}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-cyan-400 ml-2">
                      .{s.centi}
                    </span>
                  </div>
                );
              })()}
              <span className="text-xs text-neutral-400 mt-2 font-medium">Precision Centisecond Clock</span>
            </div>

            {/* Stopwatch Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleResetStopwatch}
                disabled={stopwatchTime === 0}
                className="w-16 h-16 rounded-full bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 font-bold text-xs active:scale-90 transition-all border border-neutral-700"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleToggleStopwatch}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold shadow-xl active:scale-95 transition-all ${
                  isStopwatchRunning
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                    : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400 shadow-cyan-500/30'
                }`}
              >
                {isStopwatchRunning ? <Pause size={28} /> : <Play size={28} className="fill-current ml-1" />}
              </button>

              <button
                type="button"
                onClick={handleAddLap}
                disabled={!isStopwatchRunning}
                className="w-16 h-16 rounded-full bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700 flex items-center justify-center text-cyan-300 font-bold text-xs active:scale-90 transition-all border border-cyan-500/30"
              >
                Lap
              </button>
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="p-4 rounded-[28px] bg-neutral-900 border border-neutral-800 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block pb-1 border-b border-neutral-800">
                  Recorded Laps ({laps.length})
                </span>
                {laps.map((lapMs, idx) => {
                  const s = formatStopwatch(lapMs);
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 font-mono border-b border-neutral-800/40 last:border-0">
                      <span className="text-neutral-400 font-bold">Lap {laps.length - idx}</span>
                      <span className="text-white font-bold">{s.min}:{s.sec}.{s.centi}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIMER */}
        {activeTab === 'timer' && (
          <div className="space-y-6">
            {/* Circular Timer Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-52 h-52 rounded-full flex items-center justify-center bg-neutral-900 border-4 border-cyan-500/20 shadow-2xl">
                <div className="text-center font-mono">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {Math.floor(timerRemaining / 60).toString().padStart(2, '0')}:
                    {(timerRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold mt-1 block">
                    {isTimerRunning ? 'Countdown Active' : 'Timer Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block px-1">
                Quick Presets
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1m', sec: 60 },
                  { label: '3m', sec: 180 },
                  { label: '5m', sec: 300 },
                  { label: '15m', sec: 900 },
                ].map((preset) => (
                  <button
                    key={preset.sec}
                    type="button"
                    onClick={() => {
                      triggerHaptic('smooth');
                      playTapSound(600);
                      setIsTimerRunning(false);
                      setTimerSeconds(preset.sec);
                      setTimerRemaining(preset.sec);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      timerSeconds === preset.sec
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Action Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleResetTimer}
                className="w-16 h-16 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 font-bold text-xs active:scale-90 transition-all border border-neutral-700"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleStartTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold shadow-xl active:scale-95 transition-all ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400 shadow-cyan-500/30'
                }`}
              >
                {isTimerRunning ? <Pause size={28} /> : <Play size={28} className="fill-current ml-1" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
