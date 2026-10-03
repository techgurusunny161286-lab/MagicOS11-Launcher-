export interface ActualSystemInfo {
  deviceName: string;
  model: string;
  osName: string;
  osVersion: string;
  platform: string;
  screenResolution: string;
  cpuCores: number;
  deviceMemory: string;
  networkType: string;
  language: string;
  timezone: string;
  userAgentSummary: string;
}

export function getActualSystemInfo(): ActualSystemInfo {
  if (typeof window === 'undefined') {
    return {
      deviceName: 'Android Device',
      model: 'Default System',
      osName: 'Android',
      osVersion: '14',
      platform: 'Android / Linux',
      screenResolution: '1080 × 2400',
      cpuCores: 8,
      deviceMemory: '8 GB',
      networkType: '5G / Wi-Fi',
      language: 'en-US',
      timezone: 'Asia/Calcutta',
      userAgentSummary: 'Mobile Web Runtime',
    };
  }

  const ua = navigator.userAgent || '';
  let osName = 'Android';
  let osVersion = '';
  let deviceName = 'Android Device';
  let model = 'Default System';

  // Detect OS & Version
  if (/Android\s([0-9.]+)/i.test(ua)) {
    osName = 'Android';
    const match = ua.match(/Android\s([0-9.]+)/i);
    osVersion = match ? match[1] : '';
    
    // Check for device model: e.g. "Android 14; K" or "Android 14; Pixel 8" or "Android 14; SM-S928B"
    const modelMatch = ua.match(/Android[^;]+;\s*([^;)]+)\)/i);
    if (modelMatch && modelMatch[1]) {
      const rawModel = modelMatch[1].trim();
      if (rawModel !== 'K' && rawModel !== 'Build') {
        deviceName = rawModel;
        model = rawModel;
      } else {
        deviceName = `Android ${osVersion ? `v${osVersion}` : ''} Device`.trim();
        model = 'Android Smartphone';
      }
    } else {
      deviceName = `Android ${osVersion ? `v${osVersion}` : ''} Device`.trim();
      model = 'Android Smartphone';
    }
  } else if (/iPhone/i.test(ua)) {
    osName = 'iOS';
    deviceName = 'Apple iPhone';
    model = 'iPhone';
    const match = ua.match(/OS\s([\d_]+)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (/iPad/i.test(ua)) {
    osName = 'iPadOS';
    deviceName = 'Apple iPad';
    model = 'iPad';
  } else if (/Windows/i.test(ua)) {
    osName = 'Windows';
    deviceName = 'Windows PC';
    model = 'Desktop PC';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    osName = 'macOS';
    deviceName = 'Apple Mac';
    model = 'Macintosh';
  } else if (/Linux/i.test(ua)) {
    osName = 'Linux';
    deviceName = 'Linux Device';
    model = 'Linux System';
  }

  // Screen resolution with DPR
  const dpr = window.devicePixelRatio || 1;
  const screenWidth = Math.round(window.screen.width * dpr);
  const screenHeight = Math.round(window.screen.height * dpr);
  const screenResolution = `${screenWidth} × ${screenHeight} (${dpr.toFixed(1)}x)`;

  // Hardware Cores
  const cpuCores = navigator.hardwareConcurrency || 8;

  // Device Memory
  const mem = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : '8 GB';

  // Network info
  const conn = (navigator as any).connection;
  let networkType = 'Online (Wi-Fi / 5G)';
  if (conn?.effectiveType) {
    networkType = `${conn.effectiveType.toUpperCase()} Network`;
  } else if (!navigator.onLine) {
    networkType = 'Offline';
  }

  // Locale & Timezone
  const language = navigator.language || 'en-US';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Calcutta';

  // Summary
  const userAgentSummary = `${osName} ${osVersion ? `v${osVersion}` : ''} · ${cpuCores} Cores · ${mem} RAM`.trim();

  return {
    deviceName,
    model,
    osName,
    osVersion,
    platform: navigator.platform || `${osName} Platform`,
    screenResolution,
    cpuCores,
    deviceMemory: mem,
    networkType,
    language,
    timezone,
    userAgentSummary,
  };
}
