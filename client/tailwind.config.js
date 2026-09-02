/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F7F5",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#171717",
          soft: "#6B6B6B",
        },
        brand: {
          500: "#3155D9",
          900: "#172554",
        },
        border: {
          subtle: "#E5E5E2",
        },
        success: "#26734D",
        warning: "#B7791F",
        error: "#C24141",
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "serif"],
        heading: ["'Manrope'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(23, 23, 23, 0.05)",
        raised: "0 4px 6px -1px rgba(23, 23, 23, 0.05), 0 2px 4px -2px rgba(23, 23, 23, 0.05)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
}
