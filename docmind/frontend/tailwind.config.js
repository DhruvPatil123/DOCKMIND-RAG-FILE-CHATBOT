/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0a0a0f",
          800: "#12121b",
          700: "#1b1b28",
          600: "#262636",
          500: "#3a3a52",
        },
        brand: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        accent: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      animation: {
        "figure-8": "figure8 18s linear infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
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
      },
    },
  },
  plugins: [],
};
