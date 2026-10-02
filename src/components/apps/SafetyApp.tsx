import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, HeartPulse, UserCheck, AlertTriangle, Bell, Volume2, Shield } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface SafetyAppProps {
  onClose: () => void;
  onCallEmergency?: () => void;
}

export const SafetyApp: React.FC<SafetyAppProps> = ({ onClose, onCallEmergency }) => {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isSosTriggered, setIsSosTriggered] = useState(false);

  const handleToggleSiren = () => {
    triggerHaptic('heavy');
    playTapSound(800);
    setIsSirenActive(!isSirenActive);
  };

  const handleTriggerSos = () => {
    triggerHaptic('heavy');
    playTapSound(900);
    setIsSosTriggered(true);
    if (onCallEmergency) {
      onCallEmergency();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-rose-500" />
          <h2 className="font-bold text-base text-white">Personal Safety</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Big Emergency SOS Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/70 to-neutral-900 border border-rose-500/40 shadow-2xl flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 shadow-xl">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Emergency SOS</h3>
            <p className="text-xs text-neutral-300 mt-1 max-w-xs">
              Press and hold to call emergency services (911 / 112) and alert trusted contacts with real-time location.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTriggerSos}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall size={18} />
            <span>{isSosTriggered ? 'Calling Emergency Services (911)...' : 'Hold for Emergency SOS'}</span>
          </button>
        </div>

        {/* Quick Safety Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Siren */}
          <div 
            onClick={handleToggleSiren}
            className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-95 shadow-md flex flex-col justify-between ${
              isSirenActive
                ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                : 'bg-neutral-900 border-neutral-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Volume2 size={20} className={isSirenActive ? 'animate-bounce' : 'text-amber-400'} />
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSirenActive ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800'}`}>
                {isSirenActive ? 'SOUNDING' : 'OFF'}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-bold text-xs">Emergency Siren</h4>
              <p className="text-[10px] text-neutral-400">Emits a high-volume alarm</p>
            </div>
          </div>

          {/* Medical Info */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md flex flex-col justify-between">
            <HeartPulse size={20} className="text-rose-400" />
            <div className="mt-4">
              <h4 className="font-bold text-xs">Medical Info</h4>
              <p className="text-[10px] text-neutral-400">O+ Blood · No Known Allergies</p>
            </div>
          </div>
        </div>

        {/* Safety Check & Emergency Contacts */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <UserCheck size={16} className="text-emerald-400" />
            <span>Emergency Contacts (2 Active)</span>
          </div>
          <div className="space-y-1 text-xs text-neutral-300">
            <p className="flex justify-between py-1 border-b border-neutral-800">
              <span>Sarah Connor (Spouse)</span>
              <span className="font-mono text-neutral-400">+1 555-234-5678</span>
            </p>
            <p className="flex justify-between py-1">
              <span>David Chen (Brother)</span>
              <span className="font-mono text-neutral-400">+1 555-345-9876</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
