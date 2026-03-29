import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F4C5C",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        background: "#FFFFFF",
        foreground: "#1A1A2E",
      },
      keyframes: {
        "float-up": {
          "0%, 100%": { transform: "translateY(0px) scale(1)", opacity: "0.4" },
          "50%": { transform: "translateY(-22px) scale(1.1)", opacity: "0.7" },
        },
      },
      animation: {
        "float-up": "float-up 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
