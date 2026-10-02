import React, { useState } from 'react';
import { 
  X, 
  Laptop, 
  Tablet, 
  Headphones, 
  Tv, 
  Smartphone, 
  Check, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Share2, 
  Copy,
  Camera,
  Layers
} from 'lucide-react';
import { playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

interface MagicRingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MagicRingModal: React.FC<MagicRingModalProps> = ({ isOpen, onClose }) => {
  const [activeDevice, setActiveDevice] = useState<string | null>('magicbook');
  const [clipboardSync, setClipboardSync] = useState(true);
  const [callRelay, setCallRelay] = useState(true);
  const [cameraSharing, setCameraSharing] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const devices = [
    {
      id: 'magicbook',
      name: 'MagicBook Pro 16',
      type: 'Laptop · Windows 11',
      icon: Laptop,
      status: 'Connected',
      battery: '94%',
      features: ['Keyboard & Mouse Share', 'Virtual Screen', 'File Transfer']
    },
    {
      id: 'magicpad',
      name: 'MagicPad 2 (12.3")',
      type: 'Tablet · MagicOS 11',
      icon: Tablet,
      status: 'Connected',
      battery: '82%',
      features: ['Dual Screen Extension', 'Notes Sync', 'Stylus Relay']
    },
    {
      id: 'earbuds',
      name: 'Earbuds 3 Pro',
      type: 'Spatial Audio · Dual Connection',
      icon: Headphones,
      status: 'Active',
      battery: '98%',
      features: ['Seamless Audio Hop', 'Ultra-Low Latency']
    },
    {
      id: 'smartscreen',
      name: 'Smart Screen V8',
      type: '4K Display · Living Room',
      icon: Tv,
      status: 'Standby',
      battery: null,
      features: ['One-Tap 4K Casting', 'Video Call Mirror']
    }
  ];

  const handleDeviceClick = (devId: string, devName: string) => {
    triggerHaptic('doubleTick');
    playTapSound(700);
    setActiveDevice(devId);
    setToastMsg(`MagicRing connected to ${devName}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-2xl p-4 text-white select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[36px] bg-neutral-900/95 border border-white/20 p-5 shadow-2xl flex flex-col gap-4 backdrop-blur-2xl relative overflow-hidden"
      >
        {/* Ambient background orbital ring glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-cyan-500/20 animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-indigo-500/25 pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Layers size={18} className="text-neutral-950 fill-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                MagicRing <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-cyan-500/20">互联 3.0</span>
              </h3>
              <p className="text-[10px] text-neutral-300">Cross-Device Seamless Collaboration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Central Orbital Topology Visualizer */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          {/* Central Device: Phone */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] border-2 border-white z-10">
            <Smartphone size={24} className="text-neutral-950" />
            <span className="text-[9px] font-bold text-neutral-950">Phone</span>
          </div>

          {/* Surrounding Connected Device Badges */}
          <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
            {devices.map((dev) => {
              const Icon = dev.icon;
              const isSelected = activeDevice === dev.id;
              return (
                <div
                  key={dev.id}
                  onClick={() => handleDeviceClick(dev.id, dev.name)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300">
                      <Icon size={17} />
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      dev.status === 'Connected' || dev.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 text-neutral-400'
                    }`}>
                      {dev.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{dev.name}</h4>
                    <p className="text-[10px] text-neutral-400 truncate">{dev.type}</p>
                    {dev.battery && (
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">{dev.battery}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Toggles for Collaboration Services */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wide">
            Connected Services
          </span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Copy size={14} className="text-cyan-400" />
              <span className="text-xs text-white">Cross-Device Shared Clipboard</span>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setClipboardSync(!clipboardSync);
              }}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 ${clipboardSync ? 'bg-cyan-500' : 'bg-neutral-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${clipboardSync ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-indigo-400" />
              <span className="text-xs text-white">Falcon Camera as PC Webcam</span>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setCameraSharing(!cameraSharing);
              }}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 ${cameraSharing ? 'bg-cyan-500' : 'bg-neutral-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${cameraSharing ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 size={14} className="text-emerald-400" />
              <span className="text-xs text-white">Phone Call & Notification Relay</span>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setCallRelay(!callRelay);
              }}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 ${callRelay ? 'bg-cyan-500' : 'bg-neutral-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${callRelay ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck size={14} />
            <span>End-to-End Encrypted Tunnel</span>
          </div>
          <span>3 Devices Online</span>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-cyan-500 text-neutral-950 text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-1.5 z-30">
            <Check size={14} />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
