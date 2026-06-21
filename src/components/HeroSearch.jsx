import React, { useState } from 'react';

export default function HeroSearch({ onSearch, isLoading }) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim() !== '') {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (city) => {
    setInputVal(city);
    onSearch(city);
  };

  // Popular cities array with country flag emojis
  const popularCities = [
    { name: 'Lahore', flag: '🇵🇰' },
    { name: 'London', flag: '🇬🇧' },
    { name: 'New York', flag: '🇺🇸' },
    { name: 'Tokyo', flag: '🇯🇵' },
    { name: 'Dubai', flag: '🇦🇪' }
  ];

  return (
    <section className="text-center py-14 px-4 flex flex-col items-center select-none relative z-10">
      {/* Subtle radial glow behind heading */}
      <div 
        className="absolute w-[450px] h-[250px] rounded-full blur-[90px] -z-10 top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
        }}
      ></div>

      <h2 className="text-xs font-bold tracking-[0.25em] text-brand-purple/90 uppercase mb-3.5">
        WeatherWave Platform
      </h2>
      
      <h1 className="text-4xl sm:text-[3rem] font-extrabold text-white tracking-tighter leading-[1.08] mb-8 max-w-3xl">
        Discover the weather <br />
        <span className="bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
          anywhere in the world.
        </span>
      </h1>

      <div className="w-full max-w-[550px] relative">
        {/* Input border background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 rounded-full blur-md opacity-75"></div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-[#0d1226]/50 border border-white/5 rounded-[50px] p-1.5 pl-6 focus-within:border-brand-blue/40 focus-within:ring-[3px] focus-within:ring-brand-blue/25 transition-all duration-300">
            <svg 
              className="w-5 h-5 fill-brand-secondary/80 mr-3 transition-colors duration-300 group-focus-within:fill-brand-blue shrink-0" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="bg-transparent border-none outline-none text-brand-primary text-sm font-normal w-full pr-2 placeholder:text-brand-secondary/60" 
              placeholder="Search a city..." 
              required 
              aria-label="Search city weather"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-xs py-3 px-7 rounded-full cursor-pointer flex items-center gap-2 disabled:opacity-50 transition-all duration-300"
            >
              {isLoading && (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/20 rounded-full border-t-white border-r-white/40 animate-spin"></span>
              )}
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Popular Cities Chips (hidden on mobile) */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2 mt-6" aria-label="Popular cities quick search">
        {popularCities.map((city) => (
          <button 
            key={city.name}
            type="button" 
            onClick={() => handleChipClick(city.name)}
            className="bg-white/[0.03] border border-white/5 text-brand-secondary py-1.5 px-4 rounded-full text-xs font-semibold hover:bg-gradient-to-r hover:from-brand-blue hover:to-[#6366f1] hover:text-white hover:border-transparent transition-all duration-200 ease-out cursor-pointer"
          >
            <span className="mr-1.5">{city.flag}</span>
            <span>{city.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
