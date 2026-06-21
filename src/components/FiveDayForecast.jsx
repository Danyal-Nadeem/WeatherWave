import React from 'react';

const getCardBg = (index) => {
  const tints = [
    'rgba(99, 102, 241, 0.08)',  // Indigo
    'rgba(139, 92, 246, 0.08)',  // Purple
    'rgba(236, 72, 153, 0.08)',  // Pink
    'rgba(20, 184, 166, 0.08)',  // Teal
    'rgba(59, 130, 246, 0.08)'   // Blue
  ];
  return tints[index % tints.length];
};

const getAccentTextClass = (index) => {
  const classes = [
    'text-[#818cf8]',
    'text-[#a78bfa]',
    'text-[#f472b6]',
    'text-[#2dd4bf]',
    'text-[#60a5fa]'
  ];
  return classes[index % classes.length];
};

const getAccentBorderClass = (index) => {
  const classes = [
    'hover:border-[#818cf8]/45',
    'hover:border-[#a78bfa]/45',
    'hover:border-[#f472b6]/45',
    'hover:border-[#2dd4bf]/45',
    'hover:border-[#60a5fa]/45'
  ];
  return classes[index % classes.length];
};

export default function FiveDayForecast({ forecastData, selectedDay, onSelectDay }) {
  const offsetSec = forecastData.city.timezone;
  const localTimeNow = Date.now() + (offsetSec * 1000);
  const todayStr = new Date(localTimeNow).toISOString().split('T')[0];

  // Group forecast list by date (robust selector)
  const dailyMap = new Map();
  forecastData.list.forEach(item => {
    const dateStr = item.dt_txt.split(' ')[0];
    if (dateStr === todayStr) return; // Skip current local day

    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);

    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, item);
    } else {
      const existingItem = dailyMap.get(dateStr);
      const existingHour = parseInt(existingItem.dt_txt.split(' ')[1].split(':')[0]);
      if (Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
        dailyMap.set(dateStr, item);
      }
    }
  });

  const filteredDays = Array.from(dailyMap.values()).slice(0, 5);

  return (
    <section>
      <h2 className="text-sm md:text-base font-extrabold text-white/90 uppercase tracking-wider mb-4 flex items-center gap-2.5 select-none">
        {/* Accent dot rounded rect */}
        <span className="w-[4px] h-4.5 bg-gradient-to-b from-[#60a5fa] to-[#a78bfa] rounded-full shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
        5-Day Forecast
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scroll-hide md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
        {filteredDays.map((day, index) => {
          const rawDate = new Date((day.dt + offsetSec) * 1000);
          
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayLabel = days[rawDate.getUTCDay()];
          
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const dateLabel = `${months[rawDate.getUTCMonth()]} ${rawDate.getUTCDate()}`;

          const iconCode = day.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          const tempHigh = Math.round(day.main.temp_max);
          const tempLow = Math.round(day.main.temp_min);
          const description = day.weather[0].description;
          const humidity = day.main.humidity;

          const isSelected = selectedDay && selectedDay.dt === day.dt;
          const cardBg = getCardBg(index);
          const accentText = getAccentTextClass(index);
          const accentBorder = getAccentBorderClass(index);

          return (
            <div 
              key={day.dt}
              onClick={() => onSelectDay(isSelected ? null : day)}
              style={{
                backgroundColor: isSelected ? 'rgba(10, 15, 30, 0.85)' : cardBg,
                borderColor: isSelected ? 'rgba(96, 165, 250, 0.55)' : 'rgba(255, 255, 255, 0.05)'
              }}
              className={`min-w-[140px] md:min-w-0 flex-1 border rounded-2.5xl p-5 text-center flex flex-col justify-between items-center transition-all duration-300 cursor-pointer relative overflow-hidden select-none ${accentBorder} ${
                isSelected ? 'scale-[1.02]' : ''
              }`}
            >
              <div>
                {/* Day name is the most prominent element */}
                <div className={`text-[1.05rem] font-extrabold tracking-tight ${accentText}`}>
                  {dayLabel}
                </div>
                <div className="text-[10px] font-bold text-brand-secondary/80 mt-0.5">{dateLabel}</div>
              </div>
              
              <img className="w-[60px] h-[60px] my-2.5 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)]" src={iconUrl} alt={description} />
              
              <div className="w-full">
                {/* Visual temperature range bar slider */}
                <div className="flex items-center gap-2 text-xs w-full justify-center mt-1.5 bg-white/5 py-1.5 px-2.5 rounded-xl border border-white/5">
                  <span className="font-semibold text-brand-secondary">{tempLow}°</span>
                  <div className="h-1 bg-white/10 rounded-full relative overflow-hidden flex-1 max-w-[44px]">
                    <div 
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                      style={{ left: '15%', right: '15%' }}
                    ></div>
                  </div>
                  <span className="font-bold text-white">{tempHigh}°</span>
                </div>

                <div className="text-[10px] text-brand-secondary font-semibold capitalize mt-2 truncate max-w-full" title={description}>
                  {description}
                </div>
                <div className="text-[10px] text-brand-blue font-bold mt-1.5 flex items-center justify-center gap-0.5">
                  <span>💧</span> {humidity}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
