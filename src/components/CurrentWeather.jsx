import React, { useState, useEffect } from 'react';

function formatTimeFromOffset(unixTs, offsetSec) {
  const date = new Date((unixTs + offsetSec) * 1000);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minsStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minsStr} ${ampm}`;
}

function formatDateFromOffset(unixTs, offsetSec) {
  const date = new Date((unixTs + offsetSec) * 1000);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getUTCDay()];
  const dayNum = date.getUTCDate();
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

function getConditionBadgeStyle(id) {
  if (id >= 200 && id < 300) {
    return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
  } else if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) {
    return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
  } else if (id >= 600 && id < 700) {
    return { bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-300' };
  } else if (id === 800) {
    return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
  } else {
    return { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400' };
  }
}

function getConditionColor(id) {
  if (id >= 200 && id < 300) return 'rgba(168, 85, 247, 0.4)'; // Purple
  if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) return 'rgba(59, 130, 246, 0.4)'; // Blue
  if (id >= 600 && id < 700) return 'rgba(186, 230, 253, 0.4)'; // Light blue
  if (id === 800) return 'rgba(245, 158, 11, 0.4)'; // Amber
  return 'rgba(148, 163, 184, 0.4)'; // Slate (Clouds)
}

export default function CurrentWeather({ data, onBackToCurrent }) {
  const [cityLocalTime, setCityLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cityEpoch = Math.floor((utcMs + (data.timezone * 1000)) / 1000);
      setCityLocalTime(formatTimeFromOffset(cityEpoch, 0) + ' Local Time');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [data.timezone]);

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherDesc = data.weather[0].description;
  const weatherId = data.weather[0].id;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  const badgeStyle = getConditionBadgeStyle(weatherId);
  const windKmh = (data.wind.speed * 3.6).toFixed(1);
  const windDir = getWindDirection(data.wind.deg);
  const visibilityKm = (data.visibility / 1000).toFixed(1);

  return (
    <section 
      id="weather-card" 
      className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 relative overflow-hidden rounded-3xl"
      style={{ 
        background: 'radial-gradient(ellipse at top left, rgba(96,165,250,0.08) 0%, transparent 60%), rgba(10, 15, 30, 0.55)', 
        borderTop: '1px solid rgba(96, 165, 250, 0.3)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        borderRight: '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
    >
      
      {/* Left Column: Temperatures & Names */}
      <div className="flex flex-col justify-between relative select-none">
        <div>
          {data.isForecastSelected && (
            <button 
              onClick={onBackToCurrent}
              className="mb-4 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 text-[10px] font-extrabold uppercase tracking-wider text-brand-blue py-1.5 px-3.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors duration-200"
            >
              ← Back to Live Weather
            </button>
          )}
          <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
            <h1 className="text-3xl md:text-[2.25rem] font-bold text-white tracking-tight leading-tight">{data.name}</h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 gradient-badge-border text-brand-primary">
              {data.sys.country}
            </span>
          </div>
          <div className="text-sm font-medium text-brand-secondary">
            {formatDateFromOffset(data.dt, data.timezone)}
          </div>
          <div className="text-xs font-semibold text-brand-purple flex items-center gap-1.5 mt-1.5 mb-5" aria-label="City local time">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
            <span>{cityLocalTime}</span>
          </div>
          <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.text} mb-7`}>
            {weatherDesc}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div 
            className="text-7xl font-black text-white tracking-tighter flex items-start bg-gradient-to-br from-white via-white to-white/30 bg-clip-text text-transparent"
            style={{ textShadow: '0 0 30px rgba(96,165,250,0.25)' }}
          >
            {temp}
            <span className="text-4xl font-light text-brand-secondary/40 relative -top-2">°</span>
          </div>
          
          {/* Glowing Weather Icon Orb */}
          <div 
            className="flex items-center justify-center w-[100px] h-[100px] rounded-full animate-float-icon shrink-0 relative"
            style={{
              background: `radial-gradient(circle, ${getConditionColor(weatherId)} 0%, transparent 70%)`,
              boxShadow: `0 0 30px ${getConditionColor(weatherId).replace('0.4', '0.3')}`
            }}
          >
            <img className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] relative z-10" src={iconUrl} alt={weatherDesc} />
          </div>
        </div>

        <div className="text-xs font-semibold text-brand-secondary mt-3">
          Feels like <span className="text-white">{feelsLike}°C</span>
        </div>
      </div>

      {/* Right Column: Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Humidity */}
        <div className="bg-white/[0.02] border border-white/5 border-l-4 border-l-blue-500 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:bg-[#0a0f23]/60 hover:border-l-indigo-400 group">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-secondary mb-2.5">
            💧 Humidity
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{data.main.humidity}%</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-3.5">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${data.main.humidity}%` }}
            ></div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white/[0.02] border border-white/5 border-l-4 border-l-cyan-400 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:bg-[#0a0f23]/60 hover:border-l-cyan-300 group">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-secondary mb-2.5">
            💨 Wind Speed
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{windKmh} <span className="text-xs font-semibold text-brand-secondary">km/h</span></div>
          <div className="text-xs text-brand-secondary flex items-center gap-1.5 mt-2">
            <svg 
              className="w-4 h-4 fill-brand-blue transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" 
              viewBox="0 0 24 24"
              style={{ transform: `rotate(${data.wind.deg}deg)` }}
            >
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
            <span className="font-semibold text-brand-primary">{windDir}</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white/[0.02] border border-white/5 border-l-4 border-l-purple-500 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:bg-[#0a0f23]/60 hover:border-l-purple-400 group">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-secondary mb-2.5">
            👁️ Visibility
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{visibilityKm} <span className="text-xs font-semibold text-brand-secondary">km</span></div>
          <div className="text-xs text-brand-secondary mt-2 font-semibold">Clear view</div>
        </div>

        {/* Pressure */}
        <div className="bg-white/[0.02] border border-white/5 border-l-4 border-l-pink-500 rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:bg-[#0a0f23]/60 hover:border-l-pink-400 group">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-secondary mb-2.5">
            🌡️ Pressure / UV
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{data.main.pressure} <span className="text-xs font-semibold text-brand-secondary">hPa</span></div>
          <div className="text-xs text-brand-secondary mt-2 font-semibold">
            UV Index: <span className="text-brand-secondary/60">—</span>
          </div>
        </div>
      </div>
    </section>
  );
}
