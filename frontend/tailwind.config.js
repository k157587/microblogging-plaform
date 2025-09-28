/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1DA1F2',
          dark: '#14171A',
          darkGray: '#657786',
          lightGray: '#AAB8C2',
          lightBlue: '#E1F5FE',
          border: '#E1E8ED'
        }
      }
    },
  },
  plugins: [],
}

