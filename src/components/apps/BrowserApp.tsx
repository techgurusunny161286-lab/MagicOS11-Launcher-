import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Globe, 
  RotateCw, 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  Bookmark, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface BrowserAppProps {
  onClose: () => void;
  initialQuery?: string;
  onOpenPortal?: (title: string) => void;
}

interface SearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({
  onClose,
  initialQuery = '',
  onOpenPortal,
}) => {
  const [url, setUrl] = useState(initialQuery || 'https://sunny.com/magicos-11');
  const [inputVal, setInputVal] = useState(initialQuery || 'https://sunny.com/magicos-11');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const quickSites = [
    { title: 'SUNNY Official', url: 'https://sunny.com', icon: Sparkles },
    { title: 'MagicOS 11 News', url: 'https://news.google.com', icon: Globe },
    { title: 'Tech Radar', url: 'https://techradar.com', icon: Bookmark },
    { title: 'Wikipedia', url: 'https://wikipedia.org', icon: BookOpen },
  ];

  const handleSearch = async (query: string) => {
    playTapSound(600);
    setIsLoading(true);
    setUrl(query);
    setInputVal(query);

    // Call free public Wikipedia API for live web search results
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
      if (res.ok) {
        const data = await res.json();
        if (data.query?.search) {
          setSearchResults(data.query.search.slice(0, 8));
        }
      }
    } catch {}
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Address Bar */}
      <div className="flex items-center gap-2 px-3 pt-4 pb-2 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            setUrl('https://sunny.com/magicos-11');
            setInputVal('https://sunny.com/magicos-11');
            setSearchResults([]);
          }}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleSearch(inputVal)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
        >
          <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>

        {/* URL Pill Input */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs">
          <Globe size={14} className="text-cyan-400 shrink-0" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(inputVal);
            }}
            placeholder="Search web or Wikipedia..."
            className="w-full bg-transparent text-white focus:outline-none placeholder-neutral-500"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenPortal) onOpenPortal(url);
          }}
          className="p-1.5 text-neutral-400 hover:text-cyan-400"
          title="Magic Portal"
        >
          <Share2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="p-1.5 text-neutral-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Browser Viewport Area */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-neutral-900 p-4 space-y-4">
        {/* Quick Speed Dial Bookmarks */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {quickSites.map((site) => {
            const Icon = site.icon;
            return (
              <button
                type="button"
                key={site.title}
                onClick={() => handleSearch(site.title)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <span className="text-[10px] text-neutral-300 font-medium truncate w-full text-center">
                  {site.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Results (Wikipedia API) */}
        {searchResults.length > 0 ? (
          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block px-1">
              Live Web Results ({searchResults.length})
            </span>

            {searchResults.map((res) => (
              <div
                key={res.pageid}
                className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-cyan-500/40 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-300">{res.title}</h4>
                  <a
                    href={`https://en.wikipedia.org/?curid=${res.pageid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-white"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p 
                  className="text-[11px] text-neutral-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: res.snippet + '...' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured MagicOS 11 Story Article */}
            <div className="p-5 rounded-[28px] bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-neutral-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <Sparkles size={14} />
                <span>SUNNY OFFICIAL ANNOUNCEMENT</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                SUNNY MagicOS 11: Flagship Four-Layer AI Architecture
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                MagicOS 11 introduces on-device SUNNY multimodal agent models, revolutionary Magic Capsule dynamic island multitasking, continuous squircle iconography, and lightning-fast Magic Portal edge-drag interactions.
              </p>
              <div className="flex items-center gap-3 pt-2 text-[11px] text-neutral-400 border-t border-neutral-800">
                <span>By SUNNY Engineering</span>
                <span>·</span>
                <span>Oct 2026</span>
              </div>
            </div>

            {/* Search Engine News Feed */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-400 px-1 uppercase tracking-wider">Top Headlines</h4>
              {[
                {
                  title: 'Snapdragon 8 Gen 4 Powered SUNNY Magic7 Pro Sets Benchmark Records',
                  source: 'Tech Insights · 2h ago',
                },
                {
                  title: 'Magic Portal Any-Door Drag-and-Drop Expands to 150+ Android Applications',
                  source: 'Mobile World · 4h ago',
                },
                {
                  title: 'SUNNY Qinghai Lake Battery Technology Brings 5,600mAh to Slim Flagships',
                  source: 'Hardware Daily · 6h ago',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearch(item.title)}
                  className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-cyan-500/30 cursor-pointer transition-colors"
                >
                  <h5 className="text-xs font-semibold text-white leading-snug">{item.title}</h5>
                  <span className="text-[10px] text-neutral-500 mt-1 block">{item.source}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
