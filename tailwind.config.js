/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage:{
        "home": "url('/assets/background-header.jpg')",
        "footer-image": "url('/assets/bottom.jpg')"
      }
    },
  },
  plugins: [],
}

