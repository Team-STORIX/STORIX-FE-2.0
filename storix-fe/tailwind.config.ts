// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#FF4093',
          light: '#FDBCD9',
          'extra-light': '#FFEEF6',
          dark: '#D8016F',
        },
        gray: {
          900: '#100F0F',
          800: '#302F2F',
          700: '#4E4D4D',
          600: '#816060',
          500: '#8B8787',
          400: '#A9ABA8',
          300: '#CECDCD',
          200: '#E1E0E0',
          100: '#EEEDED',
          50: '#F8F7F7',
        },
        black: '#000000',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}

export default config
