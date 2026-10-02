import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  RefreshCw, 
  Wind, 
  Droplets, 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  Compass, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Navigation
} from 'lucide-react';
import { 
  RealTimeWeather, 
  POPULAR_CITIES, 
  CityLocation, 
  fetchLiveWeather 
} from '../../utils/weather';
import { triggerHaptic } from '../../utils/haptics';
import { playTapSound } from '../../utils/sound';

interface WeatherAppProps {
  onClose: () => void;
  selectedCity?: CityLocation;
  onCityChange?: (city: CityLocation) => void;
}

export const WeatherApp: React.FC<WeatherAppProps> = ({ 
  onClose,
  selectedCity = POPULAR_CITIES[0],
  onCityChange
}) => {
  const [currentCity, setCurrentCity] = useState<CityLocation>(selectedCity);
  const [weather, setWeather] = useState<RealTimeWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const loadWeather = async (city: CityLocation) => {
    setIsLoading(true);
    const data = await fetchLiveWeather(city);
    setWeather(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity]);

  const handleRefresh = () => {
    triggerHaptic('smooth');
    playTapSound(600);
    loadWeather(currentCity);
  };

  const handleSelectCity = (city: CityLocation) => {
    triggerHaptic('click');
    playTapSound(600);
    setCurrentCity(city);
    if (onCityChange) onCityChange(city);
    setShowCityPicker(false);
  };

  const handleUseCurrentLocation = () => {
    triggerHaptic('doubleTick');
    playTapSound(700);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const customCity: CityLocation = {
            id: 'current-gps',
            name: 'My Location',
            country: 'Live GPS',
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCurrentCity(customCity);
          setShowCityPicker(false);
        },
        () => {
          // If permission denied, keep current
          setShowCityPicker(false);
        }
      );
    }
  };

  const renderWeatherIcon = (iconType: string, size = 24, className = '') => {
    switch (iconType) {
      case 'sunny':
        return <Sun size={size} className={`text-amber-400 ${className}`} />;
      case 'partlyCloudy':
        return <CloudSun size={size} className={`text-amber-300 ${className}`} />;
      case 'cloudy':
        return <Cloud size={size} className={`text-neutral-300 ${className}`} />;
      case 'rain':
        return <CloudRain size={size} className={`text-cyan-400 ${className}`} />;
      case 'thunder':
        return <CloudLightning size={size} className={`text-purple-400 ${className}`} />;
      case 'snow':
        return <Snowflake size={size} className={`text-blue-200 ${className}`} />;
      case 'fog':
        return <CloudFog size={size} className={`text-neutral-400 ${className}`} />;
      default:
        return <CloudSun size={size} className={`text-amber-300 ${className}`} />;
    }
  };

  // Dynamic background based on weather condition
  const getThemeBackground = () => {
    if (!weather) return 'from-sky-950 via-blue-900 to-indigo-950';
    switch (weather.icon) {
      case 'sunny':
        return 'from-sky-600 via-blue-700 to-indigo-950';
      case 'rain':
      case 'thunder':
        return 'from-slate-900 via-cyan-950 to-neutral-950';
      case 'cloudy':
      case 'fog':
        return 'from-neutral-900 via-slate-800 to-neutral-950';
      default:
        return 'from-sky-900 via-blue-950 to-neutral-950';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b ${getThemeBackground()} text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200`}>
      {/* Top App Header */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('smooth');
            setShowCityPicker(!showCityPicker);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-bold"
        >
          <MapPin size={14} className="text-cyan-400 shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{currentCity.name}</span>
          <span className="text-[10px] text-cyan-300 font-normal">▼</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className={`w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh Live Weather"
          >
            <RefreshCw size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              playTapSound(500);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* City Switcher Dropdown Drawer */}
      {showCityPicker && (
        <div className="absolute top-14 inset-x-4 z-40 p-4 rounded-3xl bg-neutral-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200 max-h-[60vh] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Select City / Region</span>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/30"
            >
              <Navigation size={12} />
              <span>Use GPS Location</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 overflow-y-auto no-scrollbar max-h-56 pr-1">
            {POPULAR_CITIES.map((city) => (
              <button
                type="button"
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col ${
                  currentCity.id === city.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold block">{city.name}</span>
                <span className="text-[10px] text-neutral-400">{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Scrollable Weather Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        {weather && (
          <>
            {/* Primary Current Temperature Hero */}
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="flex items-center justify-center mb-2">
                {renderWeatherIcon(weather.icon, 72, 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] animate-bounce duration-1000')}
              </div>
              <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white drop-shadow-md">
                {weather.temp}°
              </h1>
              <p className="text-lg font-semibold text-white/90 mt-1">{weather.condition}</p>
              <div className="flex items-center gap-3 text-xs text-white/70 mt-1 font-medium">
                <span>H: {weather.high}°</span>
                <span>·</span>
                <span>L: {weather.low}°</span>
                <span>·</span>
                <span>Feels like {weather.feelsLike}°</span>
              </div>
              <span className="text-[10px] text-cyan-300 mt-2 bg-white/10 px-2.5 py-0.5 rounded-full">
                Updated {weather.lastUpdated}
              </span>
            </div>

            {/* Hourly 24-Hour Forecast Card */}
            <div className="p-4 rounded-[28px] bg-white/10 dark:bg-black/35 backdrop-blur-xl border border-white/15 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/80 font-semibold">
                <span className="uppercase tracking-wider text-[11px] text-cyan-400">Hourly Forecast</span>
                <span className="text-[10px] text-white/60">Next 12 Hours</span>
              </div>

              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 pt-1">
                {weather.hourly.map((h, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col items-center gap-2 min-w-[54px] p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-[11px] text-white/80 font-mono">{h.time}</span>
                    {renderWeatherIcon(h.icon, 20)}
                    <span className="text-sm font-bold text-white">{h.temp}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Forecast Card */}
            <div className="p-4 rounded-[28px] bg-white/10 dark:bg-black/35 backdrop-blur-xl border border-white/15 space-y-2.5">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-cyan-400 block mb-1">
                7-Day Forecast
              </span>

              <div className="space-y-2">
                {weather.daily.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 text-xs">
                    <span className="w-16 font-semibold text-white/90">{d.day}</span>
                    <div className="flex items-center gap-2">
                      {renderWeatherIcon(d.icon, 18)}
                      <span className="text-[11px] text-white/70 w-24 truncate hidden sm:inline">{d.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white/60 text-[11px]">{d.min}°</span>
                      <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(20, (d.max - d.min) * 10))}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-white text-[12px]">{d.max}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Metrics 4-Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Air Quality */}
              <div className="p-3.5 rounded-[24px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 text-[11px]">
                  <span className="font-semibold">Air Quality (AQI)</span>
                  <Gauge size={14} className="text-emerald-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-2xl font-bold text-white">{weather.aqi}</span>
                  <span className="text-xs text-emerald-400 font-semibold ml-2">Good</span>
                </div>
                <span className="text-[10px] text-white/60">Air pollution risk is very low today.</span>
              </div>

              {/* UV Index */}
              <div className="p-3.5 rounded-[24px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 text-[11px]">
                  <span className="font-semibold">UV Index</span>
                  <Sun size={14} className="text-amber-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-2xl font-bold text-white">{weather.uvIndex}</span>
                  <span className="text-xs text-amber-400 font-semibold ml-2">Moderate</span>
                </div>
                <span className="text-[10px] text-white/60">Sun protection recommended at noon.</span>
              </div>

              {/* Wind Speed */}
              <div className="p-3.5 rounded-[24px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 text-[11px]">
                  <span className="font-semibold">Wind</span>
                  <Wind size={14} className="text-cyan-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-2xl font-bold text-white">{weather.windSpeed}</span>
                  <span className="text-xs text-white/80 font-medium ml-1">km/h</span>
                </div>
                <span className="text-[10px] text-white/60">Light breeze from North-West.</span>
              </div>

              {/* Humidity */}
              <div className="p-3.5 rounded-[24px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 text-[11px]">
                  <span className="font-semibold">Humidity</span>
                  <Droplets size={14} className="text-sky-400" />
                </div>
                <div className="my-1.5">
                  <span className="text-2xl font-bold text-white">{weather.humidity}%</span>
                </div>
                <span className="text-[10px] text-white/60">The dew point is comfortable.</span>
              </div>
            </div>

            {/* Sunrise & Sunset */}
            <div className="p-4 rounded-[28px] bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 flex items-center justify-around">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sunrise size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Sunrise</span>
                  <span className="text-sm font-bold text-white">{weather.sunrise}</span>
                </div>
              </div>

              <div className="w-[1px] h-8 bg-white/20"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sunset size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Sunset</span>
                  <span className="text-sm font-bold text-white">{weather.sunset}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
