/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Battery, 
  ChevronRight, 
  Sparkles, 
  Search, 
  Layers, 
  Power, 
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  ChevronLeft,
  Volume2,
  Lock,
  ArrowUp,
  ChevronUp,
  Grid,
  SlidersHorizontal,
  Sliders,
  X,
  Undo2
} from 'lucide-react';
import { AppItem, ActiveApp, MagicCapsuleActivity, WallpaperItem, NoteItem, NotificationItem } from './types/launcher';
import { DEFAULT_APPS, BIG_FOLDER_APPS, DOCK_APPS, WALLPAPERS, INITIAL_NOTIFICATIONS, INITIAL_NOTES } from './data/apps';
import { AppIcon } from './components/AppIcon';
import { MagicCapsule } from './components/MagicCapsule';
import { MagicPortal } from './components/MagicPortal';
import { BigFolder } from './components/BigFolder';
import { ControlCenter } from './components/ControlCenter';
import { NotificationCenter } from './components/NotificationCenter';
import { LockScreen } from './components/LockScreen';
import { RecentApps } from './components/RecentApps';
import { AppDrawer } from './components/AppDrawer';
import { PixelNavigationGestures } from './components/PixelNavigationGestures';
import { AppContextMenu } from './components/AppContextMenu';

// Widgets
import { WeatherWidget } from './components/widgets/WeatherWidget';
import { ClockWidget } from './components/widgets/ClockWidget';
import { YoyoSuggestionsWidget } from './components/widgets/YoyoSuggestionsWidget';
import { HealthWidget } from './components/widgets/HealthWidget';

// Simulated Apps
import { CameraApp } from './components/apps/CameraApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { GalleryApp } from './components/apps/GalleryApp';
import { NotesApp } from './components/apps/NotesApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { PhoneApp } from './components/apps/PhoneApp';
import { HealthApp } from './components/apps/HealthApp';
import { MusicApp } from './components/apps/MusicApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { WeatherApp } from './components/apps/WeatherApp';
import { ClockApp } from './components/apps/ClockApp';
import { SpotifyApp } from './components/apps/SpotifyApp';
import { YouTubeApp } from './components/apps/YouTubeApp';
import { WhatsAppApp } from './components/apps/WhatsAppApp';
import { ChatGPTApp } from './components/apps/ChatGPTApp';
import { NetflixApp } from './components/apps/NetflixApp';
import { FilesApp } from './components/apps/FilesApp';
import { SystemManagerApp } from './components/apps/SystemManagerApp';
import { SunnyAssistantApp } from './components/apps/SunnyAssistantApp';
import { SocialAppView } from './components/apps/SocialAppView';

// Sound & Haptic utilities
import { playTapSound, playLockSound, playUnlockSound } from './utils/sound';
import { initTouchHapticFeedback, triggerHaptic } from './utils/haptics';

export type DeviceMode = 'phone' | 'tablet' | 'phone-frame';

const INITIAL_HOME_APPS: AppItem[] = [
  { id: 'gallery', name: 'Gallery', iconName: 'gallery', category: 'media' },
  { id: 'settings', name: 'Settings', iconName: 'settings', category: 'system' },
  { id: 'notes', name: 'Notes', iconName: 'notes', category: 'tools' },
  { id: 'health', name: 'Health', iconName: 'health', category: 'tools' },
  { id: 'music', name: 'Music', iconName: 'music', category: 'media' },
  { id: 'calculator', name: 'Calculator', iconName: 'calculator', category: 'tools' },
  { id: 'themes', name: 'Themes', iconName: 'themes', category: 'system' },
  { id: 'yoyo', name: 'SUNNY AI', iconName: 'yoyo', category: 'system' },
  { id: 'files', name: 'Files', iconName: 'files', category: 'tools' },
  { id: 'clock', name: 'Clock', iconName: 'clock', category: 'tools' },
  { id: 'manager', name: 'Optimizer', iconName: 'manager', category: 'system' },
  { id: 'browser', name: 'Browser', iconName: 'browser', category: 'system' },
];

