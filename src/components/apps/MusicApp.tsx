import React, { useState } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, Disc, Heart } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

interface MusicAppProps {
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrack: { title: string; artist: string };
  onSelectTrack: (track: { title: string; artist: string }) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  onClose,
  isPlaying,
  onTogglePlay,
  currentTrack,
  onSelectTrack,
}) => {
  const [liked, setLiked] = useState(true);
  const [progress, setProgress] = useState(38);

  const playlist = [
    { title: 'Symphony in Blue', artist: 'SUNNY Sound Lab', duration: '3:42' },
    { title: 'Magic Horizon 11', artist: 'SUNNY Spatial Audio', duration: '2:55' },
    { title: 'Cyber Pulse Aurora', artist: 'SUNNY Sonic Beats', duration: '4:10' },
    { title: 'Midnight Glass Flow', artist: 'Acoustic Elements', duration: '3:18' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div>
          <span className="text-[10px] text-cyan-400 font-mono tracking-wider block">SUNNY HISTEN AUDIO</span>
          <h2 className="text-base font-bold tracking-tight text-white">SUNNY Music</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Music"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Player Screen */}
      <div className="flex-1 flex flex-col justify-between items-center py-6 px-6 max-w-sm mx-auto w-full">
        {/* Vinyl Record Visual */}
        <div className="relative my-4 flex items-center justify-center">
          <div className={`w-56 h-56 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950 border-4 border-neutral-700/60 shadow-2xl flex items-center justify-center ${
            isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''
          }`}>
            {/* Record grooves */}
            <div className="w-48 h-48 rounded-full border border-neutral-700/30 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-neutral-700/30 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-inner">
                  <Disc size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Details */}
        <div className="w-full flex items-center justify-between px-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white truncate">{currentTrack.title}</h3>
            <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              playTapSound(600);
              setLiked(!liked);
            }}
            className="p-2 text-rose-500"
          >
            <Heart size={20} className={liked ? 'fill-rose-500' : ''} />
          </button>
        </div>

        {/* Scrubber Bar */}
        <div className="w-full space-y-1 my-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>01:24</span>
            <span>03:42</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full px-4 mb-4">
          <button className="text-neutral-400 hover:text-white">
            <Shuffle size={18} />
          </button>
          <button
            type="button"
            onClick={() => playTapSound(500)}
            className="text-neutral-300 hover:text-white"
          >
            <SkipBack size={24} />
          </button>
          <button
            type="button"
            onClick={() => {
              playTapSound(700);
              onTogglePlay();
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-neutral-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} className="translate-x-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => playTapSound(500)}
            className="text-neutral-300 hover:text-white"
          >
            <SkipForward size={24} />
          </button>
          <button className="text-neutral-400 hover:text-white">
            <Repeat size={18} />
          </button>
        </div>

        {/* Quick Playlist Switcher */}
        <div className="w-full border-t border-neutral-800/80 pt-2 space-y-1">
          <span className="text-[10px] text-neutral-500 font-semibold block px-2">RECENT SUNNY TRACKS</span>
          {playlist.map((t) => (
            <div
              key={t.title}
              onClick={() => {
                playTapSound(600);
                onSelectTrack(t);
              }}
              className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer ${
                currentTrack.title === t.title ? 'bg-neutral-800/80 text-cyan-400 font-semibold' : 'text-neutral-300 hover:bg-neutral-800/40'
              }`}
            >
              <span className="truncate">{t.title}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{t.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
