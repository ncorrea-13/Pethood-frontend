/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        pethood: {
          orange: '#FF7A45',
          beige: '#F5EBE0',
        },
      },
    },
  },
  plugins: [],
};
