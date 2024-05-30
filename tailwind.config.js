/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Inter, sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/background-header.jpg')",
        "footer-image": "url('/assets/bottom.jpg')"
      }
    },
  },
  plugins: [],
}

