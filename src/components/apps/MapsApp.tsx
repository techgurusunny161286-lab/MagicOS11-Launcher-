import React, { useState } from 'react';
import { X, Search, Navigation, Compass, Layers, Coffee, Fuel, Utensils, ShoppingCart, MapPin, LocateFixed, ArrowRight } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface MapsAppProps {
  onClose: () => void;
}

export const MapsApp: React.FC<MapsAppProps> = ({ onClose }) => {
  const [searchLocation, setSearchLocation] = useState('San Francisco, CA');
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const quickCategories = [
    { label: 'Coffee', icon: Coffee },
    { label: 'Restaurants', icon: Utensils },
    { label: 'Gas', icon: Fuel },
    { label: 'Groceries', icon: ShoppingCart },
  ];

  const handleStartNav = () => {
    triggerHaptic('heavy');
    playTapSound(700);
    setIsNavigating(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      {/* 1. MAP CANVAS SIMULATION */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        {/* Stylized vector map grid background */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* River & Roads Vector Elements */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
          <path d="M 0,220 Q 150,180 260,300 T 500,420" fill="none" stroke="#0284c7" strokeWidth="18" />
          <path d="M 80,0 L 220,600" fill="none" stroke="#475569" strokeWidth="8" strokeDasharray="4 2" />
          <path d="M 0,380 L 400,260" fill="none" stroke="#64748b" strokeWidth="6" />
          {isNavigating && (
            <path d="M 120,450 C 180,380 210,320 280,240" fill="none" stroke="#00d2d3" strokeWidth="7" strokeLinecap="round" className="animate-pulse" />
          )}
        </svg>

        {/* Current Location Marker */}
        <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-xl animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full mt-1 border border-white/20">
            You are here
          </span>
        </div>

        {/* Destination Pin */}
        <div className="absolute top-[32%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer">
          <MapPin size={28} className="text-rose-500 fill-rose-500 drop-shadow-lg" />
          <span className="text-[10px] font-bold text-white bg-neutral-900/90 px-2 py-0.5 rounded-full border border-rose-500/40 shadow-lg">
            Golden Gate Park
          </span>
        </div>

        {/* TOP FLOATING SEARCH BAR */}
        <div className="absolute top-4 inset-x-4 z-20 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-900/95 border border-white/20 shadow-2xl backdrop-blur-xl">
            <Search size={16} className="text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search here..."
              className="w-full bg-transparent text-xs text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900/95 border border-white/20 flex items-center justify-center text-white/80 shadow-2xl backdrop-blur-xl active:scale-95 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* TOP CATEGORIES PILLS */}
        <div className="absolute top-18 inset-x-4 z-20 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  setSelectedPlace(cat.label);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xl border shadow-lg whitespace-nowrap active:scale-95 transition-all ${
                  selectedPlace === cat.label
                    ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold'
                    : 'bg-neutral-900/90 text-white border-white/15 hover:bg-neutral-800'
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTROLS: Re-center & Layers */}
        <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tick');
              playTapSound(600);
            }}
            className="w-10 h-10 rounded-full bg-neutral-900/90 border border-white/20 flex items-center justify-center text-white shadow-xl backdrop-blur-xl active:scale-95"
          >
            <LocateFixed size={18} className="text-cyan-400" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-neutral-900/90 border border-white/20 flex items-center justify-center text-white shadow-xl backdrop-blur-xl active:scale-95"
          >
            <Compass size={18} className="text-rose-400" />
          </button>
        </div>

        {/* BOTTOM NAVIGATION ROUTE CARD */}
        <div className="absolute bottom-4 inset-x-4 z-20 p-4 rounded-3xl bg-neutral-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white">Golden Gate Park Route</h4>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span>18 min (4.2 miles)</span>
                <span>·</span>
                <span>Fastest route with typical traffic</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Navigation size={20} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartNav}
              className={`flex-1 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                isNavigating ? 'bg-emerald-500 text-neutral-950' : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950'
              }`}
            >
              <Navigation size={14} />
              <span>{isNavigating ? 'Navigating Active' : 'Start Navigation'}</span>
            </button>
            <button
              type="button"
              className="px-4 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700"
            >
              Steps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
