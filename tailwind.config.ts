import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080c14",
        surface: "#0f1626",
        "surface-2": "#161e30",
        border: "#1e293b",
        primary: "#10b981",
        "primary-dim": "#064e3b",
        accent: "#3b82f6",
        gold: "#f59e0b",
        "text-primary": "#f8fafc",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
        field: "#1a472a",
        "field-dark": "#14391f",
        "field-line": "#ffffff26",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
