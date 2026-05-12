/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        base: {
          900: "#060913",
          800: "#0b1020",
          700: "#151b2f",
          100: "#f5f7ff",
        },
        premium: {
          cyan: "#59d4ff",
          mint: "#6cf3cc",
          amber: "#ffca63",
          coral: "#ff8a6b",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(89,212,255,0.28), 0 12px 36px rgba(1, 10, 36, 0.35)",
      },
      backgroundImage: {
        "ambient-radial":
          "radial-gradient(circle at 20% 20%, rgba(89,212,255,0.2), transparent 38%), radial-gradient(circle at 80% 0%, rgba(108,243,204,0.16), transparent 40%), radial-gradient(circle at 70% 80%, rgba(255,138,107,0.18), transparent 45%)",
      },
    },
  },
  plugins: [],
};
