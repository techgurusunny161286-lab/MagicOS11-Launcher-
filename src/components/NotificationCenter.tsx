import React, { useState, useRef } from 'react';
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
  ChevronUp
} from 'lucide-react';
import { NotificationItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { playTapSound } from '../utils/sound';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  onOpenControlCenter?: () => void;
  onOpenSettings?: () => void;
  isFlashlightOn?: boolean;
  onToggleFlashlight?: () => void;
  brightness?: number;
  onBrightnessChange?: (val: number) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onDismiss,
  onOpenControlCenter,
  onOpenSettings,
  isFlashlightOn = false,
  onToggleFlashlight,
  brightness = 85,
  onBrightnessChange,
}) => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [btEnabled, setBtEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);
  const touchStartRef = useRef<{ y: number; x: number } | null>(null);

  if (!isOpen) return null;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

  // Gesture Recognition: Swiping/Swapping UP from anywhere in notification panel closes it!
  const handleTouchStart = (clientY: number, clientX: number) => {
    touchStartRef.current = { y: clientY, x: clientX };
  };

  const handleTouchEnd = (clientY: number, clientX: number) => {
    if (!touchStartRef.current) return;
    const deltaY = clientY - touchStartRef.current.y;
    const deltaX = clientX - touchStartRef.current.x;
    touchStartRef.current = null;

    // If swiped/swapped UP by more than 24px, close the notification panel immediately
    if (deltaY < -24 && Math.abs(deltaY) > Math.abs(deltaX)) {
      playTapSound(500);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-start bg-neutral-950/80 backdrop-blur-2xl p-4 text-white overflow-y-auto no-scrollbar animate-in slide-in-from-top duration-300 select-none"
      onClick={onClose}
      onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX)}
      onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
      onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX)}
      onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX)}
        onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
        className="w-full max-w-[420px] mx-auto flex flex-col gap-3 pt-4 pb-12"
      >
        {/* Grab Handle */}
        <div 
          onClick={onClose}
          className="flex flex-col items-center justify-center cursor-pointer py-1 group"
          title="Swipe up or tap to close"
        >
          <div className="w-12 h-1.5 rounded-full bg-neutral-600 group-hover:bg-neutral-400 transition-colors"></div>
        </div>

        {/* Header with big clock & date */}
        <div className="flex items-end justify-between px-2 pt-1">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">{timeStr}</h1>
            <p className="text-xs text-neutral-400 font-medium">{dateStr}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  playTapSound(500);
                  onOpenSettings();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
                aria-label="Settings"
              >
                <Settings size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
              aria-label="Close Notifications"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>

        {/* MagicOS 11 Quick Controls Bar in Notification Panel */}
        <div className="p-3 rounded-[26px] bg-neutral-900/85 border border-neutral-700/60 shadow-lg space-y-2.5">
          {/* Quick toggle circles row */}
          <div className="flex items-center justify-around pt-0.5">
            {/* Wi-Fi */}
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setWifiEnabled(!wifiEnabled);
              }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                wifiEnabled ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-400'
              }`}
              title="Wi-Fi"
            >
              <Wifi size={18} />
            </button>

            {/* Bluetooth */}
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setBtEnabled(!btEnabled);
              }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                btEnabled ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-400'
              }`}
              title="Bluetooth"
            >
              <Bluetooth size={18} />
            </button>

            {/* Torch / Flashlight */}
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                if (onToggleFlashlight) onToggleFlashlight();
              }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isFlashlightOn ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20' : 'bg-neutral-800 text-neutral-400'
              }`}
              title="Torch"
            >
              <Flashlight size={18} />
            </button>

            {/* Do Not Disturb */}
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setDndEnabled(!dndEnabled);
              }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                dndEnabled ? 'bg-purple-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-400'
              }`}
              title="Do Not Disturb"
            >
              <Moon size={18} />
            </button>

            {/* Switch to Full Control Center */}
            {onOpenControlCenter && (
              <button
                type="button"
                onClick={() => {
                  playTapSound(600);
                  onOpenControlCenter();
                }}
                className="w-11 h-11 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 flex items-center justify-center border border-cyan-500/30"
                title="Open Control Center"
              >
                <Sliders size={18} />
              </button>
            )}
          </div>

          {/* Mini Brightness Slider */}
          {onBrightnessChange && (
            <div className="flex items-center gap-2 px-1 pt-1 border-t border-neutral-800/80">
              <Sun size={15} className="text-amber-400 shrink-0" />
              <input
                type="range"
                min="10"
                max="100"
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <span className="text-[10px] text-neutral-400 font-mono w-7 text-right">
                {brightness}%
              </span>
            </div>
          )}
        </div>

        {/* Notifications Header: count & clear all */}
        <div className="flex items-center justify-between px-2 pt-2 border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-semibold">
            <Bell size={14} className="text-cyan-400" />
            <span>Notifications ({notifications.length})</span>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                playTapSound(500);
                onClearAll();
              }}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 flex flex-col items-center gap-2">
              <CheckCheck size={28} className="text-neutral-600" />
              <p className="text-xs">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-[24px] bg-neutral-900/85 border border-neutral-800/80 shadow-md backdrop-blur-md flex flex-col gap-1.5 relative group hover:border-neutral-700 transition-all"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AppIcon iconName={n.appIcon} size="mini" isDraggable={false} />
                    <span className="text-xs font-semibold text-neutral-200">{n.appName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono">{n.time}</span>
                    <button
                      type="button"
                      onClick={() => {
                        playTapSound(500);
                        onDismiss(n.id);
                      }}
                      className="text-neutral-500 hover:text-rose-400 text-xs px-1"
                      aria-label="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="pl-9 pr-1">
                  <h4 className="text-xs font-bold text-white tracking-tight">{n.title}</h4>
                  <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5">{n.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Swipe Up to Close Affordance */}
        <div 
          onClick={onClose}
          className="pt-2 text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5 cursor-pointer hover:text-white py-1 group"
        >
          <ChevronUp size={14} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-medium">Swipe up or tap to close notification panel</span>
        </div>
      </div>
    </div>
  );
};
