import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Send, 
  Command, 
  Zap, 
  Sun,
  Clock
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface SunnyAssistantAppProps {
  onClose: () => void;
  onOpenApp?: (appId: string) => void;
}

export const SunnyAssistantApp: React.FC<SunnyAssistantAppProps> = ({ onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string>("Hi Sunny! I'm your MagicOS Assistant. How can I help you today?");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const handleAsk = (q: string) => {
    if (!q.trim()) return;
    triggerHaptic('doubleTick');
    playTapSound(700);

    const lower = q.toLowerCase();
    let answer = "I'm processing that with MagicOS Intelligence. ";

    if (lower.includes('weather')) {
      answer = "The current weather is partly cloudy with comfortable humidity and a pleasant breeze. The 7-day forecast is also looking clear!";
    } else if (lower.includes('time') || lower.includes('clock')) {
      answer = `The time is now ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. All systems are synchronized.`;
    } else if (lower.includes('camera')) {
      answer = "Opening the MagicOS Falcon camera for you!";
      setTimeout(() => onOpenApp?.('camera'), 1000);
    } else if (lower.includes('music') || lower.includes('song')) {
      answer = "Launching Spotify audio streaming!";
      setTimeout(() => onOpenApp?.('music'), 1000);
    } else if (lower.includes('joke')) {
      answer = "Why do programmers prefer dark mode? Because light attracts bugs!";
    } else {
      answer = `Here is what I found for "${q}": MagicOS 11 linear haptics and real-time APIs are running with zero latency.`;
    }

    setResponse(answer);
    speakText(answer);
    setQuery('');
  };

  const toggleMic = () => {
    triggerHaptic('smooth');
    playTapSound(600);
    setIsListening(true);

    setTimeout(() => {
      setIsListening(false);
      handleAsk("What is the system status and weather today?");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#0a1128] via-[#091a38] to-[#040817] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">SUNNY Assistant</h2>
            <p className="text-[10px] text-cyan-300">MagicOS 11 Ambient Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled && typeof window !== 'undefined') window.speechSynthesis?.cancel();
            }}
            className={`p-2 rounded-full ${voiceEnabled ? 'text-cyan-400 bg-cyan-500/20' : 'text-neutral-500 bg-neutral-800'}`}
            title="Toggle Voice Speech Output"
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
              playTapSound(500);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        {/* Glowing Orb */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 blur-2xl opacity-40 ${
            isSpeaking || isListening ? 'scale-125 animate-pulse duration-700' : 'scale-100'
          }`} />

          <button
            type="button"
            onClick={toggleMic}
            className={`relative w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl active:scale-95 transition-all ${
              isListening ? 'ring-4 ring-cyan-300 animate-bounce' : 'hover:scale-105'
            }`}
          >
            <Mic size={36} className="text-white drop-shadow" />
          </button>
        </div>

        {/* Status text */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to Assist'}
          </span>
          <p className="text-base sm:text-lg font-semibold text-white/95 max-w-md leading-relaxed">
            "{response}"
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md pt-2">
          {[
            "Check live weather",
            "Tell me a joke",
            "Open Camera",
            "Play Spotify Music"
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(chip)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-neutral-200 transition-all active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Text Input Bar */}
      <div className="p-3 bg-black/40 border-t border-white/10 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-2 max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="Ask SUNNY anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            disabled={!query.trim()}
            className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-neutral-950 font-bold flex items-center justify-center active:scale-95 transition-all shadow"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
