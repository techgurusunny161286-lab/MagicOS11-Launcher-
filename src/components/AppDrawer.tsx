import React, { useState, useMemo, useRef } from 'react';
import { Search, X, Sparkles, ChevronDown, Plus, Download, Info, LayoutGrid, ListFilter } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<'All' | 'Communication' | 'Entertainment' | 'Tools'>('All');
  const [selectedAppForMenu, setSelectedAppForMenu] = useState<AppItem | null>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ y: number; x: number; isTopHeader: boolean } | null>(null);

  // Filter apps by search & category
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = !search.trim() || app.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (activeCategory === 'All') return true;
      if (activeCategory === 'Communication') {
        return ['phone', 'messages', 'whatsapp', 'contacts', 'gmail', 'meet'].includes(app.id) || app.category === 'social';
      }
      if (activeCategory === 'Entertainment') {
        return ['youtube', 'gallery', 'photos', 'music', 'netflix', 'spotify'].includes(app.id) || app.category === 'media';
      }
      if (activeCategory === 'Tools') {
        return ['settings', 'files', 'clock', 'calculator', 'recorder', 'notes', 'maps', 'calendar', 'weather', 'manager', 'safety', 'browser', 'playstore'].includes(app.id) || app.category === 'tools';
      }
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [apps, search, activeCategory]);

  const ALPHABET = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
    triggerHaptic('tick');
    playTapSound(700, 0.02);
    const targetApp = filteredApps.find(a => 
      letter === '#' ? !/^[A-Z]/i.test(a.name) : a.name.toUpperCase().startsWith(letter)
    );
    if (targetApp) {
      const element = document.getElementById(`app-drawer-item-${targetApp.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end bg-neutral-950/80 backdrop-blur-3xl text-white select-none animate-in slide-in-from-bottom duration-300 overflow-hidden"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, false)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX, false)}
        onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
        className="w-full max-w-[440px] md:max-w-3xl lg:max-w-4xl mx-auto h-[94%] flex flex-col rounded-t-[42px] bg-neutral-900/90 border-t border-t-white/30 shadow-[0_-20px_50px_rgba(0,0,0,0.85)] p-4 md:p-6 pb-6 relative backdrop-blur-2xl"
      >
        {/* Top Grab Handle */}
        <div 
          onClick={onClose}
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, true)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX, true)}
          onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
          className="flex flex-col items-center justify-center cursor-pointer pt-1 pb-2 group touch-none active:scale-95 transition-all"
        >
          <div className="w-14 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors"></div>
        </div>

        {/* Title Header: "Apps" matching reference */}
        <div className="flex items-center justify-between px-2 pt-1 mb-2">
          <h2 className="text-2xl font-black tracking-tight text-white font-sans">Apps</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('smooth');
                setIsInstallModalOpen(true);
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors"
              title="Add / Install App"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills (All, Communication, Entertainment, Tools) */}
        <div className="flex items-center gap-2 px-1 mb-3 overflow-x-auto no-scrollbar">
          {(['All', 'Communication', 'Entertainment', 'Tools'] as const).map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  playTapSound(600);
                  setActiveCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-md ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 border border-white/30 scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/15 text-neutral-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3D Extruded Search Bar matching reference */}
        <div className="relative mb-3 px-1 flex items-center gap-2">
          <div className="relative flex-1 flex items-center rounded-[22px] bg-white/10 dark:bg-black/40 backdrop-blur-2xl border-t border-t-white/40 border-b border-b-black/40 shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.2)]">
            <Search size={17} className="absolute left-3.5 text-neutral-300" />
            <input
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-transparent text-xs text-white placeholder-neutral-400 focus:outline-none"
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
              <LayoutGrid size={15} className="absolute right-3.5 text-neutral-400" />
            )}
          </div>
        </div>

        {/* All Apps Grid with 3D Depth Icons & Alphabet Index Rail */}
        <div 
          className="relative flex-1 overflow-hidden flex"
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientY, e.touches[0].clientX, false)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientY, e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleTouchStart(e.clientY, e.clientX, false)}
          onMouseUp={(e) => handleTouchEnd(e.clientY, e.clientX)}
        >
          {/* Scrollable Apps Grid (4 columns) */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto no-scrollbar pr-6 py-1"
          >
            {filteredApps.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 text-xs">
                No apps found matching "{search}"
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-4 gap-x-2 justify-items-center">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    id={`app-drawer-item-${app.id}`}
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
            )}
          </div>

          {/* Quick Alphabet Index Scrubber on Right Edge matching reference */}
          <div className="absolute right-0 inset-y-0 flex flex-col justify-between items-center py-2 px-0.5 text-[8.5px] font-sans font-bold text-white/50 select-none pointer-events-auto">
            {ALPHABET.map((ltr) => (
              <button
                type="button"
                key={ltr}
                onClick={() => scrollToLetter(ltr)}
                className="w-3.5 h-3 flex items-center justify-center hover:text-cyan-400 hover:scale-150 transition-transform cursor-pointer"
              >
                {ltr}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div 
          onClick={onClose}
          className="pt-2 text-center text-[10px] text-neutral-500 flex flex-col items-center justify-center gap-1 cursor-pointer hover:text-neutral-300"
        >
          <div className="w-24 h-1 rounded-full bg-white/40"></div>
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
