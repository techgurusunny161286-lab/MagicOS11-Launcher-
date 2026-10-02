import React, { useState } from 'react';
import { X, Video, VideoOff, Mic, MicOff, PhoneOff, Plus, Key, Users, Hand, MessageSquare, Share2 } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface MeetAppProps {
  onClose: () => void;
}

export const MeetApp: React.FC<MeetAppProps> = ({ onClose }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');

  const handleStartCall = () => {
    triggerHaptic('doubleTick');
    playTapSound(600);
    setIsInCall(true);
  };

  const handleEndCall = () => {
    triggerHaptic('heavy');
    playTapSound(400);
    setIsInCall(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Video size={16} />
          </div>
          <h2 className="font-bold text-base text-white">Google Meet</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {isInCall ? (
        /* ACTIVE VIDEO CALL ROOM */
        <div className="flex-1 flex flex-col justify-between bg-neutral-900 p-4 relative overflow-hidden">
          {/* Main Remote Video Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-3xl bg-neutral-800 border border-neutral-700/60 flex flex-col items-center justify-center p-4 relative shadow-lg">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                SC
              </div>
              <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                Sarah Connor
              </span>
            </div>

            <div className="rounded-3xl bg-neutral-800 border border-neutral-700/60 flex flex-col items-center justify-center p-4 relative shadow-lg">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                AR
              </div>
              <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                Alex Rivera
              </span>
            </div>
          </div>

          {/* Self Video Floating Pip */}
          <div className="absolute right-6 top-6 w-24 h-32 rounded-2xl bg-neutral-950 border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
            {isCamOn ? (
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] text-cyan-400 font-bold">You</span>
                <span className="text-[9px] text-neutral-400">Camera Live</span>
              </div>
            ) : (
              <VideoOff size={20} className="text-neutral-500" />
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="flex items-center justify-center gap-3 p-3 rounded-full bg-neutral-950/90 border border-white/20 backdrop-blur-2xl shadow-2xl mx-auto max-w-sm w-full">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setIsMicOn(!isMicOn);
              }}
              className={`p-3 rounded-full transition-all active:scale-95 ${
                isMicOn ? 'bg-neutral-800 text-white' : 'bg-rose-500 text-white shadow-rose-500/40'
              }`}
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setIsCamOn(!isCamOn);
              }}
              className={`p-3 rounded-full transition-all active:scale-95 ${
                isCamOn ? 'bg-neutral-800 text-white' : 'bg-rose-500 text-white shadow-rose-500/40'
              }`}
            >
              {isCamOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                setIsHandRaised(!isHandRaised);
              }}
              className={`p-3 rounded-full transition-all active:scale-95 ${
                isHandRaised ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-white'
              }`}
            >
              <Hand size={18} />
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-95 transition-all"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* LOBBY / NEW MEETING SCREEN */
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="space-y-4 max-w-sm mx-auto w-full pt-4">
            <button
              type="button"
              onClick={handleStartCall}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
            >
              <Plus size={18} strokeWidth={2.8} />
              <span>New Meeting</span>
            </button>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter meeting code..."
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-700/80 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleStartCall}
                disabled={!meetingCode.trim()}
                className="px-5 py-3 rounded-2xl bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs border border-neutral-700 hover:bg-neutral-700 active:scale-95"
              >
                Join
              </button>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1 max-w-sm mx-auto w-full">
            <h4 className="text-xs font-bold text-white">Secure Video Calling</h4>
            <p className="text-[11px] text-neutral-400">
              Calls are encrypted with WebRTC protocol powered by Google Meet on MagicOS 11.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
