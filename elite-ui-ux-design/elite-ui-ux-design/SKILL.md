---
name: elite-ui-ux-design
description: Creates evidence-based, accessible UI/UX designs that avoid AI homogenization. Applies research-backed typography, color theory, layout systems, and WCAG compliance. Use when designing web interfaces, applications, or any digital product requiring professional design quality.
---

# Elite UI/UX Design Skill

## Overview
This skill provides research-backed UI/UX design principles to create professional, accessible interfaces that avoid common AI design failures. Based on empirical evidence from Baymard Institute, Nielsen Norman Group, TetraLogical, and industry experts.

**Critical Context:**
- AI-generated designs have 81% failure rate on UX recommendations (Baymard Institute)
- AI overlooks 76% of static usability problems
- Consistent WCAG violations across all AI models tested
- Statistical homogenization toward "median SaaS aesthetic"
- AI Purple Problem (#5E6AD2 indigo-violet gradients everywhere)

## Section 1: Accessibility (Non-Negotiable)

### WCAG 2.1 Level AA Compliance

**1.3.1 Info and Relationships - Semantic HTML:**
```html
<!-- ✅ CORRECT -->
<header>
  <nav>
    <ul>
      <li><a href="/products">Products</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <section>
      <h2>Subtitle</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
<aside>Related content</aside>
<footer>Footer content</footer>

<!-- ❌ WRONG: div soup -->
<div class="header">
  <div class="nav">
    <div class="link">Products</div>
  </div>
</div>
```

**Forms require proper structure:**
```html
<form>
  <label for="email">Email address *</label>
  <input type="email" id="email" name="email" required>
  <span class="hint">We'll never share your email</span>
</form>
```

**2.1.1 Keyboard Navigation:**
```javascript
// Tab components must support Arrow keys
const Tabs = () => {
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      focusTab((index + 1) % tabs.length);
    }
    if (e.key === 'ArrowLeft') {
      focusTab((index - 1 + tabs.length) % tabs.length);
    }
  };
  
  return (
    <div role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === activeTab}
          tabIndex={i === activeTab ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
```

**2.4.7 Focus Visible:**
```css
/* All interactive elements need visible focus */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

/* Dark mode adjustment */
@media (prefers-color-scheme: dark) {
  button:focus-visible {
    outline-color: var(--accent-light);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  button:focus-visible {
    outline: 4px solid;
  }
}
```

**1.4.3 Contrast Requirements:**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3.0:1 minimum
- UI components: 3.0:1 minimum

```javascript
// Verify contrast function
function meetsContrastRequirement(fg, bg, isLargeText = false) {
  const ratio = getContrastRatio(fg, bg);
  const required = isLargeText ? 3.0 : 4.5;
  return ratio >= required;
}
```

**2.5.5 Touch Target Size:**
- Minimum: 44×44px (Apple guidelines)
- Preferred: 48×48px (Material Design)
- Spacing: 8px minimum between targets

```css
/* Mobile-first button sizing */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Ensure spacing between interactive elements */
nav a {
  padding: 12px;
  margin: 0 4px;
}
```

## Section 2: Typography (Scientific Specifications)

**Line-Height Contextual Rules:**
```css
/* ❌ WRONG: Uniform 1.5 everywhere */
* { line-height: 1.5; }

/* ✅ CORRECT: Contextual */
h1, h2, h3 { line-height: 1.1; }
.subtitle { line-height: 1.3; }
p, li { line-height: 1.5; }
code, pre { line-height: 1.6; }
```

**Line Length:**
```css
/* Body text: 65ch optimal (45-75 range) */
.prose {
  max-width: 65ch;
}

/* Headings: 40ch maximum */
h1, h2, h3 {
  max-width: 40ch;
}

/* Sidebars: 50ch */
aside {
  max-width: 50ch;
}
```

**Type Scale - Use Major Third (1.25) or Perfect Fourth (1.333):**
```css
/* ❌ WRONG: Timid 1.125 ratio */
--text-xs: 0.889rem;
--text-sm: 1rem;
--text-base: 1.125rem;

/* ✅ CORRECT: Major Third (1.25) */
--text-xs: 0.8rem;
--text-sm: 1rem;
--text-base: 1.25rem;
--text-lg: 1.563rem;
--text-xl: 1.953rem;
--text-2xl: 2.441rem;
--text-3xl: 3.052rem;
```

**Font Weights - Use Extremes:**
```css
/* ❌ WRONG: Middle weights */
h1 { font-weight: 500; }
p { font-weight: 400; }

/* ✅ CORRECT: Extremes create contrast */
h1 { font-weight: 900; }
.subtitle { font-weight: 300; }
p { font-weight: 400; }
strong { font-weight: 700; }
```

**Letter Spacing:**
```css
.display { letter-spacing: -0.02em; } /* Large text tighter */
body { letter-spacing: 0; } /* Normal */
.small-caps { letter-spacing: 0.05em; } /* Small text wider */
```

**Font Pairing - Contrast Not Similarity:**

Proven pairings:
1. Playfair Display (serif heading) + Source Sans 3 (sans body)
2. Syne (geometric sans heading) + JetBrains Mono (mono body)
3. Archivo Black (display) + Epilogue (text sans)
4. Cormorant Garamond (serif) + Work Sans (geometric sans)
5. Space Grotesk (geometric) + IBM Plex Serif (transitional)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;700&display=swap');

:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans 3', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 900;
}

