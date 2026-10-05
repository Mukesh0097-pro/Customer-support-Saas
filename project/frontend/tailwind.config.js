/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#FFFFFF",
          panel: "#FFFFFF",
          border: "rgba(0,0,0,0.12)",
        },
        text: {
          primary: "#000000",
          muted: "#4B5563",
          faint: "#6B7280",
        },
        // semantic only — never decorative
        signal: {
          up: "#22C55E",
          down: "#EF4444",
          warn: "#F5A623",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        none_: "none",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
