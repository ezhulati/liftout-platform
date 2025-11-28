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
      // Practical UI HSB Monochromatic Color System
      // Navy Hue: 220, Gold Hue: 38
      colors: {
        // Background layers - Warm cream (H=40), not pure white
        bg: {
          DEFAULT: 'hsl(40, 30%, 97%)',      // Main background
          surface: 'hsl(40, 20%, 100%)',     // Component backgrounds (white)
          elevated: 'hsl(40, 25%, 95%)',     // Hover states, elevated surfaces
          alt: 'hsl(220, 2%, 98%)',          // Lightest navy-tinted alt bg
        },
        // Primary: Navy (H=220) - HSB Monochromatic Scale
        // Following Practical UI formula for light interfaces
        navy: {
          DEFAULT: 'hsl(220, 70%, 50%)',     // Primary actions HSB(220,70,80) → hsl approx
          darkest: 'hsl(220, 60%, 20%)',     // Headings HSB(220,60,20)
          dark: 'hsl(220, 30%, 45%)',        // Secondary text HSB(220,30,45)
          medium: 'hsl(220, 20%, 66%)',      // Non-decorative borders HSB(220,20,66)
          light: 'hsl(220, 10%, 95%)',       // Decorative borders HSB(220,10,95)
          lightest: 'hsl(220, 2%, 98%)',     // Alt backgrounds HSB(220,2,98)
          // Full scale for compatibility
          50: 'hsl(220, 10%, 95%)',
          100: 'hsl(220, 15%, 90%)',
          200: 'hsl(220, 20%, 80%)',
          300: 'hsl(220, 25%, 66%)',
          400: 'hsl(220, 35%, 50%)',
          500: 'hsl(220, 50%, 40%)',
          600: 'hsl(220, 60%, 30%)',
          700: 'hsl(220, 60%, 25%)',
          800: 'hsl(220, 60%, 20%)',
          900: 'hsl(220, 65%, 15%)',
          950: 'hsl(220, 70%, 10%)',
        },
        // Secondary: Gold (H=38) - HSB Monochromatic Scale
        gold: {
          DEFAULT: 'hsl(38, 70%, 50%)',      // Primary gold actions HSB(38,70,80)
          darkest: 'hsl(38, 60%, 20%)',      // Gold text on light HSB(38,60,20)
          dark: 'hsl(38, 50%, 40%)',         // Darker gold
          medium: 'hsl(38, 30%, 60%)',       // Medium gold
          light: 'hsl(38, 20%, 85%)',        // Light gold
          lightest: 'hsl(38, 10%, 95%)',     // Lightest gold bg
          // Full scale for compatibility
          50: 'hsl(38, 60%, 95%)',
          100: 'hsl(38, 60%, 90%)',
          200: 'hsl(38, 60%, 82%)',
          300: 'hsl(38, 55%, 70%)',
          400: 'hsl(38, 60%, 55%)',
          500: 'hsl(38, 70%, 50%)',
          600: 'hsl(38, 70%, 45%)',
          700: 'hsl(38, 65%, 40%)',
          800: 'hsl(38, 60%, 35%)',
          900: 'hsl(38, 55%, 28%)',
          950: 'hsl(38, 50%, 20%)',
        },
        // Text hierarchy - Following Practical UI contrast requirements
        // Small text needs 4.5:1, Large text 3:1, UI components 3:1
        text: {
          primary: 'hsl(220, 60%, 20%)',     // Darkest - headings, primary text
          secondary: 'hsl(220, 30%, 45%)',   // Dark - secondary text
          tertiary: 'hsl(220, 20%, 55%)',    // Medium - helper text, placeholders
          inverse: 'hsl(0, 0%, 100%)',       // White - text on dark backgrounds
          'on-navy': 'hsl(0, 0%, 100%)',     // White text on navy
          'on-gold': 'hsl(220, 60%, 15%)',   // Dark text on gold
        },
        // Borders - Following Practical UI 3:1 contrast for non-decorative
        border: {
          DEFAULT: 'hsl(220, 20%, 85%)',     // Default border
          hover: 'hsl(220, 25%, 70%)',       // Hover state
          focus: 'hsl(220, 70%, 50%)',       // Focus ring - primary color
          decorative: 'hsl(220, 10%, 90%)',  // Decorative only (no contrast req)
        },
        // Semantic colors - with icons, never color alone
        success: {
          DEFAULT: 'hsl(142, 55%, 38%)',
          light: 'hsl(142, 40%, 92%)',
          dark: 'hsl(142, 60%, 28%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 90%, 50%)',
          light: 'hsl(38, 80%, 92%)',
          dark: 'hsl(38, 90%, 40%)',
        },
        error: {
          DEFAULT: 'hsl(0, 65%, 50%)',
          light: 'hsl(0, 50%, 95%)',
          dark: 'hsl(0, 65%, 40%)',
        },
        info: {
          DEFAULT: 'hsl(220, 70%, 50%)',
          light: 'hsl(220, 50%, 95%)',
          dark: 'hsl(220, 70%, 40%)',
        },
        // Legacy primary alias (maps to navy)
        primary: {
          50: 'hsl(220, 10%, 95%)',
          100: 'hsl(220, 15%, 90%)',
          200: 'hsl(220, 20%, 80%)',
          300: 'hsl(220, 25%, 66%)',
          400: 'hsl(220, 35%, 50%)',
          500: 'hsl(220, 50%, 40%)',
          600: 'hsl(220, 60%, 30%)',
          700: 'hsl(220, 60%, 25%)',
          800: 'hsl(220, 60%, 20%)',
          900: 'hsl(220, 65%, 15%)',
          950: 'hsl(220, 70%, 10%)',
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
      // Contextual line heights (Elite UI/UX - different for each element type)
      lineHeight: {
        'none': '1',
        'tight': '1.1',      // Display headings
        'snug': '1.25',      // Subheadings, subtitles
        'normal': '1.5',     // Body text, paragraphs
        'relaxed': '1.6',    // Long-form content, code
        'loose': '1.75',     // Extra readable content
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
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Staggered animations for lists/grids (Elite UI/UX pattern)
        'fade-in-up-1': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
        'fade-in-up-2': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-in-up-3': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
        'fade-in-up-4': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
        'fade-in-up-5': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
        'fade-in-up-6': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards',
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
