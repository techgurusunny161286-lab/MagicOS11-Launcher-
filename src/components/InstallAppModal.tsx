import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Download, 
  Sparkles, 
  Check, 
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { AppItem } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { triggerHaptic } from '../utils/haptics';
import { playTapSound } from '../utils/sound';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallApp: (newApp: AppItem) => void;
  onRestoreDefaults?: () => void;
  installedAppIds: string[];
}

const PRESET_POPULAR_APPS: AppItem[] = [
  { id: 'whatsapp', name: 'WhatsApp', iconName: 'messages', category: 'social' },
  { id: 'youtube', name: 'YouTube', iconName: 'music', category: 'media' },
  { id: 'spotify', name: 'Spotify', iconName: 'music', category: 'media' },
  { id: 'netflix', name: 'Netflix', iconName: 'gallery', category: 'media' },
  { id: 'instagram', name: 'Instagram', iconName: 'camera', category: 'social' },
  { id: 'twitter', name: 'X / Twitter', iconName: 'browser', category: 'social' },
  { id: 'chatgpt', name: 'ChatGPT AI', iconName: 'yoyo', category: 'tools' },
  { id: 'telegram', name: 'Telegram', iconName: 'messages', category: 'social' },
  { id: 'tiktok', name: 'TikTok', iconName: 'music', category: 'media' },
  { id: 'files_pro', name: 'Files Pro', iconName: 'files', category: 'tools' },
];

const AVAILABLE_ICONS = [
  'phone', 'messages', 'browser', 'camera', 'gallery', 
  'settings', 'notes', 'calculator', 'health', 'music', 
  'themes', 'weather', 'files', 'clock', 'manager', 'yoyo'
];

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onInstallApp,
  onRestoreDefaults,
  installedAppIds,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customName, setCustomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('browser');
  const [selectedCategory, setSelectedCategory] = useState<'tools' | 'media' | 'social' | 'system'>('tools');

  if (!isOpen) return null;

  const handleInstallPreset = (app: AppItem) => {
    triggerHaptic('doubleTick');
    playTapSound(700);
    onInstallApp(app);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newApp: AppItem = {
      id: `app-${Date.now()}`,
      name: customName.trim(),
      iconName: selectedIcon,
      category: selectedCategory,
    };

    triggerHaptic('doubleTick');
    playTapSound(700);
    onInstallApp(newApp);
    setCustomName('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[380px] rounded-[32px] bg-neutral-900 border border-white/20 shadow-2xl p-5 flex flex-col gap-4 text-white backdrop-blur-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Download size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MagicOS App Center</h3>
              <p className="text-[10px] text-neutral-400">Install & Add Apps to Launcher</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab switch: Presets vs Custom */}
        <div className="grid grid-cols-2 p-1 bg-black/40 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('smooth');
              setActiveTab('presets');
            }}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'presets' ? 'bg-cyan-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Popular Apps
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('smooth');
              setActiveTab('custom');
            }}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'custom' ? 'bg-cyan-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Custom App
          </button>
        </div>

        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {PRESET_POPULAR_APPS.map((preset) => {
                const isInstalled = installedAppIds.includes(preset.id);
                return (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AppIcon iconName={preset.iconName} size="sm" isDraggable={false} />
                      <div>
                        <span className="text-xs font-bold text-white block">{preset.name}</span>
                        <span className="text-[10px] text-cyan-400 uppercase font-medium">{preset.category}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isInstalled}
                      onClick={() => handleInstallPreset(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                        isInstalled
                          ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md'
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Check size={12} strokeWidth={3} />
                          <span>Installed</span>
                        </>
                      ) : (
                        <>
                          <Plus size={13} strokeWidth={2.5} />
                          <span>Install</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Restore defaults button */}
            {onRestoreDefaults && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('click');
                  playTapSound(600);
                  onRestoreDefaults();
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-2xl border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-2"
              >
                <RotateCcw size={13} />
                <span>Restore Default System Apps</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 2: CREATE CUSTOM APP */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateCustom} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                App Name
              </label>
              <input
                type="text"
                placeholder="e.g. My Workspace, Twitter, Crypto..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-cyan-400"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                Select Icon Style
              </label>
              <div className="grid grid-cols-4 gap-2 p-2 bg-black/40 rounded-2xl border border-white/10 max-h-36 overflow-y-auto no-scrollbar">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => {
                      triggerHaptic('smooth');
                      setSelectedIcon(icon);
                    }}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                      selectedIcon === icon ? 'bg-cyan-500/30 border border-cyan-400 ring-2 ring-cyan-400/50' : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <AppIcon iconName={icon} size="mini" isDraggable={false} />
                    <span className="text-[9px] text-neutral-300 mt-1 capitalize truncate w-full text-center">
                      {icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                Category
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['tools', 'media', 'social', 'system'] as const).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      triggerHaptic('smooth');
                      setSelectedCategory(cat);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold capitalize transition-all border ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!customName.trim()}
              className="w-full py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all mt-2"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Install to Launcher</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
