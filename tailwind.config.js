module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
      },
    },
  },
  screens: {
    xs: { max: '767px' }, 
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  plugins: []
}
