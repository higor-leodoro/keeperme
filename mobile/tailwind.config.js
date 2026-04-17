/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#06060A',
          elevated: '#0F1114',
          'elevated-2': '#12151A',
          'elevated-3': '#1A1D23',
        },
        text: {
          primary: '#F5F0E8',
          secondary: 'rgba(245, 240, 232, 0.55)',
          hint: 'rgba(245, 240, 232, 0.38)',
          mute: 'rgba(245, 240, 232, 0.28)',
        },
        border: {
          subtle: 'rgba(245, 240, 232, 0.06)',
          DEFAULT: 'rgba(245, 240, 232, 0.08)',
          strong: 'rgba(245, 240, 232, 0.14)',
        },
        accent: {
          DEFAULT: '#F5F0E8',
          highlight: '#E8D4A8',
        },
        positive: '#A8D4BA',
        negative: '#D99A9A',
        warning: '#E8C67A',
      },
      fontFamily: {
        display: ['BricolageGrotesque_400Regular'],
        'display-medium': ['BricolageGrotesque_500Medium'],
        'display-semibold': ['BricolageGrotesque_600SemiBold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
        body: ['Geist_400Regular'],
        'body-medium': ['Geist_500Medium'],
      },
      fontSize: {
        'hero-xl': ['58px', { lineHeight: '58px', letterSpacing: '-3.19px' }],
        'hero-lg': ['40px', { lineHeight: '42px', letterSpacing: '-1.6px' }],
        'hero-md': ['26px', { lineHeight: '28.6px', letterSpacing: '-0.91px' }],
        'hero-sm': ['20px', { lineHeight: '24px', letterSpacing: '-0.6px' }],
        'body-lg': ['17px', { lineHeight: '23.8px', letterSpacing: '-0.374px' }],
        'body-md': ['15px', { lineHeight: '21.75px', letterSpacing: '-0.27px' }],
        'body-sm': ['14px', { lineHeight: '21px', letterSpacing: '-0.21px' }],
        'mono-lg': ['13px', { lineHeight: '18.2px' }],
        'mono-sm': ['11px', { lineHeight: '14.3px' }],
        caption: ['10px', { lineHeight: '13px', letterSpacing: '2px' }],
        'caption-xs': ['9px', { lineHeight: '10.8px', letterSpacing: '1.62px' }],
      },
      spacing: {
        4.5: '18px',
        5.5: '22px',
        6.5: '26px',
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '12px',
        lg: '22px',
        xl: '26px',
        '2xl': '28px',
      },
    },
  },
  plugins: [],
};
