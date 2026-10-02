import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Trash2, 
  BatteryCharging, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  RotateCw,
  Gauge
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface SystemManagerAppProps {
  onClose: () => void;
}

export const SystemManagerApp: React.FC<SystemManagerAppProps> = ({ onClose }) => {
  const [ramUsed, setRamUsed] = useState(5.8); // GB
  const [ramTotal] = useState(12.0); // GB
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityScore, setSecurityScore] = useState(98);

  const handleOptimize = () => {
    triggerHaptic('doubleTick');
    playTapSound(700);
    setIsOptimizing(true);
    setIsOptimized(false);

    setTimeout(() => {
      triggerHaptic('heavy');
      playTapSound(800);
      setRamUsed(3.4); // Cleared memory!
      setIsOptimizing(false);
      setIsOptimized(true);
    }, 1500);
  };

  const handleScanVirus = () => {
    triggerHaptic('smooth');
    playTapSound(600);
    setIsScanning(true);
    setTimeout(() => {
      triggerHaptic('doubleTick');
      setSecurityScore(100);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">System Manager</h2>
            <p className="text-[10px] text-neutral-400">MagicOS 11 Device Optimizer</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Big Optimization Hero Gauge */}
        <div className="flex flex-col items-center justify-center py-6 p-6 rounded-[32px] bg-gradient-to-b from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/20 shadow-xl text-center">
          <div className="relative w-36 h-36 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mb-3">
            <div className="text-center">
              <span className="text-4xl font-black text-emerald-400 font-mono">
                {isOptimized ? '100' : '92'}
              </span>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">
                Score
              </span>
            </div>
            {isOptimizing && (
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
            )}
          </div>

          <h3 className="text-base font-bold text-white">
            {isOptimized ? 'Device is at Peak Performance' : 'System Ready for Optimization'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            {isOptimized ? '2.4 GB Memory released, background processes streamlined.' : 'Clean cache and release RAM memory for smoother framerates.'}
          </p>

          <button
            type="button"
            disabled={isOptimizing}
            onClick={handleOptimize}
            className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-extrabold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            {isOptimizing ? (
              <>
                <RotateCw size={14} className="animate-spin" />
                <span>Optimizing RAM & Cache...</span>
              </>
            ) : isOptimized ? (
              <>
                <CheckCircle2 size={15} />
                <span>Optimized Successfully</span>
              </>
            ) : (
              <>
                <Zap size={15} className="fill-current" />
                <span>One-Tap Boost (Release RAM)</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* RAM Memory Card */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">RAM Usage</span>
              <Cpu size={15} className="text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {ramUsed} / {ramTotal} GB
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${(ramUsed / ramTotal) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-neutral-500 block">LPDDR5X High Speed</span>
          </div>

          {/* Security & Antivirus Card */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Security Scan</span>
              <ShieldCheck size={15} className="text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {securityScore}% Protected
            </div>
            <button
              type="button"
              disabled={isScanning}
              onClick={handleScanVirus}
              className="w-full py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold text-neutral-300 transition-colors"
            >
              {isScanning ? 'Scanning...' : 'Scan Threats'}
            </button>
            <span className="text-[10px] text-neutral-500 block">No vulnerabilities found</span>
          </div>

          {/* Battery Health */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Battery Health</span>
              <BatteryCharging size={15} className="text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              98% · Normal
            </div>
            <span className="text-[10px] text-neutral-500 block">5,000 mAh Silicon-Carbon</span>
          </div>

          {/* Cache Junk Cleaner */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Junk Files</span>
              <Trash2 size={15} className="text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              0 B Cleaned
            </div>
            <span className="text-[10px] text-neutral-500 block">System cache optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
