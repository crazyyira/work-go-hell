import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ["var(--font-retro)"],
        calligraphy: ["var(--font-calligraphy)"],
        "serif-heavy": ["var(--font-serif-heavy)"],
      },
      colors: {
        "retro-red": "var(--color-retro-red)",
        "retro-yellow": "var(--color-retro-yellow)",
        "retro-paper": "var(--color-retro-paper)",
        "retro-ink": "var(--color-retro-ink)",
      },
    },
  },
  plugins: [],
} satisfies Config;

