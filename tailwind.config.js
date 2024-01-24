/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        primary:'#F6C90E',
        bgp:'#303841',
        bgs:'#3A4750',
        textc:'#EEEEEE'

      }
    },
  },
  plugins: [],
}
