import React from 'react';

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

function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export default function ExtraDetails({ data }) {
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const offset = data.timezone;
  const currentEpoch = data.dt;

  const sunriseStr = formatTimeFromOffset(sunrise, offset);
  const sunsetStr = formatTimeFromOffset(sunset, offset);

  // Day Length
  const durationSec = sunset - sunrise;
  const dayLengthHours = Math.floor(durationSec / 3600);
  const dayLengthMins = Math.floor((durationSec % 3600) / 60);

  // Golden Hour (approx last hour before sunset)
  const eveningGoldenStart = sunset - 3600;
  const goldenStr = `${formatTimeFromOffset(eveningGoldenStart, offset)} - ${sunsetStr}`;

  // Sun Daylight progress percentage
  const totalDaylightSec = sunset - sunrise;
  const currentProgressSec = currentEpoch - sunrise;
  let pct = 0;
  if (currentProgressSec > 0 && currentProgressSec < totalDaylightSec) {
    pct = currentProgressSec / totalDaylightSec;
  } else if (currentEpoch >= sunset) {
    pct = 1;
  }

  // Dashoffset calculation (circumference of radius 40 half-circle is ~125.6)
  const dashLength = 126;
  const offsetDash = dashLength - (pct * dashLength);

  // Calculate coordinates for Sun dot on progress arc (degrees from 180 to 0)
  const angleRad = Math.PI - (pct * Math.PI);
  const sunCx = 50 + 40 * Math.cos(angleRad);
  const sunCy = 45 - 40 * Math.sin(angleRad);

  // Wind Rose metrics
  const windKmh = (data.wind.speed * 3.6).toFixed(1);
  const windDegree = data.wind.deg || 0;
  const cardinalDir = getWindDirection(windDegree);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
      
      {/* Sun Position Card */}
      <section 
        className="p-6 flex flex-col justify-between hover:border-white/10 transition-colors duration-300 relative overflow-hidden rounded-3xl"
        style={{ 
          background: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.05) 0%, transparent 60%), rgba(10, 15, 30, 0.55)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          borderRight: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
        }}
      >
        <h2 className="text-sm md:text-base font-extrabold text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2.5 select-none">
          {/* Accent dot rounded rect */}
          <span className="w-[4px] h-4.5 bg-gradient-to-b from-[#60a5fa] to-[#a78bfa] rounded-full shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
          Sun Position
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-6 items-center h-full">
          <div className="flex flex-col gap-3">
            <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl flex items-center gap-3">
              <span className="text-xl">☀️</span>
              <div>
                <div className="text-[9px] text-brand-secondary font-extrabold uppercase tracking-wider">
                  Golden Hour
                </div>
                <div className="text-xs font-bold text-white mt-0.5">{goldenStr}</div>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl flex items-center gap-3">
              <span className="text-xl">🌇</span>
              <div>
                <div className="text-[9px] text-brand-secondary font-extrabold uppercase tracking-wider">
                  Sunset
                </div>
                <div className="text-xs font-bold text-white mt-0.5">{sunsetStr}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[140px]">
            <div className="w-full max-w-[150px] relative">
              <svg className="w-full h-auto overflow-visible" viewBox="0 0 100 50">
                {/* Arc path background */}
                <path d="M 10 45 A 40 40 0 0 1 90 45" className="fill-none stroke-white/10 stroke-[2] stroke-dasharray-[3_3]" />
                
                {/* Arc progress with yellow-orange-red gradient */}
                <path 
                  d="M 10 45 A 40 40 0 0 1 90 45" 
                  className="fill-none stroke-[3] stroke-linecap-round transition-all duration-[1s]" 
                  style={{
                    stroke: 'url(#sun-stroke-gradient)',
                    strokeDasharray: dashLength,
                    strokeDashoffset: offsetDash
                  }}
                />
                
                <defs>
                  <linearGradient id="sun-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                
                {/* 12px Yellow Sun Dot with Outer Glow Ring */}
                <circle cx={sunCx} cy={sunCy} r="10" className="fill-[#fbbf24] opacity-25 animate-pulse" />
                <circle 
                  cx={sunCx} 
                  cy={sunCy} 
                  r="6" 
                  className="fill-[#fbbf24] drop-shadow-[0_0_8px_#fbbf24] transition-all duration-[1s]" 
                />
              </svg>
              
              {/* Endpoint time labels inside the arc */}
              <div className="flex justify-between w-full text-[9px] font-bold text-brand-secondary/70 px-1.5 mt-1">
                <span>{sunriseStr}</span>
                <span>{sunsetStr}</span>
              </div>
            </div>

            <div className="text-center mt-3">
              <div className="text-[10px] uppercase font-bold text-brand-secondary tracking-widest">
                Day Length
              </div>
              <div className="text-[1.5rem] font-extrabold text-white mt-0.5 tracking-tight">
                {dayLengthHours}h {dayLengthMins}m
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wind Details Card */}
      <section className="premium-glass p-6 flex flex-col justify-between hover:border-white/10 transition-colors duration-300 relative overflow-hidden">
        <h2 className="text-sm md:text-base font-extrabold text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2.5 select-none">
          {/* Accent dot rounded rect */}
          <span className="w-[4px] h-4.5 bg-gradient-to-b from-[#60a5fa] to-[#a78bfa] rounded-full shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
          Wind Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-6 items-center h-full">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] text-brand-blue bg-brand-blue/10 border border-brand-blue/15 py-1 px-3.5 rounded-full font-bold uppercase tracking-wider">
                {cardinalDir} Direction
              </span>
              <div className="text-lg font-bold text-white mt-3">
                Angle: <span className="font-extrabold text-brand-purple">{windDegree}°</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-brand-secondary font-extrabold uppercase tracking-widest">
                Wind Velocity
              </div>
              <div className="text-[2rem] font-black text-white mt-1 tracking-tighter leading-none">
                {windKmh} <span className="text-sm font-semibold text-brand-secondary tracking-normal">km/h</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <svg className="w-full max-w-[130px] h-auto overflow-visible" viewBox="0 0 100 100">
              {/* Outer Ring: Dashed border */}
              <circle cx="50" cy="50" r="46" className="fill-none stroke-white/10 stroke-1 stroke-dasharray-[3_3]" />
              {/* Inner Ring: Solid filled circle */}
              <circle cx="50" cy="50" r="40" className="fill-white/[0.04] stroke-white/5 stroke-1" />
              
              {/* 45-degree Tick Marks */}
              {Array.from({ length: 8 }).map((_, idx) => {
                const angle = (idx * 45 * Math.PI) / 180;
                const innerR = 36;
                const outerR = 40;
                const x1 = 50 + innerR * Math.cos(angle);
                const y1 = 50 + innerR * Math.sin(angle);
                const x2 = 50 + outerR * Math.cos(angle);
                const y2 = 50 + outerR * Math.sin(angle);
                return (
                  <line 
                    key={idx} 
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    className="stroke-white/20 stroke-[1px]"
                  />
                );
              })}

              {/* Cardinal Labels */}
              <text x="50" y="14" className="text-[10px] font-extrabold fill-brand-primary" textAnchor="middle">N</text>
              <text x="84" y="53.5" className="text-[10px] font-extrabold fill-brand-primary" textAnchor="middle">E</text>
              <text x="50" y="89" className="text-[10px] font-extrabold fill-brand-primary" textAnchor="middle">S</text>
              <text x="16" y="53.5" className="text-[10px] font-extrabold fill-brand-primary" textAnchor="middle">W</text>
              
              {/* Intercardinal Labels */}
              <text x="73" y="30" className="text-[7px] font-bold fill-brand-secondary/60" textAnchor="middle">NE</text>
              <text x="73" y="74" className="text-[7px] font-bold fill-brand-secondary/60" textAnchor="middle">SE</text>
              <text x="27" y="74" className="text-[7px] font-bold fill-brand-secondary/60" textAnchor="middle">SW</text>
              <text x="27" y="30" className="text-[7px] font-bold fill-brand-secondary/60" textAnchor="middle">NW</text>
              
              {/* High Precision Pointer Needle */}
              <g 
                className="transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `rotate(${windDegree}deg)`, transformOrigin: '50px 50px' }}
              >
                <defs>
                  <linearGradient id="needle-red-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                {/* Red North Half pointer */}
                <polygon points="50,14 54,50 46,50" className="fill-[url(#needle-red-grad)] drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                {/* Thin White South Half pointer */}
                <polygon points="50,86 52,50 48,50" className="fill-white/30" />
                {/* Center dot with blue shadow glow */}
                <circle cx="50" cy="50" r="4.5" className="fill-white drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
              </g>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
