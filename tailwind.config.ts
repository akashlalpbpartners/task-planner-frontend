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
        slate: {
          850: "#172033",
          950: "#0b1220",
        },
      },
      boxShadow: {
        panel: "0 4px 24px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
