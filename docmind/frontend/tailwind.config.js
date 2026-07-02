/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        slate: {
          50: "#f8fafc",
          100: "#e2e8f0",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#111827",
          950: "#05070d",
        },
        ink: {
          950: "#05070d",
          900: "#05070d",
          800: "#0e1424",
          700: "#11182c",
          600: "#182338",
          500: "#22304a",
          400: "#2b3955",
        },
        brand: {
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#5b6cf4",
          600: "#4c5cf2",
          700: "#3340d1",
        },
        accent: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      animation: {
        "figure-8": "figure8 18s linear infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "pulse-border": "pulseBorder 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        figure8: {
          "0%": { transform: "translate(0,0) rotate(0deg)" },
          "25%": { transform: "translate(120px,-80px) rotate(90deg)" },
          "50%": { transform: "translate(0,-160px) rotate(180deg)" },
          "75%": { transform: "translate(-120px,-80px) rotate(270deg)" },
          "100%": { transform: "translate(0,0) rotate(360deg)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseBorder: {
          "0%,100%": { borderColor: "rgba(99, 102, 241, 0.2)" },
          "50%": { borderColor: "rgba(99, 102, 241, 0.5)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)" },
        },
      },
      backgroundImage: {
        "dot-pattern": "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-grid": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-sm": "24px 24px",
        "mesh-grid": "24px 24px",
      },
    },
  },
  plugins: [],
};
