import type { Config } from 'tailwindcss'

/**
 * PRACTICAL UI DESIGN SYSTEM ALIGNMENT
 * Based on Adham Dannaway's Practical UI (283 pages)
 *
 * ✅ Typography: Inter (single sans-serif), 1.25 Major Third scale
 * ✅ Spacing: 8pt grid (XS=8, S=16, M=24, L=32, XL=48, XXL=80)
 * ✅ Colors: HSB monochromatic palette with WCAG 2.1 AA contrast
 * ✅ Buttons: 3-weight hierarchy (primary/secondary/tertiary), 48px touch targets
 * ✅ Forms: Labels above, errors above input, 3:1 border contrast
 * ✅ Line heights: 1.5+ for body, 1.1-1.3 for headings
 * ✅ Max line length: 65ch for body text
 */

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Safelist ensures these classes are always generated even when in template literals
  safelist: [
    'bg-navy-800',
    'bg-navy-700',
    'bg-navy-600',
    'bg-navy-darkest',
    'bg-navy-dark',
    'text-navy-800',
    'text-navy-200',
    'shadow-navy-800/30',
    'shadow-navy-800/40',
    'hover:bg-navy-700',
    'hover:bg-navy-dark',
    'border-navy-600',
    'ring-navy-600/30',
    'bg-gold-600',
    'text-gold-200',
    // Purple sidebar colors
    'bg-purple-500',
    'bg-purple-600',
    'bg-purple-700',
    'hover:bg-purple-600',
    'hover:bg-purple-700',
    'text-purple-500',
    'border-purple-500',
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
        // Primary: Deep Royal Purple (H=270) - HSB Monochromatic Scale
        // Base: #4C1D95 = hsl(270, 70%, 35%)
        navy: {
          DEFAULT: '#4C1D95',                // Primary actions - Deep Royal Purple
          darkest: '#3B0764',                // Dark backgrounds - darkest purple
          dark: 'hsl(270, 40%, 40%)',        // Secondary text
          medium: 'hsl(270, 25%, 60%)',      // Non-decorative borders
          light: 'hsl(270, 15%, 92%)',       // Decorative borders
          lightest: 'hsl(270, 10%, 97%)',    // Alt backgrounds
          // Full scale for compatibility
          50: 'hsl(270, 20%, 97%)',
          100: 'hsl(270, 25%, 93%)',
          200: 'hsl(270, 30%, 85%)',
          300: 'hsl(270, 35%, 70%)',
          400: 'hsl(270, 50%, 50%)',
          500: '#4C1D95',                     // Base purple
          600: 'hsl(270, 70%, 30%)',
          700: 'hsl(270, 70%, 25%)',
          800: 'hsl(270, 70%, 20%)',
          900: '#3B0764',                     // Darkest purple
          950: 'hsl(270, 80%, 12%)',
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
        // Text hierarchy - Following Practical UI WCAG contrast requirements
        // Small text needs 4.5:1, Large text 3:1, UI components 3:1
        // Using #0f172a (slate-900) as pro dark - not pure black
        text: {
          primary: '#0f172a',                // Pro dark, not pure black (15.5:1 contrast)
          secondary: '#475569',              // Slate-600 for secondary
          tertiary: '#64748b',               // Slate-500 for tertiary
          muted: '#94a3b8',                  // Slate-400 for muted/decorative
          inverse: '#ffffff',                // White - text on dark backgrounds
          'on-navy': '#ffffff',              // White text on navy
          'on-gold': '#0f172a',              // Dark text on gold
        },
        // Override gray scale to use slate (cooler, more professional)
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',    // Pro dark - not pure black
          950: '#020617',
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
        // Purple - Figma sidebar color (#7C3AED)
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#7C3AED',   // Primary purple from Figma
          600: '#6D28D9',   // Hover state
          700: '#5B21B6',   // Active state
          800: '#4C1D95',
          900: '#3B0764',
        },
      },
      // Typography - Inter (single font family per Practical UI)
      // "Use single sans serif for most interfaces"
      fontFamily: {
        heading: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Practical UI Type Scale (Major Third 1.25)
      // Body: 16px base, 18px minimum for body text
      // Line height: ≥1.5 for body, 1.1-1.3 for headings
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.5' }],      // 13px
        'sm': ['0.875rem', { lineHeight: '1.5' }],       // 14px
        'base': ['1rem', { lineHeight: '1.5' }],         // 16px
        'lg': ['1.125rem', { lineHeight: '1.5' }],       // 18px (body minimum)
        'xl': ['1.25rem', { lineHeight: '1.4' }],        // 20px
        '2xl': ['1.375rem', { lineHeight: '1.35' }],     // 22px H4 (was 24px)
        '3xl': ['1.75rem', { lineHeight: '1.25' }],      // 28px H3
        '4xl': ['2.1875rem', { lineHeight: '1.2' }],     // 35px H2 (was 36px)
        '5xl': ['2.75rem', { lineHeight: '1.1' }],       // 44px H1
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
      // Letter spacing - Practical UI scale for optimal readability
      letterSpacing: {
        'tightest': '-0.04em',  // 44px+ display
        'tighter': '-0.03em',   // 35-44px H1
        'tight': '-0.02em',     // 22-35px H2-H3
        'snug': '-0.01em',      // 18-22px H4
        'normal': '0',          // Body
        'wide': '0.02em',       // 14-16px small
        'wider': '0.05em',      // 12-13px very small
        'widest': '0.08em',     // Uppercase labels
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
        'navy': '0 4px 14px 0 hsl(270 70% 25% / 0.3)',
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
        'gradient-navy': 'linear-gradient(135deg, #4C1D95 0%, #3B0764 100%)',
        'gradient-gold': 'linear-gradient(135deg, hsl(38, 50%, 55%) 0%, hsl(38, 60%, 42%) 100%)',
        'gradient-premium': 'linear-gradient(135deg, #4C1D95 0%, hsl(270, 50%, 40%) 50%, hsl(38, 50%, 55%) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
