/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        panel: "#20263b",
        violet: "#9b5cff",
        aqua: "#38d9d6",
        muted: "#a5abc3"
      },
      boxShadow: { glow: "0 0 30px rgba(155,92,255,.18)" },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] }
    }
  },
  plugins: []
};
