# WeatherWave 🌊

WeatherWave is a premium, real-time meteorological forecasting platform designed with immersive dark aesthetics and high-fidelity interactive elements. Built using React, Vite, and Tailwind CSS v4, it features smooth visual transitions, animated SVG weather models, custom sun-path calculators, and detailed wind-coordinates HUD.

---

## 🌟 Key Features

### 1. Immersive Portal Gateway (Landing Page)
- **Twinkling Starfield**: An interactive HTML5 canvas rendering 180 stars with dynamic twinkling speeds and shooting star trajectories.
- **Atmospheric Nebula**: Slow-drifting FIXED auras generating deep purple, blue, and pink backing flows.
- **3D Card Showcase**: A rotating 3D carousel deck displaying key cities, temperatures, and custom animated meteorological vector assets.
- **Dashboard Preview**: A realistic browser layout frame reacting to hover with interactive 3D perspective tilts.

### 2. High-Fidelity Weather Dashboard
- **Real-Time Forecasting**: Synchronized data processing updating metrics every 10 minutes.
- **Celsius/Fahrenheit HUD**: Instantly switches metrics globally with smooth transition states.
- **Drag-Scrollable Hourly Strip**: Interactive horizontal strip plotting forecast trends, heat coordinates, and active condition indicators.
- **5-Day Extended Grid**: Accent-coded daily outlook cards with visual temperature slider ranges and relative humidity tracking.
- **Detailed Sun & Wind HUD**: Custom dynamic Sun Arc reflecting sunset progress and a live compass rose reflecting wind direction angles.

### 3. Flat Interactive Buttons
- Tactile, flat button elements focusing purely on color transitions, borders, and gradient shifts. All upward hover translations and scaling transforms have been replaced to ensure a clean, modern feeling, while keeping responsive click states (`active:scale-[0.98]`).

---

## 🛠️ Technology Stack
- **Library**: React 19 (Functional Hooks & Lifecycle Management)
- **Tooling**: Vite (Fast HMR & Client Bundler)
- **Styling**: Tailwind CSS v4 (Native CSS variable `@theme` layers)
- **API**: OpenWeatherMap API

---

## 🚀 Setup & Installation

### 1. Configure the API Key
Open [src/App.jsx](file:///c:/Users/danya/OneDrive/Desktop/PROJECTS/WeatherWave/src/App.jsx) and replace the placeholder API key at line 12:
```javascript
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
```

### 2. Install Dependencies
Run the package installations:
```bash
npm install
```

### 3. Start Development Server
Launch the local dev environment:
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 4. Build for Production
To bundle the optimized assets:
```bash
npm run build
```
The compiled output will be generated inside the `/dist` directory.
