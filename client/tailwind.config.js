/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#171A21",
          soft: "#3A3F4B",
          faint: "#6B7080",
        },
        canvas: {
          DEFAULT: "#F5F5F1",
          raised: "#FFFFFF",
          sunken: "#EBEAE4",
        },
        indigo: {
          50: "#EEF0F7",
          100: "#D6DBEC",
          200: "#AEB8D9",
          300: "#8493C3",
          400: "#5A6BA8",
          500: "#3A4A85",
          600: "#2B3A67",
          700: "#212D50",
          800: "#181F38",
          900: "#101426",
        },
        marigold: {
          50: "#FDF3E4",
          100: "#FAE3BE",
          200: "#F4CB89",
          300: "#EEB35F",
          400: "#E8963B",
          500: "#D67F26",
          600: "#B2661C",
          700: "#8A4F17",
        },
        moss: {
          50: "#EBF1EA",
          100: "#CFDECD",
          200: "#A6C0A2",
          300: "#7C9F79",
          400: "#5D8259",
          500: "#4B6B4E",
          600: "#3B5540",
          700: "#2E4232",
        },
        clay: {
          400: "#D6746A",
          500: "#C1554B",
          600: "#A1423A",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,26,33,0.04), 0 8px 24px -12px rgba(23,26,33,0.12)",
        raised: "0 2px 4px rgba(23,26,33,0.06), 0 16px 40px -16px rgba(23,26,33,0.18)",
      },
      borderRadius: {
        xs: "4px",
      },
    },
  },
  plugins: [],
}
