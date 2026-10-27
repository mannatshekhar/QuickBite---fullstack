/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#F58A07', deep: '#C2410C', soft: '#FFEBD2' },
        night: '#0A0604',
        cream: '#FFF9F2',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        bump: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.35)' } },
      },
      animation: { slideIn: 'slideIn .3s ease-out', fadeIn: '.2s ease-out', bump: '.3s ease-out' },
    },
  },
  plugins: [],
};
