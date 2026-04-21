/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        neon: "rgb(var(--color-neon) / <alpha-value>)",
        "neon-purple": "rgb(var(--color-neon-purple) / <alpha-value>)",
        "neon-pink": "rgb(var(--color-neon-pink) / <alpha-value>)",
        "neon-green": "rgb(var(--color-neon-green) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
      },
      borderRadius: { xl: "var(--radius)" },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: 0, transform: "translateY(-10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
