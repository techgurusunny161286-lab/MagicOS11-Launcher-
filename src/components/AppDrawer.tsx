import React, { useState, useMemo, useRef } from 'react';
import { Search, X, Sparkles, ChevronDown, Plus, Download, Info } from 'lucide-react';
import { AppItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { AppContextMenu } from './AppContextMenu';
import { InstallAppModal } from './InstallAppModal';
import { playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  onOpenApp: (appId: string) => void;
  onDragStartPortal?: (title: string) => void;
  onAddToHome?: (app: AppItem) => void;
  onRemoveFromDrawer?: (appId: string) => void;
  onInstallApp?: (app: AppItem) => void;
  onRestoreDefaults?: () => void;
  homeAppIds?: string[];
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  apps,
  onOpenApp,
  onDragStartPortal,
  onAddToHome,
  onRemoveFromDrawer,
  onInstallApp,
  onRestoreDefaults,
  homeAppIds = [],
}) => {
  const [search, setSearch] = useState('');
  const [selectedAppForMenu, setSelectedAppForMenu] = useState<AppItem | null>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ y: number; x: number; isTopHeader: boolean } | null>(null);

  // Group apps alphabetically
  const filteredApps = useMemo(() => {
    if (!search.trim()) {
      return [...apps].sort((a, b) => a.name.localeCompare(b.name));
    }
    return apps
      .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [apps, search]);

  // Suggested apps (top 4 favorites)
  const suggestedApps = useMemo(() => {
    return apps.slice(0, 4);
  }, [apps]);

  // Alphabetical buckets
  const groupedApps = useMemo(() => {
    const map: Record<string, AppItem[]> = {};
    filteredApps.forEach((app) => {
      const firstLetter = app.name[0].toUpperCase();
      if (!map[firstLetter]) map[firstLetter] = [];
      map[firstLetter].push(app);
    });
    return map;
  }, [filteredApps]);

  const availableLetters = useMemo(() => {
    return Object.keys(groupedApps).sort();
  }, [groupedApps]);

  if (!isOpen) return null;

  // Swipe-down detection at the top to close App Drawer
  const handleTouchStart = (clientY: number, clientX: number, isTopHeader = false) => {
    touchStartRef.current = { y: clientY, x: clientX, isTopHeader };
  };

  const handleTouchEnd = (clientY: number, clientX: number) => {
    if (!touchStartRef.current) return;
    const deltaY = clientY - touchStartRef.current.y;
    const deltaX = clientX - touchStartRef.current.x;
    const wasTopHeader = touchStartRef.current.isTopHeader;
    const isAtTopScroll = !scrollContainerRef.current || scrollContainerRef.current.scrollTop <= 2;
    touchStartRef.current = null;

    // 1. Sweeping from Right to Left closes the App Drawer
    if (deltaX < -32 && Math.abs(deltaX) > Math.abs(deltaY)) {
      playTapSound(500);
      onClose();
      return;
    }

    // 2. Swiping/swapping down from top closes the app drawer
    if (deltaY > 25 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (wasTopHeader || isAtTopScroll) {
        playTapSound(500);
        onClose();
      }
    }
  };

  const scrollToLetter = (letter: string) => {
    playTapSound(700, 0.02);
    const element = document.getElementById(`letter-group-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end bg-neutral-950/80 backdrop-blur-2xl text-white select-none animate-in slide-in-from-bottom duration-300 overflow-hidden"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, false)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX, false)}
        onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
        className="w-full max-w-[420px] md:max-w-3xl lg:max-w-4xl mx-auto h-[92%] flex flex-col rounded-t-[38px] bg-neutral-900/95 border-t border-neutral-700/60 shadow-2xl p-4 md:p-6 pb-8"
      >
        {/* Top Grab Handle & Dismiss Area (Swipe Down anywhere here to close) */}
        <div 
          onClick={onClose}
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, true)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX, true)}
          onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
          className="flex flex-col items-center justify-center cursor-pointer pt-1 pb-2 group touch-none hover:opacity-90 active:scale-95 transition-all"
          title="Swipe down at top or click to close"
        >
          <div className="w-14 h-1.5 rounded-full bg-neutral-500 group-hover:bg-neutral-300 transition-colors"></div>
          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium mt-1">
            <ChevronDown size={13} className="text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Swipe down at top to close</span>
          </div>
        </div>

        {/* Search Bar + Install App Action Button */}
        <div 
          className="relative my-1 px-1 flex items-center gap-2"
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, true)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
        >
          <div className="relative flex-1 flex items-center">
            <Search size={16} className="absolute left-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search apps & suggestions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 text-neutral-400 hover:text-white"
              >
                <X size={14} />
              </button>
            ) : (
              <Sparkles size={14} className="absolute right-3 text-cyan-400 animate-pulse" />
            )}
          </div>

          {/* Install New App Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('smooth');
              setIsInstallModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold whitespace-nowrap active:scale-95 transition-all shadow"
            title="Install or Add New App"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">Install</span>
          </button>
        </div>

        {/* Feature Hint Pill */}
        <div className="px-2 py-1 flex items-center justify-between text-[10px] text-cyan-400/90 font-medium bg-cyan-500/10 rounded-xl my-1 border border-cyan-500/20">
          <span>💡 Press & hold any app (&lt;1s) to Add to Home Screen or Uninstall</span>
        </div>

        {/* Suggested Apps Section (if not searching) */}
        {!search && (
          <div 
            className="py-2 border-b border-neutral-800/80"
            onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, true)}
            onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 px-2 block mb-2">
              Suggested Apps
            </span>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 justify-items-center">
              {suggestedApps.map((app) => (
                <div 
                  key={`sugg-${app.id}`}
                  className="flex flex-col items-center"
                >
                  <AppIcon
                    iconName={app.iconName}
                    size="sm"
                    label={app.name}
                    isDraggable={true}
                    onDragStartPortal={onDragStartPortal}
                    onOpen={() => {
                      playTapSound(600);
                      onOpenApp(app.id);
                      onClose();
                    }}
                    onHold={() => {
                      setSelectedAppForMenu(app);
                      setIsContextMenuOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Apps List with Alphabet Scrubber */}
        <div 
          className="relative flex-1 overflow-hidden flex mt-2"
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, false)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX, false)}
          onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
        >
          {/* Scrollable Apps Container */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto no-scrollbar pr-5 space-y-4"
          >
            {filteredApps.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs">
                No apps found matching "{search}"
              </div>
            ) : (
              availableLetters.map((letter) => (
                <div key={letter} id={`letter-group-${letter}`} className="space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400 px-2 sticky top-0 bg-neutral-900/90 backdrop-blur-sm py-0.5 z-10">
                    {letter}
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 justify-items-center">
                    {groupedApps[letter].map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col items-center"
                      >
                        <AppIcon
                          iconName={app.iconName}
                          size="md"
                          showBadge={app.badge}
                          label={app.name}
                          isDraggable={true}
                          onDragStartPortal={onDragStartPortal}
                          onOpen={() => {
                            playTapSound(600);
                            onOpenApp(app.id);
                            onClose();
                          }}
                          onHold={() => {
                            setSelectedAppForMenu(app);
                            setIsContextMenuOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Alphabet Index Scrubber on Right Edge */}
          {!search && availableLetters.length > 2 && (
            <div className="absolute right-0 inset-y-0 flex flex-col justify-center items-center py-2 px-0.5 text-[9px] font-mono text-neutral-400 select-none">
              {availableLetters.map((ltr) => (
                <button
                  type="button"
                  key={ltr}
                  onClick={() => scrollToLetter(ltr)}
                  className="w-3.5 h-3.5 flex items-center justify-center hover:text-cyan-400 hover:scale-125 transition-transform"
                >
                  {ltr}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Swipe Down / Close Bar */}
        <div 
          onClick={onClose}
          className="pt-2 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1 cursor-pointer hover:text-neutral-300"
        >
          <ChevronDown size={14} />
          <span>Tap or swipe down to close</span>
        </div>
      </div>

      {/* Context Menu on Hold (< 1 second) */}
      <AppContextMenu
        isOpen={isContextMenuOpen}
        app={selectedAppForMenu}
        location="drawer"
        isOnHomeScreen={selectedAppForMenu ? homeAppIds.includes(selectedAppForMenu.id) : false}
        onClose={() => {
          setIsContextMenuOpen(false);
          setSelectedAppForMenu(null);
        }}
        onAddToHomeScreen={(appToAdd) => {
          if (onAddToHome) onAddToHome(appToAdd);
        }}
        onUninstallApp={(appId) => {
          if (onRemoveFromDrawer) onRemoveFromDrawer(appId);
        }}
        onOpenApp={(appId) => {
          onOpenApp(appId);
          onClose();
        }}
      />

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstallApp={(newApp) => {
          if (onInstallApp) onInstallApp(newApp);
        }}
        onRestoreDefaults={onRestoreDefaults}
        installedAppIds={apps.map(a => a.id)}
      />
    </div>
  );
};
