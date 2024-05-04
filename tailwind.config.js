/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.svelte"
  ],
  theme: {
    extend: {
        colors: {
            'blue': '#273460',
            'white': '#F3E9DC',
            'red': '#DD7373'

        },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}

