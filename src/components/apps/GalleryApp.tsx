import React, { useState } from 'react';
import { X, Image as ImageIcon, Heart, Trash2, Share2, Sparkles, Check } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

interface GalleryAppProps {
  onClose: () => void;
  userPhotos: string[];
  onSetWallpaperFromPhoto?: (photoUrl: string) => void;
  onOpenPortal?: (title: string) => void;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({
  onClose,
  userPhotos,
  onSetWallpaperFromPhoto,
  onOpenPortal,
}) => {
  const samplePhotos = [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      title: 'SUNNY Night Photography',
      date: 'Today, 1:20 PM',
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      title: 'Alpine Valley Sunset',
      date: 'Yesterday',
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
      title: 'Starry Cosmic Peak',
      date: 'Oct 1',
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
      title: 'Mist Mountain Ridge',
      date: 'Sep 28',
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
      title: 'Sunlight Canopy Forest',
      date: 'Sep 25',
    },
    {
      id: 'p6',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      title: 'Azure Lagoon Horizon',
      date: 'Sep 22',
    },
  ];

  // Combine user photos taken in camera with sample photos
  const allPhotos = [
    ...userPhotos.map((url, idx) => ({
      id: `user-${idx}`,
      url,
      title: `Camera Snapshot ${idx + 1}`,
      date: 'Just now',
    })),
    ...samplePhotos,
  ];

  const [activePhoto, setActivePhoto] = useState<typeof allPhotos[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSetWallpaper = (url: string) => {
    playTapSound(700);
    if (onSetWallpaperFromPhoto) onSetWallpaperFromPhoto(url);
    setToast('Wallpaper updated successfully!');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight text-white">SUNNY Gallery</h2>
          <span className="text-xs text-neutral-400">({allPhotos.length} photos)</span>
        </div>
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Gallery"
        >
          <X size={18} />
        </button>
      </div>

      {/* Grid of Photos */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        <div className="grid grid-cols-3 gap-2">
          {allPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => {
                playTapSound(600);
                setActivePhoto(photo);
              }}
              className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          {/* Top close & photo title */}
          <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-sm font-semibold text-white">{activePhoto.title}</h3>
              <p className="text-[11px] text-neutral-400">{activePhoto.date}</p>
            </div>
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Large Photo Preview */}
          <div 
            className="flex-1 flex items-center justify-center py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Action Toolbar */}
          <div 
            className="flex items-center justify-around py-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 max-w-sm mx-auto w-full z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handleSetWallpaper(activePhoto.url)}
              className="flex flex-col items-center gap-1 text-[11px] text-neutral-300 hover:text-cyan-400"
            >
              <Sparkles size={18} />
              <span>Set Wallpaper</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenPortal) onOpenPortal(activePhoto.title);
              }}
              className="flex flex-col items-center gap-1 text-[11px] text-neutral-300 hover:text-cyan-400"
            >
              <Share2 size={18} />
              <span>Magic Portal</span>
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-cyan-500 text-neutral-950 text-xs font-bold shadow-xl flex items-center gap-2">
              <Check size={14} />
              <span>{toast}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
