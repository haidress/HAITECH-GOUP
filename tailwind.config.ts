import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        haitechBlue: "#0A2A5E",
        haitechGold: "#D4A017"
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        body: ["var(--font-poppins)", "Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
