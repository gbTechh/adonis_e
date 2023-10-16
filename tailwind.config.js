/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.{edge,js,ts,vue,jsx,tsx}', // 👈
  ],
  darkMode: 'class', // Habilita el modo oscuro basado en clases
  theme: {
    extend: {
      filter: {
        filterwhite:
          'invert(98%) sepia(0%) saturate(1%) hue-rotate(63deg) brightness(97%) contrast(102%)',
        filterdark:
          'invert(0%) sepia(0%) saturate(7071%) hue-rotate(142deg) brightness(100%) contrast(90%)',
      },
      colors: {
        darkbg: '#050606',
        darkbg2: '#454747',
        darkcard: '#5454745C',
        primary: '#FF6000',
        primaryt: '#FF5F001A',
        whitebg: '#F2F3F4',
        whitebg2: '#F1F1F1',
        whitecard: '#fff',
        darktext: '#F4F4F4',
        darktext2: '#D9D9D9',
        whitetext: '#0D0D0D',
        whitetext2: '#818181',
      },
      fontFamily: {
        sans: ['Mulish', 'sans'], // Cambia 'MyDefaultFont' al nombre de tu fuente
        title: ['Signika Negative', 'sans'], // Cambia 'MyDefaultFont' al nombre de tu fuente
        poppins: ['Poppins', 'sans'], // Cambia 'MyDefaultFont' al nombre de tu fuente
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'], // Agrega variantes para modo oscuro
      borderColor: ['dark'],
      color: ['dark'],
    },
  },
  plugins: [],
}
