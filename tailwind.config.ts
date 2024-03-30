/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        shakeX: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translate3d(-10px, 0, 0)' },
          '20%, 40%, 60%, 80%': { transform: 'translate3d(10px, 0, 0)' }
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        wobble: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '15%': { transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)' },
          '30%': { transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)' },
          '45%': { transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)' },
          '60%': { transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)' },
          '75%': { transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        }
      },
      animation: {
        shakeX: 'shakeX 1s ease-in-out',
        heartBeat: 'heartBeat 1s ease-in-out',
        wobble: 'wobble 1s ease-in-out',
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
}
