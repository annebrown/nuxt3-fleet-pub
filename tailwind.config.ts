// nuxt3-fleet-pub/tailwind.config.ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts}',
    './src/**/*.css', // Add this to scan your new index.css file as well

  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
