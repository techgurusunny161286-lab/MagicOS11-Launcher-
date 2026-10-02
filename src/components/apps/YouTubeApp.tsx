import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Play, 
  ThumbsUp, 
  Share2, 
  Bell, 
  Tv, 
  Flame, 
  Sparkles, 
  MessageSquare,
  Compass
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface YouTubeAppProps {
  onClose: () => void;
}

interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  thumbnail: string;
  likes: string;
}

const FEATURED_VIDEOS: YouTubeVideo[] = [
  {
    id: '1',
    videoId: 'LXb3EKWsInQ', // 4K Costa Rica Nature
    title: 'Costa Rica in 4K 60fps HDR (Ultra HD)',
    channel: 'Jacob + Katie Schwarz',
    views: '112M views',
    timeAgo: '2 years ago',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&h=360&fit=crop',
    likes: '1.2M',
  },
  {
    id: '2',
    videoId: 'jfKfPfyJRdk', // Lofi hip hop radio
    title: 'lofi hip hop radio - beats to relax/study to',
    channel: 'Lofi Girl',
    views: '320M views',
    timeAgo: 'Live',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop',
    likes: '8.4M',
  },
  {
    id: '3',
    videoId: 'kJQP7kiw5Fk', // Despacito
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    channel: 'Luis Fonsi',
    views: '8.4B views',
    timeAgo: '7 years ago',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&h=360&fit=crop',
    likes: '53M',
  },
  {
    id: '4',
    videoId: 'M7lc1UVf-VE', // YouTube Developer
    title: 'YouTube API and Next Generation Media',
    channel: 'Google Developers',
    views: '4.2M views',
    timeAgo: '1 year ago',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&h=360&fit=crop',
    likes: '140K',
  },
];

export const YouTubeApp: React.FC<YouTubeAppProps> = ({ onClose }) => {
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>(FEATURED_VIDEOS[0]);
  const [search, setSearch] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Music', 'Tech & AI', 'Gaming', 'Nature 4K', 'News', 'Live'];

  const handleSelectVideo = (v: YouTubeVideo) => {
    triggerHaptic('click');
    playTapSound(600);
    setActiveVideo(v);
    setIsLiked(false);
  };

  const toggleSubscribe = () => {
    triggerHaptic('doubleTick');
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f0f] text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top YouTube Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-neutral-800 bg-[#0f0f0f] z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
            <Play size={12} className="fill-white text-white ml-0.5" />
          </div>
          <span className="font-extrabold text-base tracking-tighter font-sans text-white">
            YouTube
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[200px] sm:max-w-xs mx-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
            />
            <Search size={14} className="absolute right-2.5 text-neutral-400" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-all active:scale-90"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Video Viewport (Active Embed Player) */}
      <div className="w-full bg-black aspect-video relative flex items-center justify-center shrink-0 shadow-xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={activeVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Video Details & Interaction Controls */}
      <div className="p-3 border-b border-neutral-800 bg-[#0f0f0f] space-y-2.5">
        <h3 className="text-sm font-bold text-white line-clamp-2">
          {activeVideo.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{activeVideo.views} · {activeVideo.timeAgo}</span>
        </div>

        {/* Channel & Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
              {activeVideo.channel[0]}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{activeVideo.channel}</span>
              <span className="text-[10px] text-neutral-400">Verified Channel</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSubscribe}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                isSubscribed
                  ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('smooth');
                setIsLiked(!isLiked);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 active:scale-95 transition-all ${
                isLiked ? 'text-red-500' : 'text-neutral-300'
              }`}
            >
              <ThumbsUp size={13} className={isLiked ? 'fill-current' : ''} />
              <span>{activeVideo.likes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-800 overflow-x-auto no-scrollbar bg-[#0f0f0f]">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              triggerHaptic('smooth');
              setActiveCategory(cat);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-white text-black font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Up Next & Related Videos List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block px-1">
          Up Next
        </span>

        {FEATURED_VIDEOS.map((vid) => (
          <div
            key={vid.id}
            onClick={() => handleSelectVideo(vid)}
            className={`flex gap-3 p-2 rounded-2xl cursor-pointer transition-all ${
              activeVideo.id === vid.id ? 'bg-neutral-800/80 border border-red-500/40' : 'hover:bg-neutral-900 border border-transparent'
            }`}
          >
            <div className="relative w-32 aspect-video rounded-xl overflow-hidden bg-neutral-800 shrink-0">
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono font-bold">
                12:45
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                {vid.title}
              </h4>
              <p className="text-[11px] text-neutral-400">{vid.channel}</p>
              <p className="text-[10px] text-neutral-500">{vid.views} · {vid.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
