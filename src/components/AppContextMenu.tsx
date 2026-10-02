import React from 'react';
import { 
  Plus, 
  Trash2, 
  MinusCircle, 
  Info, 
  Play, 
  Sliders, 
  X,
  Share2
} from 'lucide-react';
import { AppItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { triggerHaptic } from '../utils/haptics';
import { playTapSound } from '../utils/sound';

interface AppContextMenuProps {
  isOpen: boolean;
  app: AppItem | null;
  location: 'home' | 'drawer';
  isOnHomeScreen?: boolean;
  onClose: () => void;
  onAddToHomeScreen?: (app: AppItem) => void;
  onRemoveFromHomeScreen?: (appId: string) => void;
  onUninstallApp?: (appId: string) => void;
  onOpenApp?: (appId: string) => void;
  onEnterEditMode?: () => void;
}

export const AppContextMenu: React.FC<AppContextMenuProps> = ({
  isOpen,
  app,
  location,
  isOnHomeScreen = false,
  onClose,
  onAddToHomeScreen,
  onRemoveFromHomeScreen,
  onUninstallApp,
  onOpenApp,
  onEnterEditMode,
}) => {
  if (!isOpen || !app) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[290px] rounded-[28px] bg-neutral-900/95 border border-white/20 shadow-2xl p-4 flex flex-col gap-3 text-white backdrop-blur-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* App Header Glance */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <AppIcon iconName={app.iconName} size="sm" isDraggable={false} />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{app.name}</h3>
              <span className="text-[10px] text-cyan-400 capitalize font-medium">
                {app.category || 'Application'} · MagicOS 11
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Context Menu Actions */}
        <div className="flex flex-col gap-1.5">
          {/* Open App */}
          {onOpenApp && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                playTapSound(600);
                onClose();
                onOpenApp(app.id);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-white/10 active:scale-98 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-neutral-950 transition-colors">
                <Play size={15} className="fill-current" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Open App</span>
                <span className="text-[10px] text-neutral-400">Launch now</span>
              </div>
            </button>
          )}

          {/* ACTION: ADD TO HOME SCREEN (When in App Drawer) */}
          {location === 'drawer' && onAddToHomeScreen && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('click');
                playTapSound(600);
                onAddToHomeScreen(app);
                onClose();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-cyan-500/20 active:scale-98 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
                <Plus size={16} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-300 block">
                  {isOnHomeScreen ? 'Add Another to Home' : 'Add to Home Screen'}
                </span>
                <span className="text-[10px] text-neutral-400">Place shortcut on desktop</span>
              </div>
            </button>
          )}

          {/* ACTION: REMOVE FROM HOME SCREEN (When on Home Screen) */}
          {location === 'home' && onRemoveFromHomeScreen && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('heavy');
                playTapSound(500);
                onRemoveFromHomeScreen(app.id);
                onClose();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-amber-500/20 active:scale-98 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                <MinusCircle size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-300 block">Remove from Home Screen</span>
                <span className="text-[10px] text-neutral-400">App stays in App Drawer</span>
              </div>
            </button>
          )}

          {/* ACTION: ENTER EDIT MODE (When on Home Screen) */}
          {location === 'home' && onEnterEditMode && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tick');
                onClose();
                onEnterEditMode();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-white/10 active:scale-98 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Sliders size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Edit Home Screen</span>
                <span className="text-[10px] text-neutral-400">Batch remove or reorder</span>
              </div>
            </button>
          )}

          {/* ACTION: UNINSTALL / REMOVE FROM DRAWER */}
          {onUninstallApp && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('heavy');
                playTapSound(400);
                onUninstallApp(app.id);
                onClose();
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-rose-500/20 active:scale-98 text-left transition-all group border-t border-white/5 mt-1 pt-2"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Trash2 size={15} />
              </div>
              <div>
                <span className="text-xs font-semibold text-rose-300 block">
                  {location === 'home' ? 'Uninstall App' : 'Uninstall from Drawer'}
                </span>
                <span className="text-[10px] text-neutral-400">Completely remove application</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
