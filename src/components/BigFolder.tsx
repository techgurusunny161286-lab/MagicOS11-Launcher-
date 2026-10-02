import React, { useState } from 'react';
import { AppItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { X, FolderOpen } from 'lucide-react';
import { playTapSound } from '../utils/sound';

interface BigFolderProps {
  title: string;
  apps: AppItem[];
  onOpenApp: (appId: string) => void;
  onDragStartPortal?: (title: string) => void;
}

export const BigFolder: React.FC<BigFolderProps> = ({
  title,
  apps,
  onOpenApp,
  onDragStartPortal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFolderHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound(600);
    setIsExpanded(true);
  };

  const handleMiniAppClick = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound(700);
    onOpenApp(appId);
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* 2x2 Big Folder Container */}
      <div 
        className="w-full h-full rounded-[28px] bg-white/15 dark:bg-black/35 backdrop-blur-xl border border-white/20 dark:border-white/10 p-2.5 flex flex-col justify-between shadow-lg relative group transition-all duration-200"
      >
        {/* Folder Title with expand indicator */}
        <div 
          onClick={handleFolderHeaderClick}
          className="flex items-center justify-between px-1 cursor-pointer"
        >
          <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm tracking-tight truncate">
            {title}
          </span>
          <span className="text-[9px] text-white/60 group-hover:text-white/90">
            {apps.length}
          </span>
        </div>

        {/* 3x3 Grid of 9 Mini App Icons */}
        <div className="grid grid-cols-3 gap-1.5 p-0.5 flex-1 items-center justify-items-center">
          {apps.slice(0, 9).map((app) => (
            <div
              key={app.id}
              onClick={(e) => handleMiniAppClick(app.id, e)}
              className="flex items-center justify-center p-0.5 rounded-xl hover:bg-white/10 active:scale-90 transition-transform cursor-pointer"
            >
              <AppIcon 
                iconName={app.iconName} 
                size="mini" 
                showBadge={app.badge}
                isDraggable={true}
                onDragStartPortal={onDragStartPortal}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Folder Full Modal View */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] rounded-[36px] bg-neutral-900/95 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-5 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close Folder"
              >
                <X size={16} />
              </button>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-3 gap-y-5 gap-x-3 py-2 justify-items-center">
              {apps.map((app) => (
                <div 
                  key={app.id}
                  onClick={(e) => handleMiniAppClick(app.id, e)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <AppIcon 
                    iconName={app.iconName} 
                    size="md" 
                    showBadge={app.badge}
                    label={app.name}
                    isDraggable={true}
                    onDragStartPortal={onDragStartPortal}
                  />
                </div>
              ))}
            </div>

            <div className="text-center text-[10px] text-neutral-400">
              MagicOS 11 · Large Interactive Folder
            </div>
          </div>
        </div>
      )}
    </>
  );
};
