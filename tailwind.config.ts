import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"Source Serif Pro"', 'ui-serif', 'Georgia']
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d7e9ff',
          200: '#b4d2ff',
          300: '#8bb5ff',
          400: '#5f91ff',
          500: '#3e6cff',
          600: '#2f54db',
          700: '#2543b0',
          800: '#203a8f',
          900: '#20306f'
        }
      }
    }
  },
  plugins: []
};

export default config;
