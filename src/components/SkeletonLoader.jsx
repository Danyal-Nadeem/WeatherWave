import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 gap-6 animate-pulse" role="status" aria-label="Loading weather data">
      
      {/* Current Weather Card Skeleton */}
      <div className="glass-card-style p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8">
        <div className="flex flex-col justify-between h-[220px] md:h-auto">
          <div>
            <div className="h-8 w-44 bg-white/10 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-white/5 rounded mb-3"></div>
            <div className="h-6 w-24 bg-white/5 rounded-full mb-6"></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-16 w-36 bg-white/10 rounded-md"></div>
            <div className="h-20 w-20 rounded-full bg-white/5 shrink-0"></div>
          </div>
          <div className="h-4 w-28 bg-white/5 rounded mt-3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[90px]">
              <div className="h-3 w-16 bg-white/5 rounded mb-2"></div>
              <div className="h-6 w-20 bg-white/10 rounded"></div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Strip Skeleton */}
      <div className="w-full">
        <div className="h-4 w-40 bg-white/5 rounded mb-3"></div>
        <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 scroll-hide">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              className="min-w-[110px] shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-between h-[128px]"
            >
              <div className="h-3 w-10 bg-white/5 rounded"></div>
              <div className="h-9 w-9 rounded-full bg-white/5"></div>
              <div className="h-5 w-12 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Forecast Skeleton */}
      <div>
        <div className="h-4 w-32 bg-white/5 rounded mb-3"></div>
        <div className="flex gap-3 overflow-x-auto pb-4 scroll-hide md:grid md:grid-cols-5 md:gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i}
              className="min-w-[140px] md:min-w-0 flex-1 bg-white/[0.02] border border-white/5 rounded-2.5xl p-5 flex flex-col justify-between items-center h-[195px]"
            >
              <div className="h-4 w-12 bg-white/10 rounded"></div>
              <div className="h-3 w-10 bg-white/5 rounded mt-1"></div>
              <div className="h-12 w-12 rounded-full bg-white/5 my-2"></div>
              <div className="w-full flex flex-col items-center gap-1.5">
                <div className="h-4 w-16 bg-white/10 rounded"></div>
                <div className="h-3 w-14 bg-white/5 rounded"></div>
                <div className="h-3 w-10 bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Details Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card-style p-6 h-[200px] flex flex-col justify-between">
            <div className="h-4 w-24 bg-white/5 rounded mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center h-full">
              <div className="flex flex-col gap-3">
                <div className="h-10 w-full bg-white/[0.02] border border-white/5 rounded-xl"></div>
                <div className="h-10 w-full bg-white/[0.02] border border-white/5 rounded-xl"></div>
              </div>
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-white/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
