/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const { colors } = require("./src/constants/colors");

module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./src/App.tsx",
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins_400Regular"],
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-bold": ["Poppins_700Bold"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
      },
      colors: {
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        light: colors.textLight,
        "app-black": colors.palette.black,
        "app-white": colors.palette.white,
        "app-gray": {
          DEFAULT: colors.palette.gray.medium,
          medium: colors.palette.gray.medium,
          light: colors.palette.gray.light,
        },
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".font-normal": { fontFamily: "Poppins_400Regular" },
        ".font-medium": { fontFamily: "Poppins_500Medium" },
        ".font-bold": { fontFamily: "Poppins_700Bold" },
        ".font-poppins": { fontFamily: "Poppins_400Regular" },
        ".font-poppins-medium": { fontFamily: "Poppins_500Medium" },
        ".font-poppins-bold": { fontFamily: "Poppins_700Bold" },
      });
    }),
  ],
};
