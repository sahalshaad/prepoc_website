/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E5D47',
          50: '#e8f5f0',
          100: '#c5e5d8',
          200: '#9fd4be',
          300: '#6fc0a0',
          400: '#3aaf83',
          500: '#0E5D47',
          600: '#0b4f3c',
          700: '#094130',
          800: '#073325',
          900: '#04201a',
        },
        accent: {
          DEFAULT: '#D4AF37',
          50: '#fdf8e7',
          100: '#f9edbf',
          200: '#f5e194',
          300: '#f0d468',
          400: '#ebc73d',
          500: '#D4AF37',
          600: '#b4932e',
          700: '#937726',
          800: '#735b1d',
          900: '#523f14',
        },
        dark: '#0B0B0B',
        bg: '#050505',
        foreground: '#F8F8F8',
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#9CA3AF',
        },
        border: '#1A1A1A',
        card: '#0D0D0D',
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'Sora', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.05' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'display': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05' }],
        'hero': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '104': '26rem',
        '128': '32rem',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '375px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
