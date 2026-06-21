import React, { useRef } from 'react';

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

function getTempDotColor(temp) {
  if (temp > 35) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  if (temp >= 25) return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
  return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]';
}

export default function HourlyForecast({ forecastData }) {
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);

  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftVal.current = el.scrollLeft;
    el.style.scrollBehavior = 'auto';
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseMove = (e) => {
    const el = scrollRef.current;
    if (!el || !isDown.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 2;
    el.scrollLeft = scrollLeftVal.current - walk;
  };

  const nextSlots = forecastData.list.slice(0, 8);

  return (
    <section className="w-full">
      <h2 className="text-sm md:text-base font-extrabold text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2.5 select-none">
        {/* Accent dot rounded rect */}
        <span className="w-[4px] h-4.5 bg-gradient-to-b from-[#60a5fa] to-[#a78bfa] rounded-full shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
        Today's Hourly Forecast
      </h2>
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 cursor-grab active:cursor-grabbing select-none scroll-hide snap-x snap-mandatory"
      >
        {nextSlots.map((slot, index) => {
          const timeStr = formatTimeFromOffset(slot.dt, forecastData.city.timezone);
          const temp = Math.round(slot.main.temp);
          const iconCode = slot.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          const desc = slot.weather[0].description;
          const isNow = index === 0; // First slot represents "NOW"

          return (
            <div 
              key={slot.dt}
              className={`min-w-[110px] shrink-0 p-5 text-center rounded-2xl snap-start transition-all duration-300 relative overflow-hidden group ${
                isNow 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-brand-blue/40 shadow-[0_8px_20px_rgba(96,165,250,0.12)]' 
                  : index % 2 === 0 
                    ? 'bg-white/[0.01] border border-white/5 hover:border-brand-blue/20 hover:bg-white/[0.04]' 
                    : 'bg-white/[0.03] border border-white/5 hover:border-brand-blue/20 hover:bg-white/[0.06]'
              }`}
            >
              {isNow && (
                <div className="text-[8px] font-extrabold uppercase tracking-widest text-brand-blue mb-1">
                  NOW
                </div>
              )}
              <div className="text-[10px] font-bold text-brand-secondary group-hover:text-brand-purple/80 transition-colors duration-300 mb-2">
                {timeStr}
              </div>
              <img className="w-12 h-12 mx-auto object-contain drop-shadow-sm" src={iconUrl} alt={desc} />
              
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${getTempDotColor(temp)}`}></span>
                <span className="text-base font-bold text-white">{temp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
