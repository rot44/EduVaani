/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'gentle-float': 'gentleFloat 3s ease-in-out infinite',
        'smooth-spin': 'smoothSpin 2s linear infinite',
        'ripple-out': 'rippleOut 2s ease-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'floatDelayed 8s ease-in-out infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        breathe: { '0%, 100%': { transform: 'scale(1)', opacity: '0.8' }, '50%': { transform: 'scale(1.03)', opacity: '1' } },
        gentleFloat: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
        smoothSpin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        rippleOut: { '0%': { transform: 'scale(0.9)', opacity: '0.8' }, '100%': { transform: 'scale(2)', opacity: '0' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 30px rgba(249,115,22,0.3)' }, '50%': { boxShadow: '0 0 50px rgba(249,115,22,0.6)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' }, '33%': { transform: 'translateY(-10px) rotate(1deg)' }, '66%': { transform: 'translateY(5px) rotate(-1deg)' } },
        floatDelayed: { '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' }, '33%': { transform: 'translateY(8px) rotate(-1deg)' }, '66%': { transform: 'translateY(-5px) rotate(1deg)' } },
        floatSlow: { '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' }, '50%': { transform: 'translateY(-8px) rotate(0.5deg)' } },
        wave: { '0%, 100%': { transform: 'scaleY(1)' }, '50%': { transform: 'scaleY(1.5)' } },
      },
    },
  },
  plugins: [],
}
