/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08141f",
        panel: "#0d1d2d",
        panelSoft: "#10253a",
        cyan: "#63e6ff",
        signal: "#f97316",
        ember: "#fb7185",
        lime: "#bef264"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,230,255,0.18), 0 18px 48px rgba(8,20,31,0.45)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
