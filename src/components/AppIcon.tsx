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
  X
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

  // Hold for less than a second (450ms) refs
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
    }, 450); // Less than a second
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
    mini: 'w-7 h-7 rounded-[9px]',
    sm: 'w-11 h-11 rounded-[14px]',
    md: 'w-[58px] h-[58px] rounded-[18px]',
    lg: 'w-[68px] h-[68px] rounded-[22px]',
  };

  const iconSizes = {
    mini: 14,
    sm: 20,
    md: 26,
    lg: 32,
  };

  const renderIconContent = () => {
    switch (iconName) {
      case 'phone':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-inner">
            <Phone size={iconSizes[size]} className="fill-white stroke-none" />
          </div>
        );

      case 'messages':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-inner">
            <MessageSquare size={iconSizes[size]} className="fill-white stroke-none" />
          </div>
        );

      case 'browser':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 to-transparent"></div>
            <Globe size={iconSizes[size]} className="text-white relative z-10 stroke-[2.2]" />
          </div>
        );

      case 'camera':
        return (
          <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-950 flex items-center justify-center relative overflow-hidden border border-neutral-700/50">
            {/* Outer lens ring with gold rim */}
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-700 flex items-center justify-center border border-amber-400/40 shadow-inner">
              {/* Inner lens with blue reflection */}
              <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center relative">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-cyan-300/80 blur-[0.5px]"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400/30"></div>
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white to-slate-100 flex items-center justify-center relative overflow-hidden shadow-sm">
            {/* SUNNY 4-color floral petal motif */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-rose-500/90 mix-blend-multiply"></div>
              <div className="absolute -left-1 w-3.5 h-3.5 rounded-full bg-amber-400/90 mix-blend-multiply"></div>
              <div className="absolute -right-1 w-3.5 h-3.5 rounded-full bg-sky-500/90 mix-blend-multiply"></div>
              <div className="absolute -bottom-1 w-3.5 h-3.5 rounded-full bg-teal-400/90 mix-blend-multiply"></div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="w-full h-full bg-gradient-to-b from-slate-200 to-slate-400 flex items-center justify-center text-slate-800 shadow-inner relative">
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-b from-slate-100 to-slate-300 flex items-center justify-center shadow-sm">
              <Settings size={iconSizes[size]} className="text-slate-700 stroke-[2.2] animate-[spin_16s_linear_infinite]" />
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-neutral-900 shadow-inner">
            <div className="w-3/4 h-3/4 bg-white/95 rounded-[6px] shadow-sm p-1 flex flex-col justify-between">
              <div className="w-full h-1 bg-amber-500 rounded-full"></div>
              <div className="w-3/4 h-0.5 bg-neutral-300 rounded-full"></div>
              <div className="w-4/5 h-0.5 bg-neutral-300 rounded-full"></div>
              <div className="w-1/2 h-0.5 bg-neutral-300 rounded-full"></div>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-950 flex flex-col items-center justify-center p-1.5 text-white gap-0.5">
            <div className="w-full flex justify-between px-1 text-[9px] font-mono text-amber-400">=</div>
            <div className="grid grid-cols-2 gap-1 w-full flex-1">
              <div className="bg-neutral-700 rounded-xs flex items-center justify-center text-[10px]">+</div>
              <div className="bg-amber-600 rounded-xs flex items-center justify-center text-[10px]">−</div>
              <div className="bg-neutral-700 rounded-xs flex items-center justify-center text-[10px]">×</div>
              <div className="bg-amber-600 rounded-xs flex items-center justify-center text-[10px]">÷</div>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="w-full h-full bg-gradient-to-b from-white to-rose-50 flex items-center justify-center relative overflow-hidden">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-rose-500 flex items-center justify-center">
                <Heart size={iconSizes[size] - 6} className="text-rose-600 fill-rose-500" />
              </div>
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white relative overflow-hidden">
            <div className="w-3/4 h-3/4 rounded-full border border-white/20 flex items-center justify-center">
              <Music size={iconSizes[size]} className="text-white drop-shadow" />
            </div>
          </div>
        );

      case 'themes':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 flex items-center justify-center text-white">
            <Palette size={iconSizes[size]} className="drop-shadow" />
          </div>
        );

      case 'weather':
        return (
          <div className="w-full h-full bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 flex items-center justify-center text-white relative">
            <CloudSun size={iconSizes[size]} className="drop-shadow-md text-white" />
          </div>
        );

      case 'files':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white">
            <Folder size={iconSizes[size]} className="fill-white stroke-none" />
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
          <div className="w-full h-full bg-white flex items-center justify-center relative shadow-inner">
            <div className="w-full h-full rounded-full relative flex items-center justify-center">
              {/* Hour markers */}
              <div className="absolute top-1 w-0.5 h-1 bg-neutral-400"></div>
              <div className="absolute bottom-1 w-0.5 h-1 bg-neutral-400"></div>
              <div className="absolute left-1 w-1 h-0.5 bg-neutral-400"></div>
              <div className="absolute right-1 w-1 h-0.5 bg-neutral-400"></div>
              {/* Hands */}
              <div 
                className="absolute w-0.5 h-2.5 bg-neutral-900 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${hourAngle}deg)` }}
              />
              <div 
                className="absolute w-0.5 h-3.5 bg-neutral-600 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${minAngle}deg)` }}
              />
              <div 
                className="absolute w-[1px] h-4 bg-red-500 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${secAngle}deg)` }}
              />
              <div className="w-1 h-1 rounded-full bg-red-500 z-10"></div>
            </div>
          </div>
        );
      }

      case 'manager':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-cyan-600 to-teal-400 flex items-center justify-center text-white">
            <ShieldCheck size={iconSizes[size]} className="drop-shadow stroke-[2.2]" />
          </div>
        );

      case 'yoyo':
        return (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-900 via-purple-900 to-neutral-950 flex items-center justify-center relative overflow-hidden">
            {/* Holographic glowing orb */}
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-400 to-amber-300 blur-[2px] opacity-80 animate-pulse"></div>
            <div className="absolute w-1/2 h-1/2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50">
              <Sparkles size={iconSizes[size] - 8} className="text-white animate-spin [animation-duration:8s]" />
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-tr from-neutral-700 to-neutral-600 flex items-center justify-center text-white">
            <FileText size={iconSizes[size]} />
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
      <div 
        className={`${sizeClasses[size]} relative overflow-hidden shadow-md group-active:scale-90 transition-transform duration-150 ring-1 ring-white/10`}
      >
        {renderIconContent()}
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none"></div>

        {/* Badge counter */}
        {showBadge > 0 && !isEditMode && (
          <div className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-md border border-white/40">
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

      {label && size !== 'mini' && (
        <span className="text-[11px] font-medium text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight text-center truncate max-w-[68px]">
          {label}
        </span>
      )}
    </div>
  );
};
