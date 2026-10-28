/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Identidad FonoAlerta (rediseño)
        tinta: { DEFAULT: '#1F2A5C', suave: '#4A5480', tenue: '#7C84A6' },
        brand: {
          50: '#F4F2FC', 100: '#EAE5FA', 200: '#D6CCF4', 300: '#B9A8EA', 400: '#9479DA',
          500: '#7A5BCD', 600: '#6A4BC4', 700: '#5839A8', 800: '#472F87', 900: '#3A2870'
        },
        lavanda: '#F4F2FC',
        menta: { suave: '#DFF4EC', DEFAULT: '#3FAE8C', fuerte: '#23806A' },
        sol: { suave: '#FFF2CC', DEFAULT: '#E8A928', fuerte: '#9A6A06' },
        cielo: { suave: '#E4EEFB', DEFAULT: '#3E83D6', fuerte: '#245EA6' },
        rosa: { suave: '#FBE4F0', DEFAULT: '#C9569A', fuerte: '#962F6E' },
        whatsapp: { DEFAULT: '#1FAF55', fuerte: '#178A43' }
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        mano: ['"Patrick Hand"', 'Nunito', 'cursive']
      },
      boxShadow: {
        suave: '0 6px 24px -12px rgba(31, 42, 92, 0.25)'
      }
    },
  },
  plugins: [],
}
