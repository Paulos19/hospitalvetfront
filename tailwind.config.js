/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#10B981', // Emerald Green Principal
          700: '#047857', // Botões hover/active
        },
        secondary: {
          100: '#D1FAE5', // Backgrounds leves
        },
        background: '#F9FAFB',
        text: {
          main: '#1F2937',
          muted: '#6B7280'
        }
      },
    },
  },
  plugins: [],
}