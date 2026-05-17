import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc6c6',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#ff2d2d',
          600: '#ed1212',
          700: '#c80a0a',
          800: '#a50c0c',
          900: '#880f0f',
          950: '#4b0202',
        },
        gold: {
          400: '#f5c842',
          500: '#e8b820',
          600: '#c99a0a',
        },
        surface: {
          50:  '#fafafa',
          100: '#f5f5f5',
          800: '#1a1a1a',
          900: '#111111',
          950: '#080808',
        }
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.10)',
        'brand': '0 4px 24px rgba(237,18,18,0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'slide-in': 'slideIn 0.35s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
