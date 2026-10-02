import React, { useState } from 'react';
import { X, Search, Download, Star, Check, Sparkles, Gamepad2, Grid, TrendingUp, ShieldCheck } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface PlayStoreAppProps {
  onClose: () => void;
  onInstallApp?: (appName: string, iconName: string) => void;
}

interface StoreItem {
  id: string;
  name: string;
  developer: string;
  rating: number;
  reviews: string;
  size: string;
  iconBg: string;
  iconLetter: string;
  category: 'apps' | 'games';
  installed?: boolean;
}

const STORE_CATALOG: StoreItem[] = [
  { id: 'app-tiktok', name: 'TikTok', developer: 'TikTok Pte. Ltd.', rating: 4.4, reviews: '62M reviews', size: '94 MB', iconBg: 'bg-black', iconLetter: 'TT', category: 'apps' },
  { id: 'app-instagram', name: 'Instagram', developer: 'Meta Platforms, Inc.', rating: 4.2, reviews: '148M reviews', size: '58 MB', iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600', iconLetter: 'IG', category: 'apps' },
  { id: 'app-discord', name: 'Discord: Talk & Hang Out', developer: 'Discord Inc.', rating: 4.5, reviews: '5.2M reviews', size: '82 MB', iconBg: 'bg-indigo-600', iconLetter: 'DC', category: 'apps' },
  { id: 'game-genshin', name: 'Genshin Impact', developer: 'COGNOSPHERE PTE. LTD.', rating: 4.3, reviews: '4.8M reviews', size: '420 MB', iconBg: 'bg-amber-700', iconLetter: 'GI', category: 'games' },
  { id: 'game-subway', name: 'Subway Surfers', developer: 'SYBO Games', rating: 4.6, reviews: '41M reviews', size: '135 MB', iconBg: 'bg-sky-600', iconLetter: 'SS', category: 'games' },
  { id: 'app-telegram', name: 'Telegram', developer: 'Telegram FZ-LLC', rating: 4.4, reviews: '13M reviews', size: '48 MB', iconBg: 'bg-sky-500', iconLetter: 'TG', category: 'apps' },
  { id: 'app-duolingo', name: 'Duolingo: Language Lessons', developer: 'Duolingo', rating: 4.7, reviews: '19M reviews', size: '36 MB', iconBg: 'bg-emerald-500', iconLetter: 'DL', category: 'apps' },
  { id: 'game-roblox', name: 'Roblox', developer: 'Roblox Corporation', rating: 4.4, reviews: '36M reviews', size: '162 MB', iconBg: 'bg-neutral-800', iconLetter: 'RB', category: 'games' },
];

export const PlayStoreApp: React.FC<PlayStoreAppProps> = ({ onClose, onInstallApp }) => {
  const [tab, setTab] = useState<'for_you' | 'top_charts' | 'games'>('for_you');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingIds, setInstallingIds] = useState<string[]>([]);
  const [installedIds, setInstalledIds] = useState<string[]>([]);

  const handleInstall = (item: StoreItem) => {
    triggerHaptic('doubleTick');
    playTapSound(600);
    setInstallingIds(prev => [...prev, item.id]);

    setTimeout(() => {
      setInstallingIds(prev => prev.filter(id => id !== item.id));
      setInstalledIds(prev => [...prev, item.id]);
      triggerHaptic('heavy');
      playTapSound(800);
      if (onInstallApp) {
        onInstallApp(item.name, 'playstore');
      }
    }, 1800);
  };

  const filteredItems = STORE_CATALOG.filter(item => {
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.developer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = tab === 'games' ? item.category === 'games' : true;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* Search Header */}
      <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search apps & games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-800 border border-neutral-700/60 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800/80 bg-neutral-900/50">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tick');
            setTab('for_you');
          }}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
            tab === 'for_you' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          For you
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tick');
            setTab('top_charts');
          }}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
            tab === 'top_charts' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Top charts
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tick');
            setTab('games');
          }}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
            tab === 'games' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Games
        </button>
      </div>

      {/* Featured Banner */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-900/40 via-blue-900/30 to-indigo-900/40 border border-cyan-500/30 flex items-center justify-between">
          <div className="space-y-1 max-w-[70%]">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Play Protect Verified</span>
            <h3 className="text-sm font-bold text-white">Discover Flagship Android Experiences</h3>
            <p className="text-[11px] text-neutral-300">Fast installs verified for MagicOS 11 performance.</p>
          </div>
          <ShieldCheck size={36} className="text-cyan-400" />
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between px-1">
          <h4 className="font-bold text-xs text-white">Recommended for You</h4>
          <span className="text-[11px] text-cyan-400 font-semibold cursor-pointer">See all</span>
        </div>

        {/* Catalog List */}
        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const isInstalling = installingIds.includes(item.id);
            const isInstalled = installedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0`}>
                    {item.iconLetter}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{item.name}</h5>
                    <p className="text-[10px] text-neutral-400 truncate">{item.developer}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                      <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                        <Star size={10} className="fill-amber-400" />
                        {item.rating}
                      </span>
                      <span>·</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleInstall(item)}
                  disabled={isInstalling || isInstalled}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    isInstalled
                      ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40 flex items-center gap-1'
                      : isInstalling
                      ? 'bg-neutral-800 text-neutral-400 border border-neutral-700 animate-pulse'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 active:scale-95'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <Check size={12} />
                      <span>Open</span>
                    </>
                  ) : isInstalling ? (
                    'Installing...'
                  ) : (
                    'Install'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
