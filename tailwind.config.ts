import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#151921",
          card: "#1E2329",
          border: "#2A2F36",
          text: {
            primary: "#FFFFFF",
            secondary: "#A0A5B0",
            muted: "#6B7280"
          },
          accent: {
            blue: "#3B82F6",
            "blue-dark": "#2563EB"
          }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
