import React, { useState, useRef, useEffect } from 'react';
import { 
  Trash2, 
  ChevronDown, 
  CheckCheck, 
  Bell, 
  Wifi, 
  Bluetooth, 
  Flashlight, 
  Moon, 
  Sun, 
  Sliders, 
  Settings,
  ChevronUp,
  Camera,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  CloudSun,
  Flame,
  X,
  Signal,
  Airplay,
  Plane,
  Clock,
  Briefcase,
  CircleDot,
  BatteryMedium,
  Timer,
  Mic,
  Globe,
  Tv,
  BellOff,
  RotateCw,
  Plus,
  Minus,
  Search,
  Power,
  Heart,
  Music,
  Home,
  Check,
  Calculator,
  FileText,
  ScanLine,
  Eye,
  Radio,
  Volume2,
  Edit3
} from 'lucide-react';
import { NotificationItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { playTapSound, setSystemMuted, setSystemVolume } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  onAddNotification?: (n: NotificationItem) => void;
  onOpenControlCenter?: () => void;
  onOpenSettings?: () => void;
  onOpenApp?: (appId: string) => void;
  isFlashlightOn?: boolean;
  onToggleFlashlight?: () => void;
  brightness?: number;
  onBrightnessChange?: (val: number) => void;
  volume?: number;
  onVolumeChange?: (val: number) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
  currentTrack?: { title: string; artist: string };
  onNextTrack?: () => void;
  isCellularOn?: boolean;
  onToggleCellular?: (val?: boolean) => void;
  isWifiOn?: boolean;
  onToggleWifi?: (val?: boolean) => void;
  isBluetoothOn?: boolean;
  onToggleBluetooth?: (val?: boolean) => void;
  isAirplaneOn?: boolean;
  onToggleAirplane?: (val?: boolean) => void;
  isSilentModeOn?: boolean;
  onToggleSilentMode?: (val?: boolean) => void;
  isLowPowerOn?: boolean;
  onToggleLowPower?: (val?: boolean) => void;
  isRotationLocked?: boolean;
  onToggleRotationLock?: (val?: boolean) => void;
  isNightShiftOn?: boolean;
  onToggleNightShift?: (val?: boolean) => void;
  isHotspotOn?: boolean;
  onToggleHotspot?: (val?: boolean) => void;
  focusMode?: string;
  onCycleFocusMode?: () => void;
  onShowToast?: (msg: string) => void;
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

export interface CatalogItem {
  id: string;
  name: string;
  category: 'connectivity' | 'media' | 'utility' | 'display';
  icon: string;
  description: string;
}

const ALL_CONTROLS_CATALOG: Record<string, CatalogItem> = {
  cellular: { id: 'cellular', name: 'Cellular Data', category: 'connectivity', icon: 'signal', description: 'Enable 5G mobile data' },
  wifi: { id: 'wifi', name: 'Wi-Fi', category: 'connectivity', icon: 'wifi', description: 'Connect to wireless networks' },
  airdrop: { id: 'airdrop', name: 'AirDrop', category: 'connectivity', icon: 'airdrop', description: 'Share files with nearby devices' },
  bluetooth: { id: 'bluetooth', name: 'Bluetooth', category: 'connectivity', icon: 'bluetooth', description: 'Connect audio accessories & devices' },
  media: { id: 'media', name: 'Now Playing', category: 'media', icon: 'media', description: 'Playback controls and audio streaming' },
  shazam: { id: 'shazam', name: 'Music Recognition', category: 'media', icon: 'shazam', description: 'Identify music playing around you' },
  airplane: { id: 'airplane', name: 'Airplane Mode', category: 'connectivity', icon: 'plane', description: 'Disable all wireless signals' },
  flashlight: { id: 'flashlight', name: 'Flashlight', category: 'utility', icon: 'flashlight', description: 'Turn on LED torch light' },
  alarm: { id: 'alarm', name: 'Alarm & Clock', category: 'utility', icon: 'alarm', description: 'Set and toggle upcoming alarms' },
  focus_work: { id: 'focus_work', name: 'Work Focus', category: 'utility', icon: 'focus', description: 'Silence non-urgent notifications during work' },
  screen_recording: { id: 'screen_recording', name: 'Screen Recording', category: 'utility', icon: 'record', description: 'Record video of your screen activity' },
  low_power: { id: 'low_power', name: 'Low Power Mode', category: 'utility', icon: 'battery', description: 'Reduce background power consumption' },
  dark_mode: { id: 'dark_mode', name: 'Dark Mode', category: 'display', icon: 'dark_mode', description: 'Switch between light and dark system themes' },
  stopwatch: { id: 'stopwatch', name: 'Stopwatch', category: 'utility', icon: 'stopwatch', description: 'Precise lap timer and stopwatch' },
  voice_memos: { id: 'voice_memos', name: 'Voice Memos', category: 'utility', icon: 'mic', description: 'Quick audio voice recording' },
  web_translate: { id: 'web_translate', name: 'Translate & Safari', category: 'utility', icon: 'globe', description: 'Instant language translation & search' },
  remote: { id: 'remote', name: 'Apple TV Remote', category: 'utility', icon: 'remote', description: 'Control TVs and streaming boxes' },
  brightness: { id: 'brightness', name: 'Display Brightness', category: 'display', icon: 'sun', description: 'Adjust screen brightness level' },
  volume: { id: 'volume', name: 'Sound Volume', category: 'media', icon: 'volume', description: 'Adjust media and alert volume level' },
  silent_mode: { id: 'silent_mode', name: 'Silent Mode', category: 'utility', icon: 'silent', description: 'Mute ringer and notification sounds' },
  rotation_lock: { id: 'rotation_lock', name: 'Orientation Lock', category: 'display', icon: 'rotation_lock', description: 'Lock display to portrait orientation' },
  camera: { id: 'camera', name: 'Camera', category: 'media', icon: 'camera', description: 'Instantly take photos or videos' },
  calculator: { id: 'calculator', name: 'Calculator', category: 'utility', icon: 'calculator', description: 'Quick numeric math calculator' },
  notes: { id: 'notes', name: 'Quick Note', category: 'utility', icon: 'notes', description: 'Jot down thoughts and memos' },
  qr_scanner: { id: 'qr_scanner', name: 'Code Scanner', category: 'utility', icon: 'qr', description: 'Scan QR codes and barcodes' },
  hotspot: { id: 'hotspot', name: 'Personal Hotspot', category: 'connectivity', icon: 'radio', description: 'Share internet via cellular Wi-Fi' },
  eye_comfort: { id: 'eye_comfort', name: 'Night Shift', category: 'display', icon: 'eye', description: 'Warm screen colors for eye comfort' },
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
      {/* Background Fill Level */}
      <div 
        className={`absolute inset-x-0 bottom-0 ${fillColor} pointer-events-none rounded-b-[24px] transition-all duration-75`}
        style={{ height: `${pct}%` }}
      />

      {/* Numerical Percentage + Icon */}
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

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onDismiss,
  onAddNotification,
  onOpenControlCenter,
  onOpenSettings,
  onOpenApp,
  isFlashlightOn = false,
  onToggleFlashlight,
  brightness = 85,
  onBrightnessChange,
  volume = 70,
  onVolumeChange,
  isDarkMode = true,
  onToggleDarkMode,
  isPlayingMusic = false,
  onToggleMusic,
  currentTrack = { title: 'Symphony in Blue', artist: 'SUNNY Sound Lab' },
  onNextTrack,
  isCellularOn = true,
  onToggleCellular,
  isWifiOn = true,
  onToggleWifi,
  isBluetoothOn = true,
  onToggleBluetooth,
  isAirplaneOn = false,
  onToggleAirplane,
  isSilentModeOn = false,
  onToggleSilentMode,
  isLowPowerOn = false,
  onToggleLowPower,
  isRotationLocked = true,
  onToggleRotationLock,
  isNightShiftOn = false,
  onToggleNightShift,
  isHotspotOn = false,
  onToggleHotspot,
  focusMode = 'work',
  onCycleFocusMode,
  onShowToast
}) => {
  // Primary View state: 'toggles' is primary by default
  const [activeTab, setActiveTab] = useState<'toggles' | 'notifications'>('toggles');

  // Toggle IDs state with localStorage persistence
  const [activeToggleIds, setActiveToggleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ios27_control_center_toggles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_TOGGLE_IDS;
  });

  // Local state fallbacks if not bound from props
  const [airdropMode, setAirdropMode] = useState<'contacts' | 'everyone' | 'off'>('contacts');
  const [isShazamListening, setIsShazamListening] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(true);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState<number | null>(null);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  // Edit / Customization Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'connectivity' | 'media' | 'utility' | 'display'>('all');
  const [isSummarized, setIsSummarized] = useState(true);

  // Live Stopwatch ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Live Voice Memo ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setVoiceSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  useEffect(() => {
    try {
      localStorage.setItem('ios27_control_center_toggles', JSON.stringify(activeToggleIds));
    } catch (e) {
      // ignore
    }
  }, [activeToggleIds]);

  // Swipe UP gesture from the base of the notification panel
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDraggingBase, setIsDraggingBase] = useState(false);
  const baseTouchStartRef = useRef<{ y: number; time: number } | null>(null);

  if (!isOpen) return null;

  // Internal Toast helper
  const showToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

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

  // REMOVE a toggle with haptic feedback
  const handleRemoveToggle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('heavy');
    playTapSound(400);
    setActiveToggleIds(prev => prev.filter(toggleId => toggleId !== id));
    showToast(`Removed from panel`);
  };

  // ADD a toggle from the gallery with haptic feedback
  const handleAddToggle = (id: string) => {
    triggerHaptic('selection');
    playTapSound(600);
    if (!activeToggleIds.includes(id)) {
      setActiveToggleIds(prev => [...prev, id]);
      showToast(`Added ${ALL_CONTROLS_CATALOG[id]?.name || 'toggle'}`);
    }
    setIsAddGalleryOpen(false);
  };

  // RESET to default layout
  const handleResetDefaults = () => {
    triggerHaptic('doubleTick');
    playTapSound(500);
    setActiveToggleIds(DEFAULT_TOGGLE_IDS);
    setIsEditMode(false);
    showToast(`Reset to default controls`);
  };

  // TOGGLE HANDLERS (Properly Functional System Settings)

  const handleCellularToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onToggleCellular) {
      onToggleCellular();
    }
    showToast(!isCellularOn ? 'Cellular Data: 5G Active' : 'Cellular Data: Off');
  };

  const handleWifiToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onToggleWifi) {
      onToggleWifi();
    }
    showToast(!isWifiOn ? 'Wi-Fi: Connected to Honor-5G' : 'Wi-Fi: Disconnected');
  };

  const handleBluetoothToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onToggleBluetooth) {
      onToggleBluetooth();
    }
    showToast(!isBluetoothOn ? 'Bluetooth: Connected to AirPods Pro' : 'Bluetooth: Off');
  };

  const handleAirDropToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (airdropMode === 'contacts') {
      setAirdropMode('everyone');
      showToast('AirDrop: Everyone for 10 Minutes');
    } else if (airdropMode === 'everyone') {
      setAirdropMode('off');
      showToast('AirDrop: Receiving Off');
    } else {
      setAirdropMode('contacts');
      showToast('AirDrop: Contacts Only');
    }
  };

  const handleAirplaneToggle = () => {
    triggerHaptic('heavy');
    playTapSound(600);
    if (onToggleAirplane) {
      onToggleAirplane();
    }
    showToast(!isAirplaneOn ? 'Airplane Mode: On (Radios disabled)' : 'Airplane Mode: Off (Restored 5G & Wi-Fi)');
  };

  const handleShazamToggle = () => {
    triggerHaptic('doubleTick');
    playTapSound(600);
    if (isShazamListening) return;

    setIsShazamListening(true);
    showToast('Shazam: Listening for music nearby...');
    setTimeout(() => {
      setIsShazamListening(false);
      triggerHaptic('heavy');
      playTapSound(700);
      showToast(`Shazam: Identified "${currentTrack.title}" by ${currentTrack.artist}!`);
      if (onAddNotification) {
        onAddNotification({
          id: `shazam-${Date.now()}`,
          appName: 'Shazam',
          appIcon: 'camera',
          title: 'Track Recognized!',
          content: `${currentTrack.title} — ${currentTrack.artist}`,
          time: 'Just now',
          unread: true
        });
      }
    }, 1800);
  };

  const handleFlashlightToggle = () => {
    triggerHaptic('heavy');
    playTapSound(600);
    if (onToggleFlashlight) {
      onToggleFlashlight();
    }
    showToast(!isFlashlightOn ? 'Flashlight: On' : 'Flashlight: Off');
  };

  const handleAlarmToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    setIsAlarmActive(!isAlarmActive);
    showToast(!isAlarmActive ? 'Alarm: Set for 07:00 AM' : 'Alarm: Off');
  };

  const handleFocusToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onCycleFocusMode) {
      onCycleFocusMode();
    } else {
      showToast('Work Focus: Enabled (Silencing non-essential alerts)');
    }
  };

  const handleScreenRecordingToggle = () => {
    triggerHaptic('heavy');
    playTapSound(700);

    if (isScreenRecording) {
      setIsScreenRecording(false);
      showToast('Screen Recording saved to Gallery');
      if (onAddNotification) {
        onAddNotification({
          id: `recording-${Date.now()}`,
          appName: 'Screen Recorder',
          appIcon: 'gallery',
          title: 'Screen Recording Saved',
          content: 'Tap to view video clip in Gallery.',
          time: 'Just now',
          unread: true
        });
      }
    } else {
      setRecordingCountdown(3);
      const timer = setInterval(() => {
        setRecordingCountdown(c => {
          if (c && c > 1) return c - 1;
          clearInterval(timer);
          setIsScreenRecording(true);
          showToast('Recording screen...');
          return null;
        });
      }, 800);
    }
  };

  const handleLowPowerToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onToggleLowPower) {
      onToggleLowPower();
    }
    showToast(!isLowPowerOn ? 'Low Power Mode: On' : 'Low Power Mode: Off');
  };

  const handleDarkModeToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onToggleDarkMode) {
      onToggleDarkMode();
    }
    showToast(!isDarkMode ? 'Dark Mode: Enabled' : 'Light Mode: Enabled');
  };

  const handleStopwatchToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    setIsStopwatchRunning(!isStopwatchRunning);
    showToast(!isStopwatchRunning ? 'Stopwatch started' : `Stopwatch paused (${stopwatchSeconds}s)`);
  };

  const handleVoiceMemosToggle = () => {
    triggerHaptic('heavy');
    playTapSound(600);
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      showToast(`Voice Memo saved (${voiceSeconds}s)`);
      setVoiceSeconds(0);
      if (onAddNotification) {
        onAddNotification({
          id: `memo-${Date.now()}`,
          appName: 'Voice Memos',
          appIcon: 'notes',
          title: 'New Voice Memo',
          content: `Voice Recording #01 saved to Notes.`,
          time: 'Just now',
          unread: true
        });
      }
    } else {
      setIsVoiceRecording(true);
      showToast('Recording voice memo...');
    }
  };

  const handleRemoteToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    showToast('Apple TV Remote: Connected to Living Room TV');
  };

  const handleSilentModeToggle = () => {
    triggerHaptic('heavy');
    playTapSound(600);
    if (onToggleSilentMode) {
      onToggleSilentMode();
    }
    setSystemMuted(!isSilentModeOn);
    showToast(!isSilentModeOn ? 'Silent Mode: On (Ringer Muted)' : 'Silent Mode: Off (Sound on)');
  };

  const handleRotationLockToggle = () => {
    triggerHaptic('tick');
    playTapSound(600);
    if (onToggleRotationLock) {
      onToggleRotationLock();
    }
    showToast(!isRotationLocked ? 'Portrait Orientation Lock: On' : 'Portrait Orientation Lock: Off');
  };

  const isIncluded = (id: string) => activeToggleIds.includes(id);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col justify-start bg-neutral-950/80 backdrop-blur-3xl text-white overflow-y-auto no-scrollbar animate-in slide-in-from-top duration-300 select-none"
      style={{
        transform: dragOffsetY > 0 ? `translateY(-${dragOffsetY}px)` : undefined,
        transition: isDraggingBase ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out',
        opacity: dragOffsetY > 0 ? Math.max(0.15, 1 - dragOffsetY / 350) : 1,
      }}
    >
      <div 
        className="w-full max-w-[420px] mx-auto flex flex-col gap-3 pt-3 pb-6 px-4 min-h-screen justify-between"
      >
        {/* TOP STATUS BAR: (+) Edit Button, Dynamic Island AI Pill, Power Button */}
        <div className="flex items-center justify-between pt-1 px-1">
          {/* Top Left: (+) Edit / Add Toggles Button */}
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
            title={isEditMode ? 'Done Customizing' : 'Edit & Customize Toggles (+)'}
          >
            {isEditMode ? <Check size={18} strokeWidth={2.8} /> : <Plus size={18} strokeWidth={2.8} />}
          </button>

          {/* Center Dynamic Island pill with AI Agent */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-white/15 text-white/90 text-xs font-semibold shadow-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Meta AI</span>
            <span className="text-[10px] text-white/60">›</span>
          </div>

          {/* Top Right: Power / Dismiss Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              playTapSound(500);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white/90 shadow-md active:scale-95 transition-all"
            title="Close Panel"
          >
            <Power size={16} />
          </button>
        </div>

        {/* Carrier Status Row matching iOS 27 Screenshot */}
        <div className="flex items-center justify-between px-2 text-[11px] font-medium text-white/80">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {isAirplaneOn ? (
                <Plane size={11} className="text-amber-400" />
              ) : (
                <Signal size={11} className={isCellularOn ? 'text-white' : 'text-neutral-500'} />
              )}
              <span>{isAirplaneOn ? 'Airplane Mode' : isCellularOn ? 'VIVO 5G' : 'No Service'}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/60">
              <Signal size={10} />
              <span>Claro BR</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className={`font-bold ${isLowPowerOn ? 'text-amber-400' : 'text-white'}`}>
              68%
            </span>
            <BatteryMedium size={14} className={isLowPowerOn ? 'text-amber-400 fill-amber-400' : 'text-white'} />
          </div>
        </div>

        {/* PRIMARY VIEW SEGMENTED CONTROLLER: [ Notification Toggles | Notifications (N) ] */}
        <div className="flex items-center justify-center p-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 shadow-sm max-w-[340px] mx-auto w-full">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              playTapSound(600);
              setActiveTab('toggles');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'toggles'
                ? 'bg-white text-neutral-950 shadow-md scale-[1.02]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Notification Toggles
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              playTapSound(600);
              setActiveTab('notifications');
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'notifications'
                ? 'bg-white text-neutral-950 shadow-md scale-[1.02]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'notifications' ? 'bg-neutral-900 text-white' : 'bg-cyan-500 text-neutral-950'
              }`}>
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* EDIT / CUSTOMIZE TOOLBAR: Shows Edit, Add, and Reset Buttons Clearly! */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-sm">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-white">
              {isEditMode ? 'Editing Controls' : `${activeToggleIds.length} Controls Active`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-[11px] text-amber-300 hover:text-white underline px-1 transition-colors"
                  title="Reset to default 21 toggles"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddGalleryOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all"
                >
                  <Plus size={13} strokeWidth={3} />
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('doubleTick');
                    playTapSound(600);
                    setIsEditMode(false);
                  }}
                  className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-md flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Check size={13} strokeWidth={3} />
                  <span>Done</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsAddGalleryOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all border border-white/10"
                  title="Add another toggle"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Add Toggle</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('doubleTick');
                    playTapSound(600);
                    setIsEditMode(true);
                  }}
                  className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all"
                  title="Enter Edit Mode to remove or customize toggles"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* TAB 1: NOTIFICATION TOGGLES (PRIMARY) */}
        {activeTab === 'toggles' && (
          <div className="flex items-start gap-2 relative animate-in fade-in duration-200">
            <div className="flex-1 flex flex-col gap-2.5">
              {/* ROW 1: CONNECTIVITY QUAD PILLS */}
              <div className="grid grid-cols-4 gap-2">
                {/* Cellular Data */}
                {isIncluded('cellular') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleCellularToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isCellularOn && !isAirplaneOn
                          ? 'bg-emerald-500 text-white border-emerald-400/50 shadow-emerald-500/30'
                          : 'bg-white/15 text-white/50 border-white/10'
                      }`}
                      title={isCellularOn ? 'Cellular: 5G' : 'Cellular: Off'}
                    >
                      <Signal size={22} className="stroke-[2.2]" />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('cellular', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Cellular Data"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Wi-Fi */}
                {isIncluded('wifi') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleWifiToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isWifiOn && !isAirplaneOn
                          ? 'bg-blue-600 text-white border-blue-400/50 shadow-blue-500/30'
                          : 'bg-white/15 text-white/50 border-white/10'
                      }`}
                      title={isWifiOn ? 'Wi-Fi: Connected' : 'Wi-Fi: Off'}
                    >
                      <Wifi size={22} className="stroke-[2.2]" />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('wifi', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Wi-Fi"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* AirDrop */}
                {isIncluded('airdrop') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleAirDropToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        airdropMode !== 'off'
                          ? 'bg-sky-500 text-white border-sky-400/50 shadow-sky-500/30'
                          : 'bg-white/15 text-white/50 border-white/10'
                      }`}
                      title={`AirDrop: ${airdropMode}`}
                    >
                      <Airplay size={22} className="stroke-[2.2]" />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('airdrop', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove AirDrop"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Bluetooth */}
                {isIncluded('bluetooth') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleBluetoothToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isBluetoothOn && !isAirplaneOn
                          ? 'bg-blue-600 text-white border-blue-400/50 shadow-blue-500/30'
                          : 'bg-white/15 text-white/50 border-white/10'
                      }`}
                      title={isBluetoothOn ? 'Bluetooth: Connected' : 'Bluetooth: Off'}
                    >
                      <Bluetooth size={22} className="stroke-[2.2]" />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('bluetooth', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Bluetooth"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ROW 2: MEDIA PLAYER CAPSULE */}
              {isIncluded('media') && (
                <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                  <div className="w-full px-4 py-2.5 rounded-[24px] bg-white/15 dark:bg-black/40 backdrop-blur-2xl border border-white/20 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                        <Music size={14} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white/90 block truncate">
                          {isPlayingMusic ? currentTrack.title : 'Not Playing'}
                        </span>
                        <span className="text-[10px] text-white/60 block truncate">
                          {isPlayingMusic ? currentTrack.artist : 'Apple Music'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tick');
                          if (onToggleMusic) onToggleMusic();
                        }}
                        className="text-white hover:scale-110 active:scale-90 transition-transform"
                        title={isPlayingMusic ? 'Pause' : 'Play'}
                      >
                        {isPlayingMusic ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tick');
                          playTapSound(500);
                          if (onNextTrack) onNextTrack();
                        }}
                        className="text-white/80 hover:text-white active:scale-90 transition-transform"
                        title="Next Track"
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
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                      title="Remove Media Player"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* ROW 3: 4 CIRCULAR TOGGLES */}
              <div className="grid grid-cols-4 gap-2">
                {/* Shazam */}
                {isIncluded('shazam') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleShazamToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isShazamListening
                          ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white border-cyan-300 animate-pulse'
                          : 'bg-white/15 text-white/80 border-white/15 hover:bg-white/20'
                      }`}
                      title={isShazamListening ? 'Shazam: Listening...' : 'Shazam Music Recognition'}
                    >
                      <Sparkles size={20} className={isShazamListening ? 'animate-spin [animation-duration:3s]' : ''} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('shazam', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Shazam"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Airplane Mode */}
                {isIncluded('airplane') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleAirplaneToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isAirplaneOn
                          ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/30'
                          : 'bg-white/15 text-white/80 border-white/15 hover:bg-white/20'
                      }`}
                      title={isAirplaneOn ? 'Airplane Mode: On' : 'Airplane Mode: Off'}
                    >
                      <Plane size={20} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('airplane', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Airplane Mode"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Flashlight */}
                {isIncluded('flashlight') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleFlashlightToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isFlashlightOn
                          ? 'bg-white text-neutral-950 border-white shadow-white/50'
                          : 'bg-white/15 text-white/80 border-white/15 hover:bg-white/20'
                      }`}
                      title={isFlashlightOn ? 'Flashlight: On' : 'Flashlight: Off'}
                    >
                      <Flashlight size={20} className={isFlashlightOn ? 'fill-neutral-950' : ''} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('flashlight', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Flashlight"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Alarm */}
                {isIncluded('alarm') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleAlarmToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isAlarmActive
                          ? 'bg-orange-500 text-white border-orange-400 shadow-orange-500/30'
                          : 'bg-white/15 text-white/80 border-white/15 hover:bg-white/20'
                      }`}
                      title={isAlarmActive ? 'Alarm: 07:00 AM Active' : 'Alarm: Off'}
                    >
                      <Clock size={20} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('alarm', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Alarm"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ROW 4: DUAL CAPSULES (Focus & Screen Recording) */}
              <div className="grid grid-cols-2 gap-2">
                {/* Work Focus */}
                {isIncluded('focus_work') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <div
                      onClick={handleFocusToggle}
                      className="p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 bg-purple-600/80 border-purple-400/50 text-white shadow-purple-500/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center shrink-0">
                        <Briefcase size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">Work Focus</span>
                        <span className="text-[10px] text-white/70">Active</span>
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('focus_work', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Work Focus"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Screen Recording */}
                {isIncluded('screen_recording') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <div
                      onClick={handleScreenRecordingToggle}
                      className={`p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                        isScreenRecording
                          ? 'bg-rose-600 text-white border-rose-400 shadow-rose-500/40'
                          : recordingCountdown !== null
                          ? 'bg-rose-900/60 border-rose-500 text-white'
                          : 'bg-white/15 text-white/70 border-white/15'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-sm">
                        {recordingCountdown !== null ? (
                          <span>{recordingCountdown}</span>
                        ) : (
                          <CircleDot size={18} className={isScreenRecording ? 'text-white animate-pulse' : 'text-white'} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">Screen Rec</span>
                        <span className="text-[10px] text-white/70">
                          {isScreenRecording ? 'Recording...' : recordingCountdown !== null ? `Starting in ${recordingCountdown}` : 'Ready'}
                        </span>
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('screen_recording', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Screen Recording"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ROW 5: DUAL CAPSULES (Low Power & Dark Mode) */}
              <div className="grid grid-cols-2 gap-2">
                {/* Low Power Mode */}
                {isIncluded('low_power') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <div
                      onClick={handleLowPowerToggle}
                      className={`p-3 rounded-[22px] backdrop-blur-2xl border flex items-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                        isLowPowerOn
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-amber-500/30'
                          : 'bg-white/15 text-white/70 border-white/15'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center shrink-0">
                        <BatteryMedium size={18} className={isLowPowerOn ? 'text-neutral-950 fill-neutral-950' : 'text-white'} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">Low Power</span>
                        <span className="text-[10px] opacity-80">{isLowPowerOn ? 'On (Saving)' : 'Off'}</span>
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('low_power', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Low Power Mode"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Dark Mode */}
                {isIncluded('dark_mode') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <div
                      onClick={handleDarkModeToggle}
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
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Dark Mode"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ROW 6: 4 CIRCULAR TOGGLES */}
              <div className="grid grid-cols-4 gap-2">
                {/* Stopwatch */}
                {isIncluded('stopwatch') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleStopwatchToggle}
                      className={`w-full aspect-square rounded-[22px] flex flex-col items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isStopwatchRunning
                          ? 'bg-gradient-to-tr from-fuchsia-600 to-indigo-600 text-white border-fuchsia-400'
                          : 'bg-white/15 text-white/80 border-white/15'
                      }`}
                      title={isStopwatchRunning ? `Stopwatch: ${stopwatchSeconds}s` : 'Stopwatch'}
                    >
                      <Timer size={18} />
                      {stopwatchSeconds > 0 && (
                        <span className="text-[9px] font-mono font-bold mt-0.5">{stopwatchSeconds}s</span>
                      )}
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('stopwatch', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Stopwatch"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Voice Memos */}
                {isIncluded('voice_memos') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleVoiceMemosToggle}
                      className={`w-full aspect-square rounded-[22px] flex flex-col items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isVoiceRecording
                          ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                          : 'bg-white/15 text-white/80 border-white/15'
                      }`}
                      title={isVoiceRecording ? `Recording memo: ${voiceSeconds}s` : 'Voice Memos'}
                    >
                      <Mic size={18} />
                      {voiceSeconds > 0 && (
                        <span className="text-[9px] font-mono font-bold mt-0.5">{voiceSeconds}s</span>
                      )}
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('voice_memos', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Voice Memos"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Web Translate */}
                {isIncluded('web_translate') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('tick');
                        playTapSound(600);
                        showToast('Safari Translate: Web grounded');
                      }}
                      className="w-full aspect-square rounded-[22px] bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 border border-white/15 backdrop-blur-2xl shadow-md active:scale-95 transition-all"
                      title="Open Translate & Browser"
                    >
                      <Globe size={20} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('web_translate', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Web Translate"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Remote */}
                {isIncluded('remote') && (
                  <div className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleRemoteToggle}
                      className="w-full aspect-square rounded-[22px] bg-slate-700/80 hover:bg-slate-700 flex items-center justify-center text-white border border-slate-500/50 backdrop-blur-2xl shadow-md active:scale-95 transition-all"
                      title="Apple TV Remote"
                    >
                      <Tv size={20} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('remote', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Remote"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ROW 7: SLIDERS & ACTION TOGGLES */}
              <div className="grid grid-cols-4 gap-2 h-32 items-stretch">
                {/* Brightness Slider */}
                {isIncluded('brightness') && (
                  <div className={`relative group h-full ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
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
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Brightness Slider"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Volume Slider */}
                {isIncluded('volume') && (
                  <div className={`relative group h-full ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
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
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Volume Slider"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Silent Mode */}
                {isIncluded('silent_mode') && (
                  <div className={`relative group h-full flex flex-col justify-end ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleSilentModeToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isSilentModeOn
                          ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
                          : 'bg-white/15 text-white/80 border-white/15'
                      }`}
                      title={isSilentModeOn ? 'Silent Mode: On' : 'Silent Mode: Off'}
                    >
                      <BellOff size={20} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('silent_mode', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Silent Mode"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}

                {/* Rotation Lock */}
                {isIncluded('rotation_lock') && (
                  <div className={`relative group h-full flex flex-col justify-end ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                    <button
                      type="button"
                      onClick={handleRotationLockToggle}
                      className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                        isRotationLocked
                          ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
                          : 'bg-white/15 text-white/80 border-white/15'
                      }`}
                      title={isRotationLocked ? 'Orientation: Locked' : 'Orientation: Unlocked'}
                    >
                      <RotateCw size={20} />
                    </button>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveToggle('rotation_lock', e)}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                        title="Remove Rotation Lock"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ANY CUSTOM CONTROLS ADDED BY USER FROM GALLERY */}
              {activeToggleIds.filter(id => !DEFAULT_TOGGLE_IDS.includes(id)).length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10">
                  {activeToggleIds.filter(id => !DEFAULT_TOGGLE_IDS.includes(id)).map((id) => {
                    const item = ALL_CONTROLS_CATALOG[id];
                    if (!item) return null;
                    return (
                      <div key={id} className={`relative group ${isEditMode ? 'animate-[pulse_1.5s_infinite]' : ''}`}>
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('tick');
                            playTapSound(600);
                            if (id === 'camera') {
                              onClose();
                              onOpenApp?.('camera');
                            } else if (id === 'calculator') {
                              onClose();
                              onOpenApp?.('calculator');
                            } else if (id === 'notes') {
                              onClose();
                              onOpenApp?.('notes');
                            } else if (id === 'qr_scanner') {
                              onClose();
                              onOpenApp?.('camera');
                            } else if (id === 'hotspot') {
                              if (onToggleHotspot) onToggleHotspot();
                              showToast(!isHotspotOn ? 'Personal Hotspot: On' : 'Personal Hotspot: Off');
                            } else if (id === 'eye_comfort') {
                              if (onToggleNightShift) onToggleNightShift();
                              showToast(!isNightShiftOn ? 'Night Shift / Eye Comfort: On' : 'Night Shift / Eye Comfort: Off');
                            }
                          }}
                          className={`w-full aspect-square rounded-[22px] flex items-center justify-center backdrop-blur-2xl border transition-all active:scale-95 shadow-md ${
                            (id === 'hotspot' && isHotspotOn) || (id === 'eye_comfort' && isNightShiftOn)
                              ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30'
                              : 'bg-white/20 hover:bg-white/30 text-white border-white/25'
                          }`}
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
                            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-30 active:scale-90 transition-transform"
                            title={`Remove ${item.name}`}
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* "+ Add a Control" button card */}
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGalleryOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs flex items-center gap-2 shadow-lg backdrop-blur-xl active:scale-95 transition-all"
                >
                  <Plus size={16} strokeWidth={2.8} />
                  <span>+ Add a Control</span>
                </button>
              </div>
            </div>

            {/* Right Edge Category Navigation Rail */}
            <div className="w-6 flex flex-col items-center justify-center gap-4 py-6 text-white/40">
              <button type="button" className="text-white hover:scale-125 transition-transform" title="Favorites">
                <Heart size={14} className="fill-white" />
              </button>
              <button type="button" className="hover:text-white hover:scale-125 transition-transform" title="Music">
                <Music size={14} />
              </button>
              <button type="button" className="hover:text-white hover:scale-125 transition-transform" title="Home">
                <Home size={14} />
              </button>
              <button type="button" className="hover:text-white hover:scale-125 transition-transform" title="Cellular">
                <Signal size={14} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS VIEW */}
        {activeTab === 'notifications' && (
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar animate-in fade-in duration-200">
            {/* Apple Intelligence Summary */}
            {notifications.length > 0 && isSummarized && (
              <div className="p-3 rounded-[24px] bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-400/40 backdrop-blur-2xl shadow-lg flex flex-col gap-1 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold">
                    <Sparkles size={13} className="text-purple-300 animate-pulse" />
                    <span>Apple Intelligence · Notification Recap</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSummarized(false)}
                    className="text-[10px] text-purple-200/80 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-neutral-200 leading-snug">
                  You have {notifications.length} updates: upcoming flight CA1832 departing on time, new team comments, and system battery status.
                </p>
              </div>
            )}

            {/* Notifications Header */}
            <div className="flex items-center justify-between px-2 pt-1 border-b border-white/10 pb-1.5">
              <span className="text-xs font-bold text-white/90">
                Active Notifications ({notifications.length})
              </span>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('heavy');
                    playTapSound(500);
                    onClearAll();
                  }}
                  className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 transition-colors"
                  title="Clear All Notifications"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-2.5 flex-1">
              {notifications.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 flex flex-col items-center gap-2">
                  <CheckCheck size={28} className="text-neutral-500" />
                  <p className="text-xs font-medium">No New Notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      triggerHaptic('tick');
                      if (onOpenApp) {
                        onClose();
                        onOpenApp(n.appIcon);
                      }
                    }}
                    className="p-3.5 rounded-[26px] bg-white/10 hover:bg-white/15 border border-white/15 shadow-lg backdrop-blur-2xl flex flex-col gap-1.5 relative group cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-neutral-900 flex items-center justify-center shadow-sm">
                          <AppIcon iconName={n.appIcon} size="mini" isDraggable={false} />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-tight">{n.appName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/60 font-mono">{n.time}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic('tick');
                            playTapSound(500);
                            onDismiss(n.id);
                          }}
                          className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white/80 transition-colors"
                          aria-label="Dismiss"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </div>

                    <div className="pl-8 pr-1">
                      <h4 className="text-xs font-bold text-white tracking-tight">{n.title}</h4>
                      <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5">{n.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bottom Grab Handle Bar at Notification Panel Base */}
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
          title="Swipe up from base or tap to close notification panel"
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
            className="w-full max-w-[420px] mx-auto bg-neutral-900 border border-white/20 rounded-[32px] p-5 flex flex-col gap-3.5 max-h-[85vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Add Notification Controls</h3>
                <p className="text-xs text-neutral-400">Tap + Add to place on your notification panel</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGalleryOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['all', 'connectivity', 'utility', 'media', 'display'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                    galleryFilter === cat
                      ? 'bg-cyan-500 text-neutral-950 font-bold'
                      : 'bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search controls (e.g. Camera, Calculator, Wi-Fi)..."
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Controls List to Add */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-1">
              {Object.entries(ALL_CONTROLS_CATALOG)
                .filter(([id, item]) => {
                  const notAdded = !activeToggleIds.includes(id);
                  const matchesFilter = galleryFilter === 'all' || item.category === galleryFilter;
                  const matchesSearch = !gallerySearch || item.name.toLowerCase().includes(gallerySearch.toLowerCase()) || item.description.toLowerCase().includes(gallerySearch.toLowerCase());
                  return notAdded && matchesFilter && matchesSearch;
                })
                .map(([id, item]) => (
                  <div
                    key={id}
                    onClick={() => handleAddToggle(id)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 flex items-center justify-center text-white border border-white/15 transition-colors">
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
                        {id === 'cellular' && <Signal size={18} />}
                        {id === 'wifi' && <Wifi size={18} />}
                        {id === 'airdrop' && <Airplay size={18} />}
                        {id === 'bluetooth' && <Bluetooth size={18} />}
                        {id === 'airplane' && <Plane size={18} />}
                        {id === 'flashlight' && <Flashlight size={18} />}
                        {id === 'dark_mode' && <Moon size={18} />}
                        {id === 'brightness' && <Sun size={18} />}
                        {id === 'volume' && <Volume2 size={18} />}
                        {id === 'silent_mode' && <BellOff size={18} />}
                        {id === 'rotation_lock' && <RotateCw size={18} />}
                        {id === 'web_translate' && <Globe size={18} />}
                        {id === 'media' && <Music size={18} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{item.name}</h4>
                        <span className="text-[10px] text-neutral-400 line-clamp-1">{item.description}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1 rounded-full bg-cyan-500 group-hover:bg-cyan-400 text-neutral-950 font-bold text-xs shadow-md transition-all"
                    >
                      + Add
                    </button>
                  </div>
                ))}

              {Object.keys(ALL_CONTROLS_CATALOG).every(id => activeToggleIds.includes(id)) && (
                <div className="py-10 text-center text-xs text-neutral-400 flex flex-col items-center gap-2">
                  <CheckCheck size={24} className="text-emerald-400" />
                  <span>All available notification controls are added to your panel!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
