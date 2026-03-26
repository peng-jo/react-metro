/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1.5': '0.375rem',
      },
      width: {
        '80': '20rem',
      },
    },
  },
  plugins: [],
}
