// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // Make sure this line correctly points to your source files
  ],
  darkMode: 'class', // This line enables manual dark mode toggling
  theme: {
    extend: {
      colors: {
        // Define your custom brand colors here
        // Replace the hex codes with your actual brand colors
        brand: {
          // Primary colors (e.g., deep blue, teal)
          primary: '#0A385A', // Example deep blue - Replace with your primary color
          secondary: '#0F766E', // Example teal - Replace with your secondary color
          accent: '#34D399', // Example accent/highlight color (like the original teal button) - Replace

          // Status/Contextual colors
          urgent: '#DC2626', // Example red for urgency (same as original red-600) - Adjust if needed
          // Add other brand colors as needed (e.g., text-color, background-color)
          'dark-blue': '#1E3A8A', // Example dark blue, perhaps for gradients
          'light-sky': '#E0F2F7', // Example light sky blue, perhaps for text
        },
        // If you used deeper blues like blue-950 from Tailwind in the gradient
        // make sure they are available or define them here if you want custom shades
        // 'blue-950': '#172554', // Example Tailwind blue-950 value
      },
      // Optional: If you have custom fonts, define them here
      // fontFamily: {
      //   heading: ['YourHeadingFont', 'sans-serif'], // Replace 'YourHeadingFont'
      //   body: ['YourBodyFont', 'sans-serif'],     // Replace 'YourBodyFont'
      // },
    },
  },
  plugins: [],
};