export default function App() {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<number>(1); // 0: SUNNY Feed, 1: Home, 2: Media/Tools
  const [activeApp, setActiveApp] = useState<ActiveApp>(null);
  const [recentAppsList, setRecentAppsList] = useState<string[]>(['camera', 'settings', 'music']);
  const [isRecentAppsOpen, setIsRecentAppsOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);

  // Initialize global smooth touch haptic feedback across all interactive touch inputs
  useEffect(() => {
    const cleanup = initTouchHapticFeedback();
    return cleanup;
  }, []);

  // Dynamic Apps Management (Drawer Apps & Home Apps)
  const [drawerApps, setDrawerApps] = useState<AppItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('magicos_drawer_apps_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_APPS;
  });

  const [homeApps, setHomeApps] = useState<AppItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('magicos_home_apps_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_HOME_APPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('magicos_drawer_apps_v2', JSON.stringify(drawerApps));
    } catch {}
  }, [drawerApps]);

  useEffect(() => {
    try {
      localStorage.setItem('magicos_home_apps_v2', JSON.stringify(homeApps));
    } catch {}
  }, [homeApps]);

  // Home Screen Context Menu & Edit Mode
  const [isHomeEditMode, setIsHomeEditMode] = useState(false);
  const [homeContextMenuApp, setHomeContextMenuApp] = useState<AppItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; undoAction?: () => void } | null>(null);

  const showToast = (text: string, undoAction?: () => void) => {
    setToastMessage({ text, undoAction });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const handleAddToHome = (app: AppItem) => {
    triggerHaptic('doubleTick');
    setHomeApps((prev) => {
      if (prev.some((a) => a.id === app.id)) {
        showToast(`${app.name} is already on Home Screen`);
        return prev;
      }
      showToast(`${app.name} added to Home Screen!`);
      return [...prev, app];
    });
    setIsAppDrawerOpen(false);
    setCurrentPage(1);
  };

  const handleRemoveFromHome = (appId: string) => {
    const removedApp = homeApps.find((a) => a.id === appId);
    triggerHaptic('heavy');
    setHomeApps((prev) => prev.filter((a) => a.id !== appId));
    if (removedApp) {
      showToast(`${removedApp.name} removed from Home Screen`, () => {
        setHomeApps((prev) => [...prev, removedApp]);
      });
    }
  };

  const handleUninstallApp = (appId: string) => {
    const removedFromDrawer = drawerApps.find((a) => a.id === appId);
    triggerHaptic('heavy');
    setDrawerApps((prev) => prev.filter((a) => a.id !== appId));
    setHomeApps((prev) => prev.filter((a) => a.id !== appId));
    if (removedFromDrawer) {
      showToast(`${removedFromDrawer.name} uninstalled`, () => {
        setDrawerApps((prev) => [...prev, removedFromDrawer]);
      });
    }
  };

  const handleInstallNewApp = (newApp: AppItem) => {
    triggerHaptic('doubleTick');
    setDrawerApps((prev) => {
      if (prev.some((a) => a.id === newApp.id)) return prev;
      return [...prev, newApp];
    });
    showToast(`${newApp.name} installed successfully!`);
  };

  const handleRestoreDefaults = () => {
    triggerHaptic('doubleTick');
    setDrawerApps(DEFAULT_APPS);
    setHomeApps(INITIAL_HOME_APPS);
    showToast('Default apps restored');
  };

  // Device Form Factor Mode (Smartphone Fullscreen, Tablet Fullscreen, Phone Bezel Frame)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('magicos_device_mode') as DeviceMode | null;
      if (saved && ['phone', 'tablet', 'phone-frame'].includes(saved)) return saved;
      if (window.innerWidth < 640) return 'phone';
      if (window.innerWidth >= 640 && window.innerWidth <= 1024) return 'tablet';
    }
    return 'phone';
  });

  const handleSetDeviceMode = (mode: DeviceMode) => {
    setDeviceMode(mode);
    try {
      localStorage.setItem('magicos_device_mode', mode);
    } catch {}
  };

  const isPhoneFullscreen = deviceMode === 'phone';
  const isTablet = deviceMode === 'tablet';
  const isPhoneFrame = deviceMode === 'phone-frame';

  // Native Browser Fullscreen State
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  const toggleNativeFullscreen = () => {
    playTapSound(600);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsNativeFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsNativeFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsNativeFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Gesture refs
  const containerRef = useRef<HTMLDivElement>(null);
  const dockTopTouchRef = useRef<{ y: number; time: number } | null>(null);
  const gestureStartRef = useRef<{ 
    x: number; 
    y: number; 
    isRightSide: boolean; 
    isFromBottom: boolean; 
    isFromTopHalf: boolean;
    isTopOfDock: boolean;
    startTime: number 
  } | null>(null);

  // Gesture Recognition: Fast deliberate Swipe UP for App Drawer, Fast deliberate Swipe DOWN for Notifications
  const handleGestureStart = (clientX: number, clientY: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const isRight = (clientX - rect.left) > (rect.width * 0.48);
      const relY = clientY - rect.top;
      
      // Identify touches originating from the bottom of the display (bottom 45% or dock/nav area)
      const isFromBottom = relY > (rect.height * 0.52) || clientY > (window.innerHeight * 0.55);

      // Identify touches originating from the top half of the display (top 50% / status bar / clock / weather)
      const isFromTopHalf = relY <= (rect.height * 0.52) || clientY <= (window.innerHeight * 0.52);

      // Check if touch originates specifically from the top of the dock area
      let isTopOfDock = false;
      const dockElem = document.getElementById('main-phone-dock');
      if (dockElem) {
        const dRect = dockElem.getBoundingClientRect();
        isTopOfDock = clientY >= (dRect.top - 65) && clientY <= (dRect.top + 40);
      } else {
        isTopOfDock = relY > (rect.height * 0.65) && relY < (rect.height * 0.90);
      }

      gestureStartRef.current = { 
        x: clientX, 
        y: clientY, 
        isRightSide: isRight, 
        isFromBottom,
        isFromTopHalf,
        isTopOfDock,
        startTime: Date.now() 
      };
    }
  };

  const handleGestureEnd = (clientX: number, clientY: number) => {
    if (!gestureStartRef.current) return;
    const deltaX = clientX - gestureStartRef.current.x;
    const deltaY = clientY - gestureStartRef.current.y;
    const duration = Math.max(1, Date.now() - gestureStartRef.current.startTime);
    const isFromBottom = gestureStartRef.current.isFromBottom;
    const isFromTopHalf = gestureStartRef.current.isFromTopHalf;
    const isTopOfDock = gestureStartRef.current.isTopOfDock;
    gestureStartRef.current = null;

    // Calculate swipe velocity in pixels/ms
    const velocityY = Math.abs(deltaY) / duration;
    const velocityX = Math.abs(deltaX) / duration;

    // FEATURE 1: Swiping UP from the top of the dock -> Open Apps Drawer!
    if (isTopOfDock && deltaY < -18 && Math.abs(deltaY) > Math.abs(deltaX) * 0.6) {
      triggerHaptic('doubleTick');
      playTapSound(600);
      setIsAppDrawerOpen(true);
      return;
    }

    // FEATURE 2: Fast scroll / flick UP from bottom of the display -> Open Apps Drawer!
    if (isFromBottom && deltaY < -28 && (velocityY >= 0.28 || duration <= 360) && Math.abs(deltaY) > Math.abs(deltaX) * 0.8) {
      triggerHaptic('doubleTick');
      playTapSound(600);
      setIsAppDrawerOpen(true);
      return;
    }

    // FEATURE 3: Swiping DOWN from the TOP HALF of the display -> Open Notification Panel!
    if (isFromTopHalf && deltaY > 22 && Math.abs(deltaY) > Math.abs(deltaX) * 0.7) {
      triggerHaptic('doubleTick');
      playTapSound(600);
      setIsNotificationCenterOpen(true);
      return;
    }

    // Filter out slow scrolling on lower home screen area:
    // If the gesture duration is slow (> 380ms) or velocity is low (< 0.45 px/ms),
    // the user is simply scrolling slowly. DO NOT open App Drawer or Notification Panel!
    const isSlowScroll = duration > 380 || velocityY < 0.45;

    // Prioritize vertical gestures only when fast & intentional (quick flick)
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.3) {
      if (isSlowScroll) {
        // Slow finger scroll -> Ignore gesture and let user scroll naturally
        return;
      }

      // Deliberate quick flick UP -> Open App Drawer
      if (deltaY < -55 && velocityY >= 0.45) {
        triggerHaptic('tick');
        playTapSound(600);
        setIsAppDrawerOpen(true);
      } 
      // Deliberate quick flick DOWN -> Open Notification Panel
      else if (deltaY > 65 && velocityY >= 0.45) {
        triggerHaptic('tick');
        playTapSound(600);
        setIsNotificationCenterOpen(true);
      }
    } else if (Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && (Math.abs(deltaX) > 60 || velocityX > 0.4)) {
      // Horizontal swipe between home screen pages
      if (deltaX < -50) {
        setCurrentPage((p) => Math.min(2, p + 1));
      } else if (deltaX > 50) {
        setCurrentPage((p) => Math.max(0, p - 1));
      }
    }
  };

  // Google Pixel Gesture Navigation Handlers
  const handlePixelHome = () => {
    playTapSound(500);
    setActiveApp(null);
    setIsAppDrawerOpen(false);
    setIsRecentAppsOpen(false);
    setIsControlCenterOpen(false);
    setIsNotificationCenterOpen(false);
    setIsHomeEditMode(false);
    setCurrentPage(1);
  };

  const handlePixelBack = () => {
    playTapSound(500);
    if (isHomeEditMode) {
      setIsHomeEditMode(false);
      return;
    }
    if (isControlCenterOpen) {
      setIsControlCenterOpen(false);
      return;
    }
    if (isNotificationCenterOpen) {
      setIsNotificationCenterOpen(false);
      return;
    }
    if (isRecentAppsOpen) {
      setIsRecentAppsOpen(false);
      return;
    }
    if (isAppDrawerOpen) {
      setIsAppDrawerOpen(false);
      return;
    }
    if (activeApp) {
      setActiveApp(null);
      return;
    }
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handlePixelQuickSwitch = (direction: 'next' | 'prev') => {
    if (recentAppsList.length === 0) return;
    const currentIndex = activeApp ? recentAppsList.indexOf(activeApp) : -1;
    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % recentAppsList.length;
    } else {
      nextIndex = currentIndex === -1 ? recentAppsList.length - 1 : (currentIndex - 1 + recentAppsList.length) % recentAppsList.length;
    }
    const target = recentAppsList[nextIndex];
    if (target) {
      handleOpenApp(target);
    }
  };

  // System States
  const [isLocked, setIsLocked] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  // MagicOS 11 Flagship Innovations
  const [isMagicCapsuleEnabled, setIsMagicCapsuleEnabled] = useState(true);
  const [capsuleActivity, setCapsuleActivity] = useState<MagicCapsuleActivity>('music');
  const [isMagicPortalOpen, setIsMagicPortalOpen] = useState(false);
  const [draggedContent, setDraggedContent] = useState<string | null>(null);

  // Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Symphony in Blue',
    artist: 'SUNNY Sound Lab',
  });

  // Data
  const [wallpaper, setWallpaper] = useState<WallpaperItem>(WALLPAPERS[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [browserInitialQuery, setBrowserInitialQuery] = useState('');

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const tabletDateString = `${dayNames[currentTime.getDay()]}, ${monthNames[currentTime.getMonth()]} ${currentTime.getDate()}`;

  // Launch App handler
  const handleOpenApp = (appId: string) => {
    playTapSound(600);
    setActiveApp(appId as ActiveApp);
    setRecentAppsList(prev => [appId, ...prev.filter(a => a !== appId)]);
  };

  const handleCloseApp = () => {
    playTapSound(500);
    setActiveApp(null);
  };

  const handleToggleMusic = () => {
    setIsPlayingMusic(prev => !prev);
    setCapsuleActivity('music');
  };

  const handleToggleLock = () => {
    if (isLocked) {
      playUnlockSound();
      setIsLocked(false);
    } else {
      playLockSound();
      setIsLocked(true);
      setActiveApp(null);
      setIsControlCenterOpen(false);
      setIsNotificationCenterOpen(false);
      setIsRecentAppsOpen(false);
      setIsHomeEditMode(false);
    }
  };

  // Magic Portal Drop action
  const handlePortalDrop = (targetApp: string, content: string) => {
    if (targetApp === 'notes') {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: 'Magic Portal Clipping',
        content,
        date: 'Just now',
        color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-100',
      };
      setNotes(prev => [newNote, ...prev]);
      setActiveApp('notes');
    } else if (targetApp === 'yoyo' || targetApp === 'browser') {
      setBrowserInitialQuery(content);
      setActiveApp('browser');
    } else if (targetApp === 'messages') {
      setActiveApp('phone');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 flex items-center justify-center font-sans antialiased select-none">
      {/* Torch Light Overlay on entire screen when flashlight is on */}
      {isFlashlightOn && (
        <div className="fixed inset-0 bg-amber-100/15 pointer-events-none z-[60] backdrop-brightness-125 transition-all"></div>
      )}

      {/* Screen Brightness Filter Simulator */}
      <div 
        className="fixed inset-0 pointer-events-none z-[59] transition-opacity"
        style={{
          backgroundColor: '#000',
          opacity: Math.max(0, (100 - brightness) * 0.007),
        }}
      ></div>

      {/* Outer Device Frame / Fullscreen Surface */}
      <div 
        ref={containerRef}
        className={`relative transition-all duration-300 overflow-hidden flex flex-col ${
          isPhoneFrame
            ? 'w-full max-w-[420px] h-[92vh] max-h-[880px] rounded-[52px] border-[10px] border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_2px_rgba(255,255,255,0.1)] ring-1 ring-neutral-700'
            : 'w-full h-full min-h-screen rounded-none border-none shadow-none'
        } ${wallpaper.bgClass}`}
      >
        {/* Hardware Top Speaker Grill (Only in Bezel Frame mode) */}
        {isPhoneFrame && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-neutral-700/80 z-50 pointer-events-none"></div>
        )}

        {/* 1. MAGICOS STATUS BAR */}
        <div 
          onTouchStart={(e) => handleGestureStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={(e) => handleGestureEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
          onMouseDown={(e) => handleGestureStart(e.clientX, e.clientY)}
          onMouseUp={(e) => handleGestureEnd(e.clientX, e.clientY)}
          className={`relative z-40 flex items-center justify-between text-white select-none ${
          isTablet ? 'px-8 pt-3 pb-2 text-sm' : 'px-6 pt-3 pb-1 text-xs'
        }`}>
          {/* Left Slot: Time, Date & Notification Shade Trigger */}
          <button
            type="button"
            onClick={() => {
              playTapSound(600);
              setIsNotificationCenterOpen(prev => !prev);
            }}
            className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity"
            title="Swipe down or tap for Notifications"
          >
            {isTablet ? (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">{timeString}</span>
                <span className="text-xs text-neutral-300 font-normal font-sans">· {tabletDateString}</span>
              </div>
            ) : (
              <span>{timeString}</span>
            )}
            {notifications.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            )}
          </button>

          {/* Center Slot: Dynamic Island MAGIC CAPSULE */}
          {isMagicCapsuleEnabled ? (
            <div className={`px-2 flex justify-center ${isTablet ? 'max-w-md w-full' : 'flex-1'}`}>
              <MagicCapsule
                activity={capsuleActivity}
                isPlayingMusic={isPlayingMusic}
                onToggleMusic={handleToggleMusic}
                currentTrack={currentTrack}
                onOpenApp={(app) => handleOpenApp(app)}
                onActivityChange={(act) => setCapsuleActivity(act)}
              />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-black border border-neutral-800 mx-auto"></div>
          )}

          {/* Right Slot: Signal, Mode Switcher, Battery -> Tapping toggles Control Center */}
          <div className="flex items-center gap-2.5">
            {/* Quick Device Form-Factor Switcher Chip */}
            <div className="flex items-center bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-full px-1.5 py-0.5 border border-white/15 gap-1">
              <button
                type="button"
                onClick={() => handleSetDeviceMode('phone')}
                className={`p-1 rounded-full transition-colors ${deviceMode === 'phone' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'}`}
                title="Smartphone Full Screen Mode"
              >
                <Smartphone size={isTablet ? 14 : 12} />
              </button>
              <button
                type="button"
                onClick={() => handleSetDeviceMode('tablet')}
                className={`p-1 rounded-full transition-colors ${deviceMode === 'tablet' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'}`}
                title="Tablet / Pad Full Screen Mode"
              >
                <Tablet size={isTablet ? 14 : 12} />
              </button>
              <button
                type="button"
                onClick={() => handleSetDeviceMode('phone-frame')}
                className={`p-1 rounded-full transition-colors ${deviceMode === 'phone-frame' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white'}`}
                title="Bezel Frame Simulator"
              >
                <Monitor size={isTablet ? 14 : 12} />
              </button>
              <button
                type="button"
                onClick={toggleNativeFullscreen}
                className="p-1 rounded-full text-cyan-300 hover:text-white transition-colors"
                title="Native Fullscreen (F11)"
              >
                {isNativeFullscreen ? <Minimize2 size={isTablet ? 14 : 12} /> : <Maximize2 size={isTablet ? 14 : 12} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setIsControlCenterOpen(prev => !prev);
              }}
              className="flex items-center gap-1.5 font-mono text-[11px] hover:opacity-80 transition-opacity"
              title="Swipe down or click to toggle Control Center"
            >
              <span className="text-[10px] font-sans font-bold tracking-tight text-white/90">5G</span>
              <Wifi size={13} className="text-white/90" />
              <div className="flex items-center gap-0.5">
                <span>89%</span>
                <Battery size={14} className="fill-white" />
              </div>
            </button>
          </div>
        </div>

        {/* 2. MAIN HOMESCREEN VIEWPORT */}
        <div 
          className={`relative flex-1 overflow-hidden flex flex-col justify-between pt-1 z-10 ${
            isTablet 
              ? 'max-w-6xl mx-auto w-full px-6 pb-2' 
              : 'max-w-md mx-auto w-full p-4 pb-2'
          }`}
          onTouchStart={(e) => handleGestureStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={(e) => handleGestureEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
          onMouseDown={(e) => handleGestureStart(e.clientX, e.clientY)}
          onMouseUp={(e) => handleGestureEnd(e.clientX, e.clientY)}
        >
          {/* Top Page Indicators & Edit Mode Notice */}
          <div className="flex flex-col items-center gap-1 py-0.5">
            {isHomeEditMode ? (
              <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <Sliders size={13} />
                  <span className="font-semibold">Edit Mode: Tap ✕ to remove</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('click');
                    setIsHomeEditMode(false);
                  }}
                  className="px-3 py-0.5 rounded-full bg-cyan-500 text-neutral-950 font-bold text-[11px] hover:bg-cyan-400 active:scale-95 transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-1.5 py-1">
                {[0, 1, 2].map((idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      playTapSound(450);
                      setCurrentPage(idx);
                    }}
                    className={`transition-all duration-200 rounded-full ${
                      currentPage === idx
                        ? 'w-4 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Page Contents */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start">
            {/* SCREEN 0: SUNNY SMART ASSISTANT & FEED */}
            {currentPage === 0 && (
              <div className={`flex flex-col gap-3.5 py-2 animate-in fade-in duration-200 ${isTablet ? 'max-w-3xl mx-auto w-full' : ''}`}>
                {/* Greeting banner */}
                <div className="p-4 rounded-[28px] bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 text-white flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[11px] text-cyan-300 font-semibold tracking-wide uppercase">
                      SUNNY Assistant
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, Sunny
                    </h2>
                    <p className="text-xs text-white/70">
                      MagicOS 11 running at peak intelligence.
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-md">
                    <Sparkles size={22} className="text-white" />
                  </div>
                </div>

                {/* SUNNY Suggestions Widget */}
                <YoyoSuggestionsWidget
                  onOpenApp={(app) => handleOpenApp(app)}
                  onOpenSunnyAssistant={() => handleOpenApp('browser')}
                />

                {/* Quick Schedule card */}
                <div className="p-4 rounded-[28px] bg-white/10 dark:bg-black/35 backdrop-blur-xl border border-white/15 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Smart Commute</h4>
                    <span className="text-[10px] text-emerald-400 font-mono">Fast Route</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Office · 22 mins via Metro Line 2</p>
                  <p className="text-xs text-white/70">No transit delays reported. Next train arrives in 4 mins.</p>
                </div>
              </div>
            )}

            {/* SCREEN 1: MAIN DESKTOP (CLOCK, WIDGETS, BIG FOLDER, APPS) */}
            {currentPage === 1 && (
              <div className="flex flex-col gap-3.5 py-1 animate-in fade-in duration-200">
                {isTablet ? (
                  /* TABLET LAYOUT: WIDE WIDGET ROW & DYNAMIC APP GRID */
                  <div className="space-y-4">
                    {/* Top Widgets 4-Column Grid on Tablet */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                      <div className="h-36">
                        <ClockWidget onOpenClock={() => handleOpenApp('clock')} />
                      </div>
                      <div className="h-36">
                        <WeatherWidget onOpenWeather={() => handleOpenApp('weather')} />
                      </div>
                      <div className="h-36">
                        <HealthWidget onOpenHealth={() => handleOpenApp('health')} />
                      </div>
                      <div className="h-36 hidden lg:block">
                        <YoyoSuggestionsWidget 
                          onOpenApp={(app) => handleOpenApp(app)}
                          onOpenSunnyAssistant={() => handleOpenApp('browser')}
                        />
                      </div>
                    </div>

                    {/* Middle Section: Big Folder + Tablet Dynamic App Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
                      {/* Big Folder */}
                      <div className="md:col-span-4 h-48">
                        <BigFolder
                          title="Tools & System"
                          apps={BIG_FOLDER_APPS}
                          onOpenApp={(appId) => handleOpenApp(appId)}
                          onDragStartPortal={(content) => {
                            setDraggedContent(content);
                            setIsMagicPortalOpen(true);
                          }}
                        />
                      </div>

                      {/* Tablet Apps Grid (Dynamic homeApps) */}
                      <div className="md:col-span-8 p-3 rounded-[32px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 grid grid-cols-4 sm:grid-cols-6 gap-3 items-center justify-items-center min-h-48">
                        {homeApps.length === 0 ? (
                          <div className="col-span-full py-8 text-center text-xs text-neutral-400">
                            No apps on Home Screen. Swipe up to App Drawer and hold any app to add it!
                          </div>
                        ) : (
                          homeApps.map((app) => (
                            <AppIcon
                              key={`tablet-home-${app.id}`}
                              iconName={app.iconName}
                              label={app.name}
                              isEditMode={isHomeEditMode}
                              onRemove={() => handleRemoveFromHome(app.id)}
                              onOpen={() => handleOpenApp(app.id)}
                              onHold={() => setHomeContextMenuApp(app)}
                              onDragStartPortal={(c) => {
                                setDraggedContent(c);
                                setIsMagicPortalOpen(true);
                              }}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SMARTPHONE & BEZEL FRAME LAYOUT */
                  <>
                    {/* Top Widgets 2-column: Clock & Weather */}
                    <div className="grid grid-cols-2 gap-3 h-36">
                      <ClockWidget onOpenClock={() => handleOpenApp('clock')} />
                      <WeatherWidget onOpenWeather={() => handleOpenApp('weather')} />
                    </div>

                    {/* Big 2x2 Interactive Folder + Dynamic 4 Apps Grid */}
                    <div className="grid grid-cols-2 gap-3 items-stretch">
                      {/* Big Folder */}
                      <div className="h-44">
                        <BigFolder
                          title="Tools & System"
                          apps={BIG_FOLDER_APPS}
                          onOpenApp={(appId) => handleOpenApp(appId)}
                          onDragStartPortal={(content) => {
                            setDraggedContent(content);
                            setIsMagicPortalOpen(true);
                          }}
                        />
                      </div>

                      {/* 2x2 App Grid next to folder (first 4 homeApps) */}
                      <div className="grid grid-cols-2 gap-2 h-44 items-center justify-items-center p-2 rounded-[28px] bg-white/5 backdrop-blur-md border border-white/10">
                        {homeApps.slice(0, 4).map((app) => (
                          <AppIcon 
                            key={`home-2x2-${app.id}`}
                            iconName={app.iconName} 
                            label={app.name} 
                            isEditMode={isHomeEditMode}
                            onRemove={() => handleRemoveFromHome(app.id)}
                            onOpen={() => handleOpenApp(app.id)} 
                            onHold={() => setHomeContextMenuApp(app)}
                            onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Row(s) of remaining Home Apps */}
                    {homeApps.length > 4 && (
                      <div className="grid grid-cols-4 gap-2 justify-items-center pt-1">
                        {homeApps.slice(4).map((app) => (
                          <AppIcon 
                            key={`home-row-${app.id}`}
                            iconName={app.iconName} 
                            label={app.name} 
                            isEditMode={isHomeEditMode}
                            onRemove={() => handleRemoveFromHome(app.id)}
                            onOpen={() => handleOpenApp(app.id)} 
                            onHold={() => setHomeContextMenuApp(app)}
                            onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* SCREEN 2: MEDIA & PRODUCTIVITY SPACE */}
            {currentPage === 2 && (
              <div className={`flex flex-col gap-3 py-1 animate-in fade-in duration-200 ${isTablet ? 'max-w-4xl mx-auto w-full' : ''}`}>
                {/* Health concentric rings widget */}
                <div className="h-36">
                  <HealthWidget onOpenHealth={() => handleOpenApp('health')} />
                </div>

                {/* SUNNY Suggestions Widget */}
                <YoyoSuggestionsWidget
                  onOpenApp={(app) => handleOpenApp(app)}
                  onOpenSunnyAssistant={() => handleOpenApp('browser')}
                />

                {/* Apps Grid */}
                <div className="grid grid-cols-4 gap-3 justify-items-center py-2">
                  <AppIcon iconName="files" label="Files" onOpen={() => handleOpenApp('gallery')} />
                  <AppIcon iconName="clock" label="Clock" onOpen={() => handleOpenApp('clock')} />
                  <AppIcon iconName="manager" label="Optimizer" onOpen={() => handleOpenApp('settings')} />
                  <AppIcon iconName="browser" label="Browser" onOpen={() => handleOpenApp('browser')} />
                </div>
              </div>
            )}
          </div>

          {/* Top of Dock Swipe Handle / Indicator Zone */}
          <div 
            onTouchStart={(e) => {
              dockTopTouchRef.current = { y: e.touches[0].clientY, time: Date.now() };
            }}
            onTouchEnd={(e) => {
              if (dockTopTouchRef.current) {
                const dy = e.changedTouches[0].clientY - dockTopTouchRef.current.y;
                dockTopTouchRef.current = null;
                if (dy < -15) {
                  triggerHaptic('doubleTick');
                  playTapSound(600);
                  setIsAppDrawerOpen(true);
                }
              }
            }}
            onMouseDown={(e) => {
              dockTopTouchRef.current = { y: e.clientY, time: Date.now() };
            }}
            onMouseUp={(e) => {
              if (dockTopTouchRef.current) {
                const dy = e.clientY - dockTopTouchRef.current.y;
                dockTopTouchRef.current = null;
                if (dy < -15) {
                  triggerHaptic('doubleTick');
                  playTapSound(600);
                  setIsAppDrawerOpen(true);
                }
              }
            }}
            onClick={() => {
              triggerHaptic('doubleTick');
              playTapSound(600);
              setIsAppDrawerOpen(true);
            }}
            className="flex flex-col items-center justify-center -mb-0.5 cursor-pointer group select-none py-1 px-4 active:scale-95 transition-all"
            title="Swipe up from top of dock to open Apps Drawer"
          >
            {/* Elegant tactile drag bar handle */}
            <div className="w-12 h-1 bg-white/40 group-hover:bg-cyan-400 group-hover:w-16 rounded-full transition-all mb-1 shadow-sm" />
            <div className="flex items-center gap-1 text-[9px] font-semibold text-white/75 group-hover:text-white transition-colors">
              <ChevronUp size={13} className="text-cyan-400 group-hover:-translate-y-0.5 transition-all animate-bounce" />
              <span>Swipe up for all apps</span>
            </div>
          </div>

          {/* 3. DOCK BAR (TABLET TASKBAR OR PHONE DOCK) */}
          {isTablet ? (
            /* TABLET FLOATING TASKBAR DOCK */
            <div 
              id="main-phone-dock"
              className="mt-1 mx-auto px-4 py-2 rounded-[32px] bg-white/20 dark:bg-black/50 backdrop-blur-2xl border border-white/25 dark:border-white/10 shadow-2xl flex items-center gap-3"
            >
              {/* App Drawer Trigger Icon */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(600);
                  setIsAppDrawerOpen(true);
                }}
                className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/30 transition-all active:scale-95"
                title="Open All Apps Drawer"
              >
                <Grid size={20} />
              </button>

              <div className="w-[1px] h-8 bg-white/20"></div>

              {/* Main Dock Apps */}
              <div className="flex items-center gap-2">
                <AppIcon iconName="phone" label="Phone" showBadge={1} onOpen={() => handleOpenApp('phone')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
                <AppIcon iconName="messages" label="Messages" showBadge={3} onOpen={() => handleOpenApp('messages')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
                <AppIcon iconName="browser" label="Browser" onOpen={() => handleOpenApp('browser')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
                <AppIcon iconName="camera" label="Camera" onOpen={() => handleOpenApp('camera')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
                <AppIcon iconName="gallery" label="Gallery" onOpen={() => handleOpenApp('gallery')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
                <AppIcon iconName="notes" label="Notes" onOpen={() => handleOpenApp('notes')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
                <AppIcon iconName="settings" label="Settings" onOpen={() => handleOpenApp('settings')} onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }} />
              </div>

              {/* Divider for Recent Running Apps */}
              {recentAppsList.length > 0 && (
                <>
                  <div className="w-[1px] h-8 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    {recentAppsList.slice(0, 2).map((appId) => (
                      <AppIcon
                        key={`dock-recent-${appId}`}
                        iconName={appId}
                        label={appId}
                        size="sm"
                        onOpen={() => handleOpenApp(appId)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* PHONE DOCK (4 MAIN APPS) */
            <div 
              id="main-phone-dock"
              className="mt-1 p-2 pt-1.5 rounded-[32px] bg-white/20 dark:bg-black/40 backdrop-blur-2xl border border-white/25 dark:border-white/10 shadow-2xl relative"
            >
              {/* Top of Dock Swipe Handle Strip */}
              <div
                onTouchStart={(e) => {
                  dockTopTouchRef.current = { y: e.touches[0].clientY, time: Date.now() };
                }}
                onTouchEnd={(e) => {
                  if (dockTopTouchRef.current) {
                    const dy = e.changedTouches[0].clientY - dockTopTouchRef.current.y;
                    dockTopTouchRef.current = null;
                    if (dy < -15) {
                      triggerHaptic('doubleTick');
                      playTapSound(600);
                      setIsAppDrawerOpen(true);
                    }
                  }
                }}
                onMouseDown={(e) => {
                  dockTopTouchRef.current = { y: e.clientY, time: Date.now() };
                }}
                onMouseUp={(e) => {
                  if (dockTopTouchRef.current) {
                    const dy = e.clientY - dockTopTouchRef.current.y;
                    dockTopTouchRef.current = null;
                    if (dy < -15) {
                      triggerHaptic('doubleTick');
                      playTapSound(600);
                      setIsAppDrawerOpen(true);
                    }
                  }
                }}
                onClick={() => {
                  triggerHaptic('doubleTick');
                  playTapSound(600);
                  setIsAppDrawerOpen(true);
                }}
                className="w-10 h-1 bg-white/35 hover:bg-cyan-400 rounded-full mx-auto mb-1.5 cursor-pointer transition-all active:scale-110"
                title="Swipe up from top of dock to open Apps Drawer"
              />

              <div className="flex items-center justify-around">
                <AppIcon
                  iconName="phone"
                  label="Phone"
                  showBadge={1}
                  onOpen={() => handleOpenApp('phone')}
                  onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }}
                />
                <AppIcon
                  iconName="messages"
                  label="Messages"
                  showBadge={3}
                  onOpen={() => handleOpenApp('messages')}
                  onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }}
                />
                <AppIcon
                  iconName="browser"
                  label="Browser"
                  onOpen={() => handleOpenApp('browser')}
                  onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }}
                />
                <AppIcon
                  iconName="camera"
                  label="Camera"
                  onOpen={() => handleOpenApp('camera')}
                  onDragStartPortal={(c) => { setDraggedContent(c); setIsMagicPortalOpen(true); }}
                />
              </div>
            </div>
          )}

          {/* Bottom spacing for Google Pixel gesture navigation bar */}
          <div className="pb-3"></div>
        </div>

        {/* MAGIC PORTAL EDGE ACTIVATION HANDLE (SUNNY Signature Arc on right bezel) */}
        <button
          type="button"
          onClick={() => {
            playTapSound(600);
            setDraggedContent('SUNNY MagicOS 11 Selection');
            setIsMagicPortalOpen(true);
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-3.5 h-16 bg-gradient-to-l from-cyan-400 to-blue-500 rounded-l-full shadow-lg opacity-70 hover:opacity-100 hover:w-5 transition-all flex items-center justify-center text-white"
          title="Magic Portal Edge Swipe"
        >
          <div className="w-1 h-6 bg-white/80 rounded-full"></div>
        </button>

        {/* HARDWARE BUTTONS SIMULATION (Power & Volume on Frame) */}
        {isPhoneFrame && (
          <>
            {/* Power Button on Right */}
            <button
              type="button"
              onClick={handleToggleLock}
              className="absolute -right-3 top-28 w-2 h-12 rounded-r-md bg-neutral-700 hover:bg-neutral-600 active:bg-cyan-500 transition-colors cursor-pointer z-50 shadow"
              title="Power / Lock Phone"
              aria-label="Power Button"
            />
            {/* Volume Up on Right */}
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setVolume(v => Math.min(100, v + 10));
              }}
              className="absolute -right-3 top-44 w-2 h-10 rounded-r-md bg-neutral-700 hover:bg-neutral-600 active:bg-cyan-500 transition-colors cursor-pointer z-50 shadow"
              title="Volume Up"
              aria-label="Volume Up"
            />
            {/* Volume Down on Right */}
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setVolume(v => Math.max(0, v - 10));
              }}
              className="absolute -right-3 top-56 w-2 h-10 rounded-r-md bg-neutral-700 hover:bg-neutral-600 active:bg-cyan-500 transition-colors cursor-pointer z-50 shadow"
              title="Volume Down"
              aria-label="Volume Down"
            />
          </>
        )}
      </div>

      {/* QUICK FLOATING TOOLBAR ON DESKTOP VIEW (FOR TESTING PHONE & TABLET MODES) */}
      <div className="hidden lg:flex fixed bottom-3 left-1/2 -translate-x-1/2 z-50 items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 shadow-2xl backdrop-blur-xl text-xs text-neutral-300">
        <span className="font-semibold text-cyan-400">Layout:</span>
        <button
          type="button"
          onClick={() => handleSetDeviceMode('phone')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition-all ${
            deviceMode === 'phone' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
          title="Smartphone Full Screen"
        >
          <Smartphone size={13} />
          <span>Phone</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetDeviceMode('tablet')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition-all ${
            deviceMode === 'tablet' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
          title="Tablet Full Screen"
        >
          <Tablet size={13} />
          <span>Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetDeviceMode('phone-frame')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition-all ${
            deviceMode === 'phone-frame' ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
          title="Phone Bezel Frame"
        >
          <Monitor size={13} />
          <span>Bezel</span>
        </button>

        <div className="w-[1px] h-4 bg-neutral-700 mx-1"></div>

        <button
          type="button"
          onClick={toggleNativeFullscreen}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-semibold"
          title="Toggle Native Browser Fullscreen (F11)"
        >
          {isNativeFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span>{isNativeFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleLock}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          <Lock size={12} />
          <span>{isLocked ? 'Unlock' : 'Lock'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsControlCenterOpen(prev => !prev)}
          className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          Control Center
        </button>
      </div>

      {/* OVERLAYS & MODALS */}

      {/* MagicOS App Drawer */}
      <AppDrawer
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        apps={drawerApps}
        onOpenApp={(appId) => handleOpenApp(appId)}
        onDragStartPortal={(content) => {
          setDraggedContent(content);
          setIsMagicPortalOpen(true);
        }}
        onAddToHome={handleAddToHome}
        onRemoveFromDrawer={handleUninstallApp}
        onInstallApp={handleInstallNewApp}
        onRestoreDefaults={handleRestoreDefaults}
        homeAppIds={homeApps.map((a) => a.id)}
      />

      {/* Home Screen Context Menu (< 1s hold) */}
      <AppContextMenu
        isOpen={Boolean(homeContextMenuApp)}
        app={homeContextMenuApp}
        location="home"
        isOnHomeScreen={true}
        onClose={() => setHomeContextMenuApp(null)}
        onRemoveFromHomeScreen={(appId) => handleRemoveFromHome(appId)}
        onUninstallApp={(appId) => handleUninstallApp(appId)}
        onOpenApp={(appId) => {
          handleOpenApp(appId);
        }}
        onEnterEditMode={() => setIsHomeEditMode(true)}
      />

      {/* Toast Notification for App Add/Remove Actions */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-neutral-900/95 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom duration-200">
          <span className="font-medium">{toastMessage.text}</span>
          {toastMessage.undoAction && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('click');
                toastMessage.undoAction?.();
                setToastMessage(null);
              }}
              className="flex items-center gap-1 text-cyan-400 font-bold hover:underline"
            >
              <Undo2 size={12} />
              <span>Undo</span>
            </button>
          )}
        </div>
      )}

      {/* Magic Portal Target Wheel Overlay */}
      <MagicPortal
        isOpen={isMagicPortalOpen}
        draggedContent={draggedContent}
        onClose={() => {
          setIsMagicPortalOpen(false);
          setDraggedContent(null);
        }}
        onDropAction={handlePortalDrop}
      />

      {/* Recent Apps Task Switcher (Carousel / Multitasking) */}
      <RecentApps
        isOpen={isRecentAppsOpen}
        onClose={() => setIsRecentAppsOpen(false)}
        openApps={recentAppsList}
        onSelectApp={(appId) => {
          handleOpenApp(appId);
          setIsRecentAppsOpen(false);
        }}
        onCloseApp={(appId) => {
          setRecentAppsList(prev => prev.filter(a => a !== appId));
          if (activeApp === appId) setActiveApp(null);
        }}
        onClearAll={() => {
          setRecentAppsList([]);
          setActiveApp(null);
          setIsRecentAppsOpen(false);
        }}
      />

      {/* Notification Center Shade (Pull down from left/center) */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onDismiss={(id: string) => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }}
        onClearAll={() => setNotifications([])}
        onOpenSettings={() => {
          setIsNotificationCenterOpen(false);
          handleOpenApp('settings');
        }}
        isFlashlightOn={isFlashlightOn}
        onToggleFlashlight={() => setIsFlashlightOn(!isFlashlightOn)}
        brightness={brightness}
      />

      {/* Control Center Panel (Pull down from top-right) */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        brightness={brightness}
        onBrightnessChange={setBrightness}
        volume={volume}
        onVolumeChange={setVolume}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        currentTrack={currentTrack}
        isFlashlightOn={isFlashlightOn}
        onToggleFlashlight={() => setIsFlashlightOn(!isFlashlightOn)}
      />

      {/* GOOGLE PIXEL GESTURE NAVIGATION (Home, Back, Recents, App Switch for apps & drawer) */}
      {!isLocked && (
        <PixelNavigationGestures
          onHome={handlePixelHome}
          onBack={handlePixelBack}
          onRecentApps={() => {
            playTapSound(480);
            setIsRecentAppsOpen(true);
          }}
          onQuickSwitch={handlePixelQuickSwitch}
          onOpenAppDrawer={() => {
            triggerHaptic('doubleTick');
            playTapSound(600);
            setIsAppDrawerOpen(true);
          }}
          isActiveAppOpen={activeApp !== null}
          isAppDrawerOpen={isAppDrawerOpen}
        />
      )}

      {/* ACTIVE RUNNING APPS */}
      {activeApp === 'camera' && (
        <CameraApp
          onClose={handleCloseApp}
          onPhotoTaken={(photo) => setCapturedPhotos(prev => [photo, ...prev])}
          onOpenGallery={() => setActiveApp('gallery')}
        />
      )}

      {activeApp === 'settings' && (
        <SettingsApp
          onClose={handleCloseApp}
          currentWallpaper={wallpaper}
          onSelectWallpaper={setWallpaper}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isMagicCapsuleEnabled={isMagicCapsuleEnabled}
          onToggleMagicCapsule={() => setIsMagicCapsuleEnabled(!isMagicCapsuleEnabled)}
          isMagicPortalEnabled={true}
          onToggleMagicPortal={() => {}}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => handleSetDeviceMode(isPhoneFrame ? 'phone' : 'phone-frame')}
          deviceMode={deviceMode}
          onChangeDeviceMode={handleSetDeviceMode}
          brightness={brightness}
          onBrightnessChange={setBrightness}
          volume={volume}
          onVolumeChange={setVolume}
        />
      )}

      {activeApp === 'gallery' && (
        <GalleryApp
          onClose={handleCloseApp}
          userPhotos={capturedPhotos}
          onSetWallpaperFromPhoto={(url) => {
            setWallpaper({
              id: 'custom-photo',
              name: 'Custom Photo Wallpaper',
              bgClass: `bg-cover bg-center`,
              accentColor: '#38bdf8',
              previewUrl: url,
            });
          }}
          onOpenPortal={(title) => {
            setDraggedContent(title);
            setIsMagicPortalOpen(true);
          }}
        />
      )}

      {activeApp === 'notes' && (
        <NotesApp
          onClose={handleCloseApp}
          notes={notes}
          onAddNote={(n) => setNotes(prev => [n, ...prev])}
          onDeleteNote={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
        />
      )}

      {activeApp === 'calculator' && (
        <CalculatorApp onClose={handleCloseApp} />
      )}

      {(activeApp === 'phone' || activeApp === 'messages') && (
        <PhoneApp onClose={handleCloseApp} />
      )}

      {activeApp === 'health' && (
        <HealthApp onClose={handleCloseApp} />
      )}

      {activeApp === 'music' && (
        <MusicApp
          onClose={handleCloseApp}
          isPlaying={isPlayingMusic}
          onTogglePlay={handleToggleMusic}
          currentTrack={currentTrack}
          onSelectTrack={(t) => {
            setCurrentTrack(t);
            setIsPlayingMusic(true);
            setCapsuleActivity('music');
          }}
        />
      )}

      {activeApp === 'browser' && (
        <BrowserApp
          onClose={handleCloseApp}
          initialQuery={browserInitialQuery}
          onOpenPortal={(q) => {
            setDraggedContent(q);
            setIsMagicPortalOpen(true);
          }}
        />
      )}

      {activeApp === 'weather' && (
        <WeatherApp onClose={handleCloseApp} />
      )}

      {activeApp === 'clock' && (
        <ClockApp onClose={handleCloseApp} />
      )}

      {activeApp === 'spotify' && (
        <SpotifyApp onClose={handleCloseApp} />
      )}

      {activeApp === 'youtube' && (
        <YouTubeApp onClose={handleCloseApp} />
      )}

      {activeApp === 'whatsapp' && (
        <WhatsAppApp onClose={handleCloseApp} />
      )}

      {activeApp === 'chatgpt' && (
        <ChatGPTApp onClose={handleCloseApp} />
      )}

      {activeApp === 'netflix' && (
        <NetflixApp onClose={handleCloseApp} />
      )}

      {(activeApp === 'files' || activeApp === 'files_pro') && (
        <FilesApp
          onClose={handleCloseApp}
          onOpenPortal={(title) => {
            setDraggedContent(title);
            setIsMagicPortalOpen(true);
          }}
        />
      )}

      {activeApp === 'manager' && (
        <SystemManagerApp onClose={handleCloseApp} />
      )}

      {activeApp === 'yoyo' && (
        <SunnyAssistantApp
          onClose={handleCloseApp}
          onOpenApp={(appId) => handleOpenApp(appId)}
        />
      )}

      {activeApp === 'themes' && (
        <SettingsApp
          onClose={handleCloseApp}
          currentWallpaper={wallpaper}
          onSelectWallpaper={setWallpaper}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isMagicCapsuleEnabled={isMagicCapsuleEnabled}
          onToggleMagicCapsule={() => setIsMagicCapsuleEnabled(!isMagicCapsuleEnabled)}
          isMagicPortalEnabled={true}
          onToggleMagicPortal={() => {}}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => handleSetDeviceMode(isPhoneFrame ? 'phone' : 'phone-frame')}
          deviceMode={deviceMode}
          onChangeDeviceMode={handleSetDeviceMode}
          brightness={brightness}
          onBrightnessChange={setBrightness}
          volume={volume}
          onVolumeChange={setVolume}
        />
      )}

      {['twitter', 'instagram', 'tiktok', 'telegram'].includes(activeApp || '') && (
        <SocialAppView appName={activeApp!} onClose={handleCloseApp} />
      )}

      {/* Lock Screen Overlay */}
      {isLocked && (
        <LockScreen
          isLocked={isLocked}
          onUnlock={handleToggleLock}
          onOpenApp={(app) => {
            setIsLocked(false);
            handleOpenApp(app);
          }}
          wallpaperClass={wallpaper.bgClass}
          isPlayingMusic={isPlayingMusic}
          currentTrack={currentTrack}
          isFlashlightOn={isFlashlightOn}
          onToggleFlashlight={() => setIsFlashlightOn(!isFlashlightOn)}
        />
      )}
    </div>
  );
}
