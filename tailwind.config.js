/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'toktik-bg': '#FAFAF8',
        'toktik-surface': '#FFFFFF',
        'toktik-surface-raised': '#F5F4F0',
        'toktik-border': '#E8E6E0',
        'toktik-text-primary': '#1A1917',
        'toktik-text-secondary': '#6B6860',
        'toktik-text-tertiary': '#A8A49C',
        'toktik-accent': '#FF6B6B',
        'toktik-accent-soft': '#FFF0F0',
        'toktik-follow': '#1A1917',
        'toktik-shimmer-start': '#F0EEE8',
        'toktik-shimmer-end': '#E8E6DE',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'full': '9999px',
      },
      animation: {
        'shimmer': 'shimmer 1.4s infinite linear',
        'spin-disc': 'spin 4s linear infinite',
        'heart-burst': 'heartBurst 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'spring-pop': 'springPop 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 360ms cubic-bezier(0.4, 0, 0.2, 1)',
        'stagger-in': 'staggerIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        heartBurst: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        springPop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        staggerIn: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
