/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",

  ],
  theme: {
    extend: {
      colors: {
        primary: '#F6C90E',
        bgp: '#303841',
        bgs: '#3A4750',
        textc: '#EEEEEE'

      },
      fontFamily: {
        
        main: ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [require("flowbite/plugin"),],
}
