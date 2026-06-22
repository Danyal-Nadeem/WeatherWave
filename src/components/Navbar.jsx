import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [timeStr, setTimeStr] = useState('00:00:00 AM');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      const secStr = seconds < 10 ? '0' + seconds : seconds;
      
      setTimeStr(`${hours}:${minStr}:${secStr} ${ampm}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-[68px] bg-[#060814]/40 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-6 md:px-8 shadow-sm">
      {/* Animated gradient bottom underline */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#38bdf8] via-[#6366f1] via-[#a78bfa] to-[#38bdf8] bg-[length:200%_100%] animate-shimmer-border shadow-[0_2px_14px_rgba(56,189,248,0.85)]"></div>
      
      <a href="#" className="flex items-center gap-2.5 decoration-none select-none" aria-label="WeatherWave homepage">
        {/* Custom wave + droplet SVG */}
        <svg className="w-6 h-6 shrink-0 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wave-droplet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path d="M12 2C12 2 6 8.5 6 13C6 16.3137 8.68629 19 12 19C15.3137 19 18 16.3137 18 13C18 8.5 12 2 12 2Z" fill="url(#wave-droplet-grad)" />
          <path d="M7 14C9.5 16 11 13.5 13.5 14.5C16 15.5 16.5 13.5 17 13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
          WeatherWave
        </span>
      </a>
      
      <div className="flex items-center gap-3.5">
        {/* Operational badge with soft outer glow pulse */}
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 py-1 px-3 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
          </span>
          <span className="hidden sm:inline text-[9px] font-extrabold text-emerald-400 tracking-widest uppercase">API Live</span>
        </div>

        {/* Monospace Digital Clock */}
        <div className="text-xs font-mono font-medium text-brand-primary bg-white/5 border border-white/5 py-1.5 px-3.5 rounded-xl tracking-wider select-none">
          {timeStr}
        </div>
        
        <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/15 py-1 px-2.5 rounded-lg select-none">
          °C
        </span>
      </div>
    </header>
  );
}
