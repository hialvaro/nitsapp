module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "nits-green": "#24965d",
        "nits-light-green": "#7ebc8f",
        "nits-blue": "#246896",
        "nits-violet": "#7801af",
        "nits-gold": "#ddc004",
        "light-grey": "#f1f1f1",
        "dark-grey": "#515154",
      },
    },
    fontFamily: {
      Poppins: ["Poppins, sans-serif"],
    },
    flex: {
      "1": "1 1 0%",
      "2": "2 2 0%",
    },
    container: {
      center: true,
      screens: {
        lg: "1124px",
        xl: "1124px",
        "2xl": "1124px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
