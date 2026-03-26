/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f0ff',
          pink: '#ff00ff',
          purple: '#8b00ff',
          green: '#00ff88',
          red: '#ff0055',
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'fall': 'fall linear forwards',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: 1, textShadow: '0 0 10px currentColor' },
          '50%': { opacity: 0.8, textShadow: '0 0 20px currentColor' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 40px currentColor' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        'fall': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}
