import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
