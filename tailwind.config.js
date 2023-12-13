/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        base: '#0D0C11',
        primary: '#E50914',
        secondary: '#17161B'
      },

      textColor: {
        primary: '#E50914',
        secondary: '#17161B'
      },

      fontFamily: {
        inter: 'Inter',
        poppins: 'Poppins'
      },

      boxShadow: {
        primary: '0 0 10px #E50914'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

