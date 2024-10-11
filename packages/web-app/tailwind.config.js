module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'sm-regular': ['14px', '20px'],
        'sm-medium': ['14px', '20px'],
        'base-regular': ['16px', '24px'],
        'base-semibold': ['16px', '24px'],
        'lg-regular': ['18px', '20px'],
        'lg-semibold': ['18px', '20px'],
      },
      fontWeight: {
        'regular': 400,
        'medium': 500,
        'semibold': 600,
      },
    },
  },
  plugins: [],
}