body {
  font-family: var(--font-body);
  font-weight: 400;
}
```

**Font Blacklist - Never Use:**
- Comic Sans MS
- Papyrus
- Brush Script
- Curlz MT
- Impact (body text)
- Times New Roman (web)

## Section 3: Color Systems (Perceptual Accuracy)

**Dark Mode - Near Black, Not Pure Black:**
```css
:root {
  /* ❌ WRONG: Pure black causes halation */
  --bg-wrong: #000000;
  --text-wrong: #FFFFFF;
  
  /* ✅ CORRECT: Near-black backgrounds */
  --bg-dark: #0f0f0f;
  --surface-dark: #1a1a1a;
  --text-dark: #e8e8e8;
}

@media (prefers-color-scheme: dark) {
  body {
    background: var(--bg-dark);
    color: var(--text-dark);
  }
}
```

**Perceptual Brightness Adjustments:**
```css
/* Colors need different L values for equal perceived brightness */
:root {
  /* Yellow appears brighter at lower L values */
  --yellow: hsl(50, 80%, 55%);  /* L: 55% */
  
  /* Blue needs higher L for equal brightness */
  --blue: hsl(210, 80%, 50%);   /* L: 50% */
  
  /* Red in middle */
  --red: hsl(0, 75%, 52%);      /* L: 52% */
}
```

**Avoid AI Purple:**
```css
/* ❌ FORBIDDEN: AI purple problem */
--ai-purple: #5E6AD2;
--indigo-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* 80-100% saturation neon accents */

/* ✅ ALTERNATIVES: */
/* Warm accent */
--warm-accent: hsl(25, 75%, 55%);

/* Cool cyan */
--cool-accent: hsl(195, 80%, 50%);

/* Desaturated elegant */
--elegant-accent: hsl(15, 45%, 55%);
```

**Darkening Colors Correctly:**
```css
/* ❌ WRONG: Just decrease lightness */
--primary: hsl(210, 50%, 50%);
--primary-dark: hsl(210, 50%, 30%); /* Looks muddy */

/* ✅ CORRECT: Increase saturation while decreasing lightness */
--primary: hsl(210, 50%, 50%);
--primary-dark: hsl(210, 70%, 35%); /* Richer, more vibrant */
```

**Complete Color Palette Example:**
```css
:root {
  /* Background layers */
  --bg: hsl(0, 0%, 98%);
  --surface: hsl(0, 0%, 100%);
  --surface-elevated: hsl(0, 0%, 96%);
  
  /* Text hierarchy */
  --text-primary: hsl(0, 0%, 15%);
  --text-secondary: hsl(0, 0%, 45%);
  --text-tertiary: hsl(0, 0%, 65%);
  
  /* Accent system */
  --accent: hsl(195, 80%, 50%);
  --accent-hover: hsl(195, 80%, 45%);
  --accent-light: hsl(195, 60%, 90%);
  
  /* Semantic colors */
  --success: hsl(142, 71%, 45%);
  --warning: hsl(45, 100%, 51%);
  --error: hsl(0, 84%, 60%);
  
  /* Borders */
  --border: hsl(0, 0%, 85%);
  --border-hover: hsl(0, 0%, 70%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: hsl(0, 0%, 6%);
    --surface: hsl(0, 0%, 10%);
    --surface-elevated: hsl(0, 0%, 14%);
    
    --text-primary: hsl(0, 0%, 92%);
    --text-secondary: hsl(0, 0%, 70%);
    --text-tertiary: hsl(0, 0%, 50%);
    
    --border: hsl(0, 0%, 20%);
  }
}
```

**Verify Contrast:**
```css
/* Example with verified contrast ratios */
:root {
  --bg: #ffffff;           /* Base */
  --text: #1a1a1a;         /* 13.6:1 (AAA) */
  --secondary: #6b6b6b;    /* 5.7:1 (AA) */
  --button-bg: #2563eb;    /* 5.2:1 on white (AA large) */
}
```

## Section 4: Layout & Spacing (Systematic Predictability)

**8-Point Grid System:**
```css
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-12: 96px;
  --space-16: 128px;
  --space-24: 192px;
}

