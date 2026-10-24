/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            DEFAULT: '#4A0E4E',
            light: '#6E1B74',
            dark: '#300833',
          },
          gold: {
            DEFAULT: '#C5A059',
            light: '#DFBF7A',
            dark: '#9E7D3B',
          },
          crimson: '#7A0016',
          emerald: '#004D40',
          ivory: '#FDFBF7',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
