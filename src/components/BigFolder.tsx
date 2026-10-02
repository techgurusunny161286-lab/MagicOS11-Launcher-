import React, { useState } from 'react';
import { AppItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { X, FolderOpen, Maximize2, Minimize2, Edit3, Check } from 'lucide-react';
import { playTapSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

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
  const [folderTitle, setFolderTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [folderSize, setFolderSize] = useState<'2x2' | '1x1'>('2x2');

  const handleFolderHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('tick');
    playTapSound(600);
    setIsExpanded(true);
  };

  const handleMiniAppClick = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('doubleTick');
    playTapSound(700);
    onOpenApp(appId);
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Big Folder or Compact Folder Container */}
      <div 
        className={`w-full h-full rounded-[30px] bg-white/15 dark:bg-black/35 backdrop-blur-xl border border-white/25 dark:border-white/10 p-2.5 flex flex-col justify-between shadow-xl relative group transition-all duration-200 select-none ${
          folderSize === '1x1' ? 'max-w-[80px] max-h-[80px] mx-auto' : ''
        }`}
      >
        {/* Folder Title with expand / size toggle affordance */}
        <div 
          onClick={handleFolderHeaderClick}
          className="flex items-center justify-between px-1 cursor-pointer"
        >
          <span className="text-[11px] font-bold text-white drop-shadow-sm tracking-tight truncate flex items-center gap-1">
            {folderTitle}
          </span>
          <div className="flex items-center gap-1 text-[9px] text-white/70">
            <span>{apps.length}</span>
            <Maximize2 size={10} className="group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

        {/* 3x3 Grid of 9 Mini App Icons (Direct 1-tap launching without expanding!) */}
        <div className="grid grid-cols-3 gap-1.5 p-0.5 flex-1 items-center justify-items-center">
          {apps.slice(0, 9).map((app) => (
            <div
              key={app.id}
              onClick={(e) => handleMiniAppClick(app.id, e)}
              className="flex items-center justify-center p-0.5 rounded-xl hover:bg-white/10 active:scale-90 transition-transform cursor-pointer"
              title={`Open ${app.name}`}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[350px] rounded-[36px] bg-neutral-900/95 border border-white/20 p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-5 text-white"
          >
            {/* Header with Title Editing */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen size={19} className="text-cyan-400" />
                {isEditingTitle ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={folderTitle}
                      onChange={(e) => setFolderTitle(e.target.value)}
                      className="bg-black/50 border border-cyan-400/50 rounded-lg px-2 py-0.5 text-sm font-bold text-white focus:outline-none w-36"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(false)}
                      className="p-1 rounded-md bg-cyan-500 text-neutral-950 font-bold"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingTitle(true)}
                    className="flex items-center gap-1.5 cursor-pointer group"
                    title="Click to rename"
                  >
                    <h3 className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                      {folderTitle}
                    </h3>
                    <Edit3 size={13} className="text-neutral-500 group-hover:text-cyan-400" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  setIsExpanded(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close Folder"
              >
                <X size={16} />
              </button>
            </div>

            {/* Apps Grid in Full Size */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 py-2 justify-items-center">
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

            <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-white/10">
              <span>MagicOS 11 · Big Folder (大文件夹)</span>
              <span>{apps.length} apps installed</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
