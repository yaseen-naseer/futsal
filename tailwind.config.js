/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#d6e4ff',
          200: '#adc8ff',
          300: '#85a9ff',
          400: '#5e87ff',
          500: '#3f63ff',
          600: '#3352db',
          700: '#263ca8',
          800: '#1a2775',
          900: '#0e1342',
        },
        accent: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#ff6b6b',
          600: '#fa5252',
          700: '#f03e3e',
          800: '#e03131',
          900: '#c92a2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        128: '32rem',
      },
    },
  },
  plugins: [],
};
