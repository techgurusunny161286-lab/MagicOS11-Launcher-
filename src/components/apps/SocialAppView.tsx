import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Repeat2, 
  Bookmark, 
  Send, 
  Sparkles,
  Music,
  Plus
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface SocialAppViewProps {
  appName: 'twitter' | 'instagram' | 'tiktok' | 'telegram' | string;
  onClose: () => void;
}

export const SocialAppView: React.FC<SocialAppViewProps> = ({ appName, onClose }) => {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [tweetText, setTweetText] = useState('');
  const [tweets, setTweets] = useState([
    {
      id: 't1',
      author: 'Sunny Sharma',
      handle: '@sunnysharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      content: 'MagicOS 11 just redefined tactile mobile interfaces! Real-time APIs, sub-second hold gestures, and zero-latency haptics 🚀📱',
      time: '12m',
      likes: 142,
      retweets: 38,
    },
    {
      id: 't2',
      author: 'Tech Radar Pro',
      handle: '@techradar',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
      content: 'Live Weather and Global World Clock features are now streaming in real time. Flagship linear resonance motor feedback feels indistinguishable from physical hardware.',
      time: '1h',
      likes: 894,
      retweets: 215,
    },
  ]);

  const toggleLike = (id: string) => {
    triggerHaptic('tick');
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostTweet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    triggerHaptic('doubleTick');
    playTapSound(700);

    const newTweet = {
      id: `tweet-${Date.now()}`,
      author: 'You',
      handle: '@user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      content: tweetText.trim(),
      time: 'Just now',
      likes: 1,
      retweets: 0,
    };

    setTweets(prev => [newTweet, ...prev]);
    setTweetText('');
  };

  const isInstagram = appName === 'instagram';
  const isTikTok = appName === 'tiktok';

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-tight capitalize text-white">
            {appName === 'twitter' ? 'X / Twitter' : appName}
          </span>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
            LIVE FEED
          </span>
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

      {/* Main Feed View */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* TIKTOK REELS VIEW */}
        {isTikTok ? (
          <div className="relative h-full w-full bg-neutral-900 flex flex-col justify-end p-5">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop"
              alt="Reel"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>

            {/* Right Action Icons */}
            <div className="absolute right-4 bottom-16 flex flex-col items-center gap-5 z-20">
              <button
                type="button"
                onClick={() => toggleLike('tiktok-1')}
                className="flex flex-col items-center gap-1 text-white active:scale-125 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ${likes['tiktok-1'] ? 'text-rose-500' : 'text-white'}`}>
                  <Heart size={24} className={likes['tiktok-1'] ? 'fill-current' : ''} />
                </div>
                <span className="text-xs font-bold font-mono">1.4M</span>
              </button>

              <button
                type="button"
                onClick={() => playTapSound(600)}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <span className="text-xs font-bold font-mono">34.2K</span>
              </button>

              <button
                type="button"
                onClick={() => playTapSound(600)}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Share2 size={24} />
                </div>
                <span className="text-xs font-bold font-mono">Share</span>
              </button>
            </div>

            {/* Bottom Captions */}
            <div className="relative z-20 space-y-2 max-w-[80%] pb-4">
              <h4 className="text-sm font-bold text-white">@nature.explorer</h4>
              <p className="text-xs text-neutral-200">
                Witnessing the Costa Rican rainforest wildlife in 4K resolution 🌿✨ #travel #wildlife #nature
              </p>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Music size={14} className="animate-spin" />
                <span className="truncate">Original Sound - Nature Ambience Relax</span>
              </div>
            </div>
          </div>
        ) : isInstagram ? (
          /* INSTAGRAM FEED VIEW */
          <div className="space-y-4 p-4">
            {/* Stories Row */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 border-b border-neutral-800">
              {['Your Story', 'Sunny', 'TechNews', 'Design', 'Travel'].map((story, i) => (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <img
                      src={`https://images.unsplash.com/photo-${1535713875002 + i}?w=100&h=100&fit=crop`}
                      alt={story}
                      className="w-full h-full rounded-full object-cover border-2 border-black"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-300 font-medium truncate max-w-[60px]">{story}</span>
                </div>
              ))}
            </div>

            {/* Feed Post */}
            <div className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden space-y-3">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="User" />
                  </div>
                  <span className="text-xs font-bold text-white">Sunny Sharma</span>
                </div>
              </div>

              <div 
                className="w-full aspect-square bg-neutral-800 overflow-hidden relative cursor-pointer"
                onDoubleClick={() => toggleLike('ig-1')}
              >
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=800&fit=crop"
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleLike('ig-1')}
                      className={`active:scale-125 transition-transform ${likes['ig-1'] ? 'text-rose-500' : 'text-white'}`}
                    >
                      <Heart size={20} className={likes['ig-1'] ? 'fill-current' : ''} />
                    </button>
                    <MessageCircle size={20} className="text-white" />
                    <Share2 size={20} className="text-white" />
                  </div>
                  <Bookmark size={20} className="text-white" />
                </div>

                <span className="text-xs font-bold text-white block">
                  {likes['ig-1'] ? '3,482 likes' : '3,481 likes'}
                </span>
                <p className="text-xs text-neutral-300 leading-snug">
                  <span className="font-bold text-white mr-1.5">Sunny Sharma</span>
                  Experience MagicOS 11 with live haptic feedback and dynamic widgets! 🚀📱
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* TWITTER / X FEED VIEW */
          <div className="divide-y divide-neutral-800">
            {/* Tweet Composer */}
            <form onSubmit={handlePostTweet} className="p-4 bg-neutral-950 flex gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="You" />
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  placeholder="What is happening?!"
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none resize-none h-16"
                />
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Sparkles size={16} />
                  </div>
                  <button
                    type="submit"
                    disabled={!tweetText.trim()}
                    className="px-4 py-1.5 rounded-full bg-cyan-500 disabled:opacity-40 text-black font-extrabold text-xs active:scale-95 transition-all shadow"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>

            {/* Tweets Stream */}
            {tweets.map((t) => {
              const isLiked = likes[t.id];
              return (
                <div key={t.id} className="p-4 hover:bg-neutral-900/40 flex gap-3 transition-colors">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-white">{t.author}</span>
                      <span className="text-neutral-500">{t.handle}</span>
                      <span className="text-neutral-500">· {t.time}</span>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed">
                      {t.content}
                    </p>

                    <div className="flex items-center justify-between text-neutral-500 text-xs pt-2 max-w-xs">
                      <button type="button" className="flex items-center gap-1 hover:text-cyan-400">
                        <MessageCircle size={15} />
                        <span>12</span>
                      </button>
                      <button type="button" className="flex items-center gap-1 hover:text-emerald-400">
                        <Repeat2 size={15} />
                        <span>{t.retweets}</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => toggleLike(t.id)}
                        className={`flex items-center gap-1 hover:text-rose-500 ${isLiked ? 'text-rose-500' : ''}`}
                      >
                        <Heart size={15} className={isLiked ? 'fill-current' : ''} />
                        <span>{t.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                      <button type="button" className="hover:text-cyan-400">
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
