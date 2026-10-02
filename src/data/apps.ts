import { AppItem, WallpaperItem, NotificationItem, NoteItem } from '../types/launcher';

export const DEFAULT_APPS: AppItem[] = [
  { id: 'phone', name: 'Phone', iconName: 'phone', category: 'system', isSystemApp: true, badge: 1 },
  { id: 'messages', name: 'Messages', iconName: 'messages', category: 'social', isSystemApp: true, badge: 3 },
  { id: 'browser', name: 'Browser', iconName: 'browser', category: 'system', isSystemApp: true },
  { id: 'camera', name: 'Camera', iconName: 'camera', category: 'media', isSystemApp: true },
  
  { id: 'gallery', name: 'Gallery', iconName: 'gallery', category: 'media', isSystemApp: true },
  { id: 'settings', name: 'Settings', iconName: 'settings', category: 'system', isSystemApp: true },
  { id: 'notes', name: 'SUNNY Notes', iconName: 'notes', category: 'tools', isSystemApp: true },
  { id: 'calculator', name: 'Calculator', iconName: 'calculator', category: 'tools', isSystemApp: true },
  { id: 'health', name: 'SUNNY Health', iconName: 'health', category: 'tools', isSystemApp: true },
  { id: 'music', name: 'SUNNY Music', iconName: 'music', category: 'media', isSystemApp: true },
  { id: 'themes', name: 'Themes', iconName: 'themes', category: 'system', isSystemApp: true },
  { id: 'weather', name: 'Weather', iconName: 'weather', category: 'tools', isSystemApp: true },
  
  { id: 'files', name: 'Files', iconName: 'files', category: 'tools', isSystemApp: true },
  { id: 'clock', name: 'Clock', iconName: 'clock', category: 'tools', isSystemApp: true },
  { id: 'manager', name: 'System Manager', iconName: 'manager', category: 'system', isSystemApp: true },
  { id: 'yoyo', name: 'SUNNY Assistant', iconName: 'yoyo', category: 'system', isSystemApp: true },
];

export const BIG_FOLDER_APPS: AppItem[] = [
  { id: 'notes', name: 'Notes', iconName: 'notes', category: 'tools' },
  { id: 'calculator', name: 'Calculator', iconName: 'calculator', category: 'tools' },
  { id: 'music', name: 'Music', iconName: 'music', category: 'media' },
  { id: 'health', name: 'Health', iconName: 'health', category: 'tools' },
  { id: 'files', name: 'Files', iconName: 'files', category: 'tools' },
  { id: 'clock', name: 'Clock', iconName: 'clock', category: 'tools' },
  { id: 'manager', name: 'Optimizer', iconName: 'manager', category: 'system' },
  { id: 'weather', name: 'Weather', iconName: 'weather', category: 'tools' },
  { id: 'themes', name: 'Themes', iconName: 'themes', category: 'system' },
];

export const DOCK_APPS = ['phone', 'messages', 'browser', 'camera'];

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'prism-cyan',
    name: 'MagicOS 11 Cyan Flow',
    bgClass: 'bg-gradient-to-br from-[#0c1e34] via-[#093548] to-[#127278]',
    accentColor: '#00d2d3',
  },
  {
    id: 'obsidian-gold',
    name: 'SUNNY Magic Gold Velvet',
    bgClass: 'bg-gradient-to-br from-[#121316] via-[#2a2418] to-[#6d5528]',
    accentColor: '#e5b869',
  },
  {
    id: 'aurora-violet',
    name: 'Nebula Violet Pro',
    bgClass: 'bg-gradient-to-br from-[#130d24] via-[#2c1654] to-[#60297b]',
    accentColor: '#a855f7',
  },
  {
    id: 'ocean-deep',
    name: 'Pacific Azure',
    bgClass: 'bg-gradient-to-br from-[#071321] via-[#0b2b48] to-[#155e75]',
    accentColor: '#38bdf8',
  },
  {
    id: 'emerald-dark',
    name: 'SUNNY Jade Mineral',
    bgClass: 'bg-gradient-to-br from-[#081814] via-[#0e3b2e] to-[#136f54]',
    accentColor: '#34d399',
  },
  {
    id: 'minimal-slate',
    name: 'Titanium Graphite',
    bgClass: 'bg-gradient-to-br from-[#0a0a0c] via-[#1a1b20] to-[#2e313d]',
    accentColor: '#94a3b8',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    appName: 'SUNNY System Manager',
    appIcon: 'manager',
    title: 'MagicOS 11 Turbo Optimized',
    content: 'RAM Turbo expanded 8GB. 1.4 GB junk cleaned. Battery efficiency optimal.',
    time: 'Just now',
    unread: true,
  },
  {
    id: 'notif-2',
    appName: 'Messages',
    appIcon: 'messages',
    title: 'Sunny',
    content: 'MagicOS 11 looks super smooth! Love the new Magic Capsule animation.',
    time: '12m ago',
    unread: true,
  },
  {
    id: 'notif-3',
    appName: 'SUNNY Health',
    appIcon: 'health',
    title: 'Daily Goal Near Completion',
    content: '7,420 steps reached today. Only 2,580 steps to hit 10,000!',
    time: '1h ago',
    unread: false,
  },
  {
    id: 'notif-4',
    appName: 'SUNNY Assistant',
    appIcon: 'yoyo',
    title: 'Weather Suggestion',
    content: 'Clear skies expected this evening, temperature around 22°C.',
    time: '2h ago',
    unread: false,
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'MagicOS 11 Key Features',
    content: '• Magic Capsule at punch hole\n• Magic Portal edge drag-and-drop\n• Big 2x2 interactive folders\n• SUNNY Smart Suggestions widget\n• Hyper-smooth Control Center',
    date: 'Today, 2:15 PM',
    color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-100',
  },
  {
    id: 'note-2',
    title: 'Camera Shot List',
    content: 'Test Portrait mode bokeh, 5x telephoto optical zoom, Night super-RAW mode.',
    date: 'Yesterday',
    color: 'from-cyan-500/20 to-cyan-700/10 border-cyan-500/30 text-cyan-100',
  },
  {
    id: 'note-3',
    title: 'SUNNY Health Plan',
    content: 'Reach 10,000 steps daily. 30 mins cardiovascular training in the morning.',
    date: 'Sep 29',
    color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-100',
  }
];
