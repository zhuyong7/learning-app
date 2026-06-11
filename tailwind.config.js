/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        growth: {
          primary: '#4ADE80',
          secondary: '#60A5FA',
          warning: '#FBBF24',
          danger: '#FB7185',
          background: '#F8FAFC',
          ink: '#0F172A',
        },
      },
      borderRadius: {
        card: '24px',
        soft: '16px',
      },
      boxShadow: {
        glow: '0 0 32px rgba(74, 222, 128, 0.24)',
        card: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
