import React, { useState, useEffect } from 'react';
import { X, Phone, PhoneOff, Delete, User, Mic, Volume2 } from 'lucide-react';
import { playDialTone, playTapSound } from '../../utils/sound';

interface PhoneAppProps {
  onClose: () => void;
  onCallInitiated?: (number: string) => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ onClose, onCallInitiated }) => {
  const [inputNum, setInputNum] = useState('');
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inCall) {
      interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const handleKey = (digit: string) => {
    playDialTone(digit);
    if (inputNum.length < 15) {
      setInputNum(inputNum + digit);
    }
  };

  const handleCall = () => {
    if (!inputNum) return;
    playTapSound(800, 0.05);
    setInCall(true);
    setCallDuration(0);
    if (onCallInitiated) onCallInitiated(inputNum);
  };

  const handleEndCall = () => {
    playTapSound(400, 0.06);
    setInCall(false);
    setCallDuration(0);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const dialButtons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <h2 className="text-lg font-bold tracking-tight text-white">SUNNY Phone</h2>
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Phone"
        >
          <X size={18} />
        </button>
      </div>

      {inCall ? (
        /* In-Call Active Screen */
        <div className="flex-1 flex flex-col justify-between items-center py-12 px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-emerald-500/40 flex items-center justify-center shadow-xl">
              <User size={48} className="text-neutral-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{inputNum}</h3>
              <p className="text-xs text-neutral-400 mt-1">Calling via VoLTE 5G · HD</p>
              <div className="mt-2 text-sm font-mono text-emerald-400 font-semibold">
                {formatTimer(callDuration)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
              <Mic size={22} />
            </button>
            <button className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
              <Volume2 size={22} />
            </button>
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        </div>
      ) : (
        /* Normal Dialer Screen */
        <div className="flex-1 flex flex-col justify-between max-w-sm mx-auto w-full p-4 pb-8">
          {/* Number Display & Backspace */}
          <div className="flex-1 flex flex-col justify-center items-center relative min-h-24">
            <div className="text-3xl font-bold font-mono tracking-wider text-white truncate max-w-xs text-center">
              {inputNum || <span className="text-neutral-600 text-2xl">Enter number</span>}
            </div>
            {inputNum && (
              <button
                type="button"
                onClick={() => {
                  playTapSound(500);
                  setInputNum(inputNum.slice(0, -1));
                }}
                className="absolute right-4 text-neutral-400 hover:text-white p-2"
              >
                <Delete size={22} />
              </button>
            )}
          </div>

          {/* Keypad Grid (3x4) */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {dialButtons.map((btn) => (
              <button
                type="button"
                key={btn.num}
                onClick={() => handleKey(btn.num)}
                className="h-16 rounded-[22px] bg-neutral-900 border border-neutral-800/80 hover:bg-neutral-800/70 active:scale-95 transition-all flex flex-col items-center justify-center text-white"
              >
                <span className="text-xl font-bold leading-none">{btn.num}</span>
                {btn.letters && (
                  <span className="text-[9px] text-neutral-500 font-medium tracking-widest mt-0.5">
                    {btn.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Call Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCall}
              disabled={!inputNum}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-90 transition-transform disabled:opacity-40"
              aria-label="Call"
            >
              <Phone size={28} className="fill-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
