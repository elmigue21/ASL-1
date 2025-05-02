// tailwind.config.js
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "xsm": "375px", 
        "sm": "425px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1440px",
      },
    },
  },
  plugins: [],
};