/* Use in multiples of 8 */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

section {
  padding: var(--space-16) 0;
}
```

**Varied Border Radius:**
```css
/* ❌ WRONG: Everything 8px */
* { border-radius: 8px; }

/* ✅ CORRECT: Varied for visual interest */
:root {
  --radius-sm: 4px;   /* Small elements */
  --radius-md: 8px;   /* Cards */
  --radius-lg: 16px;  /* Large containers */
  --radius-xl: 24px;  /* Hero sections */
  --radius-full: 9999px; /* Pills */
}

.button { border-radius: var(--radius-sm); }
.card { border-radius: var(--radius-md); }
.modal { border-radius: var(--radius-lg); }
.avatar { border-radius: var(--radius-full); }
```

**Break Formulas - Intentional Asymmetry:**
```css
/* ❌ BORING: Centered, symmetric */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ✅ INTERESTING: Asymmetric offset */
.container {
  max-width: 600px;
  margin-left: 10%;
}

/* Uneven grid columns */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr; /* Not 1fr 1fr 1fr */
  gap: var(--space-6);
}

/* Staggered vertical positioning */
.card:nth-child(2n) {
  transform: translateY(var(--space-4));
}
```

## Section 5: Animation & Interaction (Performance + Delight)

**Custom Easing Functions:**
```css
:root {
  /* ❌ NEVER use these */
  --ease-wrong: linear;
  --ease-wrong-2: ease;
  
  /* ✅ ALWAYS use custom cubic-bezier */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Duration System:**
```css
:root {
  --duration-instant: 0.1s;
  --duration-fast: 0.2s;
  --duration-base: 0.3s;
  --duration-slow: 0.4s;
}

button {
  transition: all var(--duration-fast) var(--ease-out-expo);
}

.modal {
  transition: opacity var(--duration-base) var(--ease-out-quart);
}
```

**Staggered Animations:**
```css
/* ❌ WRONG: All animate simultaneously */
.item {
  animation: fadeIn 0.3s;
}

/* ✅ CORRECT: Staggered delays */
.item:nth-child(1) { animation-delay: 0.2s; }
.item:nth-child(2) { animation-delay: 0.4s; }
.item:nth-child(3) { animation-delay: 0.6s; }

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Performant Properties:**
```css
/* ❌ NEVER animate these (causes reflow) */
.slow {
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
}

/* ✅ ONLY animate transform and opacity */
.fast {
  transition: transform 0.3s var(--ease-out-expo),
              opacity 0.3s var(--ease-out-expo);
  will-change: transform, opacity;
}

.fast:hover {
  transform: scale(1.05) translateY(-2px);
}
```

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Section 6: Code Quality (Anti-Tech Debt)

**Reusable Components:**
```jsx
/* ❌ WRONG: Duplicated button code */
<button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
<button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
<button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>

/* ✅ CORRECT: Single Button component with variants */
const Button = ({ variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover',
    danger: 'bg-error hover:bg-error-dark',
    secondary: 'bg-surface border border-border'
  };
  
  return (
    <button 
      className={`px-4 py-2 rounded ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

<Button variant="primary">Submit</Button>
<Button variant="danger">Delete</Button>
<Button variant="secondary">Cancel</Button>
```

**CSS Architecture:**
```css
/* ❌ WRONG: Inline styles everywhere */
<div style="background: #f5f5f5; padding: 24px; border-radius: 8px">

/* ✅ CORRECT: Class-based with design tokens */
.card {
  background: var(--surface);
  padding: var(--space-6);
  border-radius: var(--radius-md);
}
```

**Design Tokens:**
```css
/* Centralized in :root, never hardcoded */
:root {
  /* Colors */
  --accent: hsl(195, 80%, 50%);
  
  /* Spacing */
  --space-4: 32px;
  
  /* Radius */
  --radius-md: 8px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
}
```

## Section 7: UX Patterns (Evidence-Based)

**Navigation:**
```html
<!-- ✅ CORRECT: Clear, conventional labels -->
<nav>
  <a href="/products">Products</a>
  <a href="/pricing">Pricing</a>
  <a href="/blog">Blog</a>
  <a href="/about">About</a>
</nav>

<!-- ❌ WRONG: Made-up terminology -->
<nav>
  <a href="/solutions">Solutions</a>
  <a href="/offerings">Offerings</a>
  <a href="/insights">Insights</a>
  <a href="/story">Story</a>
</nav>
```

**Forms - Required Field Marking:**
```html
<!-- ✅ CORRECT: Mark required with asterisk -->
<label for="name">Full name *</label>
<input type="text" id="name" required>

<label for="phone">Phone (optional)</label>
<input type="tel" id="phone">

<!-- Provide explanation -->
<p class="form-hint">* indicates required field</p>
```

**E-commerce - Duplicate CTA:**
```html
<!-- ✅ CORRECT: CTA at top AND bottom ($10M case study) -->
<div class="checkout">
  <button class="place-order">Place Order</button>
  
  <!-- Order details -->
  
  <button class="place-order">Place Order</button>
</div>
```

**Mobile Navigation - Bottom Bar:**
```html
<!-- ✅ CORRECT: Bottom navigation (thumb-friendly) -->
<nav class="mobile-nav-bottom">
  <a href="/home">Home</a>
  <a href="/search">Search</a>
  <a href="/cart">Cart</a>
  <a href="/account">Account</a>
</nav>

<style>
.mobile-nav-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: var(--space-3);
}

.mobile-nav-bottom a {
  min-height: 48px;
  min-width: 48px;
}
</style>

<!-- ❌ WRONG: Top hamburger (thumb stretch) -->
<nav class="mobile-nav-top">
  <button class="hamburger">☰</button>
</nav>
```

## Section 8: Healthcare/Therapy-Specific Guidance

**Trust Signals:**
```html
<div class="credentials">
  <p>Licensed Clinical Psychologist (LCP #12345)</p>
  <p>Board Certified in Clinical Psychology</p>
  <img src="hipaa-badge.svg" alt="HIPAA Compliant">
</div>
```

**Calming Color Schemes:**
```css
/* Option 1: Warm earthy tones */
:root {
  --bg: #faf8f5;
  --text: #3d3d3d;
  --accent: #8b7355;
  --surface: #f5f1ec;
}

/* Option 2: Cool serene blues */
:root {
  --bg: #f0f4f7;
  --text: #2c3e50;
  --accent: #5a8baa;
  --surface: #e8f0f5;
}
```

**Generous Spacing:**
```css
/* More breathing room than typical sites */
section {
  padding: var(--space-16) 0;
}

p {
  line-height: 1.7; /* Higher than typical 1.5 */
  margin-bottom: var(--space-4);
}
```

**Soft Shadows:**
```css
:root {
  --shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.08);
  --shadow-softer: 0 1px 6px rgba(0, 0, 0, 0.05);
}

.card {
  box-shadow: var(--shadow-soft);
}
```

**Accessibility Legal Requirement:**
```html
<!-- Therapy/healthcare sites MUST be accessible -->
<img src="therapist.jpg" alt="Dr. Jane Smith, Licensed Therapist">

<video controls>
  <track kind="captions" src="captions.vtt">
</video>

<form>
  <label for="symptoms">Describe your symptoms</label>
  <textarea id="symptoms" aria-required="true"></textarea>
</form>
```

## Section 9: Pre-Delivery Verification Checklist

### Accessibility Audit (10 items)
- [ ] Touch targets ≥44×44px with 8px spacing
- [ ] Focus indicators visible (3px outline, 2px offset)
- [ ] All images have alt text
- [ ] All form inputs have associated labels
- [ ] Semantic HTML used (<header>, <nav>, <main>, <article>, <section>, <footer>)
- [ ] Heading hierarchy correct (no skipped levels)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3.0:1 UI)
- [ ] Keyboard navigation works (Tab, Arrow keys)
- [ ] Reduced-motion media query implemented
- [ ] Screen reader tested (VoiceOver/NVDA)

### Typography Audit (7 items)
- [ ] Line-height contextual (1.1 headings, 1.5 body, 1.6 code)
- [ ] Line length appropriate (65ch body, 40ch headings)
- [ ] Type scale uses Major Third (1.25) or Perfect Fourth (1.333)
- [ ] Font weights use extremes (300/700/900, not middle)
- [ ] Letter-spacing adjusted (-0.02em large, 0 normal, +0.05em small)
- [ ] Custom fonts loaded (not system defaults)
- [ ] Font pairing uses contrast (serif + sans, display + mono)

### Color Audit (6 items)
- [ ] Dark mode uses near-black (#0f-1a), not pure black
- [ ] Text uses off-white (#e8-f5), not pure white
- [ ] Avoided AI purple (#5E6AD2, indigo gradients)
- [ ] Darkening colors increases saturation
- [ ] Contrast verified (meets WCAG ratios)
- [ ] Colors defined as CSS variables in :root

### Layout Audit (5 items)
- [ ] 8-point grid system used consistently
- [ ] Border-radius varied (4px, 8px, 16px, 24px, not all same)
- [ ] Intentional asymmetry present (not everything centered)
- [ ] Design tokens used (no hardcoded values)
- [ ] Touch target spacing ≥8px

### Animation Audit (6 items)
- [ ] Custom cubic-bezier functions (not linear/ease)
- [ ] Duration system defined (0.1s, 0.2s, 0.3s, 0.4s)
- [ ] Staggered animation delays (0.2s, 0.4s, 0.6s)
- [ ] Only transform/opacity animated (never width/height)
- [ ] will-change used on animated elements
- [ ] prefers-reduced-motion implemented

### Code Quality Audit (5 items)
- [ ] Reusable components (no duplicated button code)
- [ ] Design tokens centralized (CSS variables in :root)
- [ ] No inline styles
- [ ] Semantic HTML (no div soup)
- [ ] No unused/commented code

### UX Audit (7 items)
- [ ] Navigation labels clear (Products/Pricing/Blog, not Solutions/Offerings/Insights)
- [ ] Current page indicator visible
- [ ] Required fields marked with asterisk, optional marked explicitly
- [ ] Mobile nav at bottom (thumb-friendly)
- [ ] Primary actions in thumb zone on mobile
- [ ] Forms show inline validation errors
- [ ] E-commerce has duplicate CTAs (top and bottom)

### Performance Audit (3 items)
- [ ] Fonts preloaded with <link rel="preload">
- [ ] Images optimized (WebP format, proper sizes)
- [ ] No layout shift (CLS < 0.1)

**Total: 81 verification points**

## Critical Implementation Notes

### NEVER Generate
1. Pure black (#000000) or pure white (#FFFFFF)
2. AI purple (#5E6AD2, indigo-violet gradients, 80-100% saturation)
3. Uniform line-height (1.5 everywhere)
4. Touch targets <44px
5. Animations on width/height/top/left
6. Generic navigation labels (Solutions, Offerings, Insights)
7. Div soup (nested divs without semantic HTML)
8. Inline styles
9. Hardcoded color values
10. Removed :focus-visible outlines

### ALWAYS Generate
1. Near-black (#0f-1a) and off-white (#e8-f5)
2. Contextual line-height (1.1/1.3/1.5/1.6)
3. Touch targets ≥44×44px
4. Custom cubic-bezier easing
5. Semantic HTML (<header>, <nav>, <main>, <section>, <footer>)
6. CSS variables for all design tokens
7. Staggered animation delays
8. WCAG AA contrast compliance
9. Keyboard navigation support
10. Reduced-motion support

## Variance Strategy (Anti-Convergence)

**Rotation System:**
- After serif heading, use sans-serif
- After dark theme, use light theme
- After cool colors, use warm colors
- After rounded corners, use sharp corners
- After bottom nav, use sidebar

**Forbidden Consecutive Patterns:**
- Same font pairing twice in a row
- Same color palette twice in a row
- Same layout grid twice in a row

**Quality Check:**
"Would a designer immediately recognize this as AI-generated?"
If YES → iterate
If NO → success

## Success Metrics

You succeeded when:
- User says "this looks professionally designed" (not "looks like AI")
- Accessibility audit 100% pass
- Design feels unique, not generic SaaS
- Code is maintainable with reusable components
- Users complete their intended actions without confusion

You failed when:
- User asks "which button do I click?"
- Code blocks have poor contrast
- Mobile experience feels broken
- Touch targets too small
- Generic "AI purple" gradients used
- Everything looks like every other AI-generated site

## When to Use This Skill

Apply this skill whenever:
- Creating any web interface or application
- Designing landing pages, marketing sites, or web apps
- Building components or design systems
- The user mentions "design," "UI," "UX," or "interface"
- Healthcare or therapy practice websites (use Section 8)
- The user wants something that "looks professional"
- Avoiding AI-generated aesthetic is important

Your goal: **Create designs users trust and prefer, not designs that look AI-generated.**
