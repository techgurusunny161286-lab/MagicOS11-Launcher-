import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  RotateCw, 
  Zap, 
  ZapOff, 
  Sparkles, 
  Image as ImageIcon,
  ChevronDown,
  Timer as TimerIcon,
  Sliders,
  Maximize2,
  Scan,
  Moon,
  Video,
  Sun,
  Camera as CameraIcon,
  Settings2,
  Check,
  Circle,
  Eye
} from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { playCameraShutter, playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface CameraAppProps {
  onClose: () => void;
  onPhotoTaken?: (photoUrl: string) => void;
  onOpenGallery?: () => void;
}

type PixelCameraMode = 'NIGHT SIGHT' | 'PORTRAIT' | 'PHOTO' | 'VIDEO' | 'CINEMATIC' | 'PRO';

export const CameraApp: React.FC<CameraAppProps> = ({
  onClose,
  onPhotoTaken,
  onOpenGallery,
}) => {
  // Pixel Camera Modes
  const modes: PixelCameraMode[] = ['NIGHT SIGHT', 'PORTRAIT', 'PHOTO', 'VIDEO', 'CINEMATIC', 'PRO'];
  const [currentMode, setCurrentMode] = useState<PixelCameraMode>('PHOTO');

  // Hardware State
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessingHdr, setIsProcessingHdr] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [flashTrigger, setFlashTrigger] = useState(false);

  // Zoom: 0.5x, 1x, 2x, 5x
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Top Settings Dropdown
  const [isTopSettingsOpen, setIsTopSettingsOpen] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'auto' | 'on'>('auto');
  const [timerSeconds, setTimerSeconds] = useState<0 | 3 | 10>(0);
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '16:9' | 'full'>('4:3');
  const [isUltraHdrOn, setIsUltraHdrOn] = useState(true);
  const [isTopShotOn, setIsTopShotOn] = useState(true);

  // Focus & Dual Exposure
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [brightnessExposure, setBrightnessExposure] = useState<number>(0);
  const [shadowExposure, setShadowExposure] = useState<number>(0);

  // Video Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);

  // Pro Mode Controls
  const [proIso, setProIso] = useState('AUTO');
  const [proShutter, setProShutter] = useState('AUTO');
  const [proWb, setProWb] = useState('AUTO');

  // Google Lens Viewfinder Overlay
  const [isLensActive, setIsLensActive] = useState(false);
  const [lensResult, setLensResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // WebRTC Camera stream initialization with facingMode
  const initCamera = useCallback(async () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: currentMode === 'VIDEO'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
        setIsCameraActive(true);
      }
    } catch (e) {
      // Fallback simulated viewfinder
      setIsCameraActive(false);
    }
  }, [facingMode, currentMode]);

  useEffect(() => {
    initCamera();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [initCamera]);

  // Video recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Flip Camera (Front / Back)
  const handleFlipCamera = () => {
    triggerHaptic('doubleTick');
    playTapSound(600);
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Google Pixel Native GCam API invoke via Capacitor
  const handleNativePixelCapture = async () => {
    try {
      triggerHaptic('heavy');
      playTapSound(700);
      const photo = await CapCamera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (photo.dataUrl) {
        setCapturedPhotos(prev => [photo.dataUrl!, ...prev]);
        if (onPhotoTaken) onPhotoTaken(photo.dataUrl);
      }
    } catch {
      // User cancelled or unsupported browser, fallback to canvas frame
      handleShutterClick();
    }
  };

  // Shutter Click handler
  const handleShutterClick = () => {
    if (isCapturing) return;

    if (currentMode === 'VIDEO') {
      triggerHaptic('heavy');
      playTapSound(700);
      if (isRecording) {
        setIsRecording(false);
        setRecordDuration(0);
      } else {
        setIsRecording(true);
        setRecordDuration(0);
      }
      return;
    }

    if (timerSeconds > 0) {
      triggerHaptic('tick');
      playTapSound(800);
      // Simulate timer countdown
      setTimeout(() => executeCapture(), timerSeconds * 1000);
      return;
    }

    executeCapture();
  };

  const executeCapture = () => {
    setIsCapturing(true);
    triggerHaptic('heavy');
    playCameraShutter();

    // Flash trigger animation
    setFlashTrigger(true);
    setTimeout(() => setFlashTrigger(false), 140);

    // Grab live frame from WebRTC video
    let photoUrl = '';
    if (isCameraActive && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // If Night Sight or Portrait, apply subtle software ISP processing
          if (currentMode === 'PORTRAIT') {
            ctx.filter = 'contrast(1.08) saturate(1.1)';
          } else if (currentMode === 'NIGHT SIGHT') {
            ctx.filter = 'brightness(1.2) contrast(1.15)';
          }
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL('image/jpeg', 0.95);
        }
      } catch {}
    }

    if (!photoUrl) {
      // Authentic Pixel high-res sample
      const samplePhotos = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&auto=format&fit=crop&q=80'
      ];
      photoUrl = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    }

    // Google Pixel HDR+ Real Tone Processing Animation
    setIsProcessingHdr(true);
    setTimeout(() => {
      setIsProcessingHdr(false);
      setIsCapturing(false);
      setCapturedPhotos(prev => [photoUrl, ...prev]);
      if (onPhotoTaken) onPhotoTaken(photoUrl);
    }, 850);
  };

  // Viewfinder tap to focus & dual exposure
  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    triggerHaptic('tick');
    playTapSound(600);
    setFocusPoint({ x, y });

    // Auto-hide focus point after 4s
    setTimeout(() => {
      setFocusPoint(null);
    }, 4000);
  };

  // Google Lens Scan simulation
  const handleGoogleLens = () => {
    triggerHaptic('doubleTick');
    playTapSound(700);
    setIsLensActive(true);
    setTimeout(() => {
      setLensResult('Google Lens identified: MagicOS Display Engine · Text Detected: "Welcome to Pixel Camera"');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white select-none overflow-hidden animate-in fade-in duration-200">
      {/* FLASH OVERLAY */}
      {flashTrigger && (
        <div className="absolute inset-0 bg-white z-[90] pointer-events-none animate-out fade-out duration-150" />
      )}

      {/* TOP PIXEL STATUS & QUICK CONTROLS BAR */}
      <div className="relative z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between">
        {/* Back / Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-neutral-900/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Center Pixel Camera Dropdown Pill */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tick');
            setIsTopSettingsOpen(!isTopSettingsOpen);
          }}
          className="px-3.5 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-semibold shadow-lg"
        >
          <span className="text-cyan-400 font-bold">Pixel GCam</span>
          <span className="text-white/60">·</span>
          <span>{flashMode === 'on' ? 'Flash On' : flashMode === 'auto' ? 'Auto' : 'Flash Off'}</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isTopSettingsOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Google Lens Quick Action */}
        <button
          type="button"
          onClick={handleGoogleLens}
          className="w-9 h-9 rounded-full bg-neutral-900/60 backdrop-blur-md flex items-center justify-center text-cyan-400 hover:text-cyan-300"
          title="Google Lens Visual Search"
        >
          <Scan size={18} />
        </button>
      </div>

      {/* TOP SETTINGS EXPANDABLE SHEET */}
      {isTopSettingsOpen && (
        <div className="relative z-40 mx-4 p-4 rounded-3xl bg-neutral-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-400">Flash</span>
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-full">
              {(['off', 'auto', 'on'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlashMode(f)}
                  className={`px-3 py-0.5 rounded-full capitalize text-[11px] font-bold ${flashMode === f ? 'bg-cyan-500 text-neutral-950' : 'text-neutral-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-400">Timer</span>
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-full">
              {([0, 3, 10] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimerSeconds(t)}
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${timerSeconds === t ? 'bg-cyan-500 text-neutral-950' : 'text-neutral-300'}`}
                >
                  {t === 0 ? 'Off' : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-400">Aspect Ratio</span>
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-full">
              {(['4:3', '16:9', 'full'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-0.5 rounded-full uppercase text-[11px] font-bold ${aspectRatio === r ? 'bg-cyan-500 text-neutral-950' : 'text-neutral-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800">
            <span className="font-semibold text-neutral-300">Ultra HDR & Real Tone</span>
            <button
              type="button"
              onClick={() => setIsUltraHdrOn(!isUltraHdrOn)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isUltraHdrOn ? 'bg-cyan-500' : 'bg-neutral-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isUltraHdrOn ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      )}

      {/* VIEWFINDER MAIN AREA */}
      <div 
        onClick={handleViewfinderClick}
        className="flex-1 relative flex items-center justify-center overflow-hidden cursor-crosshair"
      >
        {/* Real Live Hardware Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          }`}
          style={{
            transform: `${facingMode === 'user' ? 'scaleX(-1)' : ''} scale(${zoomLevel})`,
            filter: `brightness(${1 + brightnessExposure * 0.3}) contrast(${1 + shadowExposure * 0.2})`
          }}
        />

        {/* Fallback Viewfinder when camera permission or webcam not active */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 space-y-3 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
              <CameraIcon size={32} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Pixel Viewfinder</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Real-time ISP pipeline active with HDR+ algorithms & Real Tone processing.
              </p>
            </div>
          </div>
        )}

        {/* Focus Reticle (Pixel Signature Yellow Reticle + Dual Exposure) */}
        {focusPoint && (
          <div
            className="absolute pointer-events-none z-30 transition-all duration-150 animate-in zoom-in-75"
            style={{ left: `${focusPoint.x - 30}px`, top: `${focusPoint.y - 30}px` }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-amber-400/90 shadow-lg flex items-center justify-center">
              <Sun size={14} className="text-amber-400" />
            </div>
          </div>
        )}

        {/* Google Lens Live Scan Box */}
        {isLensActive && (
          <div className="absolute inset-8 border-2 border-dashed border-cyan-400/80 rounded-3xl z-30 flex flex-col items-center justify-between p-4 bg-cyan-950/20 backdrop-blur-xs">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 text-cyan-300 text-xs font-bold border border-cyan-500/40">
              <Scan size={14} />
              <span>Google Lens Searching...</span>
            </div>

            {lensResult && (
              <div className="p-3 rounded-2xl bg-neutral-900/95 border border-white/20 text-xs text-white max-w-xs text-center shadow-2xl">
                {lensResult}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLensActive(false);
                    setLensResult(null);
                  }}
                  className="mt-2 block w-full py-1 rounded-xl bg-cyan-500 text-neutral-950 font-bold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Mode Watermark / Real Tone Pill */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider text-cyan-300 uppercase border border-white/10">
            {currentMode}
          </span>
          {isUltraHdrOn && (
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-semibold text-amber-300 border border-white/10">
              HDR+
            </span>
          )}
        </div>

        {/* Video Duration Banner */}
        {isRecording && (
          <div className="absolute top-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-mono font-bold shadow-lg animate-pulse">
            <Circle size={8} className="fill-white" />
            <span>00:{recordDuration.toString().padStart(2, '0')}</span>
          </div>
        )}

        {/* GOOGLE PIXEL FOCAL LENGTH ZOOM BAR (.5, 1x, 2, 5) */}
        <div className="absolute bottom-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1 rounded-full border border-white/15 shadow-xl">
          {[
            { label: '.5', val: 0.8 },
            { label: '1x', val: 1 },
            { label: '2', val: 1.5 },
            { label: '5', val: 2.2 },
          ].map((z) => (
            <button
              key={z.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('tick');
                setZoomLevel(z.val);
              }}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                zoomLevel === z.val
                  ? 'bg-white text-neutral-950 shadow-md scale-105'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* CAMERA MODES HORIZONTAL CAROUSEL */}
      <div className="relative z-30 bg-black/90 py-2 border-t border-neutral-900 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-6 px-6">
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setCurrentMode(m);
              }}
              className={`text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
                currentMode === m
                  ? 'text-amber-400 scale-105 border-b-2 border-amber-400 pb-0.5'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM SHUTTER CONTROLS BAR */}
      <div className="relative z-30 bg-black p-6 pb-8 flex items-center justify-between">
        {/* Gallery Thumbnail Preview */}
        <div className="w-14 h-14 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              if (onOpenGallery) onOpenGallery();
            }}
            className="w-12 h-12 rounded-full border-2 border-white/40 overflow-hidden bg-neutral-900 relative shadow-md active:scale-95 transition-transform"
          >
            {capturedPhotos[0] ? (
              <img src={capturedPhotos[0]} alt="Recent" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <ImageIcon size={18} />
              </div>
            )}

            {/* HDR+ Processing spinner */}
            {isProcessingHdr && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              </div>
            )}
          </button>
        </div>

        {/* Primary Shutter Button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleShutterClick}
            disabled={isCapturing}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-all shadow-2xl ${
              currentMode === 'VIDEO'
                ? 'border-rose-500'
                : 'border-white'
            }`}
          >
            <div
              className={`w-full h-full transition-all duration-150 ${
                currentMode === 'VIDEO'
                  ? isRecording ? 'w-7 h-7 rounded-md bg-rose-600' : 'rounded-full bg-rose-600'
                  : 'rounded-full bg-white active:bg-neutral-300'
              }`}
            />
          </button>
        </div>

        {/* Camera Flip / Pro Mode Shortcut */}
        <div className="w-14 h-14 flex items-center justify-center">
          <button
            type="button"
            onClick={handleFlipCamera}
            className="w-12 h-12 rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center text-white/90 hover:text-white shadow-md active:scale-95 transition-transform"
            title="Switch Camera (Front / Back)"
          >
            <RotateCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
