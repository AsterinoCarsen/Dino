/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.svelte"
  ],
  theme: {
    extend: {
        colors: {
            "red": "#DB504A",
            "orange": "#FF6F59"
        }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}

