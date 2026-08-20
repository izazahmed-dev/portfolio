import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oryzo: {
          bg: "#100904",
          surface: "#181818",
          card: "#1b1109",
          cardLighter: "#24160c",
          border: "rgba(255, 255, 255, 0.15)",
          borderDark: "#331a0d",
          accent: "#dc5000",
          accentHover: "#eb5a05",
          accentGlow: "rgba(220, 80, 0, 0.25)",
          text: "#ffedd7",
          textMuted: "#c09060",
          textDim: "#a86048",
          warm1: "#603018",
          warm2: "#a86048",
          warm3: "#c09060",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        heading: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        btn: "36px",
        card: "28px",
        cardLg: "36px",
      },
      maxWidth: {
        content: "1140px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
