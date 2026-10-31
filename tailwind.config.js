/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      letterSpacing: {
        wider: '0.02em',
      },
      colors: {
        black: '#0a0a0a',
        cream: '#f5f0e6',
        lime: '#ffd700',
        orange: '#e8813a',
        gold: {
          DEFAULT: '#ffd700',
          glow: 'rgba(255, 215, 0, 0.4)',
          muted: '#b89c0c',
        },
      },
      fontFamily: {
        bueno: ['Bueno', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        condensed: ['Bueno', 'var(--font-condensed)', 'Anton', 'Impact', 'sans-serif'],
        sans: ['var(--font-sans)', 'Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Bueno', 'Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
