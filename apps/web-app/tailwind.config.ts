import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Disabled - only activates with explicit .dark class
  theme: {
    extend: {
      // Deep Navy + Gold color palette
      colors: {
        // Background layers - Warm cream, not pure white
        bg: {
          DEFAULT: 'hsl(40, 30%, 97%)',
          surface: 'hsl(40, 20%, 99%)',
          elevated: 'hsl(40, 25%, 95%)',
        },
        // Primary accent: Deep Navy - executive, trustworthy
        navy: {
          DEFAULT: 'hsl(220, 60%, 20%)',
          light: 'hsl(220, 50%, 30%)',
          dark: 'hsl(220, 70%, 15%)',
          50: 'hsl(220, 50%, 95%)',
          100: 'hsl(220, 50%, 90%)',
          200: 'hsl(220, 50%, 80%)',
          300: 'hsl(220, 50%, 65%)',
          400: 'hsl(220, 50%, 45%)',
          500: 'hsl(220, 55%, 35%)',
          600: 'hsl(220, 60%, 25%)',
          700: 'hsl(220, 60%, 20%)',
          800: 'hsl(220, 65%, 15%)',
          900: 'hsl(220, 70%, 10%)',
          950: 'hsl(220, 75%, 6%)',
        },
        // Secondary accent: Gold - premium, distinctive
        gold: {
          DEFAULT: 'hsl(38, 50%, 55%)',
          light: 'hsl(38, 60%, 75%)',
          dark: 'hsl(38, 60%, 42%)',
          50: 'hsl(38, 60%, 95%)',
          100: 'hsl(38, 60%, 90%)',
          200: 'hsl(38, 60%, 82%)',
          300: 'hsl(38, 60%, 75%)',
          400: 'hsl(38, 55%, 65%)',
          500: 'hsl(38, 50%, 55%)',
          600: 'hsl(38, 55%, 48%)',
          700: 'hsl(38, 60%, 42%)',
          800: 'hsl(38, 65%, 35%)',
          900: 'hsl(38, 70%, 28%)',
          950: 'hsl(38, 75%, 20%)',
        },
        // Text hierarchy - Deep navy tones, NOT pure black
        text: {
          primary: 'hsl(220, 60%, 15%)',
          secondary: 'hsl(220, 30%, 40%)',
          tertiary: 'hsl(220, 20%, 55%)',
          inverse: 'hsl(40, 20%, 92%)',
        },
        // Borders - subtle navy tint
        border: {
          DEFAULT: 'hsl(220, 15%, 85%)',
          hover: 'hsl(220, 20%, 70%)',
          focus: 'hsl(220, 60%, 50%)',
        },
        // Semantic colors
        success: {
          DEFAULT: 'hsl(142, 55%, 38%)',
          light: 'hsl(142, 55%, 92%)',
          dark: 'hsl(142, 60%, 28%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 95%, 50%)',
          light: 'hsl(38, 95%, 92%)',
          dark: 'hsl(38, 95%, 40%)',
        },
        error: {
          DEFAULT: 'hsl(0, 65%, 50%)',
          light: 'hsl(0, 65%, 95%)',
          dark: 'hsl(0, 65%, 40%)',
        },
        // Legacy primary colors (for gradual migration)
        primary: {
          50: 'hsl(220, 50%, 95%)',
          100: 'hsl(220, 50%, 90%)',
          200: 'hsl(220, 50%, 80%)',
          300: 'hsl(220, 50%, 65%)',
          400: 'hsl(220, 50%, 45%)',
          500: 'hsl(220, 55%, 35%)',
          600: 'hsl(220, 60%, 25%)',
          700: 'hsl(220, 60%, 20%)',
          800: 'hsl(220, 65%, 15%)',
          900: 'hsl(220, 70%, 10%)',
          950: 'hsl(220, 75%, 6%)',
        },
      },
      // Typography - Playfair Display + Source Sans 3
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Source Sans 3', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Major Third (1.25) type scale
      fontSize: {
        'xs': ['0.8rem', { lineHeight: '1.5' }],
        'sm': ['1rem', { lineHeight: '1.5' }],
        'base': ['1.125rem', { lineHeight: '1.5' }],
        'lg': ['1.25rem', { lineHeight: '1.4' }],
        'xl': ['1.563rem', { lineHeight: '1.3' }],
        '2xl': ['1.953rem', { lineHeight: '1.2' }],
        '3xl': ['2.441rem', { lineHeight: '1.15' }],
        '4xl': ['3.052rem', { lineHeight: '1.1' }],
        '5xl': ['3.815rem', { lineHeight: '1.1' }],
      },
      // Line heights
      lineHeight: {
        'tight': '1.1',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.6',
      },
      // Letter spacing
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.05em',
        'wider': '0.08em',
      },
      // 8-point grid spacing
      spacing: {
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
        '14': '112px',
        '16': '128px',
        '18': '144px',
        '20': '160px',
      },
      // Border radius - varied
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      // Box shadow - subtle elevation
      boxShadow: {
        'sm': '0 1px 2px 0 hsl(220 60% 15% / 0.05)',
        'DEFAULT': '0 1px 3px 0 hsl(220 60% 15% / 0.1), 0 1px 2px -1px hsl(220 60% 15% / 0.1)',
        'md': '0 4px 6px -1px hsl(220 60% 15% / 0.1), 0 2px 4px -2px hsl(220 60% 15% / 0.1)',
        'lg': '0 10px 15px -3px hsl(220 60% 15% / 0.1), 0 4px 6px -4px hsl(220 60% 15% / 0.1)',
        'xl': '0 20px 25px -5px hsl(220 60% 15% / 0.1), 0 8px 10px -6px hsl(220 60% 15% / 0.1)',
        '2xl': '0 25px 50px -12px hsl(220 60% 15% / 0.25)',
        'inner': 'inset 0 2px 4px 0 hsl(220 60% 15% / 0.05)',
        'gold': '0 4px 14px 0 hsl(38 50% 55% / 0.3)',
        'navy': '0 4px 14px 0 hsl(220 60% 20% / 0.3)',
      },
      // Custom animations with cubic-bezier easing
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'base': '300ms',
        'slow': '400ms',
        'slower': '500ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      // Max width for typography (65ch for body)
      maxWidth: {
        'prose': '65ch',
        'heading': '40ch',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-navy': 'linear-gradient(135deg, hsl(220, 60%, 20%) 0%, hsl(220, 70%, 15%) 100%)',
        'gradient-gold': 'linear-gradient(135deg, hsl(38, 50%, 55%) 0%, hsl(38, 60%, 42%) 100%)',
        'gradient-premium': 'linear-gradient(135deg, hsl(220, 60%, 20%) 0%, hsl(220, 50%, 30%) 50%, hsl(38, 50%, 55%) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
