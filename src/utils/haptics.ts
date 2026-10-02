/**
 * Google Pixel & Flagship Tactile Haptic Feedback Engine
 * Emulates the Pixel Linear Resonant Actuator (LRA) haptic profiles
 * utilizing both device vibration (navigator.vibrate) and synthesized low-frequency acoustic tactile pulses.
 */

export type HapticType = 
  | 'smooth'     // Silky smooth micro-pulse (touch down, fluid UI interaction, gesture start)
  | 'tick'       // Light micro-tap (app icon tap, keyboard, minor toggle)
  | 'click'      // Standard tactile bump (app drawer open, folder open, card tap)
  | 'heavy'      // Firm thud (phone lock, power button, shutter snap, drawer close)
  | 'selection'  // Micro scrub tick (slider drag, alphabet index scrub)
  | 'doubleTick' // Double confirmation (fingerprint scanner, gesture completed)
  | 'unlock'     // Smooth ascending unlock pulse
  | 'error';     // Two quick pulses

let hapticsEnabled = true;
let hapticIntensity: 'soft' | 'smooth' | 'crisp' | 'strong' = 'smooth';
let audioCtx: AudioContext | null = null;
let lastHapticTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setHapticsEnabled(enabled: boolean) {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export function setHapticIntensity(intensity: 'soft' | 'smooth' | 'crisp' | 'strong') {
  hapticIntensity = intensity;
}

export function getHapticIntensity() {
  return hapticIntensity;
}

/**
 * Triggers an authentic smooth tactile haptic pulse
 */
export function triggerHaptic(type: HapticType = 'smooth') {
  if (!hapticsEnabled) return;

  // Debounce rapid multi-triggers to avoid auditory clipping
  const nowMs = Date.now();
  if (nowMs - lastHapticTime < 20 && type === 'smooth') {
    return;
  }
  lastHapticTime = nowMs;

  const multiplier = 
    hapticIntensity === 'soft' ? 0.65 : 
    hapticIntensity === 'smooth' ? 0.9 : 
    hapticIntensity === 'strong' ? 1.4 : 1.0;

  // 1. Hardware Vibration API (Android / Pixel / Chrome / Tablet)
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'smooth':
          navigator.vibrate(Math.round(8 * multiplier));
          break;
        case 'tick':
          navigator.vibrate(Math.round(10 * multiplier));
          break;
        case 'click':
          navigator.vibrate(Math.round(18 * multiplier));
          break;
        case 'heavy':
          navigator.vibrate(Math.round(38 * multiplier));
          break;
        case 'selection':
          navigator.vibrate(Math.round(5 * multiplier));
          break;
        case 'doubleTick':
          navigator.vibrate([Math.round(10 * multiplier), 35, Math.round(15 * multiplier)]);
          break;
        case 'unlock':
          navigator.vibrate([Math.round(12 * multiplier), 25, Math.round(22 * multiplier)]);
          break;
        case 'error':
          navigator.vibrate([Math.round(30 * multiplier), 50, Math.round(30 * multiplier)]);
          break;
      }
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  // 2. Synthesized Smooth Acoustic Haptic Pulse (Acoustic tactile resonance)
  playPixelAcousticHaptic(type, multiplier);
}

/**
 * Synthesizes smooth mechanical tactile sound
 */
function playPixelAcousticHaptic(type: HapticType, intensityMult: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Config based on tactile profile
    let freq = 150;
    let duration = 0.016;
    let gainVal = 0.05 * intensityMult;

    switch (type) {
      case 'smooth':
        freq = 145;
        duration = 0.016;
        gainVal = 0.045 * intensityMult;
        break;
      case 'tick':
        freq = 240;
        duration = 0.012;
        gainVal = 0.05 * intensityMult;
        break;
      case 'selection':
        freq = 320;
        duration = 0.008;
        gainVal = 0.03 * intensityMult;
        break;
      case 'click':
        freq = 180;
        duration = 0.02;
        gainVal = 0.08 * intensityMult;
        break;
      case 'heavy':
        freq = 110;
        duration = 0.035;
        gainVal = 0.12 * intensityMult;
        break;
      case 'doubleTick':
      case 'unlock':
        freq = 220;
        duration = 0.03;
        gainVal = 0.09 * intensityMult;
        break;
      case 'error':
        freq = 140;
        duration = 0.04;
        gainVal = 0.11 * intensityMult;
        break;
    }

    // Sub-bass resonance (resembles physical linear motor pulse)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + duration);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

    // Subtle transient high-frequency click for crispness (omitted in smooth for pure silky feel)
    if (type === 'tick' || type === 'click' || type === 'selection') {
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.006);

      clickGain.gain.setValueAtTime(0.018 * intensityMult, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.006);
    }
  } catch {
    // Autoplay policy or unsupported audio
  }
}

/**
 * Initializes global smooth touch haptic feedback across all interactive UI touch inputs
 */
let touchHapticsInitialized = false;

export function initTouchHapticFeedback(): () => void {
  if (typeof window === 'undefined' || touchHapticsInitialized) {
    return () => {};
  }
  touchHapticsInitialized = true;

  const handleTouch = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if touching an interactive element
    const interactive = target.closest(
      'button, a, [role="button"], input, select, textarea, .cursor-pointer, [data-haptic], .touch-haptic'
    );

    if (interactive) {
      triggerHaptic('smooth');
    }
  };

  window.addEventListener('touchstart', handleTouch, { passive: true, capture: true });
  window.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      handleTouch(e);
    }
  }, { passive: true, capture: true });

  return () => {
    window.removeEventListener('touchstart', handleTouch, { capture: true });
    touchHapticsInitialized = false;
  };
}
