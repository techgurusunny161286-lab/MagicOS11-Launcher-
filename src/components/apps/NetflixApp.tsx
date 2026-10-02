import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Play, 
  Plus, 
  Info, 
  Star, 
  Film, 
  Tv, 
  Volume2, 
  Check, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface NetflixAppProps {
  onClose: () => void;
}

interface MovieItem {
  id: number;
  name: string;
  summary: string;
  image: string;
  rating: number;
  genres: string[];
  premiered: string;
}

const FALLBACK_SHOWS: MovieItem[] = [
  {
    id: 1,
    name: 'Stranger Things',
    summary: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    rating: 8.7,
    genres: ['Sci-Fi', 'Drama', 'Horror'],
    premiered: '2016',
  },
  {
    id: 2,
    name: 'Dark',
    summary: 'A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
    rating: 8.8,
    genres: ['Sci-Fi', 'Mystery'],
    premiered: '2017',
  },
  {
    id: 3,
    name: 'Arcane',
    summary: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
    rating: 9.0,
    genres: ['Action', 'Sci-Fi', 'Animation'],
    premiered: '2021',
  },
  {
    id: 4,
    name: 'The Witcher',
    summary: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop',
    rating: 8.1,
    genres: ['Fantasy', 'Action'],
    premiered: '2019',
  },
];

export const NetflixApp: React.FC<NetflixAppProps> = ({ onClose }) => {
  const [movies, setMovies] = useState<MovieItem[]>(FALLBACK_SHOWS);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [search, setSearch] = useState('');
  const [myList, setMyList] = useState<number[]>([]);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Fetch real shows via TVMaze free public API
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await fetch('https://api.tvmaze.com/shows?page=0');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted: MovieItem[] = data.slice(0, 24).map((s: any) => ({
              id: s.id,
              name: s.name,
              summary: s.summary ? s.summary.replace(/<[^>]*>?/gm, '') : 'Riveting television streaming experience.',
              image: s.image?.medium || s.image?.original || FALLBACK_SHOWS[0].image,
              rating: s.rating?.average || 7.5,
              genres: s.genres || ['Drama'],
              premiered: s.premiered ? s.premiered.slice(0, 4) : '2023',
            }));
            setMovies(formatted);
          }
        }
      } catch {
        // Keep fallback
      }
    };
    fetchShows();
  }, []);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        const formatted: MovieItem[] = data.map((item: any) => ({
          id: item.show.id,
          name: item.show.name,
          summary: item.show.summary ? item.show.summary.replace(/<[^>]*>?/gm, '') : 'Thrilling story available on streaming.',
          image: item.show.image?.medium || item.show.image?.original || FALLBACK_SHOWS[0].image,
          rating: item.show.rating?.average || 7.5,
          genres: item.show.genres || ['Drama'],
          premiered: item.show.premiered ? item.show.premiered.slice(0, 4) : '2023',
        }));
        if (formatted.length > 0) setMovies(formatted);
      }
    } catch {}
  };

  const toggleMyList = (id: number) => {
    triggerHaptic('tick');
    setMyList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const heroMovie = movies[0] || FALLBACK_SHOWS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#141414] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 bg-black/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-2">
          <span className="text-rose-600 font-black text-xl tracking-tighter uppercase font-sans">
            NETFLIX
          </span>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
            TVMAZE API
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search movies & shows..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-36 sm:w-48 pl-3 pr-7 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-rose-500"
            />
            <Search size={13} className="absolute right-2.5 text-neutral-400" />
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
      </div>

      {/* Main Stream Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        {/* Cinematic Hero Billboard */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden">
          <img
            src={heroMovie.image}
            alt={heroMovie.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>

          <div className="absolute bottom-4 left-5 right-5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 tracking-wider uppercase">
              <TrendingUp size={13} />
              <span>#1 Trending Today</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow">
              {heroMovie.name}
            </h1>

            <p className="text-xs text-neutral-300 line-clamp-2 max-w-md">
              {heroMovie.summary}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('doubleTick');
                  playTapSound(700);
                  setIsPlayingPreview(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs active:scale-95 transition-all shadow-lg"
              >
                <Play size={16} className="fill-black" />
                <span>Play Trailer</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs active:scale-95 transition-all backdrop-blur-md"
              >
                <Info size={15} />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real Movie Cards Grid */}
        <div className="px-5 space-y-3 pb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-tight uppercase">
              Popular on Netflix
            </span>
            <span className="text-xs text-neutral-400">{movies.length} titles available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {movies.map((m) => {
              const inList = myList.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMovie(m)}
                  className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-rose-500/50 cursor-pointer transition-all duration-200 shadow-md hover:scale-105"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-neutral-800">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  <div className="p-2 space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{m.premiered}</span>
                      <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                        <Star size={10} className="fill-current" />
                        <span>{m.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedMovie(null)}
        >
          <div 
            className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/20 p-5 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-white">{selectedMovie.name}</h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                  <span>{selectedMovie.premiered}</span>
                  <span>·</span>
                  <span className="text-amber-400 font-bold">★ {selectedMovie.rating} / 10</span>
                  <span>·</span>
                  <span className="text-rose-400">{selectedMovie.genres.join(', ')}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMovie(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-neutral-800">
              <img src={selectedMovie.image} alt={selectedMovie.name} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedMovie.summary}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('doubleTick');
                  setIsPlayingPreview(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-extrabold text-xs text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg"
              >
                <Play size={14} className="fill-current" />
                <span>Watch Stream</span>
              </button>

              <button
                type="button"
                onClick={() => toggleMyList(selectedMovie.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  myList.includes(selectedMovie.id)
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                {myList.includes(selectedMovie.id) ? <Check size={14} /> : <Plus size={14} />}
                <span>{myList.includes(selectedMovie.id) ? 'Saved' : 'My List'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trailer Player Modal */}
      {isPlayingPreview && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in"
          onClick={() => setIsPlayingPreview(false)}
        >
          <div className="w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <iframe
              src="https://www.youtube-nocookie.com/embed/b9EkMc79ZSU?autoplay=1"
              title="Movie Trailer"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
            />
            <button
              onClick={() => setIsPlayingPreview(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
