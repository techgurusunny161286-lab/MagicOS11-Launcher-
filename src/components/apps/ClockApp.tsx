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
  Sun, 
  Moon,
  Trash2,
  MapPin,
  Search
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

const INITIAL_WORLD_CITIES: WorldCityClock[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { id: 'new_york', name: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { id: 'paris', name: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { id: 'delhi', name: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata' },
];

const AVAILABLE_CITIES_CATALOG: WorldCityClock[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { id: 'new_york', name: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { id: 'paris', name: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { id: 'delhi', name: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata' },
  { id: 'los_angeles', name: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timeZone: 'Africa/Cairo' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', timeZone: 'America/Toronto' },
  { id: 'hong_kong', name: 'Hong Kong', country: 'China', timeZone: 'Asia/Hong_Kong' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', timeZone: 'Asia/Bangkok' },
  { id: 'sao_paulo', name: 'São Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata' },
];

export const ClockApp: React.FC<ClockAppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'world' | 'alarm' | 'stopwatch' | 'timer'>('world');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // World Cities state
  const [worldCities, setWorldCities] = useState<WorldCityClock[]>(INITIAL_WORLD_CITIES);
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  // Stopwatch State
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

  // Timer State
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

  // Alarms State
  const [alarms, setAlarms] = useState([
    { id: '1', time: '06:30', period: 'AM', label: 'Morning Workout', days: 'Mon - Fri', enabled: true },
    { id: '2', time: '08:00', period: 'AM', label: 'Work Standup', days: 'Mon - Fri', enabled: true },
    { id: '3', time: '10:00', period: 'PM', label: 'Wind Down & Read', days: 'Everyday', enabled: false },
  ]);

  const handleToggleAlarm = (id: string) => {
    triggerHaptic('smooth');
    playTapSound(500);
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    triggerHaptic('heavy');
    playTapSound(400);
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  // World time calculation helper
  const getCityTimeInfo = (timeZone: string) => {
    try {
      const now = currentTime;
      const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const parts = dtf.formatToParts(now);
      const hourStr = parts.find((p) => p.type === 'hour')?.value || '12';
      const minuteStr = parts.find((p) => p.type === 'minute')?.value || '00';
      const period = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';

      // 24-hr check for Day / Night icon
      const hour24 = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hour12: false }).format(now),
        10
      );
      const isDay = hour24 >= 6 && hour24 < 18;

      // Relative Day Calculation (Today, Yesterday, Tomorrow)
      const localDay = now.getDate();
      const targetDay = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone, day: 'numeric' }).format(now),
        10
      );
      let dayOffset = 'Today';
      if (targetDay > localDay || (targetDay === 1 && localDay > 27)) {
        dayOffset = 'Tomorrow';
      } else if (targetDay < localDay || (localDay === 1 && targetDay > 27)) {
        dayOffset = 'Yesterday';
      }

      // Difference relative to local time in hours
      const localOffset = -now.getTimezoneOffset(); // in minutes
      // Format a date string in target time zone to get UTC offset
      const targetTimeStr = now.toLocaleString('en-US', { timeZone });
      const targetDate = new Date(targetTimeStr);
      const localDate = new Date(now.toLocaleString('en-US'));
      const diffMs = targetDate.getTime() - localDate.getTime();
      const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 2) / 2;
      const diffSign = diffHours >= 0 ? '+' : '';
      const diffLabel = diffHours === 0 ? 'Same time' : `${diffSign}${diffHours} hrs`;

      return {
        time: `${hourStr}:${minuteStr}`,
        period,
        isDay,
        dayOffset,
        diffLabel,
      };
    } catch {
      return {
        time: '12:00',
        period: 'PM',
        isDay: true,
        dayOffset: 'Today',
        diffLabel: 'Local',
      };
    }
  };

  // High Precision Analog Clock Angles
  const sec = currentTime.getSeconds();
  const min = currentTime.getMinutes();
  const hr = currentTime.getHours() % 12;

  const secAngle = sec * 6; // 360 / 60 = 6 deg/sec
  const minAngle = min * 6 + (sec / 60) * 6; // smooth minute progress
  const hrAngle = hr * 30 + (min / 60) * 30; // 360 / 12 = 30 deg/hr

  // Digital time formatting
  const digitalHours = currentTime.getHours().toString().padStart(2, '0');
  const digitalMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const digitalSeconds = currentTime.getSeconds().toString().padStart(2, '0');
  const digitalPeriod = currentTime.getHours() >= 12 ? 'PM' : 'AM';
  const digitalDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

  // SVG Dial Geometry (Center at 120, 120, Radius 100)
  const CX = 120;
  const CY = 120;

  // 12 Hour numbers around dial
  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
    const angle = (num * 30) * (Math.PI / 180);
    const radius = 74;
    return {
      num,
      x: CX + radius * Math.sin(angle),
      y: CY - radius * Math.cos(angle),
    };
  });

  // 60 Tick marks around dial
  const ticks = [...Array(60)].map((_, i) => {
    const isMajor = i % 5 === 0;
    const angle = (i * 6) * (Math.PI / 180);
    const outerR = 98;
    const innerR = isMajor ? 88 : 93;
    return {
      i,
      isMajor,
      x1: CX + innerR * Math.sin(angle),
      y1: CY - innerR * Math.cos(angle),
      x2: CX + outerR * Math.sin(angle),
      y2: CY - outerR * Math.cos(angle),
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top App Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ClockIcon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">MagicOS Clock</h2>
            <p className="text-[10px] text-neutral-400">Live Precision Chronometer</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
          title="Close Clock"
        >
          <X size={16} />
        </button>
      </div>

      {/* Modern Tabs Navigation Bar */}
      <div className="grid grid-cols-4 px-4 pt-3 pb-2 border-b border-neutral-800/80 bg-neutral-900/40 gap-1.5">
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
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
              }`}
            >
              <Icon size={17} />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">
        {/* ================= TAB 1: WORLD CLOCK & PRECISION ANALOG DIAL ================= */}
        {activeTab === 'world' && (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* Live Precision Analog Timepiece & Digital Header */}
            <div className="flex flex-col items-center justify-center pt-1 pb-3">
              {/* SVG Precision Analog Clock Dial */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)]">
                <svg
                  viewBox="0 0 240 240"
                  className="w-full h-full select-none"
                >
                  <defs>
                    {/* Dial Face Gradient */}
                    <radialGradient id="dialGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#151921" />
                      <stop offset="85%" stopColor="#0c0e12" />
                      <stop offset="100%" stopColor="#060709" />
                    </radialGradient>
                    {/* Bezel Ring Gradient */}
                    <linearGradient id="bezelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b4252" />
                      <stop offset="50%" stopColor="#1e222d" />
                      <stop offset="100%" stopColor="#2e3440" />
                    </linearGradient>
                    {/* Hand Drop Shadow Filter */}
                    <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  {/* Outer Bezel */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="115"
                    fill="url(#bezelGradient)"
                    stroke="#4c566a"
                    strokeWidth="1.5"
                  />
                  {/* Subtle Inner Accent Ring */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="108"
                    fill="none"
                    stroke="rgba(0, 210, 211, 0.25)"
                    strokeWidth="1"
                  />
                  {/* Dial Background Face */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="105"
                    fill="url(#dialGradient)"
                    stroke="#1a1e28"
                    strokeWidth="1.5"
                  />

                  {/* Inner Chronograph Aesthetic Sub-Track Ring */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="52"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />

                  {/* 60 Tick Marks */}
                  {ticks.map((t) => (
                    <line
                      key={t.i}
                      x1={t.x1}
                      y1={t.y1}
                      x2={t.x2}
                      y2={t.y2}
                      stroke={t.isMajor ? '#e2e8f0' : '#475569'}
                      strokeWidth={t.isMajor ? 2 : 1}
                      strokeLinecap="round"
                      opacity={t.isMajor ? 0.9 : 0.4}
                    />
                  ))}

                  {/* 12 Hour Numbers (Properly placed and centered) */}
                  {hourNumbers.map(({ num, x, y }) => (
                    <text
                      key={num}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={num === 12 || num === 3 || num === 6 || num === 9 ? '#ffffff' : '#94a3b8'}
                      fontSize={num === 12 || num === 3 || num === 6 || num === 9 ? '12.5' : '11'}
                      fontWeight={num === 12 || num === 3 || num === 6 || num === 9 ? '800' : '600'}
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {num}
                    </text>
                  ))}

                  {/* Hour Hand (Rotating exactly around CX, CY) */}
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={66}
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#handShadow)"
                    transform={`rotate(${hrAngle} ${CX} ${CY})`}
                  />

                  {/* Minute Hand (Cyan Accent, Rotating exactly around CX, CY) */}
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX}
                    y2={42}
                    stroke="#00d2d3"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#handShadow)"
                    transform={`rotate(${minAngle} ${CX} ${CY})`}
                  />

                  {/* Second Hand (Vibrant Red/Rose with counterweight needle) */}
                  <g transform={`rotate(${secAngle} ${CX} ${CY})`}>
                    {/* Main needle */}
                    <line
                      x1={CX}
                      y1={CY + 18}
                      x2={CX}
                      y2={30}
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* Open counterweight circle */}
                    <circle
                      cx={CX}
                      cy={CY + 12}
                      r="2.5"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                    />
                    {/* Center needle dot */}
                    <circle
                      cx={CX}
                      cy={CY}
                      r="2.5"
                      fill="#f43f5e"
                    />
                  </g>

                  {/* Multi-Layer Center Pivot Jewel */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="5.5"
                    fill="#1e293b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={CX}
                    cy={CY}
                    r="2"
                    fill="#f43f5e"
                  />
                </svg>
              </div>

              {/* Digital Time & Location Readout */}
              <div className="mt-4 text-center space-y-1">
                <div className="flex items-baseline justify-center gap-1.5 font-mono">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {digitalHours}:{digitalMinutes}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-cyan-400">
                    :{digitalSeconds}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 ml-1">
                    {digitalPeriod}
                  </span>
                </div>

                <div className="text-xs text-neutral-300 font-medium">
                  {digitalDate}
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-500/25 px-2.5 py-0.5 rounded-full mt-1">
                  <MapPin size={11} />
                  <span>Local Timezone: {localTimezone}</span>
                </div>
              </div>
            </div>

            {/* Global Cities Live Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Global Cities Live ({worldCities.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('smooth');
                    playTapSound(600);
                    setIsAddCityOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 active:scale-95 transition-all"
                >
                  <Plus size={13} />
                  <span>Add City</span>
                </button>
              </div>

              {/* Responsive Cities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {worldCities.map((city) => {
                  const cityData = getCityTimeInfo(city.timeZone);
                  return (
                    <div
                      key={city.id}
                      className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700/80 flex items-center justify-between transition-all shadow-sm group"
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          {cityData.isDay ? (
                            <Sun size={14} className="text-amber-400 shrink-0" />
                          ) : (
                            <Moon size={14} className="text-indigo-400 shrink-0" />
                          )}
                          <span className="text-sm font-bold text-white truncate">{city.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <span>{city.country}</span>
                          <span>·</span>
                          <span className="text-neutral-400 font-mono">{cityData.dayOffset}</span>
                        </div>

                        <span className="text-[10px] font-mono text-cyan-400/90 block">
                          {cityData.diffLabel}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                            {cityData.time}
                          </span>
                          <span className="text-[11px] font-bold text-cyan-400">
                            {cityData.period}
                          </span>
                        </div>

                        {worldCities.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              triggerHaptic('heavy');
                              playTapSound(400);
                              setWorldCities((prev) => prev.filter((c) => c.id !== city.id));
                            }}
                            className="text-[10px] text-neutral-500 hover:text-rose-400 transition-colors mt-1 opacity-0 group-hover:opacity-100"
                            title="Remove City"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ALARMS ================= */}
        {activeTab === 'alarm' && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  Scheduled Alarms
                </span>
                <span className="text-[11px] text-neutral-400">Manage daily wake-up and reminder tones</span>
              </div>
              
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 active:scale-95 transition-all"
              >
                <Plus size={14} />
                <span>Add Alarm</span>
              </button>
            </div>

            <div className="space-y-3">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-4 rounded-[26px] border transition-all flex items-center justify-between ${
                    alarm.enabled
                      ? 'bg-neutral-900 border-cyan-500/40 shadow-md'
                      : 'bg-neutral-900/50 border-neutral-800 opacity-60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                        {alarm.time}
                      </span>
                      <span className="text-xs font-bold text-cyan-400">{alarm.period}</span>
                    </div>
                    <span className="text-xs font-semibold text-white/90 block">{alarm.label}</span>
                    <span className="text-[11px] text-neutral-400">{alarm.days}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteAlarm(alarm.id)}
                      className="p-1.5 rounded-full text-neutral-500 hover:text-rose-400 hover:bg-white/5 transition-all active:scale-90"
                      title="Delete alarm"
                    >
                      <Trash2 size={16} />
                    </button>

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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: STOPWATCH ================= */}
        {activeTab === 'stopwatch' && (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* Big Stopwatch Timer readout */}
            <div className="flex flex-col items-center justify-center py-8">
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
              <span className="text-xs text-neutral-400 mt-2 font-medium">Precision Centisecond Chronograph</span>
            </div>

            {/* Stopwatch Control Buttons */}
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={handleResetStopwatch}
                disabled={stopwatchTime === 0}
                className="w-16 h-16 rounded-full bg-neutral-800 disabled:opacity-30 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 font-bold text-xs active:scale-90 transition-all border border-neutral-700"
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
                className="w-16 h-16 rounded-full bg-neutral-800 disabled:opacity-30 hover:bg-neutral-700 flex items-center justify-center text-cyan-300 font-bold text-xs active:scale-90 transition-all border border-cyan-500/30"
              >
                Lap
              </button>
            </div>

            {/* Recorded Laps List */}
            {laps.length > 0 && (
              <div className="p-4 rounded-[28px] bg-neutral-900 border border-neutral-800 space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block pb-1 border-b border-neutral-800">
                  Recorded Laps ({laps.length})
                </span>
                {laps.map((lapMs, idx) => {
                  const s = formatStopwatch(lapMs);
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 font-mono border-b border-neutral-800/40 last:border-0">
                      <span className="text-neutral-400 font-bold">Lap {laps.length - idx}</span>
                      <span className="text-white font-bold">{s.min}:{s.sec}.{s.centi}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: TIMER ================= */}
        {activeTab === 'timer' && (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* Circular Timer Display */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-56 h-56 rounded-full flex items-center justify-center bg-neutral-900 border-4 border-cyan-500/20 shadow-2xl">
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

      {/* Add City Modal */}
      {isAddCityOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Add World City</h3>
              <button
                type="button"
                onClick={() => setIsAddCityOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1.5">
              {AVAILABLE_CITIES_CATALOG
                .filter((c) =>
                  c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
                  c.country.toLowerCase().includes(citySearch.toLowerCase())
                )
                .map((city) => {
                  const isAdded = worldCities.some((c) => c.id === city.id);
                  return (
                    <button
                      key={city.id}
                      type="button"
                      disabled={isAdded}
                      onClick={() => {
                        triggerHaptic('doubleTick');
                        playTapSound(600);
                        setWorldCities((prev) => [...prev, city]);
                        setIsAddCityOpen(false);
                        setCitySearch('');
                      }}
                      className="w-full p-2.5 rounded-xl flex items-center justify-between text-left hover:bg-neutral-800 transition-colors disabled:opacity-40"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{city.name}</div>
                        <div className="text-[10px] text-neutral-400">{city.country}</div>
                      </div>
                      {isAdded ? (
                        <span className="text-[10px] text-cyan-400 font-semibold">Added</span>
                      ) : (
                        <Plus size={14} className="text-neutral-400" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
