import React, { useState, useEffect } from 'react';
import { X, Heart, Flame, Footprints, Timer, Activity, Sparkles } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

interface HealthAppProps {
  onClose: () => void;
}

export const HealthApp: React.FC<HealthAppProps> = ({ onClose }) => {
  const [heartRate, setHeartRate] = useState(72);
  const [measuring, setMeasuring] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (measuring) {
      interval = setInterval(() => {
        setHeartRate(Math.floor(68 + Math.random() * 12));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [measuring]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-rose-500 fill-rose-500" />
          <h2 className="text-lg font-bold tracking-tight text-white">SUNNY Health</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Health"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Daily Rings Hero Card */}
        <div className="p-5 rounded-[32px] bg-gradient-to-br from-neutral-900 to-slate-900 border border-neutral-800 shadow-xl flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-neutral-300">Activity Rings</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-neutral-400">Move: 485 / 550 kcal</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-neutral-400">Exercise: 42 / 30 min</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span className="text-neutral-400">Stand: 10 / 12 hrs</span>
              </div>
            </div>
          </div>

          {/* SVG Rings */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="25" cy="25" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="25" cy="25" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />

              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - 0.88)}
                strokeLinecap="round"
              />
              <circle
                cx="25"
                cy="25"
                r="15"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeDasharray="94.2"
                strokeDashoffset={94.2 * (1 - 1.2)}
                strokeLinecap="round"
              />
              <circle
                cx="25"
                cy="25"
                r="10"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeDasharray="62.8"
                strokeDashoffset={62.8 * (1 - 0.83)}
                strokeLinecap="round"
              />
            </svg>
            <Activity size={18} className="absolute text-white" />
          </div>
        </div>

        {/* Steps Detailed Card */}
        <div className="p-4 rounded-[28px] bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints size={18} className="text-emerald-400" />
              <h4 className="text-xs font-semibold text-white">Daily Steps Count</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400">Goal 10,000</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-white">7,420</span>
            <span className="text-xs text-neutral-400">steps · 5.4 km</span>
          </div>

          {/* Weekly Bar Chart Simulation */}
          <div className="flex items-end justify-between h-20 pt-4 px-2 border-t border-neutral-800">
            {[
              { d: 'M', h: 60 },
              { d: 'T', h: 80 },
              { d: 'W', h: 75 },
              { d: 'T', h: 90 },
              { d: 'F', h: 70 },
              { d: 'S', h: 100 },
              { d: 'S', h: 74 },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 rounded-t-lg transition-all ${
                    i === 6 ? 'bg-emerald-400' : 'bg-neutral-700'
                  }`}
                  style={{ height: `${b.h * 0.5}px` }}
                ></div>
                <span className="text-[10px] text-neutral-500">{b.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heart Rate Sensor Simulation */}
        <div className="p-4 rounded-[28px] bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-rose-500 fill-rose-500 animate-pulse" />
              <h4 className="text-xs font-semibold text-white">Heart Rate Monitor</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setMeasuring(!measuring);
              }}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              {measuring ? 'Stop Sensor' : 'Measure Now'}
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-500">{heartRate}</span>
            <span className="text-xs text-neutral-400">BPM · Resting</span>
          </div>

          <p className="text-[11px] text-neutral-400">
            Real-time biometric monitoring via SUNNY TruSeen™ algorithm. Normal resting pulse detected.
          </p>
        </div>
      </div>
    </div>
  );
};
