import React, { useState } from 'react';
import { 
  X, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Film, 
  Download, 
  HardDrive, 
  Search, 
  Trash2, 
  Share2,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface FilesAppProps {
  onClose: () => void;
  onOpenPortal?: (title: string) => void;
}

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'doc' | 'archive';
  size: string;
  date: string;
}

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'MagicOS_11_Wallpaper_4K.jpg', type: 'image', size: '4.2 MB', date: 'Today' },
  { id: 'f2', name: 'Product_Roadmap_Q4.pdf', type: 'doc', size: '1.8 MB', date: 'Yesterday' },
  { id: 'f3', name: 'Voice_Note_Meeting_01.m4a', type: 'audio', size: '12.4 MB', date: 'Sep 29' },
  { id: 'f4', name: 'Screen_Recording_Tactile_Demo.mp4', type: 'video', size: '48.6 MB', date: 'Sep 28' },
  { id: 'f5', name: 'Sunny_Assistant_Model_Weights.zip', type: 'archive', size: '142 MB', date: 'Sep 25' },
  { id: 'f6', name: 'Camera_Snapshot_Sunset.jpg', type: 'image', size: '3.6 MB', date: 'Sep 24' },
];

export const FilesApp: React.FC<FilesAppProps> = ({ onClose, onOpenPortal }) => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Files', icon: Folder, count: files.length },
    { id: 'image', label: 'Images', icon: ImageIcon, count: files.filter(f => f.type === 'image').length },
    { id: 'doc', label: 'Documents', icon: FileText, count: files.filter(f => f.type === 'doc').length },
    { id: 'audio', label: 'Audio', icon: Music, count: files.filter(f => f.type === 'audio').length },
    { id: 'video', label: 'Videos', icon: Film, count: files.filter(f => f.type === 'video').length },
  ];

  const filteredFiles = activeCategory === 'all'
    ? files
    : files.filter(f => f.type === activeCategory);

  const handleDelete = (id: string) => {
    triggerHaptic('heavy');
    playTapSound(500);
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFile?.id === id) setSelectedFile(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={18} className="text-cyan-400" />;
      case 'video': return <Film size={18} className="text-rose-400" />;
      case 'audio': return <Music size={18} className="text-amber-400" />;
      case 'doc': return <FileText size={18} className="text-blue-400" />;
      default: return <Folder size={18} className="text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Folder size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Files Manager</h2>
            <p className="text-[10px] text-neutral-400">Internal Storage · 78.4 GB Used</p>
          </div>
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

      {/* Storage Bar Overview */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/30 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-cyan-400" />
            <span className="font-semibold text-white">Device Storage</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">78.4 GB / 256 GB</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-cyan-500 w-[18%]" title="Apps (46 GB)"></div>
          <div className="h-full bg-rose-500 w-[8%]" title="Images (20 GB)"></div>
          <div className="h-full bg-amber-500 w-[5%]" title="Audio (12 GB)"></div>
          <div className="h-full bg-indigo-500 w-[3%]" title="Docs (8 GB)"></div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>Apps</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Images</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Audio</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>Docs</span>
          <span className="text-emerald-400 font-semibold">177.6 GB Free</span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-neutral-800">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              triggerHaptic('smooth');
              setActiveCategory(c.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategory === c.id
                ? 'bg-cyan-500 text-neutral-950 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>{c.label}</span>
            <span className="text-[10px] opacity-70">({c.count})</span>
          </button>
        ))}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => {
              triggerHaptic('tick');
              setSelectedFile(file);
            }}
            className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{file.name}</span>
                <span className="text-[10px] text-neutral-400">{file.size} · {file.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenPortal) onOpenPortal(file.name);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-white/10"
                title="Send to Magic Portal"
              >
                <Share2 size={14} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/10"
                title="Delete file"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
