import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D97757',
          strong: '#C25C3B',
          tint: '#FBE9DF',
          ink: '#5A2814',
        },
        paper: '#FBF9F6',
        'paper-alt': '#F4EFE8',
        surface: '#FFFFFF',
        'surface-2': '#FAF7F2',
        ink: {
          DEFAULT: '#1B1817',
          2: '#2F2A26',
          soft: '#6B6660',
          faint: '#A39C92',
        },
        line: {
          DEFAULT: '#EBE6DD',
          2: '#DCD5C7',
        },
        success: {
          DEFAULT: '#2F8F5A',
          tint: '#E3F1E7',
        },
        danger: {
          DEFAULT: '#C75348',
          tint: '#F6E1DC',
        },
        warn: {
          DEFAULT: '#C99514',
          tint: '#FBEFC8',
        },
        market: {
          up: '#2F8F5A',
          down: '#C75348',
          neutral: '#A39C92',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['44px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['38px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h2: ['28px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        h3: ['20px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        h4: ['16px', { lineHeight: '1.3', fontWeight: '700' }],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        pill: '999px',
      },
      boxShadow: {
        1: '0 1px 2px rgba(27,24,23,0.04), 0 1px 1px rgba(27,24,23,0.03)',
        2: '0 6px 18px rgba(27,24,23,0.06), 0 2px 4px rgba(27,24,23,0.04)',
        3: '0 20px 48px rgba(27,24,23,0.10), 0 8px 16px rgba(27,24,23,0.05)',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease',
        'slide-up': 'slide-up 300ms ease',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
