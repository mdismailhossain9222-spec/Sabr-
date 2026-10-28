/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainPink: "#F09DBB",
        lightPink: "#F4C3D1",
        blush: "#FCE4EC",
        daisyYellow: "#FBF8CE",
        daisyGreen: "#9EB79B",
        darkText: "#4A3B42",
      },
      keyframes: {
        "intro-logo": {
          from: { opacity: "0", transform: "translateY(1rem) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-15px)" } },
        "spin-slow": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-down": { from: { opacity: "0", transform: "translateY(-12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        // Liquid-glass button shine: sweeps from fully off-left to fully off-right
        shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
        "pulse-glow": { "0%, 100%": { boxShadow: "0 10px 25px -5px rgba(232,114,114,0.35)" }, "50%": { boxShadow: "0 10px 40px 4px rgba(232,114,114,0.65)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "intro-logo": "intro-logo 1000ms cubic-bezier(0.16,1,0.3,1) both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "fade-down": "fade-down 0.8s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.5s infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Raleway'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
