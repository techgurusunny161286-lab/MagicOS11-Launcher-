import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  MapPin, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog,
  RefreshCw
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';
import { RealTimeWeather, POPULAR_CITIES, fetchLiveWeather } from '../../utils/weather';

interface WeatherWidgetProps {
  onOpenWeather?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ onOpenWeather }) => {
  const [weather, setWeather] = useState<RealTimeWeather | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setIsLoading(true);
      const data = await fetchLiveWeather(POPULAR_CITIES[0]); // New Delhi default or GPS
      if (isMounted) {
        setWeather(data);
        setIsLoading(false);
      }
    };
    fetchWeather();

    // Auto-refresh every 5 minutes for real-time accuracy
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const renderWeatherIcon = (iconType: string, size = 26) => {
    switch (iconType) {
      case 'sunny':
        return <Sun size={size} className="text-amber-300 drop-shadow-md group-hover:scale-110 transition-transform" />;
      case 'partlyCloudy':
        return <CloudSun size={size} className="text-amber-300 drop-shadow-md group-hover:scale-110 transition-transform" />;
      case 'cloudy':
        return <Cloud size={size} className="text-neutral-200 drop-shadow-md group-hover:scale-110 transition-transform" />;
      case 'rain':
        return <CloudRain size={size} className="text-cyan-300 drop-shadow-md group-hover:scale-110 transition-transform" />;
      case 'thunder':
        return <CloudLightning size={size} className="text-purple-300 drop-shadow-md group-hover:scale-110 transition-transform" />;
      case 'snow':
        return <Snowflake size={size} className="text-blue-100 drop-shadow-md group-hover:scale-110 transition-transform" />;
      case 'fog':
        return <CloudFog size={size} className="text-neutral-300 drop-shadow-md group-hover:scale-110 transition-transform" />;
      default:
        return <CloudSun size={size} className="text-amber-300 drop-shadow-md group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <div
      onClick={() => {
        triggerHaptic('click');
        playTapSound(600);
        if (onOpenWeather) onOpenWeather();
      }}
      className="w-full h-full rounded-[28px] bg-gradient-to-br from-sky-500/35 via-blue-600/30 to-indigo-700/40 backdrop-blur-xl border border-white/20 p-3.5 flex flex-col justify-between text-white shadow-lg cursor-pointer hover:border-white/30 transition-all select-none relative overflow-hidden group"
    >
      {/* Background soft ambient blur */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top row: City & Condition icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-cyan-300" />
          <span className="text-xs font-semibold tracking-tight text-white/90">
            {weather ? weather.cityName : 'New Delhi'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Live weather connected"></span>
        </div>
        <div>
          {weather ? renderWeatherIcon(weather.icon, 26) : <CloudSun size={26} className="text-amber-300" />}
        </div>
      </div>

      {/* Middle row: Large Real-time Temperature */}
      <div className="flex items-baseline justify-between my-0.5">
        <div>
          <div className="flex items-start">
            <span className="text-3xl font-extrabold tracking-tighter text-white">
              {weather ? weather.temp : 26}
            </span>
            <span className="text-sm font-semibold text-white/80 mt-1">°C</span>
          </div>
          <span className="text-[11px] font-medium text-white/80">
            {weather ? weather.condition : 'Partly Cloudy'}
          </span>
        </div>

        <div className="text-right text-[10px] text-white/70 space-y-0.5">
          <div>
            H: {weather ? weather.high : 29}° · L: {weather ? weather.low : 19}°
          </div>
          <div className="text-cyan-200">
            Air: {weather ? `${weather.aqi} Good` : '45 Good'}
          </div>
        </div>
      </div>

      {/* Bottom mini status bar */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/70">
        <div className="flex items-center gap-1">
          <Wind size={11} className="text-cyan-300" />
          <span>{weather ? `${weather.windSpeed} km/h` : '12 km/h'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets size={11} className="text-cyan-300" />
          <span>{weather ? `${weather.humidity}% Humidity` : '48% Humidity'}</span>
        </div>
      </div>
    </div>
  );
};
