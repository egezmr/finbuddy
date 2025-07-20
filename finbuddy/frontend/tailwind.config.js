/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        fibabanka: {
          blue: '#009cde',
          green: '#00b388',
          lightgray: '#f5f5f5',
          white: '#ffffff',
          dark: '#222222',
        },
      },
      },
  },
  plugins: [],
}; 