import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { playTapSound } from '../utils/sound';

interface PixelGestureNavigationProps {
  onHome: () => void;
  onBack: () => void;
  onRecentApps: () => void;
  onQuickSwitch?: (direction: 'next' | 'prev') => void;
  onOpenAppDrawer?: () => void;
  isActiveAppOpen?: boolean;
  isAppDrawerOpen?: boolean;
  lightPill?: boolean;
}

export const PixelNavigationGestures: React.FC<PixelGestureNavigationProps> = ({
  onHome,
  onBack,
  onRecentApps,
  onQuickSwitch,
  onOpenAppDrawer,
  isActiveAppOpen = false,
  isAppDrawerOpen = false,
  lightPill = false,
}) => {
  // Edge back gesture states
  const [backGestureSide, setBackGestureSide] = useState<'left' | 'right' | null>(null);
  const [backDragDistance, setBackDragDistance] = useState(0);
  const [backYPos, setBackYPos] = useState(0);
  const [isBackTriggered, setIsBackTriggered] = useState(false);

  // Bottom home pill drag states
  const [bottomDragY, setBottomDragY] = useState(0);
  const [bottomDragX, setBottomDragX] = useState(0);
  const bottomTouchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const backTouchStartRef = useRef<{ x: number; y: number; side: 'left' | 'right' } | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Edge-to-Edge Back Gesture Handlers (Left & Right Screen Edges)
  const handleEdgePointerDown = (clientX: number, clientY: number, side: 'left' | 'right') => {
    backTouchStartRef.current = { x: clientX, y: clientY, side };
    setBackGestureSide(side);
    setBackYPos(clientY);
    setBackDragDistance(0);
    setIsBackTriggered(false);
  };

  const handleEdgePointerMove = (clientX: number, clientY: number) => {
    if (!backTouchStartRef.current) return;
    const { x, side } = backTouchStartRef.current;
    const deltaX = side === 'left' ? clientX - x : x - clientX;

    if (deltaX > 8) {
      setBackYPos(clientY);
      const clamped = Math.min(80, Math.max(0, deltaX));
      setBackDragDistance(clamped);

      // Trigger threshold: 35px
      if (clamped >= 35 && !isBackTriggered) {
        setIsBackTriggered(true);
        triggerHaptic('tick');
      } else if (clamped < 35 && isBackTriggered) {
        setIsBackTriggered(false);
      }
    }
  };

  const handleEdgePointerUp = () => {
    if (!backTouchStartRef.current) return;
    if (isBackTriggered) {
      triggerHaptic('heavy');
      playTapSound(520);
      onBack();
    }
    backTouchStartRef.current = null;
    setBackGestureSide(null);
    setBackDragDistance(0);
    setIsBackTriggered(false);
  };

  // 2. Bottom Navigation Pill (Home / Recents / Quick App Switch)
  const handleBottomTouchStart = (clientX: number, clientY: number) => {
    triggerHaptic('smooth');
    bottomTouchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    setBottomDragY(0);
    setBottomDragX(0);

    // Setup hold timer for Recent Apps overview
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      // If pulled up slightly and held -> Open Recents Overview
      triggerHaptic('doubleTick');
      playTapSound(480);
      onRecentApps();
      bottomTouchStartRef.current = null;
      setBottomDragY(0);
      setBottomDragX(0);
    }, 400);
  };

  const handleBottomTouchMove = (clientX: number, clientY: number) => {
    if (!bottomTouchStartRef.current) return;
    const deltaY = bottomTouchStartRef.current.y - clientY; // upward is positive
    const deltaX = clientX - bottomTouchStartRef.current.x;

    setBottomDragY(Math.max(0, deltaY));
    setBottomDragX(deltaX);

    // If dragged up significantly before timer, trigger recents
    if (deltaY > 65) {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      triggerHaptic('doubleTick');
      playTapSound(480);
      onRecentApps();
      bottomTouchStartRef.current = null;
      setBottomDragY(0);
      setBottomDragX(0);
    }
  };

  const handleBottomTouchEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (!bottomTouchStartRef.current) return;

    const deltaY = bottomDragY;
    const deltaX = bottomDragX;
    bottomTouchStartRef.current = null;
    setBottomDragY(0);
    setBottomDragX(0);

    // Horizontal flick on pill: Switch App
    if (Math.abs(deltaX) > 40 && deltaY < 25 && onQuickSwitch) {
      triggerHaptic('tick');
      onQuickSwitch(deltaX > 0 ? 'next' : 'prev');
      return;
    }

    // Swipe up from bottom pill while on Home Screen -> Open App Drawer!
    if (!isActiveAppOpen && !isAppDrawerOpen && deltaY > 20 && onOpenAppDrawer) {
      triggerHaptic('doubleTick');
      playTapSound(600);
      onOpenAppDrawer();
      return;
    }

    // Quick swipe up or tap: Go Home
    if (deltaY > 20 || deltaY < 8) {
      triggerHaptic('click');
      playTapSound(600);
      onHome();
    }
  };

  // 3. Screen-Wide Right-to-Left Sweep Gesture to Close Apps & App Drawer
  const screenSwipeRef = useRef<{ startX: number; startY: number } | null>(null);

  useEffect(() => {
    if (!isActiveAppOpen && !isAppDrawerOpen) return;

    const handleTouchStartGlobal = (e: TouchEvent) => {
      const touch = e.touches[0];
      // Don't intercept if touching near bottom pill (last 45px)
      if (touch.clientY > window.innerHeight - 45) return;
      screenSwipeRef.current = { startX: touch.clientX, startY: touch.clientY };
    };

    const handleTouchEndGlobal = (e: TouchEvent) => {
      if (!screenSwipeRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - screenSwipeRef.current.startX;
      const deltaY = touch.clientY - screenSwipeRef.current.startY;
      screenSwipeRef.current = null;

      // Sweeping from RIGHT to LEFT: deltaX < -35px & horizontal
      if (deltaX < -35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        triggerHaptic('heavy');
        playTapSound(500);
        onBack();
      }
    };

    const handleMouseDownGlobal = (e: MouseEvent) => {
      if (e.clientY > window.innerHeight - 45) return;
      screenSwipeRef.current = { startX: e.clientX, startY: e.clientY };
    };

    const handleMouseUpGlobal = (e: MouseEvent) => {
      if (!screenSwipeRef.current) return;
      const deltaX = e.clientX - screenSwipeRef.current.startX;
      const deltaY = e.clientY - screenSwipeRef.current.startY;
      screenSwipeRef.current = null;

      // Sweeping from RIGHT to LEFT on desktop mouse
      if (deltaX < -40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        triggerHaptic('heavy');
        playTapSound(500);
        onBack();
      }
    };

    window.addEventListener('touchstart', handleTouchStartGlobal, { passive: true });
    window.addEventListener('touchend', handleTouchEndGlobal, { passive: true });
    window.addEventListener('mousedown', handleMouseDownGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('touchstart', handleTouchStartGlobal);
      window.removeEventListener('touchend', handleTouchEndGlobal);
      window.removeEventListener('mousedown', handleMouseDownGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isActiveAppOpen, isAppDrawerOpen, onBack]);

  // Global mouse/touch move listeners for edge back pill animation
  useEffect(() => {
    const onWindowMove = (e: MouseEvent) => {
      if (backTouchStartRef.current) {
        handleEdgePointerMove(e.clientX, e.clientY);
      }
      if (bottomTouchStartRef.current) {
        handleBottomTouchMove(e.clientX, e.clientY);
      }
    };

    const onWindowUp = () => {
      if (backTouchStartRef.current) handleEdgePointerUp();
      if (bottomTouchStartRef.current) handleBottomTouchEnd();
    };

    window.addEventListener('mousemove', onWindowMove);
    window.addEventListener('mouseup', onWindowUp);
    return () => {
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
    };
  }, [isBackTriggered, bottomDragY, bottomDragX]);

  return (
    <>
      {/* LEFT EDGE BACK GESTURE DETECTION ZONE */}
      <div
        className="fixed left-0 top-16 bottom-16 w-6 z-[70] cursor-w-resize select-none touch-none"
        onMouseDown={(e) => handleEdgePointerDown(e.clientX, e.clientY, 'left')}
        onTouchStart={(e) => handleEdgePointerDown(e.touches[0].clientX, e.touches[0].clientY, 'left')}
        onTouchMove={(e) => handleEdgePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEdgePointerUp}
        title="Swipe inward from edge to go Back"
      />

      {/* RIGHT EDGE BACK GESTURE DETECTION ZONE */}
      <div
        className={`fixed right-0 top-16 bottom-16 ${
          isActiveAppOpen || isAppDrawerOpen ? 'w-14' : 'w-7'
        } z-[70] cursor-e-resize select-none touch-none`}
        onMouseDown={(e) => handleEdgePointerDown(e.clientX, e.clientY, 'right')}
        onTouchStart={(e) => handleEdgePointerDown(e.touches[0].clientX, e.touches[0].clientY, 'right')}
        onTouchMove={(e) => handleEdgePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEdgePointerUp}
        title="Swipe right-to-left to close apps / app drawer"
      />

      {/* PIXEL BACK ARROW BUBBLE (Appears when dragging from Left or Right edge) */}
      {backGestureSide && (
        <div
          style={{
            top: `${backYPos}px`,
            left: backGestureSide === 'left' ? `${Math.min(48, backDragDistance)}px` : undefined,
            right: backGestureSide === 'right' ? `${Math.min(48, backDragDistance)}px` : undefined,
            transform: 'translateY(-50%)',
          }}
          className={`fixed z-[80] pointer-events-none flex items-center justify-center transition-transform duration-75 ${
            isBackTriggered
              ? 'w-11 h-11 rounded-full bg-cyan-500 text-neutral-950 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-110'
              : 'w-9 h-9 rounded-full bg-neutral-900/90 border border-white/20 text-white shadow-xl scale-95'
          }`}
        >
          {backGestureSide === 'left' ? (
            <ChevronLeft size={isBackTriggered ? 24 : 20} className="font-bold stroke-[3]" />
          ) : (
            <ChevronRight size={isBackTriggered ? 24 : 20} className="font-bold stroke-[3]" />
          )}
        </div>
      )}

      {/* GOOGLE PIXEL BOTTOM GESTURE NAVIGATION PILL (Fixed at bottom) */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[75] flex flex-col items-center justify-end pb-2 pt-3 select-none pointer-events-auto"
      >
        <div
          onTouchStart={(e) => handleBottomTouchStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleBottomTouchMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleBottomTouchEnd}
          onMouseDown={(e) => handleBottomTouchStart(e.clientX, e.clientY)}
          style={{
            transform: `translateY(-${Math.min(24, bottomDragY * 0.4)}px) translateX(${Math.max(-20, Math.min(20, bottomDragX * 0.2))}px)`,
          }}
          className="cursor-pointer py-2 px-6 group touch-none transition-transform duration-75"
          title="Google Pixel Gesture Pill: Swipe up for Home, Swipe up & hold for Recents, Swipe left/right to switch apps"
        >
          <div 
            className={`w-32 h-1.5 rounded-full transition-all duration-150 ${
              lightPill 
                ? 'bg-neutral-800/80 group-hover:bg-neutral-950 group-active:scale-95 shadow' 
                : 'bg-white/80 group-hover:bg-white group-active:scale-95 shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
            }`} 
          />
        </div>
      </div>
    </>
  );
};
