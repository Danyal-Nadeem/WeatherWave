import React, { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ target, suffix = '', inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const parsedTarget = parseFloat(target);
    if (isNaN(parsedTarget)) return;

    let start = 0;
    const duration = 1600; // 1.6 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Decelerating ease-out curve
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * parsedTarget;

      if (target.includes('.')) {
        setCount(currentValue.toFixed(1));
      } else {
        setCount(Math.floor(currentValue));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function LandingPage({ onEnter }) {
  const canvasRef = useRef(null);
  const statsRef = useRef(null);
  const [inViewStats, setInViewStats] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Auto rotate carousel every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Stars & Shooting Star Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize stars (0.3 - 2px)
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.7 + 0.3,
      opacity: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1
    }));

    // Shooting star config
    let shootingStar = null;
    const createShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.7,
        y: Math.random() * height * 0.25,
        dx: Math.random() * 4 + 4,
        dy: Math.random() * 2 + 2,
        length: Math.random() * 70 + 40,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 40 + 25
      };
    };

    let nextShootingStarTime = Date.now() + Math.random() * 3000 + 2000;

    const draw = () => {
      // Clear black base
      ctx.fillStyle = '#000308';
      ctx.fillRect(0, 0, width, height);

      // Render starfield
      stars.forEach((star) => {
        star.opacity += star.speed * star.twinkleDir;
        if (star.opacity >= 0.9) {
          star.opacity = 0.9;
          star.twinkleDir = -1;
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.twinkleDir = 1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render shooting star
      const now = Date.now();
      if (!shootingStar && now > nextShootingStarTime) {
        createShootingStar();
      }

      if (shootingStar) {
        shootingStar.x += shootingStar.dx;
        shootingStar.y += shootingStar.dy;
        shootingStar.life++;
        shootingStar.opacity = 1 - (shootingStar.life / shootingStar.maxLife);

        if (shootingStar.opacity <= 0) {
          shootingStar = null;
          nextShootingStarTime = Date.now() + Math.random() * 4000 + 4000;
        } else {
          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.dx * 3,
            shootingStar.y - shootingStar.dy * 3
          );
          grad.addColorStop(0, `rgba(147, 197, 253, ${shootingStar.opacity})`);
          grad.addColorStop(1, 'rgba(147, 197, 253, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.dx * 2,
            shootingStar.y - shootingStar.dy * 2
          );
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // IntersectionObserver for scroll-triggered entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target === statsRef.current) {
              setInViewStats(true);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Carousel Cards details
  const carouselCards = [
    {
      city: 'Lahore, PK',
      temp: '41°C',
      desc: 'Clear Sky',
      icon: (
        <svg className="w-16 h-16 mx-auto overflow-visible" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            <filter id="sun-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="22" fill="#fbbf24" fillOpacity="0.15" className="animate-pulse" />
          <circle cx="50" cy="50" r="16" fill="url(#sun-core)" filter="url(#sun-glow)" />
          <g className="animate-spin" style={{ transformOrigin: '50px 50px', animationDuration: '16s' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="50" y1="18" x2="50" y2="28"
                className="stroke-[#fbbf24] stroke-[3.5] stroke-linecap-round"
                style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: '50px 50px' }}
              />
            ))}
          </g>
        </svg>
      )
    },
    {
      city: 'London, UK',
      temp: '18°C',
      desc: 'Moderate Rain',
      icon: (
        <svg className="w-16 h-16 mx-auto overflow-visible" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="carousel-cloud" x1="20" y1="20" x2="80" y2="80">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="rain-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M32 62h36c4.97 0 9-4.03 9-9s-4.03-9-9-9c-0.34 0-0.79.03-1.12.08C65.2 38.08 59.8 33.8 52.7 33.8c-4.95 0-9.22 2.6-11.7 6.5C39.77 39.9 37.07 39.5 34.25 39.5c-6.19 0-11.25 5.07-11.25 11.25S25.8 62 32 62z" 
                fill="url(#carousel-cloud)" stroke="#cbd5e1" strokeWidth="1.2" strokeOpacity="0.5" className="animate-cloud-float" />
          <line x1="34" y1="67" x2="31" y2="76" stroke="url(#rain-grad)" strokeWidth="3" strokeLinecap="round" className="animate-rain-drop-1" />
          <line x1="50" y1="70" x2="47" y2="79" stroke="url(#rain-grad)" strokeWidth="3" strokeLinecap="round" className="animate-rain-drop-2" />
          <line x1="66" y1="67" x2="63" y2="76" stroke="url(#rain-grad)" strokeWidth="3" strokeLinecap="round" className="animate-rain-drop-3" />
        </svg>
      )
    },
    {
      city: 'Helsinki, FI',
      temp: '-2°C',
      desc: 'Snowing',
      icon: (
        <svg className="w-16 h-16 mx-auto overflow-visible" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="carousel-cloud-snow" x1="20" y1="20" x2="80" y2="80">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.15" />
            </linearGradient>
            <filter id="snow-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M32 62h36c4.97 0 9-4.03 9-9s-4.03-9-9-9c-0.34 0-0.79.03-1.12.08C65.2 38.08 59.8 33.8 52.7 33.8c-4.95 0-9.22 2.6-11.7 6.5C39.77 39.9 37.07 39.5 34.25 39.5c-6.19 0-11.25 5.07-11.25 11.25S25.8 62 32 62z" 
                fill="url(#carousel-cloud-snow)" stroke="#f1f5f9" strokeWidth="1.2" strokeOpacity="0.6" />
          <g filter="url(#snow-glow)">
            <circle cx="34" cy="70" r="2.5" fill="#f1f5f9" fillOpacity="0.9" className="animate-rain-drop-2" />
            <circle cx="50" cy="75" r="2.5" fill="#f1f5f9" fillOpacity="0.9" className="animate-rain-drop-1" />
            <circle cx="66" cy="69" r="2.5" fill="#f1f5f9" fillOpacity="0.9" className="animate-rain-drop-3" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#000308] text-[#f8fafc]">
      {/* Background Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Decorative Nebula Blurs (Apple Aura Style) */}
      <div className="fixed top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none z-0 animate-aurora-1"></div>
      <div className="fixed top-[-5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-950/12 blur-[100px] pointer-events-none z-0 animate-aurora-2"></div>
      <div className="fixed bottom-[-15%] left-[30%] w-[500px] h-[500px] rounded-full bg-pink-950/10 blur-[140px] pointer-events-none z-0 animate-aurora-3"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between px-4 py-8 text-center">
        {/* Background Dot Grid + Lines for high-tech premium feel */}
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none z-0"></div>
        <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none z-0"></div>

        {/* Ambient radial glow centered behind heading */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/8 via-indigo-500/8 to-purple-500/8 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '6s' }}></div>
        
        {/* Empty space/spacer */}
        <div></div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          {/* Top Pill Badge with live pulse dot */}
          <div className="animate-fade-in-up animation-delay-0 inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/25 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase select-none mb-8 shadow-[0_4px_20px_rgba(59,130,246,0.12)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
            </span>
            <span className="text-[9px] tracking-widest font-extrabold uppercase">Now with real-time forecasts</span>
          </div>

          {/* Heading with shifting text gradient */}
          <h1 className="text-4xl sm:text-[4.2rem] font-extrabold tracking-tight leading-[1.1] text-white max-w-[800px] mb-8 select-none">
            <span className="block opacity-0 animate-word-blur-in text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Discover the weather
            </span>
            <span className="block bg-gradient-to-r from-[#38bdf8] via-[#818cf8] via-[#c084fc] to-[#38bdf8] bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift opacity-0 animate-word-blur-in animation-delay-200 drop-shadow-[0_8px_24px_rgba(99,102,241,0.2)]">
              anywhere in the world.
            </span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up animation-delay-400 text-sm sm:text-base font-semibold text-[#f8fafc]/55 max-w-[500px] mx-auto leading-relaxed mb-9 select-none">
            A premium weather intelligence platform. Real-time data, beautiful visualizations, forecasts you can trust.
          </p>

          {/* 3D Carousel Showcase widget */}
          <div className="animate-fade-in-up animation-delay-100 flex items-center justify-center w-full min-h-[170px] mb-10 carousel-3d-container relative">
            {carouselCards.map((card, idx) => {
              const isActive = idx === carouselIndex;
              const isNext = idx === (carouselIndex + 1) % 3;
              const isPrev = idx === (carouselIndex + 2) % 3;

              let transformStyle = '';
              let opacity = 0;
              let zIndex = 0;
              let filter = 'blur(4px)';

              if (isActive) {
                transformStyle = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
                opacity = 1;
                zIndex = 10;
                filter = 'none';
              } else if (isNext) {
                transformStyle = 'translate3d(120%, 0, -120px) scale(0.8) rotateY(-18deg)';
                opacity = 0.45;
                zIndex = 5;
              } else if (isPrev) {
                transformStyle = 'translate3d(-120%, 0, -120px) scale(0.8) rotateY(18deg)';
                opacity = 0.45;
                zIndex = 5;
              }

              let borderStyle = 'border-white/5';
              let glowStyle = 'shadow-[0_15px_35px_rgba(0,0,0,0.6)]';
              
              if (isActive) {
                if (idx === 0) { // Lahore (Sun/Warm)
                  borderStyle = 'border-amber-500/35';
                  glowStyle = 'shadow-[0_20px_50px_rgba(245,158,11,0.25),_0_0_25px_rgba(245,158,11,0.1),_inset_0_1px_1px_rgba(255,255,255,0.15)]';
                } else if (idx === 1) { // London (Rain/Cloud)
                  borderStyle = 'border-blue-500/35';
                  glowStyle = 'shadow-[0_20px_50px_rgba(59,130,246,0.22),_0_0_25px_rgba(59,130,246,0.12),_inset_0_1px_1px_rgba(255,255,255,0.15)]';
                } else { // Helsinki (Snow)
                  borderStyle = 'border-sky-400/40';
                  glowStyle = 'shadow-[0_20px_50px_rgba(56,189,248,0.25),_0_0_25px_rgba(56,189,248,0.12),_inset_0_1px_1px_rgba(255,255,255,0.2)]';
                }
              }

              return (
                <div
                  key={idx}
                  style={{ transform: transformStyle, opacity, zIndex, filter }}
                  className={`absolute w-[260px] p-6 rounded-3xl premium-glass backdrop-blur-2xl carousel-3d-card flex flex-col items-center select-none border transition-all duration-500 ${borderStyle} ${glowStyle}`}
                >
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {card.city}
                  </span>
                  
                  {card.icon}
                  
                  <div className="text-3xl font-extrabold text-white mt-2.5 leading-none tracking-tight">
                    {card.temp}
                  </div>
                  
                  <div className={`mt-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    idx === 0 ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                    idx === 1 ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                    'bg-sky-400/10 text-sky-300 border-sky-400/20'
                  }`}>
                    {card.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Primary CTA button (DOES NOT translate upward on hover) */}
          <div className="animate-fade-in-up animation-delay-100 relative z-10 flex flex-col items-center">
            <button
              onClick={onEnter}
              className="group w-[320px] h-[58px] bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a855f7] bg-[length:200%_200%] animate-gradient-shift border-none rounded-full text-white text-[0.95rem] font-bold tracking-wide active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3.5 select-none"
            >
              <span>Launch Weather Dashboard</span>
              <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5 stroke-current fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-fade-in-up animation-delay-100 flex flex-col items-center gap-1.5 mt-8 select-none">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#f8fafc]/30">Scroll to explore</span>
          <svg className="w-5 h-5 text-[#f8fafc]/30 animate-bounce-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-24 scroll-animate">
        <div className="text-center mb-16 select-none">
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#a78bfa] uppercase mb-3">System Capabilities</h2>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Engineered for Precision</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="premium-glass p-8 border border-white/5 hover:border-blue-500/30 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)] rounded-3xl select-none scroll-animate scroll-delay-100 flex flex-col justify-between h-full transition-all duration-300">
            <div>
              <div className="w-[68px] h-[68px] rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                {/* High-Fidelity Custom Globe SVG */}
                <svg className="w-9 h-9 text-blue-400 overflow-visible animate-pulse" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '4s' }}>
                  <defs>
                    <linearGradient id="globe-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="orbit-grad" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle cx="16" cy="16" r="14" stroke="url(#globe-grad)" strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx="16" cy="16" r="11" fill="url(#globe-grad)" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M16 5V27M5 16H27" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.4" />
                  <path d="M9 10C12 14 12 18 9 22M23 10C20 14 20 18 23 22" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3" />
                  <ellipse cx="16" cy="16" rx="11" ry="5.5" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.45" />
                  <path d="M3 16A13 13 0 1 1 29 16" stroke="url(#orbit-grad)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="21" cy="11" r="2.5" fill="#60a5fa" />
                  <circle cx="21" cy="11" r="5" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.5" className="animate-ping" style={{ transformOrigin: '21px 11px' }} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🌍 Global Coverage</h3>
              <p className="text-xs font-medium text-[#f8fafc]/50 leading-relaxed">
                Search any city worldwide. Real-time data updated every 10 minutes from accurate global channels.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="premium-glass p-8 border border-white/5 hover:border-indigo-500/30 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] rounded-3xl select-none scroll-animate scroll-delay-200 flex flex-col justify-between h-full transition-all duration-300">
            <div>
              <div className="w-[68px] h-[68px] rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                {/* High-Fidelity Custom Glassmorphic Cloud & Lightning SVG */}
                <svg className="w-10 h-10 text-indigo-400 overflow-visible" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="cloud-fill" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="bolt-grad" x1="16" y1="8" x2="13" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path d="M10 20C7.23858 20 5 17.7614 5 15C5 12.5657 6.73241 10.5367 9.05105 10.0931C9.69534 7.20015 12.2476 5 15.3 5C18.9959 5 22.0833 7.64023 22.7 11.13C24.6 11.45 26 13.06 26 15C26 17.2091 24.2091 19 22 19" 
                        fill="url(#cloud-fill)" stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.65" className="animate-cloud-float" />
                  <polygon points="17 8 10 18 15 18 12 28 21 16 16 16" 
                           fill="url(#bolt-grad)" filter="url(#neon-glow)" stroke="#c084fc" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">⚡ Instant Forecasts</h3>
              <p className="text-xs font-medium text-[#f8fafc]/50 leading-relaxed">
                Unlock 5-day forecasts with snap hourly segments, heat dot visual indicators, and precise metrics.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="premium-glass p-8 border border-white/5 hover:border-pink-500/30 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(236,72,153,0.12)] rounded-3xl select-none scroll-animate scroll-delay-300 flex flex-col justify-between h-full transition-all duration-300">
            <div>
              <div className="w-[68px] h-[68px] rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6">
                {/* High-Fidelity Custom Compass Rose SVG */}
                <svg className="w-10 h-10 text-pink-400 overflow-visible" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="compass-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#db2777" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="needle-pink" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <circle cx="16" cy="16" r="13" stroke="url(#compass-ring)" strokeWidth="1.2" />
                  <line x1="16" y1="3" x2="16" y2="6" stroke="#f472b6" strokeWidth="1.5" />
                  <line x1="16" y1="26" x2="16" y2="29" stroke="#f472b6" strokeWidth="1.5" />
                  <line x1="3" y1="16" x2="6" y2="16" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="26" y1="16" x2="29" y2="16" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.6" />
                  <path d="M7 7L9 9M25 7L23 9M7 25L9 23M25 25L23 23" stroke="#f472b6" strokeWidth="1" strokeOpacity="0.5" />
                  <circle cx="16" cy="16" r="4.5" fill="#f472b6" fillOpacity="0.15" />
                  <g className="animate-spin" style={{ transformOrigin: '16px 16px', animationDuration: '9s' }}>
                    <polygon points="16,6 19,16 16,14" fill="url(#needle-pink)" stroke="#f472b6" strokeWidth="0.5" />
                    <polygon points="16,26 13,16 16,14" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
                    <circle cx="16" cy="16" r="2" fill="#ffffff" />
                  </g>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🧭 Wind & Sun Intel</h3>
              <p className="text-xs font-medium text-[#f8fafc]/50 leading-relaxed">
                Integrated high-precision compass rose coordinates, sunset progress sun arc, and day length trackers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE STATS BAR ================= */}
      <section ref={statsRef} className="relative z-10 w-full bg-white/[0.015] border-y border-white/5 py-12 scroll-animate select-none">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center items-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-[#818cf8] bg-clip-text">
              <AnimatedCounter target="200" suffix="+" inView={inViewStats} />
            </div>
            <div className="text-[10px] font-black text-[#f8fafc]/40 uppercase tracking-widest mt-2">Cities Covered</div>
          </div>
          <div className="border-l-0 sm:border-l md:border-white/5">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-[#818cf8] to-purple-400 bg-clip-text">
              <AnimatedCounter target="5" suffix="-Day" inView={inViewStats} />
            </div>
            <div className="text-[10px] font-black text-[#f8fafc]/40 uppercase tracking-widest mt-2">Extended Outlook</div>
          </div>
          <div className="border-l-0 md:border-l md:border-white/5">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              <AnimatedCounter target="100" suffix="%" inView={inViewStats} />
            </div>
            <div className="text-[10px] font-black text-[#f8fafc]/40 uppercase tracking-widest mt-2">Real-Time Sync</div>
          </div>
          <div className="border-l-0 sm:border-l md:border-white/5">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text">
              <AnimatedCounter target="99.9" suffix="%" inView={inViewStats} />
            </div>
            <div className="text-[10px] font-black text-[#f8fafc]/40 uppercase tracking-widest mt-2">Operational Uptime</div>
          </div>
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="relative z-10 w-full max-w-[1000px] mx-auto px-6 py-24 scroll-animate select-none">
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold tracking-[0.25em] text-pink-400 uppercase mb-3">Live Environment</h2>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">The High-Fidelity Interface</h2>
        </div>

        {/* Dashboard Mock HTML div */}
        <div className="premium-glass border border-white/10 rounded-2xl overflow-hidden mock-preview-tilt shadow-[0_40px_100px_rgba(99,102,241,0.2)]">
          {/* Chrome Top Bar */}
          <div className="w-full bg-[#070914] px-4 py-3 flex items-center border-b border-white/5">
            <div className="flex gap-1.5 mr-6 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
            </div>
            <div className="bg-white/5 rounded-md text-[10px] font-semibold text-[#f8fafc]/40 py-0.5 px-6 mx-auto select-none">
              weatherwave.platform
            </div>
          </div>

          {/* Simulated App Content */}
          <div className="bg-[#04060f]/95 p-6 flex flex-col gap-5 text-left">
            {/* Mock Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/5 select-none">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">WeatherWave</span>
                <span className="text-[7px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 tracking-wider px-1.5 py-0.5 rounded-full">API LIVE</span>
              </div>
              <div className="text-[10px] font-semibold text-[#f8fafc]/40">11:14:30 AM</div>
            </div>

            {/* Mock Main Weather Area */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-5 items-center select-none">
              <div>
                <div className="text-xl font-extrabold text-white leading-none">Lahore</div>
                <div className="text-[10px] font-semibold text-[#f8fafc]/40 mt-1">Clear Sky · Feels like 41°C</div>
                
                {/* Large Temp */}
                <div className="text-5xl font-black text-white mt-4 flex items-start">
                  41<span className="text-2xl font-light text-brand-secondary/40 relative -top-1.5">°</span>
                </div>
              </div>

              {/* Mock right metrics boxes grid */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="bg-white/[0.02] border border-white/5 border-l-2 border-l-blue-500 p-3 rounded-xl flex flex-col justify-between">
                  <div className="text-[#f8fafc]/45 uppercase font-bold tracking-wider">Humidity</div>
                  <div className="text-sm font-extrabold mt-1">23%</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 border-l-2 border-l-cyan-400 p-3 rounded-xl flex flex-col justify-between">
                  <div className="text-[#f8fafc]/45 uppercase font-bold tracking-wider">Wind</div>
                  <div className="text-sm font-extrabold mt-1">7.1 km/h</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 border-l-2 border-l-purple-500 p-3 rounded-xl flex flex-col justify-between">
                  <div className="text-[#f8fafc]/45 uppercase font-bold tracking-wider">Visibility</div>
                  <div className="text-sm font-extrabold mt-1">10.0 km</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 border-l-2 border-l-pink-500 p-3 rounded-xl flex flex-col justify-between">
                  <div className="text-[#f8fafc]/45 uppercase font-bold tracking-wider">Pressure</div>
                  <div className="text-sm font-extrabold mt-1">1002 hPa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="relative z-10 w-full px-6 py-24 text-center select-none scroll-animate">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Ready to explore the weather?</h2>
          <p className="text-sm font-semibold text-[#f8fafc]/40 max-w-[400px] mb-10 leading-relaxed">
            Join thousands of users tracking weather worldwide with dynamic HUD interfaces.
          </p>

          {/* Final CTA Button (DOES NOT translate upward on hover) */}
          <button
            onClick={onEnter}
            className="group w-[320px] h-[58px] bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a855f7] bg-[length:200%_200%] animate-gradient-shift border-none rounded-full text-white text-[0.95rem] font-bold tracking-wide active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3.5"
          >
            <span>Launch Weather Dashboard</span>
            <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5 stroke-current fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <span className="block mt-7 text-[9px] font-mono text-[#f8fafc]/30 tracking-widest uppercase uppercase-dots">
            Free to use · No signup required · Powered by OpenWeatherMap
          </span>
        </div>
      </section>
    </div>
  );
}
