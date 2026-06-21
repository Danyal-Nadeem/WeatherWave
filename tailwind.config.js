/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#080b1a',
          surface: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.10)',
          blue: '#60a5fa',
          purple: '#a78bfa',
          success: '#34d399',
          primary: '#f1f5f9',
          secondary: 'rgba(255, 255, 255, 0.50)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-icon': 'float 3s ease-in-out infinite',
        'spin-fast': 'spin 0.8s infinite linear',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
