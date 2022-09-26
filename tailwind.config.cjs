/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        gray: {
          '300': '#F5F5F5',
          '500': "#EFEFEF",
          '600': '#E0E0E0',
          "900": "#808080",
        },
        green: '#5CAC21'

      }
    },
  },
  plugins: [],
}
