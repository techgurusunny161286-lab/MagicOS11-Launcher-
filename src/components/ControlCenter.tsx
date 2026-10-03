import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Sun, 
  Volume2, 
  Flashlight, 
  Moon, 
  Plane, 
  Share2, 
  Play, 
  Pause, 
  SkipForward, 
  X,
  ChevronDown,
  Sparkles,
  Signal,
  Radio,
  Clock,
  Briefcase,
  CircleDot,
  BatteryMedium,
  Timer,
  Mic,
  Globe,
  Tv,
  BellOff,
  Bell,
  RotateCw,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Search,
  Power,
  Heart,
  Music,
  Home,
  Sliders,
  Camera,
  Calculator,
  FileText,
  ScanLine,
  Eye,
  Airplay,
  Compass
} from 'lucide-react';
import { playTapSound, setSystemVolume } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export interface ControlToggle {
  id: string;
  name: string;
  category: 'connectivity' | 'media' | 'utility' | 'display' | 'accessibility';
  icon: string;
  size: '1x1' | '2x1' | 'slider';
  state?: boolean;
  value?: number;
  label?: string;
  sublabel?: string;
}

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  currentTrack: { title: string; artist: string };
  isFlashlightOn: boolean;
  onToggleFlashlight: () => void;
  brightness: number;
  onBrightnessChange: (val: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMagicRing?: () => void;
}

// Default toggles matching the uploaded iOS 27 screenshot
const DEFAULT_TOGGLE_IDS: string[] = [
  'cellular',
  'wifi',
  'airdrop',
  'bluetooth',
  'media',
  'shazam',
  'airplane',
  'flashlight',
  'alarm',
  'focus_work',
  'screen_recording',
  'low_power',
  'dark_mode',
  'stopwatch',
  'voice_memos',
  'web_translate',
  'remote',
  'brightness',
  'volume',
  'silent_mode',
  'rotation_lock'
];

// Master control dictionary with all available controls for adding/removing
const ALL_CONTROLS_CATALOG: Record<string, {
  name: string;
  category: 'connectivity' | 'media' | 'utility' | 'display' | 'accessibility';
  icon: string;
  size: '1x1' | '2x1' | 'slider';
  defaultLabel?: string;
  defaultSublabel?: string;
}> = {
  cellular: { name: 'Cellular Data', category: 'connectivity', icon: 'signal', size: '1x1' },
  wifi: { name: 'Wi-Fi', category: 'connectivity', icon: 'wifi', size: '1x1' },
  airdrop: { name: 'AirDrop', category: 'connectivity', icon: 'airdrop', size: '1x1' },
  bluetooth: { name: 'Bluetooth', category: 'connectivity', icon: 'bluetooth', size: '1x1' },
  media: { name: 'Now Playing', category: 'media', icon: 'media', size: '2x1' },
  shazam: { name: 'Music Recognition', category: 'media', icon: 'shazam', size: '1x1' },
  airplane: { name: 'Airplane Mode', category: 'connectivity', icon: 'plane', size: '1x1' },
  flashlight: { name: 'Flashlight', category: 'utility', icon: 'flashlight', size: '1x1' },
  alarm: { name: 'Alarm & Clock', category: 'utility', icon: 'alarm', size: '1x1' },
  focus_work: { name: 'Work Focus', category: 'utility', icon: 'focus', size: '2x1', defaultLabel: 'Work', defaultSublabel: 'On' },
  screen_recording: { name: 'Screen Recording', category: 'utility', icon: 'record', size: '2x1', defaultLabel: 'Screen Recording' },
  low_power: { name: 'Low Power Mode', category: 'utility', icon: 'battery', size: '2x1', defaultLabel: 'Low Power Mode', defaultSublabel: 'Off' },
  dark_mode: { name: 'Dark Mode', category: 'display', icon: 'dark_mode', size: '2x1', defaultLabel: 'Dark Mode', defaultSublabel: 'On' },
  stopwatch: { name: 'Stopwatch', category: 'utility', icon: 'stopwatch', size: '1x1' },
  voice_memos: { name: 'Voice Memos', category: 'utility', icon: 'mic', size: '1x1' },
  web_translate: { name: 'Translate & Safari', category: 'utility', icon: 'globe', size: '1x1' },
  remote: { name: 'Apple TV Remote', category: 'utility', icon: 'remote', size: '1x1' },
  brightness: { name: 'Display Brightness', category: 'display', icon: 'sun', size: 'slider' },
  volume: { name: 'Sound Volume', category: 'media', icon: 'volume', size: 'slider' },
  silent_mode: { name: 'Silent Mode', category: 'utility', icon: 'silent', size: '1x1' },
  rotation_lock: { name: 'Portrait Orientation Lock', category: 'display', icon: 'rotation_lock', size: '1x1' },
  // Additional controls available to add:
  calculator: { name: 'Calculator', category: 'utility', icon: 'calculator', size: '1x1' },
  camera: { name: 'Camera', category: 'media', icon: 'camera', size: '1x1' },
  notes: { name: 'Quick Note', category: 'utility', icon: 'notes', size: '1x1' },
  qr_scanner: { name: 'Code Scanner', category: 'utility', icon: 'qr', size: '1x1' },
  hotspot: { name: 'Personal Hotspot', category: 'connectivity', icon: 'radio', size: '1x1' },
  eye_comfort: { name: 'Night Shift', category: 'display', icon: 'eye', size: '1x1' },
};

