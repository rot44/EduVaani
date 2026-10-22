/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EduVaani Warm Indian Palette
        'warm-ivory': '#F8F0DF',
        ivory: '#F8F0DF',
        terracotta: {
          DEFAULT: '#B94E36',
          hover: '#A3432E',
          active: '#8E3825',
          light: '#C8644D',
          dark: '#9B3F2A',
        },
        turmeric: {
          DEFAULT: '#E8BD50',
          yellow: '#E8BD50',
          hover: '#DCB042',
          light: '#F0CD72',
          dark: '#CFA135',
        },
        'peacock-teal': {
          DEFAULT: '#236D65',
          hover: '#1C5750',
          active: '#164540',
          light: '#2D867D',
          dark: '#1A534D',
        },
        teal: {
          peacock: '#236D65',
        },
        'deep-brown': {
          DEFAULT: '#382F28',
          text: '#382F28',
          muted: '#62544A',
          subtle: '#8C7B70',
        },
        brown: {
          deep: '#382F28',
        },
        'warm-sand': {
          DEFAULT: '#EDE4D3',
          hover: '#E2D6C0',
          border: '#EDE4D3',
        },
        sand: '#EDE4D3',
        'cream-white': {
          DEFAULT: '#FFFDF7',
          page: '#FFFDF7',
        },
        cream: '#FFFDF7',
        'soft-coral': {
          DEFAULT: '#D4715E',
          hover: '#BF6250',
          light: '#E28E7D',
        },
        coral: '#D4715E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -1px rgba(56, 47, 40, 0.06), 0 1px 3px -1px rgba(56, 47, 40, 0.04)',
        'warm': '0 4px 20px -2px rgba(56, 47, 40, 0.08), 0 2px 6px -1px rgba(56, 47, 40, 0.04)',
        'warm-md': '0 10px 25px -4px rgba(56, 47, 40, 0.10), 0 4px 10px -2px rgba(56, 47, 40, 0.05)',
        'warm-lg': '0 18px 36px -6px rgba(56, 47, 40, 0.14), 0 6px 16px -3px rgba(56, 47, 40, 0.07)',
        'terracotta': '0 8px 24px -4px rgba(185, 78, 54, 0.25)',
        'teal': '0 8px 24px -4px rgba(35, 109, 101, 0.25)',
        'turmeric': '0 8px 24px -4px rgba(232, 189, 80, 0.3)',
      },
      borderRadius: {
        'card': '1rem',
        'pill': '9999px',
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
        breathe: { '0%, 100%': { transform: 'scale(1)', opacity: '0.85' }, '50%': { transform: 'scale(1.03)', opacity: '1' } },
        gentleFloat: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
        smoothSpin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        rippleOut: { '0%': { transform: 'scale(0.9)', opacity: '0.8' }, '100%': { transform: 'scale(2)', opacity: '0' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 25px rgba(185, 78, 54, 0.18)' }, '50%': { boxShadow: '0 0 45px rgba(185, 78, 54, 0.40)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
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
