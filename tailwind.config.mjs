// tailwind.config.js
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "800px",
        // md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "pangalan":"200px"
      },
    },
  },
  plugins: [],
};
