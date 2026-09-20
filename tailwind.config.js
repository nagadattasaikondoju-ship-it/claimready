/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1958E8",        // Primary Blue
        success: "#1FAA5C",        // Success Green
        warning: "#D97706",        // Warning Amber
        danger: "#C0392B",         // Danger Red
        tint: {
          blue: "#EAF1FF",         // Explainer card background
          amber: "#FFF6E9",        // Assumption / warning card background
          green: "#EAFBF1",        // Success card background
          red: "#FDE8E8",          // Danger card background
        },
        text: {
          primary: "#1A1F2B",      // Primary typography
          secondary: "#595959",    // Secondary typography
        },
        surface: "#FAFBFC",        // App surface background
        cardBorder: "#E2E8F0",     // Flat border color
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "Noto Sans", "Noto Sans Telugu", "Noto Sans Devanagari", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
