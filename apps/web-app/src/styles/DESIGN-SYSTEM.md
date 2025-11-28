# Liftout Design System

Based on **Practical UI** principles. This document serves as the single source of truth for UI decisions.

## Color System (HSB Monochromatic)

### Primary: Navy (H=220)
| Token | HSL | Usage |
|-------|-----|-------|
| `--navy` | hsl(220, 70%, 50%) | Primary actions, links |
| `--navy-darkest` | hsl(220, 60%, 20%) | Headings |
| `--navy-dark` | hsl(220, 30%, 45%) | Secondary text |
| `--navy-medium` | hsl(220, 20%, 66%) | Non-decorative borders |
| `--navy-light` | hsl(220, 10%, 95%) | Decorative borders |
| `--navy-900` | hsl(220, 65%, 15%) | Dark section backgrounds |
| `--navy-950` | hsl(220, 70%, 10%) | Footer, deepest dark |

### Secondary: Gold (H=38)
| Token | HSL | Usage |
|-------|-----|-------|
| `--gold` | hsl(38, 70%, 50%) | Accents, highlights |
| `--gold-darkest` | hsl(38, 60%, 20%) | Gold text |

### Backgrounds
| Token | HSL | Usage |
|-------|-----|-------|
| `--bg` | hsl(40, 30%, 97%) | Main page background (warm cream) |
| `--bg-surface` | hsl(0, 0%, 100%) | Cards, components |
| `--bg-elevated` | hsl(40, 25%, 95%) | Hover states |

### Text Hierarchy
| Token | Contrast | Usage |
|-------|----------|-------|
| `--text-primary` | 11:1 | Headings, important text |
| `--text-secondary` | 7:1 | Body text |
| `--text-tertiary` | 4.5:1 | Helper text, placeholders |

## Button System (Three-Weight)

### Light Backgrounds
```css
.btn-primary     /* Navy fill + white text - ONE per screen */
.btn-secondary   /* Navy outline - alternative actions */
.btn-tertiary    /* Underlined text - cancel, back */
.btn-ghost       /* Minimal - low priority */
```

### Dark Backgrounds
```css
.btn-primary-on-dark    /* White fill + dark text */
.btn-secondary-on-dark  /* White outline */
```

### Rules
- **ONE primary button per screen maximum**
- Min 48px touch target (44px acceptable on desktop)
- 16px spacing between buttons
- Left-align buttons (primary first)
- Use verb + noun labels ("Save post", "Delete message")

## Dark Sections

Use these classes for CTAs, footers, and dark backgrounds:

```css
.dark-section       /* navy-900 background */
.dark-section-deep  /* navy-950 background */
.text-on-dark       /* White text */
.text-on-dark-muted /* 80% white */
.text-on-dark-subtle /* 60% white */
```

## Light Section Accents

Use these classes for accent colors on light/cream backgrounds:

```css
.text-navy          /* Navy accent text hsl(220, 70%, 50%) */
.bg-navy            /* Navy background fill */
.text-gold          /* Gold accent text hsl(38, 70%, 50%) */
.text-gold-dark     /* Darker gold for better contrast hsl(38, 65%, 40%) */
.bg-gold            /* Gold background fill */
.text-on-gold       /* Dark text on gold background */
```

**Note:** These utility classes use explicit HSL values to ensure reliable rendering regardless of Tailwind's purging behavior.

## Form Patterns

### Structure
1. Labels on TOP (not beside)
2. Error summary at TOP of form
3. Inline errors with icon + text (not color alone)
4. Single column layout
5. Required fields marked with asterisk `*`
6. Include "Required fields are marked with *" instruction

### Classes
```css
.input-field        /* Standard input */
.input-field-error  /* Error state */
.label-text         /* Field label */
.form-field         /* Field container */
.form-field-error   /* Error message */
.form-field-hint    /* Hint text */
.form-single-column /* Single column layout */
.btn-group          /* Button container, left-aligned */
```

### Accessibility
- 48px minimum touch targets
- 3:1 contrast for borders
- 4.5:1 contrast for text
- Never color alone for errors (use icon)
- `aria-invalid` and `aria-describedby` for errors

## Typography

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: Source Sans 3 (sans-serif)

### Scale (Major Third 1.25)
| Size | Rem | Pixels |
|------|-----|--------|
| xs | 0.8rem | 12.8px |
| sm | 1rem | 16px |
| base | 1.125rem | 18px |
| lg | 1.25rem | 20px |
| xl | 1.563rem | 25px |
| 2xl | 1.953rem | 31px |
| 3xl | 2.441rem | 39px |
| 4xl | 3.052rem | 49px |

### Line Height
- Headings: 1.1 (tight)
- Subheadings: 1.25 (snug)
- Body: 1.5 (normal)
- Long-form: 1.6 (relaxed)

### Max Width
- Body text: 65ch
- Headings: 40ch

## Spacing (8pt Grid)

All spacing should be multiples of 8px:
- 4px (0.5) - Micro gaps
- 8px (1) - Tight spacing
- 16px (2) - Standard spacing
- 24px (3) - Component gaps
- 32px (4) - Section gaps
- 48px (6) - Large gaps
- 64px (8) - Extra large

## Shadows

```css
.shadow-sm    /* Subtle elevation */
.shadow       /* Default */
.shadow-md    /* Cards */
.shadow-lg    /* Modals, dropdowns */
```

## Animations

Use `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo) for most transitions.

Durations:
- Instant: 100ms (micro-interactions)
- Fast: 200ms (buttons, inputs)
- Base: 300ms (cards, panels)
- Slow: 400ms (modals, overlays)

## Practical UI Principles Applied

1. **HSB Monochromatic Colors** - Single hue (220) with varying saturation/brightness
2. **Squint Test** - Hierarchy visible even when blurred
3. **One Primary CTA** - Single prominent action per screen
4. **48px Touch Targets** - Mobile-friendly tap areas
5. **8pt Grid** - Consistent spacing rhythm
6. **Labels Above Fields** - Better scannability
7. **Error Summary + Inline** - Complete error visibility
8. **Never Color Alone** - Icons accompany color indicators
9. **Verb + Noun Labels** - Clear action buttons
10. **Left-Aligned Buttons** - Primary first, then secondary
