/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '300px', // Móvil muy pequeño
      md: '768px', // Tablet estándar
      tablet: '1180px', // Definido por ti
      lg: '1024px', // PC estándar
      xl: '1280px', // Pantallas grandes
      '2xl': '1536px'
    },
    extend: {
      backgroundImage: {
        'buildings-login': 'url("./assets/bg_buildings.webp")',
        'buildings-profile': 'url("./assets/bg_buildings_grayout.jpg")'
      },
      colors: {
        primary: {}
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/forms')]
}
