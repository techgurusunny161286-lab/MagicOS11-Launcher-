import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  Smartphone, 
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  Palette, 
  Sun, 
  Sparkles, 
  Battery, 
  Volume2, 
  Shield, 
  Wifi, 
  Bluetooth, 
  Layers, 
  Info,
  Check,
  Vibrate
} from 'lucide-react';
import { WALLPAPERS } from '../../data/apps';
import { WallpaperItem } from '../../types/launcher';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic, isHapticsEnabled, setHapticsEnabled, getHapticIntensity, setHapticIntensity } from '../../utils/haptics';

export type DeviceMode = 'phone' | 'tablet' | 'phone-frame';

interface SettingsAppProps {
  onClose: () => void;
  currentWallpaper: WallpaperItem;
  onSelectWallpaper: (wp: WallpaperItem) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMagicCapsuleEnabled: boolean;
  onToggleMagicCapsule: () => void;
  isMagicPortalEnabled: boolean;
  onToggleMagicPortal: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  deviceMode?: DeviceMode;
  onChangeDeviceMode?: (mode: DeviceMode) => void;
  brightness: number;
  onBrightnessChange: (v: number) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  onClose,
  currentWallpaper,
  onSelectWallpaper,
  isDarkMode,
  onToggleDarkMode,
  isMagicCapsuleEnabled,
  onToggleMagicCapsule,
  isMagicPortalEnabled,
  onToggleMagicPortal,
  isPhoneFrame,
  onTogglePhoneFrame,
  deviceMode = 'phone',
  onChangeDeviceMode,
  brightness,
  onBrightnessChange,
  volume,
  onVolumeChange,
}) => {
  const [selectedTab, setSelectedTab] = useState<'main' | 'about' | 'wallpapers'>('main');
  const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());
  const [intensity, setIntensity] = useState(getHapticIntensity());
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  const toggleBrowserFullscreen = () => {
    playTapSound(600);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {selectedTab !== 'main' ? (
            <button
              type="button"
              onClick={() => {
                playTapSound(500);
                setSelectedTab('main');
              }}
              className="text-xs text-cyan-400 font-semibold flex items-center gap-1"
            >
              ← Back
            </button>
          ) : (
            <h2 className="text-lg font-bold tracking-tight text-white">Settings</h2>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Settings"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        {selectedTab === 'main' && (
          <>
            {/* 1. About Phone Card (SUNNY MagicOS Flagship) */}
            <div
              onClick={() => {
                playTapSound(600);
                setSelectedTab('about');
              }}
              className="p-4 rounded-[28px] bg-gradient-to-br from-indigo-950/60 via-neutral-900 to-slate-900 border border-neutral-800 shadow-xl cursor-pointer hover:border-cyan-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">SUNNY Magic7 Pro</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-semibold text-cyan-400">MagicOS 11.0</span>
                    <span className="text-[10px] text-neutral-400">· 512GB</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-neutral-500 group-hover:text-cyan-400 transition-colors" />
            </div>

            {/* 2. Personalization & Wallpapers */}
            <div className="rounded-[28px] bg-neutral-900/80 border border-neutral-800/90 overflow-hidden divide-y divide-neutral-800/80">
              <div
                onClick={() => {
                  playTapSound(600);
                  setSelectedTab('wallpapers');
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                    <Palette size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Wallpapers & Themes</h4>
                    <p className="text-[10px] text-neutral-400">{currentWallpaper.name}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-500" />
              </div>

              <div
                onClick={() => {
                  playTapSound(600);
                  onTogglePhoneFrame();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Phone Bezel Frame</h4>
                    <p className="text-[10px] text-neutral-400">
                      {isPhoneFrame ? 'Enabled (Realistic Smartphone)' : 'Disabled (Edge-to-Edge)'}
                    </p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors p-0.5 ${isPhoneFrame ? 'bg-cyan-500' : 'bg-neutral-700'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isPhoneFrame ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            {/* 3. MagicOS 11 AI & Flagship Features */}
            <div className="rounded-[28px] bg-neutral-900/80 border border-neutral-800/90 overflow-hidden divide-y divide-neutral-800/80">
              <div className="px-4 py-2.5 bg-neutral-900/40 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                MagicOS 11 Intelligence
              </div>

              {/* Magic Capsule Switch */}
              <div 
                onClick={() => {
                  playTapSound(600);
                  onToggleMagicCapsule();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Magic Capsule</h4>
                    <p className="text-[10px] text-neutral-400">Dynamic Island pill around punch-hole</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors p-0.5 ${isMagicCapsuleEnabled ? 'bg-cyan-500' : 'bg-neutral-700'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isMagicCapsuleEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              {/* Magic Portal Switch */}
              <div 
                onClick={() => {
                  playTapSound(600);
                  onToggleMagicPortal();
                }}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-800/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Magic Portal</h4>
                    <p className="text-[10px] text-neutral-400">Drag to edge to share instantly</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors p-0.5 ${isMagicPortalEnabled ? 'bg-teal-500' : 'bg-neutral-700'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isMagicPortalEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            {/* Device Mode & Fullscreen Form Factor Card */}
            <div className="rounded-[28px] bg-neutral-900/80 border border-neutral-800/90 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Tablet size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Device Mode & Full Screen</h4>
                    <p className="text-[10px] text-neutral-400">Smartphone, Tablet & Native Fullscreen</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleBrowserFullscreen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-all active:scale-95"
                  title="Toggle Browser Fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>
              </div>

              {/* 3 Form Factor Selectors */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(600);
                    onChangeDeviceMode?.('phone');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    deviceMode === 'phone'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-neutral-800/50 border-neutral-700/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Smartphone size={20} className={deviceMode === 'phone' ? 'text-cyan-400' : ''} />
                  <span className="text-[11px] font-bold">Smartphone</span>
                  <span className="text-[9px] text-neutral-400 leading-tight">Full Screen</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTapSound(600);
                    onChangeDeviceMode?.('tablet');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    deviceMode === 'tablet'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-neutral-800/50 border-neutral-700/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Tablet size={20} className={deviceMode === 'tablet' ? 'text-cyan-400' : ''} />
                  <span className="text-[11px] font-bold">Tablet / Pad</span>
                  <span className="text-[9px] text-neutral-400 leading-tight">Wide Taskbar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTapSound(600);
                    onChangeDeviceMode?.('phone-frame');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    deviceMode === 'phone-frame'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-neutral-800/50 border-neutral-700/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Monitor size={20} className={deviceMode === 'phone-frame' ? 'text-cyan-400' : ''} />
                  <span className="text-[11px] font-bold">Phone Bezel</span>
                  <span className="text-[9px] text-neutral-400 leading-tight">Simulator</span>
                </button>
              </div>
            </div>

            {/* 4. Display, Brightness & Sound */}
            <div className="rounded-[28px] bg-neutral-900/80 border border-neutral-800/90 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-amber-400" />
                  <span className="text-xs font-semibold text-white">Screen Brightness</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">{brightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-cyan-400" />
                  <span className="text-xs font-semibold text-white">Media Volume</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* 5. Google Pixel Haptics & Vibration Engine */}
            <div className="rounded-[28px] bg-neutral-900/80 border border-neutral-800/90 p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Vibrate size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Google Pixel Haptic Engine</h4>
                    <p className="text-[10px] text-neutral-400">Tactile Linear Resonant Actuator (LRA)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !hapticsOn;
                    setHapticsOn(next);
                    setHapticsEnabled(next);
                    if (next) triggerHaptic('click');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${hapticsOn ? 'bg-cyan-500' : 'bg-neutral-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${hapticsOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {hapticsOn && (
                <>
                  {/* Intensity selector: Soft / Smooth / Crisp / Strong */}
                  <div className="pt-2 border-t border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 font-semibold block mb-2">
                      HAPTIC VIBRATION INTENSITY
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['soft', 'smooth', 'crisp', 'strong'] as const).map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => {
                            setIntensity(lvl);
                            setHapticIntensity(lvl);
                            triggerHaptic(lvl === 'smooth' ? 'smooth' : 'click');
                          }}
                          className={`py-1.5 px-1.5 rounded-xl text-xs font-semibold capitalize transition-all border text-center ${
                            intensity === lvl
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                              : 'bg-neutral-800/60 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800'
                          }`}
                        >
                          {lvl === 'smooth' ? 'Smooth' : lvl === 'crisp' ? 'Crisp' : lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Tactile Pulse Preview Pads */}
                  <div className="pt-2 border-t border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 font-semibold block mb-2">
                      TEST PIXEL TACTILE PROFILES
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => triggerHaptic('smooth')}
                        className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-cyan-500/40 text-left transition-all"
                      >
                        <span className="text-xs font-semibold text-cyan-300 block">Smooth Touch</span>
                        <span className="text-[9px] text-neutral-400">Silky micro-pulse</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerHaptic('tick')}
                        className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-neutral-700 text-left transition-all"
                      >
                        <span className="text-xs font-semibold text-white block">Light Tick</span>
                        <span className="text-[9px] text-neutral-400">Micro-pulse 8ms</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerHaptic('click')}
                        className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-neutral-700 text-left transition-all"
                      >
                        <span className="text-xs font-semibold text-white block">Pixel Click</span>
                        <span className="text-[9px] text-neutral-400">Crisp bump 18ms</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerHaptic('doubleTick')}
                        className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-neutral-700 text-left transition-all"
                      >
                        <span className="text-xs font-semibold text-white block">Double Pulse</span>
                        <span className="text-[9px] text-neutral-400">Fingerprint success</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerHaptic('heavy')}
                        className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 border border-neutral-700 text-left transition-all"
                      >
                        <span className="text-xs font-semibold text-white block">Firm Thud</span>
                        <span className="text-[9px] text-neutral-400">Lock & shutter 40ms</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* About Phone Full Screen */}
        {selectedTab === 'about' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Hero MagicOS 11 Banner */}
            <div className="p-6 rounded-[32px] bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl mb-3">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">MagicOS 11</h2>
              <p className="text-xs text-cyan-300 font-mono mt-1">Official SUNNY Experience</p>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/40">
                Up to date · 11.0.0.128 (C00E120R3P1)
              </div>
            </div>

            {/* Specifications Specs Sheet */}
            <div className="rounded-[28px] bg-neutral-900/80 border border-neutral-800 divide-y divide-neutral-800/80 text-xs">
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Device Name</span>
                <span className="font-semibold text-white">SUNNY Magic7 Pro</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Processor</span>
                <span className="font-semibold text-white">Snapdragon® 8 Gen 4 (3nm)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">RAM Turbo</span>
                <span className="font-semibold text-white">16 GB + 8 GB Expansion</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Internal Storage</span>
                <span className="font-semibold text-white">512 GB (184 GB Used)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Battery</span>
                <span className="font-semibold text-white">5,600 mAh Qinghai Lake Battery</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Android Version</span>
                <span className="font-semibold text-white">Android 15</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-neutral-400">Display</span>
                <span className="font-semibold text-white">6.8" 120Hz LTPO OLED 4320Hz PWM</span>
              </div>
            </div>
          </div>
        )}

        {/* Wallpapers Selector */}
        {selectedTab === 'wallpapers' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-white px-1">MagicOS 11 Official Wallpapers</h3>
            <div className="grid grid-cols-2 gap-3">
              {WALLPAPERS.map((wp) => {
                const isSelected = currentWallpaper.id === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => {
                      playTapSound(650);
                      onSelectWallpaper(wp);
                    }}
                    className={`h-40 rounded-[24px] ${wp.bgClass} p-3 flex flex-col justify-between border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-[1.02]' : 'border-neutral-700/60 hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex justify-end">
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-cyan-400 text-neutral-950 flex items-center justify-center shadow-md">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white drop-shadow truncate">{wp.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
