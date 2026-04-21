/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // === Taply Design System: "The Digital Curator" ===
        // Primary palette (Indigo)
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "on-primary-fixed": "#0f0069",
        "on-primary-fixed-variant": "#3323cc",
        // Secondary
        secondary: "#58579b",
        "secondary-container": "#b6b4ff",
        "secondary-fixed": "#e2dfff",
        "secondary-fixed-dim": "#c3c0ff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#454386",
        // Tertiary
        tertiary: "#7e3000",
        "tertiary-container": "#a44100",
        "tertiary-fixed": "#ffdbcc",
        "tertiary-fixed-dim": "#ffb695",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffd2be",
        // Surface hierarchy
        background: "#fcf9f8",
        surface: "#fcf9f8",
        "surface-bright": "#fcf9f8",
        "surface-container": "#f0edec",
        "surface-container-high": "#ebe7e7",
        "surface-container-highest": "#e5e2e1",
        "surface-container-low": "#f6f3f2",
        "surface-container-lowest": "#ffffff",
        "surface-dim": "#dcd9d9",
        "surface-tint": "#4d44e3",
        "surface-variant": "#e5e2e1",
        // On-surface
        "on-background": "#1c1b1b",
        "on-surface": "#1c1b1b",
        "on-surface-variant": "#464555",
        // Inverse
        "inverse-surface": "#313030",
        "inverse-on-surface": "#f3f0ef",
        "inverse-primary": "#c3c0ff",
        // Outline
        outline: "#777587",
        "outline-variant": "#c7c4d8",
        // Error
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        "manrope-regular": ["ManropeRegular", "sans-serif"],
        "manrope-semibold": ["ManropeSemiBold", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        "inter-medium": ["InterMedium", "sans-serif"],
        "inter-semibold": ["InterSemiBold", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
    },
  },
  plugins: [],
};