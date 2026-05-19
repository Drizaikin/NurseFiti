import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#08514F",
          mid: "#0A6865",
          light: "#E8F5F4",
          xlight: "#F0FAF9",
        },
        amber: {
          DEFAULT: "#F5A623",
          light: "#FFF3DC",
          dark: "#C47F0A",
        },
        cream: {
          DEFAULT: "#FFFDF8",
          warm: "#FFF5E6",
        },
        dark: {
          DEFAULT: "#0F1C1C",
          mid: "#1E3535",
          soft: "#2D4A4A",
        },
        mid: "#4A6565",
        light: "#7A9E9E",
        border: "#D0E6E5",
        red: "#E84545",
        green: "#1A9E75",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        lg: "20px",
        full: "999px",
      },
      boxShadow: {
        DEFAULT: "0 4px 24px rgba(8,81,79,.10)",
        lg: "0 12px 48px rgba(8,81,79,.16)",
      },
    },
  },
  plugins: [],
};

export default config;
