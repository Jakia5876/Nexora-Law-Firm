import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c5a059',
          light: '#dfc289',
          dark: '#9a7c3e',
        },
        burgundy: {
          DEFAULT: '#6b1d2f',
          light: '#8e273e',
          dark: '#4a1320',
        },
        obsidian: {
          DEFAULT: '#0d0d0d',
          card: '#141414',
          border: '#262626',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
