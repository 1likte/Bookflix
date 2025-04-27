/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 20s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateY(-100px) scale(1.5)',
            opacity: '0.8'
          },
          '100%': {
            transform: 'translateY(-200px) scale(1)',
            opacity: '0'
          },
        },
      },
    },
  },
  plugins: [],
};