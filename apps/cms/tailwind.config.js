/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        robin: {
          primary: "#b57eff",
          secondary: "#d09efe",
          accent: "#d0baff",
          neutral: "#cfffdd",
          "base-100": "#27293c",
          info: "#bae1ff",
          success: "#baffc9",
          warning: "#ffffba",
          error: "#ffb3ba",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
