import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import FiveDayForecast from './components/FiveDayForecast';
import ExtraDetails from './components/ExtraDetails';
import Toast from './components/Toast';
import SkeletonLoader from './components/SkeletonLoader';
import LandingPage from './components/LandingPage';
import './App.css';

// API Setup
const API_KEY = "9f75619c809674ea340390861fb1de6a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function isLocalNight(dt, sunrise, sunset) {
  return dt < sunrise || dt > sunset;
}

function getBackgroundTint(id, isNight) {
  if (id >= 200 && id < 300) return 'rgba(88, 28, 135, 0.15)'; // Thunderstorm - dark purple
  if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) return 'rgba(71, 85, 105, 0.15)'; // Rain/Drizzle - grey-blue
  if (id >= 600 && id < 700) return 'rgba(186, 230, 253, 0.06)'; // Snow - light blue-white
  if (id >= 700 && id < 800) return 'rgba(100, 116, 139, 0.12)'; // Mist/Atmosphere - greenish grey
  if (id === 800) return isNight ? 'rgba(30, 27, 75, 0.6)' : 'rgba(251, 191, 36, 0.04)'; // Clear Day/Night
  return 'rgba(100, 116, 139, 0.10)'; // Clouds - muted grey
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedForecastDay, setSelectedForecastDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [bgTint, setBgTint] = useState('transparent');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [curtainState, setCurtainState] = useState('');

  // Initial load
  useEffect(() => {
    fetchWeather("Lahore");
  }, []);

  const handleEnterDashboard = () => {
    // 1. Slide curtain up to cover landing page
    setCurtainState('active');

    // 2. Once curtain covers screen (650ms), toggle dashboard mount
    setTimeout(() => {
      setShowDashboard(true);

      // 3. Slide curtain out top to reveal dashboard
      setCurtainState('exit');

      // 4. Reset curtain state after slide completes
      setTimeout(() => {
        setCurtainState('');
      }, 650);
    }, 650);
  };



  // Update background tint dynamically based on selected day or current weather
  useEffect(() => {
    if (weather) {
      const activeData = selectedForecastDay || weather;
      const isNight = isLocalNight(activeData.dt, weather.sys.sunrise, weather.sys.sunset);
      setBgTint(getBackgroundTint(activeData.weather[0].id, isNight));
    }
  }, [weather, selectedForecastDay]);

  // Sync scroll to cards on data change
  useEffect(() => {
    if (weather && !isLoading && hasScrolled) {
      const timer = setTimeout(() => {
        const cardEl = document.getElementById('weather-card');
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [weather, isLoading, hasScrolled]);

  const fetchWeather = async (city) => {
    if (!city || city.trim() === "") return;

    if (API_KEY === "YOUR_KEY_HERE") {
      setToastMsg("Welcome to WeatherWave! Please edit src/App.jsx (line 12) and set your OpenWeatherMap API_KEY to view live weather forecasts.");
      return;
    }

    setIsLoading(true);
    setSelectedForecastDay(null); // Reset selection on new search

    const encodedCity = encodeURIComponent(city.trim());
    const currentUrl = `${BASE_URL}/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `${BASE_URL}/forecast?q=${encodedCity}&appid=${API_KEY}&units=metric`;

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      if (!currentRes.ok) {
        if (currentRes.status === 404) {
          throw new Error("City not found. Please try again.");
        } else {
          throw new Error(`Current weather failed: ${currentRes.statusText}`);
        }
      }
      if (!forecastRes.ok) {
        throw new Error(`Forecast request failed: ${forecastRes.statusText}`);
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      setWeather(currentData);
      setForecast(forecastData);

      setIsLoading(false);
      setHasScrolled(true);

    } catch (err) {
      setIsLoading(false);
      setToastMsg(err.message || "Something went wrong. Please check your API key or city spelling.");
    }
  };

  // Map display weather parameters dynamically if a forecast card is selected
  const displayWeather = selectedForecastDay ? {
    ...selectedForecastDay,
    name: weather.name,
    sys: {
      country: weather.sys.country,
      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset
    },
    timezone: weather.timezone,
    isForecastSelected: true
  } : weather;

  // Filter hourly slots to show only selected day forecast if selected
  const displayHourly = selectedForecastDay ? {
    ...forecast,
    list: forecast.list.filter(item => item.dt_txt.split(' ')[0] === selectedForecastDay.dt_txt.split(' ')[0])
  } : forecast;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#080b1a] via-[#0d1535] to-[#1a0533] bg-[length:400%_400%] animate-gradient-shift overflow-hidden">
      {/* Dynamic Curtain Overlay Wipe */}
      <div className={`curtain-overlay ${curtainState}`} />

      {!showDashboard ? (
        <LandingPage onEnter={handleEnterDashboard} />
      ) : (
        <div className="animate-enter-fade">
          {/* Background Ambient Orbs */}
          <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0"></div>
          <div className="fixed bottom-[-100px] right-[-150px] w-[500px] h-[500px] rounded-full bg-fuchsia-500/4 blur-[150px] pointer-events-none z-0"></div>
          <div className="fixed top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-sky-500/3 blur-[100px] pointer-events-none z-0"></div>

          {/* Dynamic Condition Tint Overlay */}
          <div
            className="fixed top-0 left-0 w-full h-full pointer-events-none transition-all duration-[1.5s] ease-in-out z-10"
            style={{ backgroundColor: bgTint }}
          ></div>

          <div className="relative z-20 w-full flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 pb-12">
              <HeroSearch onSearch={fetchWeather} isLoading={isLoading} />

              <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

              {/* SKELETON PLACEHOLDER */}
              {isLoading && <SkeletonLoader />}

              {/* MAIN WEATHER CONTENT GRID */}
              {!isLoading && weather && forecast && (
                <main className="grid grid-cols-1 gap-6">
                  <div className="animate-fade-in-up animation-delay-0">
                    <CurrentWeather
                      data={displayWeather}
                      onBackToCurrent={() => setSelectedForecastDay(null)}
                    />
                  </div>
                  <div className="animate-fade-in-up animation-delay-100">
                    <HourlyForecast forecastData={displayHourly} />
                  </div>
                  <div className="animate-fade-in-up animation-delay-200">
                    <FiveDayForecast
                      forecastData={forecast}
                      selectedDay={selectedForecastDay}
                      onSelectDay={setSelectedForecastDay}
                    />
                  </div>
                  <div className="animate-fade-in-up animation-delay-300">
                    <ExtraDetails data={displayWeather} />
                  </div>
                </main>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