interface VerticalTouchSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  icon: React.ReactNode;
  activeColor: string;
  fillColor?: string;
}

const VerticalTouchSlider: React.FC<VerticalTouchSliderProps> = ({
  value,
  min = 0,
  max = 100,
  onChange,
  icon,
  activeColor,
  fillColor = 'bg-white',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const calculateValue = (clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetY = rect.bottom - clientY;
    const ratio = Math.max(0, Math.min(1, offsetY / rect.height));
    const newVal = Math.round(min + ratio * (max - min));
    onChange(newVal);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDragging.current = true;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    calculateValue(e.clientY);
    triggerHaptic('tick');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    calculateValue(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    triggerHaptic('selection');
  };

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      className="h-full w-full rounded-[26px] bg-white/15 dark:bg-black/40 border border-white/20 overflow-hidden flex flex-col justify-end p-2.5 relative shadow-lg touch-none cursor-pointer select-none active:scale-[0.98] transition-transform"
      style={{ touchAction: 'none' }}
    >
      <div 
        className={`absolute inset-x-0 bottom-0 ${fillColor} pointer-events-none rounded-b-[24px] transition-all duration-75`}
        style={{ height: `${pct}%` }}
      />
      <div className="relative z-10 mx-auto flex flex-col items-center gap-1 pointer-events-none">
        <span className={`text-[10px] font-bold font-mono transition-colors ${pct > 45 ? 'text-neutral-900' : 'text-white'}`}>
          {value}%
        </span>
        <div className={`transition-colors ${pct > 35 ? activeColor : 'text-white'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  isPlayingMusic,
  onToggleMusic,
  currentTrack,
  isFlashlightOn,
  onToggleFlashlight,
  brightness,
  onBrightnessChange,
  volume,
  onVolumeChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenMagicRing,
}) => {
  // Active toggles array in order
  const [activeToggleIds, setActiveToggleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ios27_control_center_toggles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_TOGGLE_IDS;
  });

  // State of individual toggles
  const [cellularEnabled, setCellularEnabled] = useState(true);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [airdropEnabled, setAirdropEnabled] = useState(true);
  const [btEnabled, setBtEnabled] = useState(true);
  const [shazamActive, setShazamActive] = useState(false);
  const [airplaneEnabled, setAirplaneEnabled] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [focusWorkActive, setFocusWorkActive] = useState(true);
  const [screenRecordingActive, setScreenRecordingActive] = useState(false);
  const [lowPowerActive, setLowPowerActive] = useState(false);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [voiceMemosActive, setVoiceMemosActive] = useState(false);
  const [remoteActive, setRemoteActive] = useState(false);
  const [silentModeActive, setSilentModeActive] = useState(true);
  const [rotationLockActive, setRotationLockActive] = useState(true);

  // Edit / Customization Mode (triggered by + button on top left)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');

  // Active right navigation tab
  const [activeTab, setActiveTab] = useState<'favorites' | 'music' | 'home' | 'cellular'>('favorites');

  // Save customized controls to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ios27_control_center_toggles', JSON.stringify(activeToggleIds));
    } catch (e) {
      // ignore
    }
  }, [activeToggleIds]);

  // Swipe UP gesture from the base of the Control Center
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDraggingBase, setIsDraggingBase] = useState(false);
  const baseTouchStartRef = useRef<{ y: number; time: number } | null>(null);

  if (!isOpen) return null;

  const handleBasePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    baseTouchStartRef.current = { y: e.clientY, time: Date.now() };
    setIsDraggingBase(true);
  };

  const handleBasePointerMove = (e: React.PointerEvent) => {
    if (!baseTouchStartRef.current) return;
    e.stopPropagation();
    const deltaY = e.clientY - baseTouchStartRef.current.y;
    if (deltaY < 0) {
      setDragOffsetY(Math.abs(deltaY));
    } else {
      setDragOffsetY(0);
    }
  };

  const handleBasePointerUp = (e: React.PointerEvent) => {
    if (!baseTouchStartRef.current) return;
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    const deltaY = e.clientY - baseTouchStartRef.current.y;
    const elapsed = Date.now() - baseTouchStartRef.current.time;
    const velocity = Math.abs(deltaY) / Math.max(1, elapsed);
    baseTouchStartRef.current = null;
    setIsDraggingBase(false);

    if (deltaY < -35 || (deltaY < -15 && velocity > 0.3)) {
      triggerHaptic('tick');
      playTapSound(500);
      setDragOffsetY(window.innerHeight || 800);
      setTimeout(() => {
        onClose();
        setDragOffsetY(0);
      }, 140);
    } else {
      setDragOffsetY(0);
    }
  };

  const handleBaseTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    baseTouchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
    setIsDraggingBase(true);
  };

  const handleBaseTouchMove = (e: React.TouchEvent) => {
    if (!baseTouchStartRef.current) return;
    e.stopPropagation();
    const deltaY = e.touches[0].clientY - baseTouchStartRef.current.y;
    if (deltaY < 0) {
      setDragOffsetY(Math.abs(deltaY));
    } else {
      setDragOffsetY(0);
    }
  };

  const handleBaseTouchEnd = (e: React.TouchEvent) => {
    if (!baseTouchStartRef.current) return;
    e.stopPropagation();
    const deltaY = e.changedTouches[0].clientY - baseTouchStartRef.current.y;
    const elapsed = Date.now() - baseTouchStartRef.current.time;
    const velocity = Math.abs(deltaY) / Math.max(1, elapsed);
    baseTouchStartRef.current = null;
    setIsDraggingBase(false);

    if (deltaY < -35 || (deltaY < -15 && velocity > 0.3)) {
      triggerHaptic('tick');
      playTapSound(500);
      setDragOffsetY(window.innerHeight || 800);
      setTimeout(() => {
        onClose();
        setDragOffsetY(0);
      }, 140);
    } else {
      setDragOffsetY(0);
    }
  };

  // Remove a control
  const handleRemoveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('heavy');
    playTapSound(400);
    setActiveToggleIds(prev => prev.filter(toggleId => toggleId !== id));
  };

  // Add a control from gallery
  const handleAddToggle = (id: string) => {
    triggerHaptic('selection');
    playTapSound(600);
    if (!activeToggleIds.includes(id)) {
      setActiveToggleIds(prev => [...prev, id]);
    }
    setIsAddGalleryOpen(false);
  };

  // Reset to default layout
  const handleResetDefaults = () => {
    triggerHaptic('doubleTick');
    playTapSound(500);
    setActiveToggleIds(DEFAULT_TOGGLE_IDS);
    setIsEditMode(false);
  };

  const isIncluded = (id: string) => activeToggleIds.includes(id);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col justify-start bg-neutral-950/75 backdrop-blur-3xl text-white overflow-y-auto no-scrollbar animate-in slide-in-from-top duration-300 select-none"
      style={{
        transform: dragOffsetY > 0 ? `translateY(-${dragOffsetY}px)` : undefined,
        transition: isDraggingBase ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out',
        opacity: dragOffsetY > 0 ? Math.max(0.15, 1 - dragOffsetY / 350) : 1,
      }}
    >
      <div 
        className="w-full max-w-[420px] mx-auto flex flex-col gap-3 pt-3 pb-8 px-4 relative min-h-screen justify-between"
      >
        {/* Top Header Bar matching iOS 27 Screenshot */}
        <div className="flex items-center justify-between pt-1 px-1">
          {/* Top Left: (+) Edit / Customize Controls button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('doubleTick');
              playTapSound(600);
              setIsEditMode(!isEditMode);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all active:scale-95 shadow-md ${
              isEditMode 
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-amber-500/30' 
                : 'bg-white/15 hover:bg-white/25 text-white/90 border-white/20'
            }`}
            title={isEditMode ? 'Finish Customizing' : 'Customize Toggles (+)'}
          >
            {isEditMode ? <Check size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
          </button>

          {/* Center Dynamic Island pill with AI Agent */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-white/15 text-white/90 text-xs font-semibold shadow-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Meta AI</span>
            <span className="text-[10px] text-white/60">›</span>
          </div>

          {/* Top Right: Power Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('heavy');
              playTapSound(500);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white/90 shadow-md active:scale-95 transition-all"
            title="Close / Power"
          >
            <Power size={16} />
          </button>
        </div>

        {/* Carrier Status Row matching iOS 27 Screenshot */}
        <div className="flex items-center justify-between px-2 text-[11px] font-medium text-white/80">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Signal size={11} className="text-white" />
              <span>VIVO</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/60">
              <Signal size={10} />
              <span>Claro BR</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-white">68%</span>
            <BatteryMedium size={14} className="text-white" />
          </div>
        </div>

        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">⚙️</span>
              <span className="font-semibold">Tap (-) to remove toggles or add new</span>
            </div>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] underline text-amber-300 hover:text-white"
            >
              Reset
            </button>
          </div>
        )}

        {/* Main Controls Grid matching iOS 27 Screenshot */}
        <div className="flex items-start gap-2 relative">
          <div className="flex-1 flex flex-col gap-2.5">
            {/* ROW 1: CONNECTIVITY QUAD PILLS (Cellular, Wi-Fi, AirDrop, Bluetooth) */}
            <div className="grid grid-cols-4 gap-2">
              {/* Cellular Data */}
              {isIncluded('cellular') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setCellularEnabled(!cellularEnabled);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      cellularEnabled
                        ? 'bg-emerald-500 text-white border-emerald-400/50 shadow-emerald-500/30'
                        : 'bg-white/15 text-white/50 border-white/10'
                    }`}
                    title="Cellular Data"
                  >
                    <Signal size={22} className="stroke-[2.2]" />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('cellular', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Wi-Fi */}
              {isIncluded('wifi') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setWifiEnabled(!wifiEnabled);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      wifiEnabled
                        ? 'bg-blue-600 text-white border-blue-400/50 shadow-blue-500/30'
                        : 'bg-white/15 text-white/50 border-white/10'
                    }`}
                    title="Wi-Fi"
                  >
                    <Wifi size={22} className="stroke-[2.2]" />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('wifi', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* AirDrop */}
              {isIncluded('airdrop') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setAirdropEnabled(!airdropEnabled);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      airdropEnabled
                        ? 'bg-sky-500 text-white border-sky-400/50 shadow-sky-500/30'
                        : 'bg-white/15 text-white/50 border-white/10'
                    }`}
                    title="AirDrop"
                  >
                    <Airplay size={22} className="stroke-[2.2]" />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('airdrop', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Bluetooth */}
              {isIncluded('bluetooth') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setBtEnabled(!btEnabled);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      btEnabled
                        ? 'bg-blue-600 text-white border-blue-400/50 shadow-blue-500/30'
                        : 'bg-white/15 text-white/50 border-white/10'
                    }`}
                    title="Bluetooth"
                  >
                    <Bluetooth size={22} className="stroke-[2.2]" />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('bluetooth', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ROW 2: MEDIA PLAYER HORIZONTAL CAPSULE */}
            {isIncluded('media') && (
              <div className="relative group">
                <div className="w-full px-4 py-2.5 rounded-[24px] bg-white/15 dark:bg-black/40 backdrop-blur-2xl border border-white/20 shadow-lg flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80 truncate">
                    {isPlayingMusic ? currentTrack.title : 'Not Playing'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tick');
                        onToggleMusic();
                      }}
                      className="text-white hover:scale-110 active:scale-90 transition-transform"
                    >
                      {isPlayingMusic ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => playTapSound(500)}
                      className="text-white/80 hover:text-white"
                    >
                      <SkipForward size={16} />
                    </button>
                    <Airplay size={16} className="text-white/60" />
                  </div>
                </div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveToggle('media', e)}
                    className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                  >
                    <Minus size={11} strokeWidth={3} />
                  </button>
                )}
              </div>
            )}

            {/* ROW 3: 4 CIRCULAR ACTION TOGGLES (Shazam, Airplane, Flashlight, Alarm) */}
            <div className="grid grid-cols-4 gap-2">
              {/* Shazam */}
              {isIncluded('shazam') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setShazamActive(!shazamActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      shazamActive
                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white border-cyan-400'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Shazam Music Recognition"
                  >
                    <Sparkles size={20} className={shazamActive ? 'animate-spin [animation-duration:8s]' : ''} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('shazam', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Airplane Mode */}
              {isIncluded('airplane') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setAirplaneEnabled(!airplaneEnabled);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      airplaneEnabled
                        ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/30'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Airplane Mode"
                  >
                    <Plane size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('airplane', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Flashlight */}
              {isIncluded('flashlight') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('heavy');
                      playTapSound(600);
                      onToggleFlashlight();
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      isFlashlightOn
                        ? 'bg-white text-neutral-950 border-white shadow-white/50'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Flashlight"
                  >
                    <Flashlight size={20} className={isFlashlightOn ? 'fill-neutral-950' : ''} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('flashlight', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Alarm Clock */}
              {isIncluded('alarm') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setAlarmActive(!alarmActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      alarmActive
                        ? 'bg-orange-500 text-white border-orange-400'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Alarm & Clock"
                  >
                    <Clock size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('alarm', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ROW 4: DUAL 2x1 CAPSULES (Work Focus & Screen Recording) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Work Focus */}
              {isIncluded('focus_work') && (
                <div className="relative group">
                  <div
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setFocusWorkActive(!focusWorkActive);
                    }}
                    className={`p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                      focusWorkActive
                        ? 'bg-purple-600/80 border-purple-400/50 text-white shadow-purple-500/30'
                        : 'bg-white/15 text-white/70 border-white/15'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center shrink-0">
                      <Briefcase size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">Work</span>
                      <span className="text-[10px] text-white/70">{focusWorkActive ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('focus_work', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Screen Recording */}
              {isIncluded('screen_recording') && (
                <div className="relative group">
                  <div
                    onClick={() => {
                      triggerHaptic('doubleTick');
                      playTapSound(700);
                      setScreenRecordingActive(!screenRecordingActive);
                    }}
                    className={`p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                      screenRecordingActive
                        ? 'bg-rose-600/80 border-rose-400/50 text-white shadow-rose-500/30'
                        : 'bg-white/15 text-white/70 border-white/15'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CircleDot size={18} className={screenRecordingActive ? 'text-rose-400 animate-pulse' : 'text-white'} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">Screen</span>
                      <span className="text-[10px] text-white/70">{screenRecordingActive ? 'Recording...' : 'Recording'}</span>
                    </div>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('screen_recording', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ROW 5: DUAL 2x1 CAPSULES (Low Power Mode & Dark Mode) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Low Power Mode */}
              {isIncluded('low_power') && (
                <div className="relative group">
                  <div
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setLowPowerActive(!lowPowerActive);
                    }}
                    className={`p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                      lowPowerActive
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-amber-500/30'
                        : 'bg-white/15 text-white/70 border-white/15'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center shrink-0">
                      <BatteryMedium size={18} className={lowPowerActive ? 'text-neutral-950 fill-neutral-950' : 'text-white'} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">Low Power</span>
                      <span className="text-[10px] opacity-80">{lowPowerActive ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('low_power', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Dark Mode */}
              {isIncluded('dark_mode') && (
                <div className="relative group">
                  <div
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      onToggleDarkMode();
                    }}
                    className={`p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                      isDarkMode
                        ? 'bg-white text-neutral-950 border-white shadow-white/40'
                        : 'bg-white/15 text-white/70 border-white/15'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 border border-white/20">
                      <Moon size={16} className="text-white fill-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">Dark Mode</span>
                      <span className="text-[10px] opacity-80">{isDarkMode ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('dark_mode', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ROW 6: 4 CIRCULAR TOGGLES (Stopwatch, Voice Memos, Web Translate, Remote) */}
            <div className="grid grid-cols-4 gap-2">
              {/* Stopwatch */}
              {isIncluded('stopwatch') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setStopwatchActive(!stopwatchActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      stopwatchActive
                        ? 'bg-gradient-to-tr from-fuchsia-600 to-indigo-600 text-white border-fuchsia-400'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Stopwatch"
                  >
                    <Timer size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('stopwatch', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Voice Memos */}
              {isIncluded('voice_memos') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setVoiceMemosActive(!voiceMemosActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      voiceMemosActive
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Voice Memos"
                  >
                    <Mic size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('voice_memos', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Web Translate */}
              {isIncluded('web_translate') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                    }}
                    className="w-full aspect-square rounded-[22px] bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 border border-white/15 backdrop-blur-2xl shadow-md active:scale-95 transition-all"
                    title="Safari & Web Translate"
                  >
                    <Globe size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('web_translate', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Apple TV Remote */}
              {isIncluded('remote') && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setRemoteActive(!remoteActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      remoteActive
                        ? 'bg-slate-700 text-white border-slate-500'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Apple TV Remote"
                  >
                    <Tv size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('remote', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ROW 7: SLIDERS & BOTTOM QUICK TOGGLES */}
            <div className="grid grid-cols-4 gap-2 h-32 items-stretch">
              {/* Vertical Brightness Slider */}
              {isIncluded('brightness') && (
                <div className="relative group h-full">
                  <VerticalTouchSlider
                    value={brightness}
                    min={10}
                    max={100}
                    onChange={(val) => onBrightnessChange?.(val)}
                    icon={<Sun size={20} className="fill-current" />}
                    activeColor="text-amber-500 fill-amber-500"
                  />
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('brightness', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Vertical Volume Slider */}
              {isIncluded('volume') && (
                <div className="relative group h-full">
                  <VerticalTouchSlider
                    value={volume}
                    min={0}
                    max={100}
                    onChange={(val) => {
                      onVolumeChange?.(val);
                      setSystemVolume(val);
                    }}
                    icon={<Volume2 size={20} className="fill-current" />}
                    activeColor="text-sky-500 fill-sky-500"
                  />
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('volume', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Silent Mode / Mute Toggle */}
              {isIncluded('silent_mode') && (
                <div className="relative group h-full flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setSilentModeActive(!silentModeActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      silentModeActive
                        ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Silent Mode"
                  >
                    <BellOff size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('silent_mode', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Portrait Orientation Lock */}
              {isIncluded('rotation_lock') && (
                <div className="relative group h-full flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tick');
                      playTapSound(600);
                      setRotationLockActive(!rotationLockActive);
                    }}
                    className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                      rotationLockActive
                        ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
                        : 'bg-white/15 text-white/80 border-white/15'
                    }`}
                    title="Portrait Orientation Lock"
                  >
                    <RotateCw size={20} />
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveToggle('rotation_lock', e)}
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Any extra custom controls added by the user */}
            {activeToggleIds.filter(id => !DEFAULT_TOGGLE_IDS.includes(id)).length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10">
                {activeToggleIds.filter(id => !DEFAULT_TOGGLE_IDS.includes(id)).map(id => {
                  const item = ALL_CONTROLS_CATALOG[id];
                  if (!item) return null;
                  return (
                    <div key={id} className="relative group">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tick');
                          playTapSound(600);
                        }}
                        className="w-full aspect-square rounded-[22px] bg-white/20 hover:bg-white/30 text-white border border-white/25 flex items-center justify-center shadow-md active:scale-95 transition-all"
                        title={item.name}
                      >
                        {id === 'camera' && <Camera size={20} />}
                        {id === 'calculator' && <Calculator size={20} />}
                        {id === 'notes' && <FileText size={20} />}
                        {id === 'qr_scanner' && <ScanLine size={20} />}
                        {id === 'hotspot' && <Radio size={20} />}
                        {id === 'eye_comfort' && <Eye size={20} />}
                      </button>
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveToggle(id, e)}
                          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold border border-white shadow-md z-30"
                        >
                          <Minus size={11} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* "+ Add a Control" button when in Edit Mode */}
            {isEditMode && (
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsAddGalleryOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs flex items-center gap-2 shadow-lg backdrop-blur-xl active:scale-95 transition-all"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Add a Control</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Edge Category Navigation Rail matching iOS 27 Screenshot */}
          <div className="w-6 flex flex-col items-center justify-center gap-4 py-6 text-white/40">
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`transition-colors ${activeTab === 'favorites' ? 'text-white scale-125' : 'hover:text-white/80'}`}
              title="Favorites"
            >
              <Heart size={14} className={activeTab === 'favorites' ? 'fill-white' : ''} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('music')}
              className={`transition-colors ${activeTab === 'music' ? 'text-white scale-125' : 'hover:text-white/80'}`}
              title="Music"
            >
              <Music size={14} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`transition-colors ${activeTab === 'home' ? 'text-white scale-125' : 'hover:text-white/80'}`}
              title="Home"
            >
              <Home size={14} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cellular')}
              className={`transition-colors ${activeTab === 'cellular' ? 'text-white scale-125' : 'hover:text-white/80'}`}
              title="Cellular"
            >
              <Signal size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Grab Handle Bar at Control Center Base */}
        <div 
          onClick={() => {
            triggerHaptic('tick');
            playTapSound(500);
            onClose();
          }}
          onPointerDown={handleBasePointerDown}
          onPointerMove={handleBasePointerMove}
          onPointerUp={handleBasePointerUp}
          onPointerCancel={handleBasePointerUp}
          onTouchStart={handleBaseTouchStart}
          onTouchMove={handleBaseTouchMove}
          onTouchEnd={handleBaseTouchEnd}
          className="w-full h-16 flex flex-col items-center justify-center cursor-pointer group select-none touch-none pb-2 mt-2"
          style={{ touchAction: 'none' }}
          title="Swipe up from base or tap to close control center"
        >
          <div className={`rounded-full transition-all duration-150 shadow-md ${
            isDraggingBase || dragOffsetY > 0 
              ? 'w-40 h-2 bg-cyan-400 shadow-cyan-500/50' 
              : 'w-36 h-1.5 bg-white/70 group-hover:bg-white active:scale-95'
          }`}></div>
          <span className="text-[10px] text-white/50 group-hover:text-white/80 tracking-wider mt-1.5 font-medium transition-colors">
            {dragOffsetY > 0 ? 'Release to close' : 'Swipe up from base to close'}
          </span>
        </div>
      </div>

      {/* Control Gallery Modal for ADDING Controls */}
      {isAddGalleryOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xl flex flex-col justify-end p-4 animate-in fade-in"
          onClick={() => setIsAddGalleryOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] mx-auto bg-neutral-900 border border-white/20 rounded-[32px] p-5 flex flex-col gap-4 max-h-[85vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Add Controls</h3>
                <p className="text-xs text-neutral-400">Choose controls to customize your panel</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGalleryOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search controls..."
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Controls List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-1">
              {Object.entries(ALL_CONTROLS_CATALOG)
                .filter(([id, item]) => 
                  !activeToggleIds.includes(id) && 
                  (!gallerySearch || item.name.toLowerCase().includes(gallerySearch.toLowerCase()))
                )
                .map(([id, item]) => (
                  <div
                    key={id}
                    onClick={() => handleAddToggle(id)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15">
                        {id === 'camera' && <Camera size={18} />}
                        {id === 'calculator' && <Calculator size={18} />}
                        {id === 'notes' && <FileText size={18} />}
                        {id === 'qr_scanner' && <ScanLine size={18} />}
                        {id === 'hotspot' && <Radio size={18} />}
                        {id === 'eye_comfort' && <Eye size={18} />}
                        {id === 'shazam' && <Sparkles size={18} />}
                        {id === 'stopwatch' && <Timer size={18} />}
                        {id === 'voice_memos' && <Mic size={18} />}
                        {id === 'alarm' && <Clock size={18} />}
                        {id === 'low_power' && <BatteryMedium size={18} />}
                        {id === 'screen_recording' && <CircleDot size={18} />}
                        {id === 'focus_work' && <Briefcase size={18} />}
                        {id === 'remote' && <Tv size={18} />}
                        {!['camera', 'calculator', 'notes', 'qr_scanner', 'hotspot', 'eye_comfort', 'shazam', 'stopwatch', 'voice_memos', 'alarm', 'low_power', 'screen_recording', 'focus_work', 'remote'].includes(id) && (
                          <Sliders size={18} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-neutral-400 capitalize">{item.category}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                ))}
              {Object.keys(ALL_CONTROLS_CATALOG).every(id => activeToggleIds.includes(id)) && (
                <div className="py-8 text-center text-xs text-neutral-400">
                  All available controls are already on your panel!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
