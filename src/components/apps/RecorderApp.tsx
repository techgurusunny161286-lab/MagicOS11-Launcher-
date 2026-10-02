import React, { useState, useEffect } from 'react';
import { X, Mic, Square, Play, Pause, Trash2, Volume2, Share2 } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface RecorderAppProps {
  onClose: () => void;
}

interface Recording {
  id: string;
  name: string;
  duration: string;
  date: string;
}

export const RecorderApp: React.FC<RecorderAppProps> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: 'rec-1', name: 'Meeting Notes 01', duration: '02:45', date: 'Oct 1, 2026' },
    { id: 'rec-2', name: 'Song Idea Demo', duration: '01:12', date: 'Sep 29, 2026' },
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecord = () => {
    triggerHaptic('heavy');
    playTapSound(700);

    if (isRecording) {
      // Stop & Save
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      const newRec: Recording = {
        id: `rec-${Date.now()}`,
        name: `Recording #${recordings.length + 1}`,
        duration: `${mins}:${secs}`,
        date: 'Just now'
      };
      setRecordings(prev => [newRec, ...prev]);
      setIsRecording(false);
      setSeconds(0);
    } else {
      setIsRecording(true);
      setSeconds(0);
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic size={18} className="text-rose-500" />
          <h2 className="font-bold text-base text-white">Voice Recorder</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Center Area: Sound Wave & Big Timer */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            {isRecording ? 'Recording in progress' : 'Ready to record'}
          </span>
          <h1 className="text-5xl font-mono font-black text-white tracking-tight">
            {formatTimer(seconds)}
          </h1>
        </div>

        {/* Animated Waveform Simulation */}
        <div className="flex items-center justify-center gap-1.5 h-20 w-full max-w-xs">
          {Array.from({ length: 24 }).map((_, i) => {
            const heightMultiplier = isRecording ? Math.sin((i + seconds * 2) * 0.8) * 0.5 + 0.6 : 0.15;
            return (
              <div
                key={`bar-${i}`}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isRecording ? 'bg-gradient-to-t from-rose-500 to-amber-400' : 'bg-neutral-800'
                }`}
                style={{ height: `${Math.max(8, heightMultiplier * 70)}px` }}
              />
            );
          })}
        </div>

        {/* Big Record Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95 ${
              isRecording
                ? 'bg-neutral-800 border-4 border-rose-500 text-rose-500'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/40'
            }`}
          >
            {isRecording ? <Square size={26} className="fill-rose-500" /> : <Mic size={32} />}
          </button>
        </div>
      </div>

      {/* Bottom Saved Recordings Sheet */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-4 max-h-[35vh] overflow-y-auto space-y-2">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Saved Recordings</h4>
        {recordings.map((rec) => {
          const isPlaying = playingId === rec.id;
          return (
            <div
              key={rec.id}
              className="p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tick');
                    setPlayingId(isPlaying ? null : rec.id);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isPlaying ? 'bg-rose-500 text-white' : 'bg-neutral-700 text-neutral-200'
                  }`}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-neutral-200 ml-0.5" />}
                </button>
                <div>
                  <h5 className="font-bold text-xs text-white">{rec.name}</h5>
                  <span className="text-[10px] text-neutral-400 font-mono">{rec.date} · {rec.duration}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  setRecordings(prev => prev.filter(r => r.id !== rec.id));
                }}
                className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
