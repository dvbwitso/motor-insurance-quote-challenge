module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: { 
    extend: {
      colors: {
        'hobbiton': {
          red: '#DC2626', // Red
          'dark-green': '#065F46', // Dark Green
          'light-grey': '#F3F4F6', // Light Grey
          'dark-grey': '#374151', // Dark Grey for dark mode
        },
        primary: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
          900: '#7F1D1D',
        },
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#065F46',
          600: '#047857',
          700: '#064E3B',
          900: '#022C22',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    } 
  },
  plugins: [require('@tailwindcss/forms')],
};