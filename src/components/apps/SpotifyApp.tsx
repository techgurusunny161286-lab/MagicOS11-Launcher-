import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  Volume2, 
  Music as MusicIcon, 
  Disc, 
  Radio, 
  Sparkles,
  ExternalLink,
  ListMusic
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface SpotifyAppProps {
  onClose: () => void;
}

interface TrackItem {
  id: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  previewUrl: string;
  durationMs: number;
}

const DEFAULT_FEATURED: TrackItem[] = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    artwork: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9b/6c/35/9b6c359d-6490-449e-b9b5-c02347fa364c/mzaf_16401037580641154628.plus.aac.p.m4a',
    durationMs: 200000,
  },
  {
    id: 2,
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/36/f1/9136f1c4-2790-ee5e-a616-5388cbe7b1eb/mzaf_10793616239103527218.plus.aac.p.m4a',
    durationMs: 230000,
  },
  {
    id: 3,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ba/65/56/ba655610-85f2-95e3-c21c-cf2ce9aa1119/mzaf_10972322521190527376.plus.aac.p.m4a',
    durationMs: 233000,
  },
  {
    id: 4,
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/e5/22/e1/e522e11a-07d2-4e8c-87d2-7be73a98ea83/mzaf_12398516104443907572.plus.aac.p.m4a',
    durationMs: 203000,
  },
];

export const SpotifyApp: React.FC<SpotifyAppProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<TrackItem[]>(DEFAULT_FEATURED);
  const [currentTrack, setCurrentTrack] = useState<TrackItem>(DEFAULT_FEATURED[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Search real tracks via Apple iTunes Search API (free, open, no API key needed)
  const searchMusic = async (term: string) => {
    if (!term.trim()) {
      setTracks(DEFAULT_FEATURED);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=20`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const parsed: TrackItem[] = data.results
            .filter((item: any) => item.previewUrl)
            .map((item: any) => ({
              id: item.trackId,
              title: item.trackName,
              artist: item.artistName,
              album: item.collectionName || 'Single',
              artwork: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : '',
              previewUrl: item.previewUrl,
              durationMs: item.trackTimeMillis || 30000,
            }));
          if (parsed.length > 0) {
            setTracks(parsed);
          }
        }
      }
    } catch {
      // Fallback to local
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTrack = (track: TrackItem) => {
    triggerHaptic('click');
    playTapSound(600);
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play().catch(() => {});
    }
  };

  const togglePlayPause = () => {
    triggerHaptic('smooth');
    playTapSound(600);
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    handlePlayTrack(nextTrack);
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
    handlePlayTrack(prevTrack);
  };

  const toggleLike = (id: number) => {
    triggerHaptic('tick');
    setLikedTrackIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#121212] via-[#0f1712] to-[#121212] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Hidden audio element for actual real audio playback */}
      <audio
        ref={audioRef}
        src={currentTrack.previewUrl}
        onTimeUpdate={() => {
          if (audioRef.current && audioRef.current.duration) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
          }
        }}
        onEnded={handleNext}
      />

      {/* Top Spotify Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#1db954]/20">
            <Radio size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Spotify Music</span>
              <span className="text-[10px] font-bold text-[#1db954] bg-[#1db954]/15 px-1.5 py-0.2 rounded-full border border-[#1db954]/30">LIVE API</span>
            </h2>
            <p className="text-[10px] text-neutral-400">Stream millions of real audio tracks</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/5 bg-black/20">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search artists, songs, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') searchMusic(searchQuery);
            }}
            className="w-full pl-10 pr-20 py-2.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#1db954] transition-colors"
          />
          <button
            type="button"
            onClick={() => searchMusic(searchQuery)}
            className="absolute right-1.5 px-3 py-1 rounded-full bg-[#1db954] text-neutral-950 font-bold text-[11px] hover:bg-[#1ed760] transition-colors"
          >
            {isLoading ? '...' : 'Search'}
          </button>
        </div>

        {/* Quick Genre Tags */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
          {['Pop', 'Arijit Singh', 'Hip Hop', 'Rock', 'Taylor Swift', 'Lo-Fi', 'Electronic'].map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => {
                setSearchQuery(genre);
                searchMusic(genre);
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-neutral-300 whitespace-nowrap active:scale-95 transition-all"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Main Track List & Player View */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Track List */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block px-1 mb-1">
            {searchQuery ? `Results for "${searchQuery}"` : 'Trending Real Tracks'}
          </span>

          {tracks.map((track) => {
            const isCurrent = currentTrack.id === track.id;
            const isLiked = likedTrackIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className={`p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1db954]/20 border border-[#1db954]/40 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                    {track.artwork ? (
                      <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <MusicIcon size={20} />
                      </div>
                    )}
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1db954] animate-ping" />
                      </div>
                    )}
                  </div>

                  <div className="truncate">
                    <span className={`text-xs font-bold block truncate ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                      {track.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 block truncate">
                      {track.artist}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                    className={`p-2 rounded-full hover:bg-white/10 ${isLiked ? 'text-[#1db954]' : 'text-neutral-500'}`}
                  >
                    <Heart size={15} className={isLiked ? 'fill-current' : ''} />
                  </button>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent ? 'bg-[#1db954] text-neutral-950 font-bold' : 'bg-white/10 text-white'
                  }`}>
                    {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Real Player Bar */}
      <div className="p-3 bg-neutral-900/95 border-t border-white/10 backdrop-blur-2xl">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#1db954] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 truncate max-w-[55%]">
            <div className={`w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 shrink-0 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
              {currentTrack.artwork ? (
                <img src={currentTrack.artwork} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <Disc size={20} className="m-auto text-neutral-400" />
              )}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{currentTrack.title}</span>
              <span className="text-[10px] text-neutral-400 block truncate">{currentTrack.artist}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-neutral-300 hover:text-white active:scale-90"
            >
              <SkipBack size={18} />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-[#1db954] text-neutral-950 flex items-center justify-center font-bold active:scale-95 shadow-md shadow-[#1db954]/30"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-neutral-300 hover:text-white active:scale-90"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
