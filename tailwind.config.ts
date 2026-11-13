import type { Config } from "tailwindcss";

// Mismos tokens que globals.css de e-Cobro — para que el login de Keycloak
// se vea "de la misma familia" que el resto de la app, sin duplicar
// valores a mano y arriesgarse a que se desincronicen con el tiempo.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ffc107",       // dorado — botones/acciones
          foreground: "#1a1a1a",    // texto oscuro sobre dorado
        },
        chrome: {
          DEFAULT: "#1a1815",       // gris carbón — header/chrome
        },
        muted: "#f3f4f6",
        border: "#e5e7eb",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
      backgroundImage: {
        "app-gradient": "linear-gradient(135deg, #faf8f3 0%, #f3f4f6 45%, #eef0f4 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
