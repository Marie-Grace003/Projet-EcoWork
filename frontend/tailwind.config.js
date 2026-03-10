/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-blue': '#7BDFF2',
        'eco-mint': '#B2F7EF',
        'eco-light': '#EFF7F6',
        'eco-pink': '#F7D6E0',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}