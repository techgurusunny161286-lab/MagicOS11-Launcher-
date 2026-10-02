import React, { useEffect, useState, useRef } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { 
  Phone, 
  MessageSquare, 
  Globe, 
  Camera, 
  Settings, 
  FileText, 
  Calculator, 
  Heart, 
  Music, 
  Palette, 
  CloudSun, 
  Folder, 
  ShieldCheck, 
  Sparkles,
  Search,
  X,
  Play,
  Mail,
  MapPin,
  Calendar,
  Mic,
  Video,
  Languages,
  User,
  HardDrive
} from 'lucide-react';

interface AppIconProps {
  iconName: string;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  showBadge?: number;
  className?: string;
  label?: string;
  onOpen?: () => void;
  isDraggable?: boolean;
  onDragStartPortal?: (title: string) => void;
  onHold?: (e: React.MouseEvent | React.TouchEvent, iconName: string, label?: string) => void;
  isEditMode?: boolean;
  onRemove?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
  iconName,
  size = 'md',
  showBadge = 0,
  className = '',
  label,
  onOpen,
  isDraggable = true,
  onDragStartPortal,
  onHold,
  isEditMode = false,
  onRemove,
}) => {
  // Live clock hands for Clock icon
  const [time, setTime] = useState(new Date());

  // Hold timer ref
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHeldRef = useRef(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const startHoldTimer = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onHold) return;
    isHeldRef.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartPos.current = { x: clientX, y: clientY };

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      isHeldRef.current = true;
      triggerHaptic('doubleTick');
      if (onHold) {
        onHold(e, iconName, label);
      }
    }, 450);
  };

  const cancelHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartPos.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const dist = Math.hypot(clientX - touchStartPos.current.x, clientY - touchStartPos.current.y);
    if (dist > 10) {
      cancelHoldTimer();
    }
  };

  useEffect(() => {
    if (iconName === 'clock') {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [iconName]);

  const sizeClasses = {
    mini: 'w-7 h-7 rounded-[10px]',
    sm: 'w-11 h-11 rounded-[15px]',
    md: 'w-[60px] h-[60px] rounded-[19px]',
    lg: 'w-[70px] h-[70px] rounded-[23px]',
  };

  const iconSizes = {
    mini: 14,
    sm: 20,
    md: 26,
    lg: 32,
  };

  const renderIconContent = () => {
    switch (iconName.toLowerCase()) {
      case 'phone':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#34d399] via-[#10b981] to-[#059669] flex items-center justify-center text-white relative">
            <div className="w-3/4 h-3/4 rounded-full bg-white/20 blur-[1px] absolute -top-1 -left-1 pointer-events-none"></div>
            <Phone size={iconSizes[size]} className="fill-white stroke-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
          </div>
        );

      case 'messages':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] flex items-center justify-center text-white relative">
            <div className="w-3/4 h-3/4 rounded-full bg-white/20 blur-[1px] absolute -top-1 -left-1 pointer-events-none"></div>
            <MessageSquare size={iconSizes[size]} className="fill-white stroke-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
          </div>
        );

      case 'browser':
      case 'chrome':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-100 to-slate-200 flex items-center justify-center relative shadow-inner">
            {/* 3D Chrome Trifold Swirl */}
            <div className="w-4/5 h-4/5 rounded-full relative flex items-center justify-center overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] border border-slate-300/80">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-[#ea4335]"></div>
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-[#fbbc05]"></div>
              <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[#34a853]"></div>
              {/* Center 3D Blue Glass Dome */}
              <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-b from-[#4285f4] to-[#1a73e8] border-2 border-white shadow-md relative z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/60 blur-[0.5px] absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#262626] via-[#171717] to-[#0a0a0a] flex items-center justify-center relative shadow-inner border border-neutral-700/60">
            {/* Outer 3D Lens Barrel with Gold/Metallic Rim */}
            <div className="w-[82%] h-[82%] rounded-full bg-gradient-to-tr from-[#1f1f1f] to-[#404040] flex items-center justify-center border-2 border-amber-400/60 shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_3px_rgba(255,255,255,0.4)] relative">
              {/* Inner Optical Glass with Blue Reflection */}
              <div className="w-[68%] h-[68%] rounded-full bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1e1b4b] flex items-center justify-center relative shadow-inner border border-cyan-500/40">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-300 to-white/90 blur-[0.6px] absolute top-1 left-1.5 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                <div className="w-2 h-2 rounded-full bg-rose-500/70 absolute bottom-1.5 right-1.5 blur-[0.5px]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-white/30"></div>
              </div>
            </div>
            {/* Top Red Sensor Accent */}
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5 shadow-[0_0_4px_#f43f5e]"></div>
          </div>
        );

      case 'gallery':
      case 'photos':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center relative shadow-inner border border-slate-200">
            {/* 3D 4-Color Flower Petal Motif */}
            <div className="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)]">
              <div className="absolute -top-1 w-4 h-4 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 shadow-sm opacity-95"></div>
              <div className="absolute -left-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-sm opacity-95"></div>
              <div className="absolute -right-1 w-4 h-4 rounded-full bg-gradient-to-l from-sky-400 to-sky-600 shadow-sm opacity-95"></div>
              <div className="absolute -bottom-1 w-4 h-4 rounded-full bg-gradient-to-t from-teal-400 to-emerald-500 shadow-sm opacity-95"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md relative z-10"></div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="w-full h-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center text-slate-800 shadow-inner relative border border-slate-300">
            <div className="w-[78%] h-[78%] rounded-full bg-gradient-to-b from-slate-100 to-slate-300 flex items-center justify-center shadow-[0_3px_6px_rgba(0,0,0,0.25),inset_0_2px_3px_rgba(255,255,255,0.8)] border border-slate-300">
              <Settings size={iconSizes[size]} className="text-slate-700 stroke-[2.2] animate-[spin_20s_linear_infinite] drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] flex items-center justify-center text-neutral-900 shadow-inner relative">
            {/* 3D Notepad Sheet */}
            <div className="w-[76%] h-[80%] bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.9)] p-1.5 flex flex-col justify-between border-t-4 border-t-amber-500 border-b border-neutral-300">
              <div className="w-full h-1 bg-amber-400/80 rounded-full"></div>
              <div className="w-4/5 h-0.5 bg-neutral-300 rounded-full"></div>
              <div className="w-3/4 h-0.5 bg-neutral-300 rounded-full"></div>
              <div className="w-1/2 h-0.5 bg-neutral-300 rounded-full"></div>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#262626] to-[#171717] flex flex-col items-center justify-center p-2 text-white gap-1 border border-neutral-700/60 shadow-inner">
            <div className="w-full flex justify-end px-1 text-[10px] font-mono text-amber-400 font-bold leading-none">=</div>
            <div className="grid grid-cols-2 gap-1 w-full flex-1">
              <div className="bg-neutral-700/90 rounded-md flex items-center justify-center text-[10px] font-bold shadow-[0_2px_3px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]">+</div>
              <div className="bg-amber-600 rounded-md flex items-center justify-center text-[10px] font-bold shadow-[0_2px_3px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]">−</div>
              <div className="bg-neutral-700/90 rounded-md flex items-center justify-center text-[10px] font-bold shadow-[0_2px_3px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]">×</div>
              <div className="bg-amber-600 rounded-md flex items-center justify-center text-[10px] font-bold shadow-[0_2px_3px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]">÷</div>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-rose-50 to-rose-100 flex items-center justify-center relative shadow-inner border border-rose-200">
            <div className="w-[78%] h-[78%] rounded-full bg-gradient-to-b from-rose-500 to-rose-600 flex items-center justify-center shadow-[0_3px_6px_rgba(225,29,72,0.4),inset_0_2px_2px_rgba(255,255,255,0.5)]">
              <Heart size={iconSizes[size] - 6} className="text-white fill-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        );

      case 'music':
      case 'spotify':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#a855f7] via-[#7c3aed] to-[#4c1d95] flex items-center justify-center text-white relative shadow-inner border border-purple-400/30">
            {/* 3D Vinyl Grooves */}
            <div className="w-[78%] h-[78%] rounded-full bg-gradient-to-tr from-purple-900 via-indigo-900 to-neutral-900 flex items-center justify-center border-2 border-white/20 shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative">
              <div className="w-[50%] h-[50%] rounded-full border border-white/10 flex items-center justify-center">
                <Music size={iconSizes[size] - 4} className="text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
          </div>
        );

      case 'themes':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-white shadow-inner">
            <Palette size={iconSizes[size]} className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]" />
          </div>
        );

      case 'weather':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] flex items-center justify-center text-white relative shadow-inner">
            <CloudSun size={iconSizes[size]} className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] text-white" />
          </div>
        );

      case 'files':
      case 'drive':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] flex items-center justify-center text-white shadow-inner relative">
            <Folder size={iconSizes[size] + 2} className="fill-white stroke-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]" />
          </div>
        );

      case 'clock': {
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();
        const secAngle = seconds * 6;
        const minAngle = minutes * 6 + seconds * 0.1;
        const hourAngle = (hours % 12) * 30 + minutes * 0.5;

        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-200 flex items-center justify-center relative shadow-inner border border-slate-300">
            <div className="w-[84%] h-[84%] rounded-full bg-white relative flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] border border-slate-200">
              {/* Hour markers */}
              <div className="absolute top-1 w-0.5 h-1 bg-neutral-700"></div>
              <div className="absolute bottom-1 w-0.5 h-1 bg-neutral-700"></div>
              <div className="absolute left-1 w-1 h-0.5 bg-neutral-700"></div>
              <div className="absolute right-1 w-1 h-0.5 bg-neutral-700"></div>
              {/* Hands with 3D drop shadow */}
              <div 
                className="absolute w-0.5 h-3 bg-neutral-900 rounded-full origin-bottom bottom-1/2 shadow-sm"
                style={{ transform: `rotate(${hourAngle}deg)` }}
              />
              <div 
                className="absolute w-0.5 h-4 bg-neutral-700 rounded-full origin-bottom bottom-1/2 shadow-sm"
                style={{ transform: `rotate(${minAngle}deg)` }}
              />
              <div 
                className="absolute w-[1.5px] h-4.5 bg-rose-500 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${secAngle}deg)` }}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 z-10 shadow-sm border border-white"></div>
            </div>
          </div>
        );
      }

      case 'youtube':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#ef4444] via-[#dc2626] to-[#b91c1c] flex items-center justify-center text-white relative shadow-inner border border-rose-400/40">
            <div className="w-[62%] h-[46%] rounded-xl bg-white flex items-center justify-center shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
              <Play size={iconSizes[size] - 10} className="text-rose-600 fill-rose-600 translate-x-0.5" />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#25d366] via-[#128c7e] to-[#075e54] flex items-center justify-center text-white relative shadow-inner border border-emerald-300/40">
            <div className="w-[74%] h-[74%] rounded-full bg-white flex items-center justify-center shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
              <Phone size={iconSizes[size] - 8} className="fill-[#128c7e] text-[#128c7e]" />
            </div>
          </div>
        );

      case 'gmail':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center relative shadow-inner border border-slate-200">
            <Mail size={iconSizes[size] + 2} className="text-rose-600 drop-shadow-[0_2px_4px_rgba(225,29,72,0.35)] stroke-[2.4]" />
          </div>
        );

      case 'maps':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center relative shadow-inner border border-slate-200 overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 gap-0.5 p-1 opacity-70">
              <div className="bg-emerald-100 rounded-xs"></div>
              <div className="bg-sky-100 rounded-xs"></div>
              <div className="bg-amber-100 rounded-xs"></div>
              <div className="bg-slate-100 rounded-xs"></div>
            </div>
            <MapPin size={iconSizes[size] + 2} className="text-rose-600 fill-rose-500 drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)] relative z-10" />
          </div>
        );

      case 'playstore':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center relative shadow-inner border border-slate-200">
            <Play size={iconSizes[size]} className="text-cyan-500 fill-cyan-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] rotate-90" />
          </div>
        );

      case 'contacts':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] flex items-center justify-center text-white relative shadow-inner">
            <div className="w-[74%] h-[74%] rounded-full bg-white flex items-center justify-center shadow-[0_3px_6px_rgba(0,0,0,0.3)]">
              <User size={iconSizes[size] - 6} className="text-sky-600 fill-sky-600" />
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white via-slate-50 to-slate-200 flex flex-col items-center justify-between p-1.5 shadow-inner border border-slate-200">
            <div className="w-full bg-rose-600 rounded-t-md text-[8px] font-bold text-white text-center py-0.5 uppercase tracking-wider">
              FRI
            </div>
            <span className="text-base font-black text-neutral-900 leading-none mb-1 font-mono">
              26
            </span>
          </div>
        );

      case 'recorder':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#262626] to-[#0a0a0a] flex items-center justify-center text-white relative shadow-inner border border-neutral-700/60">
            <Mic size={iconSizes[size]} className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          </div>
        );

      case 'meet':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] flex items-center justify-center text-white relative shadow-inner">
            <Video size={iconSizes[size]} className="fill-white stroke-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
          </div>
        );

      case 'translate':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] flex items-center justify-center text-white relative shadow-inner">
            <Languages size={iconSizes[size]} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
          </div>
        );

      case 'grid':
      case 'drawer':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#38bdf8]/40 via-cyan-900/60 to-slate-950/80 backdrop-blur-xl flex items-center justify-center relative shadow-inner border border-cyan-400/40">
            <div className="grid grid-cols-2 gap-1.5 p-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-white shadow-sm"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-white shadow-sm"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-white shadow-sm"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-white shadow-sm"></div>
            </div>
          </div>
        );

      case 'manager':
      case 'safety':
        return (
          <div className="w-full h-full bg-gradient-to-b from-blue-600 via-cyan-600 to-teal-500 flex items-center justify-center text-white relative shadow-inner">
            <ShieldCheck size={iconSizes[size]} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] stroke-[2.4]" />
          </div>
        );

      case 'yoyo':
      case 'assistant':
        return (
          <div className="w-full h-full bg-gradient-to-b from-[#312e81] via-[#1e1b4b] to-[#0f172a] flex items-center justify-center relative overflow-hidden border border-indigo-500/40 shadow-inner">
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-400 to-amber-300 blur-[3px] opacity-80 animate-pulse"></div>
            <div className="absolute w-1/2 h-1/2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50 shadow-lg">
              <Sparkles size={iconSizes[size] - 8} className="text-white animate-spin [animation-duration:8s] drop-shadow" />
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-b from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-inner">
            <FileText size={iconSizes[size]} className="drop-shadow" />
          </div>
        );
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStartPortal) {
      e.dataTransfer.setData('text/plain', label || iconName);
      onDragStartPortal(label || iconName);
    }
  };

  return (
    <div 
      className={`relative flex flex-col items-center gap-1 group cursor-pointer select-none ${
        isEditMode ? 'animate-pulse' : ''
      } ${className}`}
      onTouchStart={(e) => {
        triggerHaptic('smooth');
        startHoldTimer(e);
      }}
      onTouchMove={handlePointerMove}
      onTouchEnd={cancelHoldTimer}
      onTouchCancel={cancelHoldTimer}
      onMouseDown={(e) => {
        triggerHaptic('smooth');
        startHoldTimer(e);
      }}
      onMouseMove={handlePointerMove}
      onMouseUp={cancelHoldTimer}
      onMouseLeave={cancelHoldTimer}
      onClick={(e) => {
        if (isHeldRef.current) {
          isHeldRef.current = false;
          return;
        }
        cancelHoldTimer();
        triggerHaptic('tick');
        if (onOpen) onOpen();
      }}
      draggable={isDraggable && !isEditMode}
      onDragStart={(e) => {
        cancelHoldTimer();
        triggerHaptic('selection');
        handleDragStart(e);
      }}
    >
      {/* 3D Glass Extruded Container with Specular Highlights and Bottom Extrusion */}
      <div 
        className={`${sizeClasses[size]} relative overflow-hidden transition-all duration-150
          /* 3D Extruded Depth Shadows & Highlights */
          shadow-[0_12px_24px_-4px_rgba(0,0,0,0.65),0_6px_12px_-2px_rgba(0,0,0,0.45),inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2.5px_4px_rgba(0,0,0,0.45)]
          /* 3D Physical Extruded Bevel Border */
          border-b-[3px] border-b-black/35 border-t border-t-white/60 border-x border-x-white/20
          /* Outer Halo Ring */
          ring-1 ring-white/20
          /* Tactile 3D Button Press Effect */
          group-active:scale-[0.91] group-active:translate-y-1 group-active:shadow-[0_4px_8px_rgba(0,0,0,0.6)]`}
      >
        {/* Render the inner icon graphics */}
        {renderIconContent()}

        {/* 3D Curved Specular Gloss Bubble across top half */}
        <div className="absolute inset-x-0.5 top-0.5 h-[46%] rounded-t-[16px] bg-gradient-to-b from-white/60 via-white/18 to-transparent pointer-events-none z-20"></div>

        {/* Inner Glass Edge Refraction Rim */}
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/35 pointer-events-none z-20"></div>

        {/* Badge counter */}
        {showBadge > 0 && !isEditMode && (
          <div className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg border border-white/80 z-30">
            {showBadge > 99 ? '99+' : showBadge}
          </div>
        )}

        {/* Edit Mode Remove Badge (✕) */}
        {isEditMode && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cancelHoldTimer();
              triggerHaptic('heavy');
              onRemove();
            }}
            className="absolute top-1 right-1 z-30 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg border border-white/80 active:scale-90 transition-transform cursor-pointer"
            title={`Remove ${label || iconName}`}
          >
            <X size={11} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Label with 3D drop shadow */}
      {label && size !== 'mini' && (
        <span className="text-[11px] font-semibold text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight text-center truncate max-w-[68px]">
          {label}
        </span>
      )}
    </div>
  );
};
