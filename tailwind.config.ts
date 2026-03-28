import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#192126",
        fog: "#eef2ee",
        pine: "#1d4f45",
        moss: "#6f8f68",
        sand: "#f7f2e7",
        ember: "#af5f3c",
      },
      boxShadow: {
        card: "0 20px 45px rgba(25, 33, 38, 0.08)",
      },
      fontFamily: {
        sans: ["Avenir Next", "Helvetica Neue", "Segoe UI", "sans-serif"],
        serif: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

