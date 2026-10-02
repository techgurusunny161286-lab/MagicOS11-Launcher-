export interface AppItem {
  id: string;
  name: string;
  iconName: string;
  category: 'system' | 'tools' | 'media' | 'social';
  badge?: number;
  isSystemApp?: boolean;
}

export type MagicCapsuleActivity = 'music' | 'timer' | 'call' | 'charging';

export interface WidgetConfig {
  id: string;
  type: 'weather' | 'clock_calendar' | 'yoyo_suggestions' | 'health_ring' | 'music_player' | 'notes_card';
  title?: string;
  gridSpan: '2x2' | '2x4' | '4x2';
}

export interface NotificationItem {
  id: string;
  appName: string;
  appIcon: string;
  title: string;
  content: string;
  time: string;
  unread: boolean;
}

export interface WallpaperItem {
  id: string;
  name: string;
  bgClass: string;
  accentColor: string;
  previewUrl?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

export type ActiveApp = 
  | null 
  | 'camera' 
  | 'settings' 
  | 'gallery' 
  | 'notes' 
  | 'calculator' 
  | 'phone' 
  | 'messages'
  | 'health' 
  | 'music' 
  | 'themes' 
  | 'weather' 
  | 'browser' 
  | 'clock'
  | 'yoyo'
  | string;
