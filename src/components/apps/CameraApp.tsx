import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  RotateCw, 
  Zap, 
  Sliders, 
  Sparkles, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { playCameraShutter, playTapSound } from '../../utils/sound';

interface CameraAppProps {
  onClose: () => void;
  onPhotoTaken?: (photoUrl: string) => void;
  onOpenGallery?: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({
  onClose,
  onPhotoTaken,
  onOpenGallery,
}) => {
  const [zoom, setZoom] = useState('1x');
  const [mode, setMode] = useState<'PHOTO' | 'PORTRAIT' | 'NIGHT' | 'VIDEO' | 'PRO'>('PHOTO');
  const [flash, setFlash] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Try accessing device webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch {
        // Fallback to simulated live viewfinder
        setCameraActive(false);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    playCameraShutter();
    setFlashTrigger(true);
    setTimeout(() => setFlashTrigger(false), 120);

    // If real video is active, grab frame from canvas
    let photoUrl = '';
    if (cameraActive && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL('image/jpeg');
        }
      } catch {
        // ignore
      }
    }

    if (!photoUrl) {
      // High-quality simulated snapshot
      photoUrl = `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80`;
    }

    setCapturedPhotos((prev) => [photoUrl, ...prev]);
    if (onPhotoTaken) onPhotoTaken(photoUrl);
  };

  const modes: Array<'PHOTO' | 'PORTRAIT' | 'NIGHT' | 'VIDEO' | 'PRO'> = [
    'PRO',
    'NIGHT',
    'PORTRAIT',
    'PHOTO',
    'VIDEO',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white select-none overflow-hidden animate-in fade-in duration-200">
      {/* Screen flash effect */}
      {flashTrigger && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-75"></div>
      )}

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={() => {
            playTapSound(600);
            setFlash(!flash);
          }}
          className={`p-2 rounded-full ${flash ? 'text-amber-400 bg-white/10' : 'text-white/80'}`}
          aria-label="Flash"
        >
          <Zap size={20} />
        </button>

        <div className="text-[11px] font-mono tracking-wider px-3 py-1 rounded-full bg-white/10 text-neutral-200 backdrop-blur-md">
          SUNNY AI RAW 100MP
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close Camera"
        >
          <X size={20} />
        </button>
      </div>

      {/* Viewfinder Center */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-950">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          /* Simulated Scenery Viewfinder with autofocus target */
          <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-neutral-900 flex items-center justify-center">
            {/* Ambient scenery visual */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
            <div className="text-center text-neutral-400 p-6 z-10 flex flex-col items-center gap-2">
              <Camera size={36} className="text-amber-400/80 animate-pulse" />
              <p className="text-xs font-medium text-neutral-300">MagicOS Ultra-Sensing Viewfinder</p>
              <span className="text-[10px] text-neutral-500">Tap shutter to capture high-res frame</span>
            </div>
          </div>
        )}

        {/* Center AF Reticle & Golden Grid lines */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
          <div className="border-r border-b border-white"></div>
          <div className="border-r border-b border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-r border-b border-white"></div>
          <div className="border-r border-b border-white flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-amber-400/80 rounded-lg animate-ping [animation-duration:3s]"></div>
          </div>
          <div className="border-b border-white"></div>
          <div className="border-r border-white"></div>
          <div className="border-r border-white"></div>
          <div></div>
        </div>

        {/* Zoom Selector Bar */}
        <div className="absolute bottom-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          {['0.5x', '1x', '2x', '5x'].map((z) => (
            <button
              type="button"
              key={z}
              onClick={() => {
                playTapSound(650);
                setZoom(z);
              }}
              className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                zoom === z
                  ? 'bg-amber-400 text-black shadow-md scale-110'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Shutter & Mode Bar */}
      <div className="flex flex-col gap-4 pb-8 pt-3 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
        {/* Mode Selector */}
        <div className="flex justify-center items-center gap-6 overflow-x-auto no-scrollbar px-6 text-xs font-semibold">
          {modes.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => {
                playTapSound(600);
                setMode(m);
              }}
              className={`transition-colors uppercase whitespace-nowrap tracking-wider ${
                mode === m ? 'text-amber-400 font-bold scale-110' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Shutter row: Gallery Preview, Big Shutter Button, Switch Camera */}
        <div className="flex items-center justify-around px-8">
          {/* Gallery thumbnail preview */}
          <button
            type="button"
            onClick={() => {
              playTapSound(600);
              if (onOpenGallery) onOpenGallery();
            }}
            className="w-12 h-12 rounded-2xl bg-neutral-800 border-2 border-white/40 overflow-hidden flex items-center justify-center group active:scale-95 transition-transform"
          >
            {capturedPhotos[0] ? (
              <img
                src={capturedPhotos[0]}
                alt="Last photo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <ImageIcon size={20} className="text-neutral-400" />
            )}
          </button>

          {/* Big SUNNY Shutter Button */}
          <button
            type="button"
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-90 transition-transform shadow-2xl"
            aria-label="Capture Photo"
          >
            <div className={`w-full h-full rounded-full transition-colors ${
              mode === 'VIDEO' ? 'bg-rose-500 rounded-2xl' : 'bg-white'
            }`}></div>
          </button>

          {/* Switch Camera */}
          <button
            type="button"
            onClick={() => playTapSound(600)}
            className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-300 hover:text-white active:rotate-180 transition-transform duration-300"
            aria-label="Flip Camera"
          >
            <RotateCw size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
