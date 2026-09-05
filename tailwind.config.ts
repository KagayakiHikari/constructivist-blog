import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        construct: {
          red: "#E62617",
          black: "#0B0B0B",
          yellow: "#F7C61A",
          blue: "#1D4ED8",
          paper: "#F4F0E6",
          ink: "#111111",
          muted: "#6F6A62",
          danger: "#D91F2A",
          success: "#12805C"
        }
      },
      fontFamily: {
        display: [
          "Archivo Black",
          "Arial Black",
          "Impact",
          "Helvetica Neue",
          "Noto Sans SC",
          "Microsoft YaHei",
          "sans-serif"
        ],
        body: [
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Noto Sans SC",
          "Microsoft YaHei",
          "sans-serif"
        ]
      },
      boxShadow: {
        construct: "8px 8px 0 #0B0B0B",
        "construct-sm": "4px 4px 0 #0B0B0B",
        "construct-red": "8px 8px 0 #E62617"
      }
    }
  },
  plugins: []
};

export default config;
