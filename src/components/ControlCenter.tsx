import React, { useState, useRef } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Sun, 
  Volume2, 
  Flashlight, 
  RotateCcw, 
  Moon, 
  Plane, 
  Share2, 
  WifiOff, 
  Eye, 
  Disc, 
  Nfc, 
  BatteryMedium, 
  Play, 
  Pause, 
  SkipForward, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { playTapSound } from '../utils/sound';

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
}

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
}) => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [btEnabled, setBtEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dnd, setDnd] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [sunnyShare, setSunnyShare] = useState(true);
  const [eyeComfort, setEyeComfort] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const touchStartRef = useRef<{ y: number; x: number } | null>(null);

  if (!isOpen) return null;

  // Gesture: Swiping UP closes Control Center
  const handleTouchStart = (clientY: number, clientX: number) => {
    touchStartRef.current = { y: clientY, x: clientX };
  };

  const handleTouchEnd = (clientY: number, clientX: number) => {
    if (!touchStartRef.current) return;
    const deltaY = clientY - touchStartRef.current.y;
    const deltaX = clientX - touchStartRef.current.x;
    touchStartRef.current = null;

    if (deltaY < -24 && Math.abs(deltaY) > Math.abs(deltaX)) {
      playTapSound(500);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-start bg-neutral-950/70 backdrop-blur-2xl p-4 text-white overflow-y-auto no-scrollbar animate-in slide-in-from-top duration-300 select-none"
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
        className="w-full max-w-[420px] mx-auto flex flex-col gap-3 pt-6 pb-12"
      >
        {/* Top pull down handle & Close button */}
        <div className="flex items-center justify-between px-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-300">MagicOS Control Center</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
            aria-label="Close Control Center"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* 1. Dual Big Capsule Cards: Wi-Fi & Bluetooth */}
        <div className="grid grid-cols-2 gap-3">
          {/* Wi-Fi Card */}
          <div 
            onClick={() => {
              playTapSound(600);
              setWifiEnabled(!wifiEnabled);
            }}
            className={`p-3.5 rounded-[24px] cursor-pointer transition-all flex items-center gap-3 border ${
              wifiEnabled 
                ? 'bg-blue-600/80 border-blue-400/40 text-white shadow-lg shadow-blue-900/30' 
                : 'bg-neutral-800/70 border-neutral-700/50 text-neutral-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${wifiEnabled ? 'bg-white/20' : 'bg-neutral-700/60'}`}>
              <Wifi size={20} className={wifiEnabled ? 'text-white' : 'text-neutral-400'} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold leading-tight truncate">Wi-Fi</h4>
              <p className="text-[10px] opacity-80 truncate">{wifiEnabled ? 'SUNNY_WiFi_6E' : 'Off'}</p>
            </div>
          </div>

          {/* Bluetooth Card */}
          <div 
            onClick={() => {
              playTapSound(600);
              setBtEnabled(!btEnabled);
            }}
            className={`p-3.5 rounded-[24px] cursor-pointer transition-all flex items-center gap-3 border ${
              btEnabled 
                ? 'bg-blue-600/80 border-blue-400/40 text-white shadow-lg shadow-blue-900/30' 
                : 'bg-neutral-800/70 border-neutral-700/50 text-neutral-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${btEnabled ? 'bg-white/20' : 'bg-neutral-700/60'}`}>
              <Bluetooth size={20} className={btEnabled ? 'text-white' : 'text-neutral-400'} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold leading-tight truncate">Bluetooth</h4>
              <p className="text-[10px] opacity-80 truncate">{btEnabled ? 'Earbuds 3 Pro' : 'Off'}</p>
            </div>
          </div>
        </div>

        {/* 2. Media Player & Vertical Sliders Row */}
        <div className="grid grid-cols-2 gap-3 items-stretch">
          {/* Media Player Card */}
          <div className="p-3.5 rounded-[24px] bg-neutral-900/80 border border-neutral-700/60 flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
                <Disc size={18} className="text-white animate-spin [animation-duration:12s]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-semibold text-white truncate">{currentTrack.title}</h5>
                <p className="text-[10px] text-neutral-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[9px] text-cyan-400 font-mono">SUNNY Sound</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(700);
                    onToggleMusic();
                  }}
                  className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 flex items-center justify-center"
                >
                  {isPlayingMusic ? <Pause size={14} /> : <Play size={14} className="translate-x-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => playTapSound(600)}
                  className="p-1 text-neutral-300 hover:text-white"
                >
                  <SkipForward size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Dual Sliders: Brightness & Volume */}
          <div className="grid grid-cols-2 gap-2 h-28">
            {/* Brightness Slider */}
            <div className="relative rounded-[22px] bg-neutral-800/80 border border-neutral-700/50 overflow-hidden flex flex-col justify-end p-2.5 group">
              <div 
                className="absolute inset-x-0 bottom-0 bg-white/90 group-hover:bg-white transition-all duration-75 pointer-events-none rounded-b-[20px]"
                style={{ height: `${brightness}%` }}
              ></div>
              <input
                type="range"
                min="10"
                max="100"
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
              />
              <Sun 
                size={18} 
                className={`relative z-10 mx-auto transition-colors ${brightness > 35 ? 'text-neutral-900' : 'text-neutral-300'}`} 
              />
            </div>

            {/* Volume Slider */}
            <div className="relative rounded-[22px] bg-neutral-800/80 border border-neutral-700/50 overflow-hidden flex flex-col justify-end p-2.5 group">
              <div 
                className="absolute inset-x-0 bottom-0 bg-cyan-400 group-hover:bg-cyan-300 transition-all duration-75 pointer-events-none rounded-b-[20px]"
                style={{ height: `${volume}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
              />
              <Volume2 
                size={18} 
                className={`relative z-10 mx-auto transition-colors ${volume > 35 ? 'text-neutral-950' : 'text-neutral-300'}`} 
              />
            </div>
          </div>
        </div>

        {/* 3. Quick Toggles Grid (4x2) */}
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {/* Flashlight */}
          <div
            onClick={() => {
              playTapSound(650);
              onToggleFlashlight();
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              isFlashlightOn 
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/30' 
                : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
            }`}>
              <Flashlight size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">Torch</span>
          </div>

          {/* Auto Rotate */}
          <div
            onClick={() => {
              playTapSound(600);
              setAutoRotate(!autoRotate);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              autoRotate 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <RotateCcw size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">Rotate</span>
          </div>

          {/* Do Not Disturb */}
          <div
            onClick={() => {
              playTapSound(600);
              setDnd(!dnd);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              dnd 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <Moon size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">DND</span>
          </div>

          {/* Airplane Mode */}
          <div
            onClick={() => {
              playTapSound(600);
              setAirplane(!airplane);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              airplane 
                ? 'bg-amber-500 text-neutral-950 shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <Plane size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">Airplane</span>
          </div>

          {/* SUNNY Share */}
          <div
            onClick={() => {
              playTapSound(600);
              setSunnyShare(!sunnyShare);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              sunnyShare 
                ? 'bg-teal-500 text-neutral-950 shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <Share2 size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">SUNNY Share</span>
          </div>

          {/* Eye Comfort */}
          <div
            onClick={() => {
              playTapSound(600);
              setEyeComfort(!eyeComfort);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              eyeComfort 
                ? 'bg-amber-600 text-white shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <Eye size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">Eye Comfort</span>
          </div>

          {/* Dark Mode */}
          <div
            onClick={() => {
              playTapSound(600);
              onToggleDarkMode();
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <Moon size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">Dark Theme</span>
          </div>

          {/* Low Power Mode */}
          <div
            onClick={() => {
              playTapSound(600);
              setLowPower(!lowPower);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
              lowPower 
                ? 'bg-yellow-500 text-neutral-950 shadow-lg' 
                : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700'
            }`}>
              <BatteryMedium size={20} />
            </div>
            <span className="text-[10px] text-neutral-300 font-medium truncate">Power Save</span>
          </div>
        </div>

        {/* 4. SUNNY Smart Space / Devices */}
        <div className="mt-2 p-3 rounded-[24px] bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-neutral-300">
          <div className="flex items-center gap-2">
            <Nfc size={16} className="text-cyan-400" />
            <span className="text-xs font-medium">SUNNY Connect · 2 Devices Online</span>
          </div>
          <span className="text-[10px] text-neutral-500">MagicOS 11</span>
        </div>

        {/* Bottom Swipe Up to Close Affordance */}
        <div 
          onClick={onClose}
          className="pt-2 text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5 cursor-pointer hover:text-white py-1 group"
        >
          <ChevronUp size={14} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-medium">Swipe up or tap to close panel</span>
        </div>
      </div>
    </div>
  );
};
