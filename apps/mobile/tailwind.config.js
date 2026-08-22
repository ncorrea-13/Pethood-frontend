/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta tomada del diseño de referencia (source/ en la raíz del proyecto).
      colors: {
        pethood: {
          orange: '#FF9D5C',
          'orange-dark': '#FF8A3D', // estado presionado
          beige: '#FFF5ED', // fondo de pantallas
          'beige-dark': '#F5F1E8', // fin del degradado de fondo
          input: '#FAFAFA', // fondo de los campos de formulario
        },
      },
    },
  },
  plugins: [],
};
