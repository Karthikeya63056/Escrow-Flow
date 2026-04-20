/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class', // enable dark mode by default if desired
  theme: {
    extend: {
      colors: {
        neonBlue: '#00f3ff',
        neonPurple: '#bd00ff',
        darkBg: '#0b0f19',
        darkCard: '#131b2e',
      },
      animation: {
        'glow-pulse': 'glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff' },
          '50%': { opacity: 0.5, boxShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff' },
        }
      }
    },
  },
  plugins: [],
}
