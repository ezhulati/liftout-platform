# Practical UI Design System — Complete Reference

Evidence-based guidelines for intuitive, accessible, and beautiful interfaces. Based on *Practical UI* by Adham Dannaway (283 pages, 14 chapters).

---

## Core Philosophy

Every design decision should have a logical reason that improves usability. Design using objective logic rather than subjective opinion—"that looks nice" is not constructive feedback.

## Three Foundational Principles

1. **Minimise usability risks** - Consider people with poor eyesight, low computer literacy, reduced dexterity, and cognitive differences. Meet WCAG 2.1 Level AA requirements.

2. **Minimise interaction cost** - Reduce physical and mental effort (looking, scrolling, clicking, typing, thinking, remembering). Apply Fitts's Law (closer/larger targets are faster) and Hick's Law (fewer choices = faster decisions).

3. **Minimise cognitive load** - Remove unnecessary styles/information, break up information into smaller groups, use familiar patterns, maintain consistency, create clear visual hierarchy.

---

## Quick Reference Tables

### Spacing System (8pt base)
| Token | Value | Usage |
|-------|-------|-------|
| XS | 8pt | Closely related elements, icon-to-label |
| S | 16pt | Related elements within groups |
| M | 24pt | Between groups, section padding |
| L | 32pt | Section separators |
| XL | 48pt | Major sections |
| XXL | 80pt | Page sections, hero areas |

### Type Scale (1.25 ratio)
| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 44px | Bold | 1.1-1.2 |
| H2 | 35px | Bold | 1.2 |
| H3 | 28px | Bold | 1.2-1.3 |
| H4 | 22px | Bold | 1.3 |
| Body | 18px+ | Regular | ≥1.5 |
| Small | 16px | Regular | 1.5 |

### Color Contrast Requirements (WCAG 2.1 AA)
| Element | Minimum Ratio |
|---------|---------------|
| Small text (≤18px) | 4.5:1 |
| Large text (>18px bold or >24px) | 3:1 |
| UI components (borders, icons) | 3:1 |
| Between button weights | 3:1 |

### Button Hierarchy
| Weight | Style | Usage |
|--------|-------|-------|
| Primary | Solid fill, white text | Most important action (1 per view) |
| Secondary | Border/outline only | Less important actions |
| Tertiary | Underlined text only | Least important actions |

### Form Input Selection
| Options | Recommended Control |
|---------|-------------------|
| 2 options | Checkbox or toggle |
| ≤5 options | Radio buttons |
| 6-10 options | Radio buttons or dropdown |
| >10 options | Autocomplete search |

---

## Accessibility Checklist

- [ ] Text contrast ≥4.5:1 (small) or ≥3:1 (large)
- [ ] UI element contrast ≥3:1
- [ ] Touch targets ≥48×48pt
- [ ] Don't rely on color alone for meaning
- [ ] Form fields have visible labels (not just placeholders)
- [ ] Error messages explain what went wrong and how to fix
- [ ] Links are distinguishable from regular text
- [ ] Focus states are visible

## Common Anti-Patterns to Avoid

- Light grey text for aesthetics (accessibility risk)
- Icons without labels (comprehension risk)
- Colored heading text (looks like links)
- Placeholder text as labels (disappears on input)
- Disabled buttons without explanation (frustrating)
- Justify-aligned text (uneven spacing)
- Center-aligned long text (hard to read)
- Multiple primary buttons (unclear hierarchy)
- Trendy styles like Glassmorphism/Neuomorphism (contrast issues)

---

# Chapter 1: Fundamentals

## Minimise Usability Risks

While it might not sound very fun or creative, base many design decisions on risk—the risk that someone could have difficulty using an interface.

**Common usability risks:**
- Thin, light grey text can look sleek and trendy, but there's a risk that some may find it difficult to read
- Icons without labels can look clean and minimal, but there's a risk that some might not understand what the icons mean. This risk is greater for those with cognitive and vision impairments
- It might look nice to add colour to heading text, but there's a risk that some could mistake it for a link

Usability testing should highlight large risks, but smaller ones could go unnoticed. It depends on the diversity of users you test with and the effectiveness of the testing. Most of the time you don't know the different types of people that will be using your product, so it's safest to cater to as many as possible.

**Consider:** People with poor eyesight, low computer literacy, reduced dexterity, and cognitive ability. Make sure that your designs meet Web Content Accessibility Guidelines (WCAG).

**Target:** WCAG 2.1 Level AA requirements—this is the medium level of conformance and a good place to start.

Keep an eye out for potential usability risks. If there's anything that's slightly vague, confusing or unclear, simplify it to make it crystal clear before investing time and money in usability testing.

## Have a Logical Reason for Every Design Detail

The importance of UI design is often trivialised as being nothing more than making an interface look pretty. This demonstrates an ignorance of the logic behind UI design. Sure, some elements are purely decorative, but if an interface is designed well, every detail will have a logical reason behind it that improves usability.

UI design is about so much more than how it looks. It's about how it works and why it works that way. When designing an interface, you're literally designing the user's experience.

**Benefits of designing with logic:**
- Faster and easier design decisions
- Support decisions in discussions
- Provide constructive feedback to other designers

"That looks nice" or "I don't like it" are just subjective opinions, not logical or constructive feedback.

**Example logical reasons for a simple row of text blocks with icons:**
- Icons and text are left aligned to create a neat left edge—improves readability and aesthetics while decreasing cognitive load
- Headings and text links are descriptive so they're scannable and can be read out of context by screen readers
- Secondary text is less important than headings, so it's made less prominent (using size and contrast) to create a clear visual hierarchy
- Secondary text line height is at least 1.5 to improve readability
- Text links are coloured blue to indicate they're interactive and underlined so the colour blind can distinguish them from other text
- Spacing inside each block is less than the spacing between each block to create groups of related information
- Spacing is based on a set of predefined spacing options to improve consistency
- Information is broken up into smaller groups to make it easier to understand and to help speed up decision making
- Colours are based on an accessible monochromatic colour palette with rules that govern its usage

## Minimise Interaction Cost

**Definition:** Interaction cost is the sum of physical and mental effort required to achieve a task.

**Components:** Looking, scrolling, searching, reading, clicking, waiting, typing, thinking, and remembering all add to interaction cost.

The higher the interaction cost, the harder it is for someone to achieve their task. The great thing about interaction cost is that you can measure it—try to minimise it to make it easier for people to achieve their goals.

Simple apps that focus on doing a specific task efficiently are often the most successful because they keep interaction costs down.

### How to Minimise Interaction Cost

**1. Keep related actions close (Fitts's Law)**
According to Fitts's Law, the closer and larger a target, the faster it is to click on that target. Keep actions close to the element they relate to and try to ensure they have a sufficient target area (at least 48pt by 48pt is a safe size).

**2. Reduce distractions**
Attention grabbing distractions like animated banners, pop-ups, and unnecessary visuals can pull people's attention away from the task they're trying to complete.

**3. Minimise choice (Hick's Law)**
According to Hick's Law, the time it takes to make a decision increases with the number and complexity of choices. Reduce choices to speed up decisions. You can also highlight a smaller set of recommended or popular items to help people make decisions faster.

### Interaction Cost Example

**Before (high cost):** Dropdown quantity selector
- 2 clicks to open and select
- 1 scroll through options
- Move mouse to "Add to cart" button
- 1 click
- **Total: 3 clicks, a scroll, and a short mouse movement**

**After (low cost):** Stepper component + left-aligned button
- Stepper allows increase/decrease with single button press or typing
- Button close to quantity selector
- Left-aligned button ensures it won't be missed by screen magnifier users
- **Total: 2 clicks and a very small mouse movement**

## Minimise Cognitive Load

**Definition:** Cognitive load is the amount of brain power required to use an interface.

**Goal:** Minimise cognitive load to make your interface as easy to use as possible. This frees up mental resources for people to focus on the task they're trying to achieve.

### Quick Ways to Reduce Cognitive Load

1. **Remove unnecessary styles, information, and decisions** to reduce distractions
2. **Break up information into smaller groups** to clearly show relationships and speed up decision making
3. **Use conventional design patterns** that people are familiar with
4. **Maintain consistency** by ensuring that similar elements look and work in a similar way
5. **Create a clear visual hierarchy** to show the level of importance of information

### Example: Breaking Up Complex Forms

People can get overwhelmed by large, complex problems. Breaking them down into smaller, simpler ones makes them easier to solve.

A large complex form with many fields → Multiple simple steps with fewer fields each, progress indicator showing "Step 2 of 4"

## Create a Design System

Having endless design possibilities sounds great in theory, but in practice, it can be frustrating and time consuming. When designing an interface, there are so many options to choose from regarding layout, spacing, typography, and colour, it can quickly get overwhelming.

That's why having a system of predefined options and guidelines to help you efficiently make design decisions is crucial. This is known as a design system.

### 3 Steps to Create a Design System

#### Step 1: Set Predefined Style Options

Rather than choosing from unlimited options for things like colour, typography, and spacing, create a small set of predefined options to choose from. Limiting your options in this way helps improve consistency and speeds up design decisions.

**Predefined options should cover:**
- Spacing scale
- Colour palette
- Typography scale
- Border radius
- Shadow/elevation levels
- Icon sizes

#### Step 2: Create Reusable Modules

Design a library of reusable UI components (modules) that include the predefined style options. For example: buttons, form fields, cards, navigation, modals.

**Benefits:**
- Faster design and development
- Consistency across product
- Easier maintenance
- Reduced cognitive load for users

#### Step 3: Define Usage Guidelines

Document when and how to use each style option and component. Guidelines ensure consistency as teams grow and products evolve.

**Example guidelines:**
- Indicate actions using the primary colour
- Use sentence case
- Left align buttons
- Left align text
- Try to avoid disabled buttons
- Front-load text
- Be concise and use plain and simple language

### Design System Components

**Colour Palette Example (HSB values):**
| Shade | HSB Values | Usage |
|-------|------------|-------|
| Darkest | 220, 90, 30 | Heading text |
| Dark | 220, 40, 57 | Secondary text |
| Medium | 220, 34, 72 | Dark borders |
| Light | 220, 10, 95 | Light borders |
| Lightest | 220, 2, 98 | Background |

**Spacing Scale:**
| Token | Size |
|-------|------|
| XS | 8pt |
| S | 16pt |
| M | 24pt |
| L | 32pt |
| XL | 48pt |
| XXL | 80pt |

**Type Scale:**
| Level | Size | Weight |
|-------|------|--------|
| Heading 1 | 40px | Bold |
| Heading 2 | 32px | Bold |
| Heading 3 | 24px | Bold |
| Heading 4 | 20px | Bold |
| Small | 18px | Regular |
| Tiny | 16px | Regular |

**Button Weights:**
| Weight | Style |
|--------|-------|
| Primary | Solid fill |
| Secondary | Border/outline |
| Tertiary | Text only |

**Form Controls:**
| Control | Usage |
|---------|-------|
| Input | Free text entry |
| Dropdown | Select from list |
| Radio buttons | Single choice from few options |
| Checkboxes | Multiple choices |

## Ensure an Interface is Accessible

Accessibility ensures that people with disabilities can use your interface. This includes people with visual, auditory, motor, and cognitive impairments.

### Assistive Technologies

**Screen Readers** - Read out the content of a website. Used by people with visual impairments or those who prefer to listen rather than read.
- Enable people to navigate websites using a keyboard
- Read out text, buttons, links, and other elements
- Describe images using alt text
- Navigate using headings, lists, and landmarks

**Screen Magnifiers** - Enlarge content for people with low vision.
- Users see only a portion of the screen at a time
- Important content should be left-aligned so it's visible
- Buttons and actions should be close to related content

### WCAG 2.1 Guidelines Summary

**Level A** (Minimum)
- Text alternatives for images
- Captions for audio
- Content can be accessed with keyboard
- No content that flashes more than 3 times per second

**Level AA** (Target this level)
- Colour contrast of at least 4.5:1 for normal text
- Colour contrast of at least 3:1 for large text and UI components
- Text can be resized up to 200%
- Multiple ways to navigate
- Focus indicators are visible
- Consistent navigation and identification

**Level AAA** (Enhanced)
- Colour contrast of at least 7:1 for normal text
- Sign language for audio
- Extended audio descriptions

### Key Accessibility Rules

1. **Don't rely on colour alone** - Use icons, patterns, or text in addition to colour
2. **Provide text alternatives** - Alt text for images, captions for videos
3. **Ensure keyboard navigation** - All functionality available via keyboard
4. **Maintain sufficient contrast** - 4.5:1 for small text, 3:1 for large text and UI
5. **Use clear, descriptive labels** - Buttons, links, and form fields should be clear
6. **Provide visible focus states** - Show which element is currently focused
7. **Don't time out unexpectedly** - Warn users before timing out

## Use Common Design Patterns

Design patterns are proven solutions to common design problems. They're familiar to users, so using them reduces cognitive load and improves usability.

**Benefits of using common patterns:**
- Users already know how they work
- Less time needed for usability testing
- Faster development
- Reduced errors

**Examples of common patterns:**
- Navigation menus at the top or left
- Logo links to homepage
- Search in the header
- Shopping cart icon in the corner
- Form labels above inputs
- Primary action button on the right (for wizards) or left (for forms)
- Modal dialogs for confirmations
- Tabs for switching between views

**When to deviate from patterns:**
- When usability testing shows the pattern doesn't work for your users
- When the pattern creates accessibility issues
- When you have strong evidence a new pattern is significantly better

Even then, test thoroughly before implementing.

## Use the 80/20 Rule to Prioritise

**The Pareto Principle (80/20 Rule):** Roughly 80% of results come from 20% of efforts.

In UI design, focus on the 20% of features and content that provide 80% of the value to users. This helps you:
- Prioritise what to design first
- Decide what to emphasise visually
- Know what to test most thoroughly
- Identify what to simplify or remove

**Application examples:**
- Focus on core user flows, not edge cases
- Emphasise primary actions over secondary ones
- Test main features before nice-to-haves
- Remove rarely-used features

## Keep Costs in Mind

If you're working on a commercial project, time isn't free. Every minute spent on user research, design, usability testing, development, and quality assurance costs money.

**Ways to improve efficiency:**
- Consider using an existing design system or UI kit to save time
- Outsource time-intensive tasks (e.g., use an existing icon set rather than creating your own)
- Stick with familiar UI patterns to save time and money on usability testing
- Learn how interfaces are built and coded to understand technical constraints
- Talk to developers early and often to achieve more from your design for less

The simple approach is usually cheaper to build and easier for customers to understand and use.

## Be Consistent

**Definition:** Consistency in UI design means that similar elements look and work in a similar way.

This should be true:
1. **Within your product** (internal consistency)
2. **Compared with other products** (external consistency)

This predictable functionality improves usability and reduces errors, as people don't need to keep learning how things work.

### Internal Consistency

To maintain visual and functional consistency within your product, create a design system to define guidelines for:
- Components
- Templates
- Visual styles
- Language

### External Consistency

Be consistent with other products people are familiar with. If your product sits on a certain platform (iOS, Android), follow platform guidelines unless they test poorly or result in accessibility issues.

**Follow well-established patterns:**
- Link text is underlined
- Form checkboxes are small squares with a tick icon
- Input fields are rectangles with a label on top
- Navigation is at the top or side
- Logo links to homepage

---

# Chapter 2: Less is More

## Remove Unnecessary Information

Every element you add to your interface competes with existing elements. This can make it harder for people to understand. Unnecessary information is a distraction that increases cognitive load, so try to ensure every interface element has a logical reason behind it.

### Quick Tips

1. **Remove repeated elements** to instantly simplify your interface without losing information
2. **Avoid unneeded words and introductory phrases** (covered in Copywriting chapter)
3. **Reveal less important information gradually** (progressive disclosure)

### Example: Repeated Course Names

**Before:**
```
Contents
UI Design Fundamentals Course - Chapter 1 - Colours
UI Design Fundamentals Course - Chapter 2 - Typography
UI Design Fundamentals Course - Chapter 3 - Layout
```

**After:**
```
UI Design Fundamentals Course

Contents
Chapter 1 - Colours
Chapter 2 - Typography
Chapter 3 - Layout
```

Making the course name a subheading removes the repetition and simplifies the design. It also helps people differentiate between the chapters.

## Remove Unnecessary Styles

Just like unnecessary information can be distracting and increase cognitive load, so can unnecessary styles. Avoid unnecessary lines, colours, backgrounds, and animations to create a simpler, more focused interface.

**Unnecessary styles are those that don't convey information—they're purely decorative.**

Not saying you shouldn't have any decorative styles (aesthetics are important), but try to ensure they don't hinder usability.

### Common Problems

1. **Decorative colours without purpose** - List items with different colours that lack meaning. This could be confusing to some who assume the colours have meaning
2. **Blue underlined headings that aren't links** - People will try to click them
3. **Decorative icons that look like buttons** - Could be confused for interactive elements
4. **Overly prominent icons** - All very prominent and competing for attention

### Style Trends Fade

It's tempting to use the latest popular visual style trends, but trends are always changing. The more trendy effects you use, the worse your interface will age over time. Sticking with minimal styles that highlight quality content is better for longevity.

### Problematic Style Trends

**Glassmorphism** - Frosted glass effect with blur
- Very difficult to create clear visual hierarchy
- Difficult to achieve sufficient contrast
- Background images can interfere with readability

**Neuomorphism** - Soft, extruded shapes with subtle shadows
- Very difficult to create clear visual hierarchy
- Insufficient contrast between elements
- Button states are hard to distinguish

**The advice:** Experiment with different visual styles, but make sure they don't hinder usability or exclude people from being able to use your interface.

## Not All Links Need to Be Underlined

For accessibility, consistency, and good usability, it's safest to make text links coloured and underlined. This conventional link treatment helps differentiate links from other text and clearly indicates interactivity.

**However:** Some UI elements already look and feel interactive, so you don't need to underline and colour the text:
- Navigation menus
- Cards
- Tabs
- Buttons

These have other cues to indicate they're interactive. Removing the conventional link treatment for these components can help simplify your interface.

### Example: Interactive Cards

Cards with image and text inside a raised box have sufficient visual cues to indicate the card is interactive. The combination of:
- Image
- Text
- Raised box/container
- Often a subtle hover state

...makes the interactivity clear without blue underlined text.

Feel free to keep the conventional link treatment for extra clarity if desired.

## Use Progressive Disclosure

**Definition:** Progressive disclosure is the act of revealing information gradually as needed.

Show people only what they need to know to complete the task at hand, rather than overwhelming them with all of the information upfront. For those who want more information, allow them to easily access it without overwhelming others.

**Trade-off:** Progressively disclosing information slightly increases interaction cost, but can significantly decrease cognitive load and speed up decision making.

### Example: Feature Benefits

**Before (all information visible):**
```
Strengthen your brand with a custom domain

Look professional and help your customers find you online by adding a custom domain.

Benefits of a custom domain
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper hendrerit turpis ac condimentum. Vivamus pretium iaculis lobortis. Pellentesque non blandit neque. Quisque nibh libero, sodales sit amet posuere at, elementum. Aliquam finibus turpis magna, lobortis tempus lectus fermentum at cras ac imperdiet turpis.

• Lorem ipsum dolor sit amet
• Donec semper hendrerit turpis ac
• Vivamus pretium iaculis lobortis

[Add domain]
```

**After (progressive disclosure):**
```
Strengthen your brand with a custom domain

Look professional and help your customers find you online by adding a custom domain.

▶ Benefits of a custom domain  [expandable accordion]

[Add domain]
```

### Label Best Practice

Don't use generic "Show more" text in accordion components. Instead, use a descriptive label to:
- Aid scanning
- Ensure the action makes sense when read out of context

### Example: Form Fields

Progressively disclose the mobile number field to those who need it:

**Before:** Mobile number field always visible (optional)

**After:** 
```
☐ Receive updates via text message
```
When checked, the mobile number field appears. This:
- Avoids the need for an optional field
- Simplifies the form for people who aren't interested

## Don't Confuse Minimalism with Simplicity

**Key insight:** Minimal doesn't mean simple.

We have a tendency to favour minimal interfaces as they can look beautiful and clean. A minimal interface has fewer elements and styles, but isn't necessarily simple to understand and use.

**Problem:** Minimal interfaces can often be vague or confusing as they lack crucial details needed for good usability.

**Simplification isn't just about reduction.** Removing or hiding too much can harm usability. You need to make sure that you're not removing critical information or details.

### Example: Photo Editor Interface

**Minimal (problematic):**
- Interface, photo filters, and bottom navigation aren't labelled
- Selected state of filters and navigation is very subtle
- Share and save actions are hidden
- Contrast of icons is insufficient

**Simple (clear):**
- All sections labelled (Exposure, Presets, Colour, Contrast)
- Clear selected states
- Visible action buttons (Edit, Share, Save)
- Filter names visible (Natural, Warm, Cool, Soft, Greyscale)

**Fixes:**
- Make sure important actions are clearly visible
- Label interface elements
- Use sufficient contrast
- Show clear selected states

## Design for the Smallest Screen First

Assuming your product will be used across a range of different screen sizes, **start designing on the smallest size first** (mobile-first).

**Why:**
- The restricted space forces you to prioritise important elements
- Forces you to remove unnecessary elements
- Results in simpler interfaces on larger screens too

**Problem with desktop-first:** If you start designing on a large screen first, there's a tendency to want to fill the screen with more information. You don't need to fill the screen—more information can increase cognitive load and slow down decision making.

**Analogy:** It's similar to living in a large home compared to a small one. We tend to fill large homes with lots of stuff we don't need. In a small one, we have no choice but to be more organised and focused on the essentials.

## Break Up Choices to Speed Up Decision Making

**Hick's Law:** The time it takes to make a decision increases with the number and complexity of choices.

Present fewer choices more simply to help people make decisions faster.

### 4 Ways to Break Up Choices

#### 1. Remove Choices

The most obvious way—actually remove unnecessary options.

Whether you're designing a form, navigation, or landing page, make sure every option earns its place. If it's not necessary, it's a potential distraction.

**Example: Newsletter Subscription**

Before:
```
First name *
Company name *
Email *
[Subscribe]
```

After:
```
Email
[Subscribe]
```

Benefits of removing fields:
- Much simpler form
- Faster and easier to complete
- Higher conversion (less work, less personal information required)

#### 2. Group or Categorise Choices

Reduce the number and complexity of choices by grouping or categorising them.

It's simpler and faster to decide between a small number of categories than to choose an option from a large list.

**Example: Blog Articles**

Before: All 185 articles in one list

After:
```
Articles
[All (185)] [Interiors] [Architecture] [Gardens]
```

Articles are categorised to break them up and make them easier to browse.

#### 3. Break Up Choices into Multiple Steps

Make large, complex tasks seem less overwhelming by breaking them into multiple smaller steps.

**Benefits:**
- Decreases cognitive load
- Allows people to focus on one small thing at a time

**Applications:**
- Long forms broken into multiple steps
- Large navigation menus broken into multiple levels

**Example: Multi-level Navigation**
```
Features ▼

Analytics                    Marketing
├─ Trend monitoring         ├─ Website builder
├─ Custom reports           ├─ Email marketing
├─ User segmentation        ├─ Discount codes
└─ Live dashboard           └─ Affiliate program
```

Navigation menu broken into multiple levels helps people find what they're looking for, one decision at a time.

#### 4. Recommend Choices

Make decisions easier by recommending popular or common choices.

If a lot of people prefer certain choices, there's a good chance others will too.

**Examples:**
- Video streaming websites recommend popular videos
- Search boxes suggest common search terms to help people narrow down their search faster

**Example: Search Suggestions**
```
[Int_____________]

Suggested searches:
• Interior design
• Interior decor
• Renovated interiors
```

Suggested search terms help people narrow down their search faster.

---

# Chapter 3: Colour

## Ensure Sufficient Contrast

**Definition:** Contrast is a measure of the difference in perceived brightness between two colours. It's expressed as a ratio ranging from 1:1 to 21:1.

- Black text on black background = 1:1 (lowest)
- Black text on white background = 21:1 (highest)

### WCAG 2.1 Level AA Requirements

| Element | Minimum Ratio |
|---------|---------------|
| Small text (18px or less) | 4.5:1 |
| Large text (24px regular+ or 18px bold+) | 3:1 |
| UI elements (form fields, icons, etc.) | 3:1 |

Decorative elements and styles that don't convey meaning don't need to meet these ratios.

### Common Contrast Problems

- Close icon contrast less than 3:1
- Secondary text contrast less than 4.5:1
- Search field border contrast less than 3:1
- Placeholder text less than 4.5:1
- Button background contrast against white text less than 4.5:1
- Link text contrast less than 4.5:1

### APCA: An Improved Contrast Algorithm

**Accessible Perceptual Contrast Algorithm (APCA)** is part of the WCAG 3 draft and fixes limitations of WCAG 2.

**Example problem with WCAG 2:**
White text on orange background FAILS WCAG 2 (3.04:1), but black text PASSES (4.5:1). However, white text is clearly easier to read. APCA correctly scores white text higher (62) than black (43).

**APCA uses numbers instead of ratios:**
| APCA Value | Usage |
|------------|-------|
| 90 | Preferred for body text (14px regular+) |
| 75 | Minimum for body text (18px regular+) |
| 60 | Minimum for other text (24px regular or 16px bold+) |
| 45 | Minimum for large text (36px regular or 24px bold+) and UI elements |
| 30 | Absolute minimum for placeholder text, disabled buttons |
| 15 | Minimum for non-text elements |

**Key APCA differences from WCAG 2:**
1. Swapping text and background colours affects contrast (white on blue ≠ blue on white)
2. Works better for dark interfaces (WCAG 2 results in hard-to-read text on dark backgrounds)

**Recommendation:**
- Personal projects: Use APCA
- Commercial projects requiring compliance: Stick with WCAG 2 until WCAG 3 is released
- Ideally, pass both

## Don't Rely on Colour Alone to Convey Meaning

Many types of colour blindness exist, mainly affecting men. Most common: difficulty distinguishing red and green. Some can't see any colour at all.

**Rule:** Use additional visual cues to differentiate interface elements beyond colour.

### Example: Form Errors

**Bad:** Red border only indicates error
**Good:** Red border + icon + thicker border + background shade

### Example: Text Links

**Bad:** Blue colour only indicates link
**Good:** Blue colour + underline

The underline clearly differentiates the link from other text for colour blind users.

## Use System Colours to Indicate Status

Three system colours for status messages:

| Colour | Meaning | Usage |
|--------|---------|-------|
| Red | Error | Negative message, system failure, urgent attention needed |
| Amber/Yellow | Warning | Caution, action could be risky |
| Green | Success | Positive message, action completed as expected |

Traffic light colours are used because they have familiar meanings.

### Accessibility for System Colours

- Use additional visual cues (icons) for colour blind users
- Text in system colours: at least 4.5:1 contrast
- Icons/UI components in system colours: at least 3:1 contrast

**Info/Blue:** Some systems add a fourth colour (blue) for informational messages.

## Use Colour to Define a Clear Visual Hierarchy

Not all information has the same importance. Present information in order of importance by making more important elements more prominent.

### Tools for Colour Hierarchy

**Saturation:** Degree of richness/intensity of a colour
- More saturated colours = more prominent
- Use saturated colours for text links and buttons

**Hue:** Number between 0-360 degrees (rainbow colours)
- Some hues are more prominent (e.g., red stands out most)
- Use prominent hues for urgent elements

**Contrast:** Difference in brightness between colours
- Higher contrast = more prominent
- Make headings darker than body text

## Understand Light and Dark Interfaces

### Light Interfaces
- Dark text and elements on light background
- Most common approach
- Simplest: black on white
- Generally safest—simple, legible, familiar

### Dark Interfaces
- Light text and elements on dark background
- Simplest: white on black
- Great for media-focused apps
- Can be challenging for contrast
- Popular for "dark mode" preferences

### When to Use Each

**Light interfaces best for:**
- Most websites and applications
- Reading-heavy content
- Universal appeal
- Easiest to make accessible

**Dark interfaces best for:**
- Media/video applications
- Gaming
- Low-light environments
- Brands with dark aesthetic

## Use Black and White for a Timeless Aesthetic

Black and white creates a clean, timeless look that won't age quickly. It:
- Lets content shine
- Works for almost any brand
- Avoids trend-dependent colour choices
- Easy to maintain accessibility

## Add a Tinge of Colour to Black and White

Pure black and white can feel cold or harsh. Add a slight tinge of the brand colour to create warmth and cohesion without overwhelming the interface.

**Example:** Instead of pure grey (#808080), use a grey with slight blue tinge (HSB: 220, 10, 50).

## Use 1 Brand Colour

Using a single brand colour:
- Creates a simple, cohesive look
- Allows colour to have functional purpose (indicating interactivity)
- Reduces cognitive load
- Conveys strong brand presence

Most brands consist of a single primary colour, so a monochromatic approach reinforces brand identity.

## Apply the Brand Colour to Interactive Elements

Use colour sparingly and with purpose. Avoid using colour purely for decoration.

**Approach:**
1. Start with black and white
2. Introduce colour only where it conveys meaning
3. Apply brand colour to interactive elements (links, buttons)

This teaches users what's interactive and what's not.

**Important:** Don't apply brand colour to non-interactive elements (like headings), as they could be mistaken for links.

### Contrast Requirements for Brand Colour

**Light interfaces:** Brand colour must have 4.5:1 contrast ratio against background (usually white)

**Dark interfaces:** Brand colour must have 4.5:1 contrast ratio against dark background

### Multiple Brand Colours

If you have multiple brand colours:
- Use the highest contrast colour for interactive elements
- Use others sparingly for decorative elements
- Don't use multiple colours for interactive elements (confusing)

## Create a Monochromatic Colour Palette

Rather than unlimited colour options, create a small set of predefined colours (colour palette). This:
- Makes colour decisions faster and easier
- Results in more consistent design

### What is Monochromatic?

Variations of a single colour, rather than neutral greys. Start with the brand colour and change saturation and brightness to create variations.

**Benefits:**
- Simple and cohesive look
- Colour assigned functional purpose
- Fewer colours = less cognitive load
- Strong brand presence

## Use the HSB Colour System

HSB (Hue, Saturation, Brightness) makes defining colour variations much easier.

| Component | Range | Description |
|-----------|-------|-------------|
| Hue | 0-360° | Rainbow colours |
| Saturation | 0-100 | Intensity/richness (100=rich, 0=grey) |
| Brightness | 0-100 | Lightness/darkness (100=lightest, 0=black) |

## Create a Light Colour Palette

### 7-Part Light Mode Palette

| Variation | HSB Example | Usage | Contrast Requirement |
|-----------|-------------|-------|---------------------|
| Primary | 230, 70, 80 | Actions, interactive elements | 4.5:1 vs lightest |
| Darkest | 230, 60, 20 | Heading text, primary content | 4.5:1 vs lightest |
| Dark | 230, 30, 45 | Secondary/supporting text | 4.5:1 vs lightest |
| Medium | 230, 20, 66 | Non-decorative borders (form fields) | 3:1 vs lightest |
| Light | 230, 10, 95 | Decorative borders | Decorative—no requirement |
| Lightest | 230, 2, 98 | Alternate backgrounds | Must support contrast for text/UI |
| White | 0, 0, 100 | Main background | Must support contrast for text/UI |

### Creating Each Variation

**Primary Colour:**
- Use the main brand colour
- Must have 4.5:1 contrast against lightest variation

**Darkest Variation:**
- Greatly decrease brightness
- Heavily saturate (dark colours need more saturation)
- Aim for very dark grey with tinge of primary

**Dark Variation:**
- Increase brightness from darkest
- Decrease saturation
- Aim for dark grey with tinge of primary

**Medium Variation:**
- Increase brightness from dark
- Decrease saturation
- Aim for medium grey with tinge of primary

**Light Variation:**
- Increase brightness from medium
- Decrease saturation
- Aim for light grey with tinge of primary

**Lightest Variation:**
- Increase brightness from light
- Decrease saturation
- Aim for very light grey with tinge of primary

### Edge Cases for Brand Colours

**If brand colour has meaning (red, green, amber):**
- Consider using the darkest variation for interactive elements
- Or use blue for interactive elements (commonly associated with links)
- Avoids conflicting colour meanings

**If brand colour is too light (yellow):**
- Use darkest variation for button text instead of white
- Add border to buttons for 3:1 contrast
- Or use the light colour in a dark interface instead

## Create a Dark Colour Palette

### 7-Part Dark Mode Palette

| Variation | HSB Example | Usage | Contrast Requirement |
|-----------|-------------|-------|---------------------|
| Primary | 166, 50, 90 | Actions, interactive elements | 4.5:1 vs dark |
| White | 0, 0, 100 | Heading text | 4.5:1 vs dark |
| Lightest | 166, 4, 80 | Secondary text | 4.5:1 vs dark |
| Light | 166, 6, 65 | Non-decorative borders | 3:1 vs dark |
| Medium | 166, 8, 33 | Decorative borders | Decorative—no requirement |
| Dark | 166, 10, 23 | Alternate backgrounds | Must support contrast |
| Darkest | 166, 15, 15 | Main background | Must support contrast |

### Dark Palette Logic

The logic is essentially inverted from light mode:
- White replaces darkest for primary text
- Lightest replaces dark for secondary text
- Light replaces medium for borders
- Medium is decorative
- Dark and darkest are backgrounds

### Testing Your Palette

Test your colour palette using an interface example containing all variations. Seeing colours in context is the only way to be sure they work well together.

## Neutral Greys Alternative

If you prefer a more neutral colour palette:
- Set saturation to zero for all variations
- Keep the primary brand colour as-is
- Results in pure grey variations rather than tinted greys

## Adjust Photo Colour Temperature

Photos should match your interface's colour palette. Adjust colour temperature:

**Warm palette:** Slightly warm photo temperature
**Cool palette:** Slightly cool photo temperature

This creates visual cohesion between photos and the interface.

---

# Chapter 4: Layout and Spacing

## Group Related Elements

Breaking up information into smaller groups of related elements helps to structure and organise an interface. This makes it faster and easier for people to understand and remember.

### 4 Methods for Grouping

1. **Containers** - Place related elements in the same boundary
2. **Proximity** - Space related elements close together
3. **Similarity** - Make related elements look similar
4. **Continuity** - Align related elements in a continuous line

Combine these methods to display groupings more clearly.

## 1. Containers (Common Region)

**Principle:** Items within the same boundary or container are perceived as a group and assumed to be related.

**Create containers using:** Borders, shadows, background colours

**Strongest visual cue** for grouping interface elements.

### Common Container Uses

- Main structure of interface (sidebar, header, footer)
- Cards
- Dialog boxes
- Form sections
- Navigation sections

### When Containers Are Necessary

Use containers when groupings are unclear due to:
- Inconsistent text lengths creating varying gaps
- Elements that could be associated with wrong neighbours
- Need for strong visual separation

### When to Avoid Containers

Don't use containers for every group—can cause unnecessary clutter. Look for opportunities to use other grouping methods for simpler designs.

## 2. Proximity

**Principle:** Elements near each other are perceived as a group and assumed to be related.

**Implementation:**
- Place related elements close together
- Separate unrelated elements with more space

Using spacing instead of containers can help declutter and simplify an interface.

### Proximity Example

**With containers:** Cards around each item
**With spacing only:** Adequate space between items, no cards needed

Spacing can overpower containers as a grouping method when combined with similarity and continuity.

## 3. Similarity

**Principle:** When things look similar, your mind groups them together.

**Make related elements look similar using:**
- Size
- Shape
- Colour
- Style

### Highlighting Within Groups

Within a group of related elements, highlight certain ones by making them slightly different:
- Larger size
- Different colour
- Badge or label
- Filled vs outlined style

### Critical Rule: Similar = Similar Function

If elements look similar, people expect them to work similarly.

**Do:**
- Use consistent visual treatment for same functionality
- Make elements with different functionality look different

**Don't:**
- Make icons look like buttons (suggests interactivity)
- Make badges look like primary buttons
- Use the same colour for interactive and non-interactive elements

## 4. Continuity

**Principle:** People perceive elements arranged in a continuous line to be related.

Our eyes naturally follow elements aligned in continuous straight or curved lines.

### Uses

- Lists
- Tables
- Navigation
- Grids

### Breaking Continuity

Disrupt continuity to:
- Indicate end of a group
- Highlight a particular element
- Insert a different type of content (e.g., newsletter signup in article list)

## Create a Clear Visual Hierarchy

**Definition:** A clear order of importance that helps people scan information quickly and focus on areas of interest.

Not all information has the same importance. Make more important elements look more prominent.

### 6 Tools for Creating Visual Hierarchy

| Tool | Primary | Secondary | Tertiary |
|------|---------|-----------|----------|
| Size | Largest | Medium | Smallest |
| Colour | Darkest/most saturated | Medium | Lightest/least saturated |
| Weight | Bold | Regular | Light |
| Spacing | Most space | Medium space | Least space |
| Position | Top/prominent | Middle | Bottom/less prominent |
| Depth | Highest elevation | Medium | Flat |

### Creating Hierarchy: Step by Step

1. **Group** related information
2. **Order** sections by importance
3. **Order** elements within sections by importance
4. **Apply visual styles** based on importance

### Example: Property Booking Card

**Section 1 (Most important):** Photo gallery, price
**Section 2:** Property details (type, beds, baths, garage)
**Section 3:** Ratings and reviews
**Section 4:** Description

Within each section, apply hierarchy:
- Primary: Largest, darkest, boldest
- Secondary: Medium size, grey, regular weight
- Tertiary: Smallest, lightest, least prominent

## Test Visual Hierarchy Using The Squint Test

**Method:** Squint or blur your eyes when looking at a design. What stands out should be the most important elements.

If important elements don't stand out when squinting, adjust the visual hierarchy.

## Use Depth to Create Visual Hierarchy

**Elevation:** Items that appear closer to you (elevated) are perceived as more prominent.

### Creating Depth with Shadows

| Elevation Level | Shadow | Usage |
|----------------|--------|-------|
| Level 0 | None | Default, flat elements |
| Level 1 | Small (0, 2px, 4px) | Cards, slight elevation |
| Level 2 | Medium (0, 4px, 8px) | Dropdowns, popovers |
| Level 3 | Large (0, 8px, 16px) | Modals, dialogs |

### Shadow Properties

Shadows typically have:
- X offset: 0 (light from above)
- Y offset: Positive (shadow below)
- Blur radius: 2-3x the Y offset
- Colour: Black at 10-20% opacity (or dark grey from palette)

## Understand the Box Model

Every interface element is a rectangular box consisting of:

1. **Content** - The actual content (text, image, etc.)
2. **Padding** - Space between content and border
3. **Border** - Line around the padding
4. **Margin** - Space outside the border

```
┌─────────────────────────────┐
│         Margin              │
│  ┌───────────────────────┐  │
│  │       Border          │  │
│  │  ┌─────────────────┐  │  │
│  │  │    Padding      │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  Content  │  │  │  │
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

Understanding the box model helps you space interface elements accurately.

## Design @1x Using Points

**Points (pt)** are a unit of measurement independent of pixel density.

- 1pt = 1 pixel on standard displays
- 1pt = 2 pixels on 2x Retina displays
- 1pt = 3 pixels on 3x displays

**Always design at 1x** using points. This ensures:
- Consistent sizing across devices
- Easier handoff to developers
- Simpler design files

## Create a Set of Predefined Spacing Options

Rather than choosing from unlimited spacing options, create a small set of predefined values.

### 8pt Spacing System

Base unit of 8 creates values that work well across different screen densities.

| Token | Value | Usage |
|-------|-------|-------|
| XS | 8pt | Closely related elements (icon to label, label to input) |
| S | 16pt | Related elements within groups |
| M | 24pt | Between groups, section padding |
| L | 32pt | Section separators |
| XL | 48pt | Major sections |
| XXL | 80pt | Page sections, hero areas |

### Why 8pt?

- Divides evenly on most screen densities
- Creates consistent rhythm
- Limits decisions
- Easy math

## Space Elements Based on How Closely Related They Are

**Rule:** The closer elements are related, the less space between them.

### Spacing Hierarchy

1. **Tightly related:** XS (8pt) - Icon and label, label and field
2. **Related:** S (16pt) - Elements in same group
3. **Loosely related:** M (24pt) - Different groups in same section
4. **Sections:** L-XXL (32-80pt) - Major section breaks

### Example: Form Fields

- Label to input: XS (8pt) - tightly coupled
- Between form fields: M (24pt) - same form, different groups
- Between form sections: L (32pt) - different logical groups

## Be Generous with White Space

White space (negative space) is the empty area between and around elements.

**Benefits:**
- Improves readability
- Reduces cognitive load
- Creates visual breathing room
- Increases perceived quality
- Guides attention

**Common mistakes:**
- Cramming too much content
- Insufficient margins
- Dense, overwhelming layouts

**Recommendation:** When in doubt, add more space.

## Align the Main Layout to a 12-Column Grid

A grid system helps create consistent layouts and alignment.

### 12-Column Grid Components

1. **Columns** - Vertical divisions (12 is standard, divisible by 2, 3, 4, 6)
2. **Gutters** - Space between columns
3. **Margins** - Space on outer edges

### Responsive Grid Settings

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Desktop (1200px+) | 12 | 32pt | 32pt+ |
| Tablet (768-1199px) | 8 | 24pt | 24pt |
| Mobile (<768px) | 4 | 16pt | 16pt |

### Grid Usage

- Don't make every element snap to grid
- Use grid for main layout structure
- Content within containers doesn't need to align to outer grid

## Align Text to Improve Readability

**Left alignment** (default for LTR languages):
- Easiest to read
- Creates consistent left edge
- Eye knows where to return

**Right alignment:**
- Use sparingly
- Good for numbers in tables
- RTL languages

**Center alignment:**
- Short headings
- Hero text
- Single lines
- **Never** center long body text or multiple paragraphs

**Justify:**
- **Avoid** - Creates uneven spacing (rivers of white)
- Hard to read
- Accessibility issues

## Try to Avoid Using Multiple Alignments

**Problem:** Multiple alignments on a page create visual chaos.

**Solution:** Stick to left alignment with occasional centered headings.

### Mixed Alignment Example

**Bad:** Left-aligned body, centered headings, right-aligned dates, centered buttons
**Good:** Everything left-aligned

## Keep Related Actions Close

**Fitts's Law:** The closer and larger a target, the faster it is to click.

Keep actions close to the elements they relate to:
- Delete button near the item being deleted
- Submit button near the form
- Edit link near the content being edited

### Screen Magnifier Consideration

Users with screen magnifiers see only a portion of the screen. Actions far from content may not be visible. Left-align and keep related.

## Make Sure Important Content is Visible

**Above the fold:** Content visible without scrolling

Important content should be visible immediately:
- Primary call-to-action
- Key value proposition
- Critical navigation

**Note:** People do scroll, but initial visibility matters for engagement.

## Ensure Your Interface is Unbreakable

Design for edge cases:

- **Empty states** - What shows when there's no data?
- **Error states** - What happens when things fail?
- **Loading states** - What shows while waiting?
- **Long text** - Does text overflow or truncate gracefully?
- **Missing images** - What's the fallback?
- **Extreme values** - Very long names, very large numbers?

## Use the Rule of Thirds for Photos

**Rule of Thirds:** Divide image into 9 equal parts with 2 horizontal and 2 vertical lines. Place important elements along lines or at intersections.

Creates more dynamic, interesting compositions than centering subjects.

**Application:**
- Product photos
- Hero images
- Profile pictures
- Feature images

---

# Chapter 5: Typography

## Use a Single Sans Serif Typeface

For most interfaces, a single sans serif typeface is the safest and most practical choice.

### 5 Typeface Classifications

| Classification | Characteristics | Best For |
|---------------|-----------------|----------|
| Sans serif | No decorative strokes, clean | UI, body text, general use |
| Serif | Small decorative strokes | Long-form reading, traditional |
| Script | Handwriting-style, flowing | Decorative, branding |
| Display | Decorative, attention-grabbing | Headlines only |
| Monospace | Fixed-width characters | Code, technical |

### Why Sans Serif?

1. **Legibility** - Clean, simple forms readable at any size
2. **Neutrality** - Works across industries and styles
3. **Versatility** - Multiple weights and styles available
4. **Familiarity** - People are used to reading sans serif on screens
5. **Simplicity** - One typeface = fewer decisions, more consistency

### Choosing a Sans Serif

**Criteria:**
- **Popularity** - Well-established, tested in many contexts
- **Weights** - At least regular and bold (ideally more)
- **x-height** - Taller x-height = better small-size readability
- **OpenType features** - Tabular numbers for data

**Recommended options:**
- Inter
- Roboto
- Open Sans
- Lato
- Source Sans Pro
- Nunito
- Work Sans

**Avoid:** Typefaces that are too thin, too decorative, or have poor character distinction (especially l, 1, I, O, 0).

## Evoke Emotion Using a Second Typeface for Headings

If you want to add personality or emotion, add a **second typeface for headings only**. Keep sans serif for body text.

### Mood by Typeface Style

| Style | Mood | Examples |
|-------|------|----------|
| Serif | Traditional, trustworthy, elegant | Playfair Display, Lora |
| Slab serif | Strong, confident, modern | Roboto Slab, Rockwell |
| Rounded | Friendly, approachable, fun | Nunito, Varela Round |
| Geometric | Modern, clean, tech-forward | Poppins, Montserrat |
| Script | Elegant, personal, creative | Pacifico (use sparingly) |

### Rules for Pairing

1. **Contrast** - Typefaces should be noticeably different
2. **Limit to 2** - More than 2 typefaces creates chaos
3. **Hierarchy** - Display/serif for headings, sans serif for body
4. **Never use script for body text** - Only decorative headers

## Use Regular and Bold Font Weights Only

For most interfaces, you only need 2 weights:
- **Regular (400)** - Body text, secondary text
- **Bold (700)** - Headings, emphasis, labels

**Why limit weights?**
- Simplifies decisions
- Maintains hierarchy
- Reduces file size
- Improves consistency

**When to add more:**
- Semi-bold (600) for subtle emphasis
- Light (300) for very large display text only
- Never use light weights for body text (readability issues)

## Use a Type Scale to Set Font Sizes

Rather than arbitrary sizes, use a type scale based on a ratio.

### Recommended: 1.25 Major Third Scale

| Level | Size | Usage |
|-------|------|-------|
| H1 | 44px | Page titles |
| H2 | 35px | Section headings |
| H3 | 28px | Subsection headings |
| H4 | 22px | Card titles, minor headings |
| Body | 18px | Body text, paragraphs |
| Small | 15px | Captions, meta info |
| Tiny | 12px | Fine print (use sparingly) |

**Scale formula:** Each size = previous size × ratio (1.25)
- 18 × 1.25 = 22
- 22 × 1.25 = 28
- 28 × 1.25 = 35
- 35 × 1.25 = 44

### Other Common Ratios

| Ratio | Name | Best For |
|-------|------|----------|
| 1.067 | Minor Second | Small screens, compact UI |
| 1.125 | Major Second | Body-heavy content |
| 1.200 | Minor Third | General use |
| 1.250 | Major Third | Marketing sites, apps |
| 1.333 | Perfect Fourth | Bold statements |
| 1.414 | Augmented Fourth | High drama |
| 1.618 | Golden Ratio | Artistic, dramatic |

## Make Long Body Text Bigger

For long-form reading (articles, documentation):

**Minimum body text: 18px**

Larger text improves:
- Readability
- Reduced eye strain
- Accessibility for vision impairments

**For short UI text:** 16px can work (labels, buttons, navigation)
**For marketing/hero text:** 20-24px body text common

## Use at Least 1.5 Line Height for Long Body Text

**Line height (leading):** Space between lines of text

**WCAG 2.1 AA requirement:** At least 1.5 for body text

### Line Height Guidelines

| Text Type | Line Height |
|-----------|-------------|
| Body text | 1.5-1.7 |
| Short UI text | 1.4-1.5 |
| Headings | 1.1-1.3 |
| Display text | 1.0-1.2 |

**Why higher line height for body?**
- Eyes can find next line
- Reduces reading fatigue
- Improves comprehension

## Decrease Line Height as Font Size Increases

**Rule:** Larger text needs less line height.

As font size increases:
- Characters are already tall
- High line height looks disconnected
- Tighter spacing looks more cohesive

### Scaling Line Height

| Font Size | Suggested Line Height |
|-----------|----------------------|
| 16-18px | 1.5-1.7 |
| 20-24px | 1.4-1.5 |
| 28-35px | 1.2-1.3 |
| 44px+ | 1.1-1.2 |

## Ensure Ideal Line Length

**Optimal line length:** 45-75 characters per line

**Why it matters:**
- Too short: Eye jumps too often, tiring
- Too long: Hard to find next line, lose place
- Optimal: Comfortable reading rhythm

### Measuring Line Length

Use `ch` unit in CSS (width of "0" character)
```css
p { max-width: 65ch; }
```

### Implementation

- Set max-width on text containers
- Don't let text span full width on large screens
- Multi-column layouts for wide screens

## Left Align Text

**Default alignment: Left** (for left-to-right languages)

### Why Left Alignment?

- Creates consistent left edge
- Eye knows exactly where to return
- Easiest to scan and read
- Works with screen magnifiers

### When to Center

- Short headings (1-3 lines max)
- Hero text
- Single buttons/CTAs
- Labels on symmetric elements

### When NOT to Center

- Body paragraphs
- Long headings
- Multiple lines of text
- Form labels
- Lists

### Never Justify

Justified text creates:
- Uneven word spacing
- "Rivers" of white space
- Reading difficulty
- Accessibility issues

## Decrease Letter Spacing for Large Text

**Letter spacing (tracking):** Space between characters

### Guidelines

| Text Size | Letter Spacing |
|-----------|---------------|
| Body (16-18px) | 0 (default) |
| Small text | +0.02em to +0.05em |
| Large headings (28px+) | -0.01em to -0.03em |
| Very large display (44px+) | -0.02em to -0.04em |

**Why decrease for large text?**
- Large text already has enough visual space
- Tighter spacing looks more refined
- Creates cohesive headlines

**Why increase for small text?**
- Improves readability
- Characters don't merge together

## Ensure Text on Photos is Legible

Text over images is often hard to read due to varying background colours.

### 4 Solutions

**1. Gradient Overlay**
Add a semi-transparent gradient (usually dark to transparent) behind text
```css
background: linear-gradient(transparent, rgba(0,0,0,0.7));
```

**2. Full Image Overlay**
Semi-transparent solid colour over entire image
```css
background: rgba(0,0,0,0.4);
```

**3. Blur Background**
Blur the area behind text
```css
backdrop-filter: blur(10px);
```

**4. Solid Background**
Place text in solid colour container
```css
background: rgba(255,255,255,0.9);
```

### Best Practice

- Test with various images
- Ensure contrast meets 4.5:1 (or 3:1 for large text)
- Consider adding text shadow for extra definition

## Avoid Light Grey and Pure Black Text

### Light Grey Text

**Problem:** Insufficient contrast, hard to read, accessibility failure

**Rule:** Body text should have at least 4.5:1 contrast ratio

### Pure Black Text

**Problem:** Can be harsh, especially on pure white background

**Recommendation:** Use very dark grey instead
- HSB: ~220, 60, 20 (darkest variation from palette)
- Slightly softer appearance
- Still passes accessibility

### Sweet Spot

- Body text: Dark grey (not pure black)
- Headings: Can be darker (darkest from palette)
- Secondary text: Medium grey (maintaining 4.5:1)

## UPPERCASE Guidelines

### Problems with UPPERCASE

- **Harder to read** - Lose word shapes (ascenders/descenders)
- **FEELS LIKE SHOUTING** - Aggressive tone
- **Accessibility issues** - Screen readers may spell out
- **Takes more space** - Same content, wider

### Acceptable Uses for UPPERCASE

- Short labels (1-3 words)
- Category tags
- Buttons (if styled appropriately)
- Emphasis in short headings

### When Using UPPERCASE

1. **Bold weight** - Thin uppercase is very hard to read
2. **Larger size** - At least 11-12px
3. **Increased letter spacing** - +0.05em to +0.1em (opens up cramped appearance)
4. **Limited length** - Only for short text

---

# Chapter 6: Copywriting

## Be Concise

Every word should earn its place. Remove unnecessary words to make text faster to read and easier to understand.

### Words to Remove

| Remove | Why |
|--------|-----|
| Actually | Filler word |
| Basically | Filler word |
| Just | Filler word (usually) |
| Really | Vague intensifier |
| Very | Vague intensifier |
| In order to | Use "to" |
| Due to the fact that | Use "because" |
| At this point in time | Use "now" |
| Would you like to | Use imperative ("Save file") |
| Please | Usually unnecessary in UI |
| Successfully | Implied in success message |

### Before/After Examples

**Before:** "Would you like to save your changes before closing?"
**After:** "Save changes?"

**Before:** "Your message was successfully sent."
**After:** "Message sent."

**Before:** "In order to continue, please enter your password."
**After:** "Enter password to continue."

### Avoid Introductory Phrases

- "Welcome to our app" - They know where they are
- "Here you can..." - Just describe what's there
- "We are pleased to..." - Skip to the point

## Use Sentence Case

**Sentence case:** Capitalize only the first word and proper nouns

**Why sentence case?**
- Easier to read
- More natural
- Less visual noise
- Friendly tone

### Comparison

| Style | Example |
|-------|---------|
| Sentence case ✓ | "Create your account" |
| Title Case | "Create Your Account" |
| ALL CAPS | "CREATE YOUR ACCOUNT" |

### Where to Use Sentence Case

- Buttons
- Headings
- Labels
- Menu items
- Error messages
- Tooltips
- Everything in UI

### Exceptions

- Proper nouns (Google, iPhone)
- Acronyms (API, URL)
- Brand names if they require it

## Use Plain and Simple Language

Write for a general audience. Avoid jargon, technical terms, and complex words.

### Word Substitutions

| Complex | Simple |
|---------|--------|
| Utilize | Use |
| Facilitate | Help |
| Commence | Start |
| Terminate | End |
| Subsequently | Then |
| Prior to | Before |
| In the event that | If |
| Approximately | About |
| Implement | Do, Make |
| Modify | Change |
| Acquire | Get |

### Guidelines

- Write at an 8th-grade reading level
- Short sentences (15-20 words max)
- One idea per sentence
- Active voice over passive voice

### Active vs Passive

**Passive:** "Your file was deleted by the system"
**Active:** "The system deleted your file" or better: "File deleted"

## Front-Load Text

Put the most important information first. People scan from left to right—lead with what matters.

### Examples

**Bad:** "To save your changes, click the Save button"
**Good:** "Click Save to save your changes" or just "Save changes"

**Bad:** "If you have any questions, please contact support"
**Good:** "Contact support for questions"

### Application

- Headings: Key word first
- Instructions: Action first
- Buttons: Verb first (not "Click here to...")
- Error messages: What went wrong first

## Use the Inverted Pyramid

**Structure:** Most important information first, details last.

```
       ┌─────────────────┐
       │  Most Important │  ← Lead with this
       ├─────────────────┤
       │     Details     │  ← Supporting info
       ├─────────────────┤
       │   Background    │  ← Nice to have
       └─────────────────┘
```

### Why?

- People scan, don't read everything
- Important info is seen first
- Works if text is truncated

### Application

- Product descriptions
- Feature explanations
- Help articles
- Email content

## Limit the Use of Abbreviations and Acronyms

Abbreviations and acronyms can confuse users who don't know them.

### Guidelines

1. **Spell out first use:** "Web Content Accessibility Guidelines (WCAG)"
2. **Common abbreviations OK:** FAQ, PDF, URL
3. **Domain-specific:** Only if audience knows them
4. **Avoid creating new ones:** If people won't know it, spell it out

### When Abbreviations Are OK

- Universally known (FAQ, PDF)
- Space is extremely limited
- Technical audience who knows the terms
- After spelling out on first use

### When to Avoid

- General consumer audiences
- Critical instructions
- Error messages
- First-time user experiences

## Limit the Use of UPPERCASE

### Problems with UPPERCASE

1. **Harder to read** - Lose word shapes
2. **Feels like shouting** - Aggressive tone
3. **Takes more space** - Same content, wider
4. **Accessibility** - Screen readers may spell out letters

### Acceptable Uses

- Short labels (1-2 words): "NEW", "SALE"
- Category tabs
- With careful styling (bold, increased letter spacing)

### Requirements for Readable UPPERCASE

- Bold weight
- At least 11-12px size
- Increased letter spacing (+0.05em to +0.1em)
- Maximum 2-3 words

## Break Up Content Using Descriptive Headings and Bullets

### Headings

**Make headings descriptive**, not vague.

| Vague | Descriptive |
|-------|-------------|
| Overview | How our pricing works |
| Features | Features that save you time |
| Details | Shipping and return policies |
| More | Related products you might like |

**Why descriptive?**
- Scannable
- SEO benefits
- Screen readers announce them
- Aid navigation

### Bullets

Use bullets to:
- Break up long paragraphs
- List features/benefits
- Show steps or options

**Bullet guidelines:**
- Keep items parallel (same grammatical structure)
- Start with verbs for action items
- Keep items similar length
- 3-7 items ideal

## Avoid Using "My" on Form Labels

**Prefer:** "Name" over "My name"
**Prefer:** "Email" over "Your email"

### Why?

- Shorter
- Less confusing (whose perspective?)
- Consistent
- Works better for screen readers

### Exception

Sometimes "my" creates clarity:
- "My account" vs "Account" (in navigation)
- "My orders" vs "Orders"

But for form labels, skip it.

## Use Vocabulary Consistently

Use the same word for the same concept throughout.

### Examples

| Inconsistent | Consistent |
|--------------|------------|
| Cart / Bag / Basket | Cart (pick one) |
| Log in / Sign in | Sign in (pick one) |
| Settings / Preferences / Options | Settings (pick one) |
| Cancel / Dismiss / Close | Cancel (context-dependent) |

### Create a Terminology Guide

Document chosen terms:
- Cart (not bag, basket)
- Sign in / Sign out (not log in/out)
- Delete (not remove, for permanent actions)
- Remove (not delete, for reversible actions)

## Use Numerals for Numbers

**Use numerals** (1, 2, 3) instead of words (one, two, three).

### Why Numerals?

- Faster to scan
- Take less space
- Stand out in text
- Easier to compare

### Examples

**Words:** "You have three new messages"
**Numerals:** "You have 3 new messages" ✓

**Words:** "Shipping in five to seven days"
**Numerals:** "Shipping in 5-7 days" ✓

### Formatting Numbers

- Thousands separator: 1,000 (not 1000)
- Decimals: 4.5 (not 4,5 in English)
- Percentages: 25% (not 25 percent)
- Currency: $10 (symbol before number)
- Large numbers: 1.2M, 3.5K (for approximate values)

### Exception

- Beginning of sentence: "Five users joined" (or restructure)
- Stylistic choice for small numbers in prose

## Avoid Full Stops If Possible

**Full stops (periods)** at the end of UI text are usually unnecessary.

### Don't Use Full Stops

- Headings
- Button labels
- Navigation items
- List items (unless full sentences)
- Tooltips
- Labels

### Use Full Stops

- Full sentences in body text
- Multiple sentences together
- Help documentation

### Why Avoid?

- Cleaner appearance
- Matches user expectations
- Reduces visual noise

## Ensure Text Length is Similar Across Similar Interface Elements

When elements should look equal, keep their text lengths similar.

### Examples

**Pricing cards:** Feature lists should have similar number of items and length

**Navigation:** Menu items roughly similar length

**Cards:** Titles and descriptions similar length (or truncate)

### Solutions

- Edit copy to match lengths
- Truncate with ellipsis (...)
- Use line clamping
- Restructure content

## Ensure Text Links Describe Their Destination

Link text should describe where the link goes, not how it works.

### Bad Link Text

- "Click here"
- "Learn more"
- "Read more"
- "Here"

### Good Link Text

- "View pricing plans"
- "Read the full article"
- "Download the PDF"
- "Contact support"

### Why Descriptive Links?

1. **Scannability** - Users scan for links
2. **Accessibility** - Screen readers list links out of context
3. **SEO** - Search engines use link text
4. **Clarity** - Users know what to expect

### Guidelines

- 2-5 words ideal
- Describe the destination
- Avoid "click" (not all users click)
- Front-load keywords

## Write Clear Error Messages

### Error Message Formula

**What went wrong + Why + How to fix it**

### Bad vs Good

**Bad:** "Error"
**Good:** "Password is incorrect. Please try again."

**Bad:** "Invalid input"
**Good:** "Email address must include @ symbol"

**Bad:** "An error occurred"
**Good:** "Unable to save. Check your connection and try again."

### Guidelines

1. **Be specific** - What exactly is wrong?
2. **Be helpful** - How do they fix it?
3. **Be human** - Avoid technical jargon
4. **Be brief** - Get to the point
5. **Don't blame** - "Password incorrect" not "You entered wrong password"

### Format

- Use sentence case
- No exclamation marks
- Don't apologize excessively
- Provide clear next action

---

# Chapter 7: Forms

## Stack Forms in a Single Column Layout

**Use single column layouts** for forms whenever possible.

### Why Single Column?

1. **Clear path** - Top to bottom, no confusion
2. **Mobile-friendly** - Naturally responsive
3. **Faster completion** - No left-right eye movement
4. **Screen magnifiers** - Users see full width
5. **Accessibility** - Tab order is logical

### When Multi-Column is OK

- Related short fields (First name / Last name)
- Date fields (Day / Month / Year)
- Address fields (City / State / ZIP)
- Very long forms where space is limited

### Multi-Column Rules

- Keep related fields together
- Maintain logical tab order
- Test on mobile

## Minimise the Number of Form Fields

Every field you add:
- Increases completion time
- Increases cognitive load
- Reduces conversion

**Question every field:** Is this essential to complete the task?

### Strategies to Reduce Fields

1. **Remove optional fields** - If optional, is it needed?
2. **Combine fields** - "Full name" vs "First" + "Last"
3. **Auto-detect** - Derive country from IP, city from postal code
4. **Defer collection** - Get info later when needed
5. **Use defaults** - Pre-select common options

### Example

**Before:** First name, Last name, Company, Phone, Email, Address, City, State, ZIP, Country, How did you hear about us?

**After:** Email

## Mark Optional Fields

If you have optional fields, mark them clearly.

### Options

1. **Mark optional:** "Company (optional)"
2. **Mark required:** "Email *" with legend "* Required"
3. **Mark both:** Best for clarity

### Which to Mark?

| Situation | Mark |
|-----------|------|
| Mostly required fields | Mark optional |
| Mostly optional fields | Mark required |
| Mixed | Mark both |

**Recommendation:** Mark both for maximum clarity.

## Try to Avoid Optional Fields by Using Opt-ins

Instead of an optional field that most people skip, use a checkbox to reveal the field for those who need it.

### Example

**Before:**
```
Phone (optional): [____________]
```

**After:**
```
☐ Contact me by phone
   [Shows phone field when checked]
```

### Benefits

- Cleaner form for most users
- Progressive disclosure
- Clear intent from users who fill it

## Mark Both Required and Optional Fields

**Safest approach:** Mark everything clearly.

```
Email *                    Company (optional)
[________________]         [________________]

* Required fields
```

### Why Both?

- No ambiguity
- Accessible to screen readers
- Works for any mix of required/optional
- Users don't have to guess

### Formatting

- Required: asterisk (*) with legend explaining it
- Optional: "(optional)" text after label
- Place legend at top of form

## Match Field Width to the Intended Input

**Field width should hint at expected input length.**

### Width Guidelines

| Input Type | Width |
|------------|-------|
| Full name | Full width |
| Email | Full width |
| Phone | ~50% width |
| ZIP/Postal code | 4-6 characters |
| CVV | 3-4 characters |
| State abbreviation | 2 characters |
| Year | 4 characters |
| Credit card | ~16 characters |

### Why Match Width?

- Sets expectations
- Reduces errors
- Guides input
- Looks intentional

### Implementation

Don't make ALL fields full width. Use appropriate widths based on expected content.

## Stick with Conventional Form Field Styles

Users recognize form fields by their appearance. Unconventional styles cause confusion.

### Conventional Styles

- **Rectangle** with visible border
- **Label above** the field (or to the left on wide forms)
- **Rounded corners** OK but not too rounded
- **Background** slightly different from page (optional)
- **Border colour** meets 3:1 contrast

### Avoid

- Borderless fields (hard to identify as inputs)
- Underline-only (minimal but confusing)
- Unusual shapes
- Overly styled/decorated
- Fields that look like buttons

### Border Contrast

**WCAG 2.1 AA:** Form field borders must have at least **3:1 contrast** against background.

## Display Hints Above Form Fields

**Hint placement:** Above the field is safest.

### Why Above?

- Always visible (below may be cut off on mobile)
- Read before entering input
- Doesn't disappear when typing
- Works with screen magnifiers

### When Below is OK

- Very short hints
- Format examples ("mm/dd/yyyy")

### Hint Guidelines

- Keep hints short
- Explain why info is needed
- Show format if important
- Don't repeat the label

### Example

**Label:** Password
**Hint:** Must be at least 8 characters
**Field:** [________________]

## Don't Use Placeholder Text Instead of a Label

**Placeholders are NOT labels.**

### Problems with Placeholder-as-Label

1. **Disappears** when user types
2. **Low contrast** (typically light grey)
3. **Memory burden** - Can't check what field is for
4. **Screen reader issues** - May not announce properly
5. **Auto-fill confusion** - Field looks filled but isn't labelled

### Proper Use of Placeholders

- Format examples: "mm/dd/yyyy"
- Sample input: "e.g., john@example.com"
- Keep contrast sufficient (4.5:1)
- Always have a visible label too

### What to Use Instead

```
Label:        Email
Placeholder:  (optional hint or example)
Field:        [e.g., john@example.com    ]
```

## Try to Use Radio Buttons Instead of Dropdowns

**Radio buttons > Dropdowns** when you have few options.

### When to Use What

| Options | Control |
|---------|---------|
| 2 options | Checkbox, toggle, or radio buttons |
| 3-5 options | Radio buttons |
| 6-10 options | Radio buttons or dropdown |
| 11+ options | Autocomplete/search |

### Why Radio Buttons?

- **Visible** - All options shown at once
- **Faster** - Single click vs two clicks
- **Comparable** - Easy to compare options
- **Less cognitive load** - No memory needed

### When Dropdowns Are OK

- Many options (6+)
- Very limited space
- Alphabetical list (countries, states)
- Data the user knows (their birth year)

## Use an Autocomplete Instead of a Long Dropdown

For 10+ options, use an autocomplete (searchable dropdown).

### Benefits

- **Faster** - Type to filter
- **Scalable** - Works with hundreds of options
- **Flexible** - Handles typos with fuzzy matching
- **Mobile-friendly** - Brings up keyboard

### Implementation

- Allow typing to filter
- Show top results
- Keyboard navigation
- Clear selection option

### Example

Country dropdown with 200+ options → Autocomplete that filters as you type

## Use Steppers for Numeric Fields Instead of Dropdowns

For small numeric ranges, **steppers** (+ and - buttons) work better than dropdowns.

### When to Use Steppers

- Quantity selection (1-10)
- Guests/travelers
- Small number adjustments
- Ages (within small range)

### Stepper Design

- Horizontal layout preferred
- "+" and "-" buttons (not arrows)
- Direct text input allowed
- 48pt minimum target size
- Start at sensible default

### Stepper Example

```
Quantity
[-] 2 [+]
```

### Benefits

- Faster for small adjustments
- Visual feedback
- Works on touch devices
- Prevents invalid input

## Use a Checkbox or Toggle Switch for 2 Options

For yes/no, on/off, true/false options:

### Checkbox
- For agreement/acceptance
- For forms submitted later
- When unchecked state needs to be explicit

### Toggle Switch
- For immediate effect (settings)
- For on/off states
- When change happens instantly

### Key Difference

- **Checkbox:** Commit later (form submission)
- **Toggle:** Immediate effect

### Design

- Checkbox: Small square, checkmark when selected
- Toggle: Sliding switch, ON/OFF visual
- Both: Clear label describing the action

## Use Positive Phrasing for Checkboxes

**Frame checkboxes positively** - checked = enabled/yes.

### Bad (Negative Phrasing)

```
☐ Don't send me emails
```
Confusing: Does checking mean no emails or yes emails?

### Good (Positive Phrasing)

```
☐ Send me email updates
```
Clear: Checking means yes to emails.

### Test for Clarity

If you can't tell what happens when it's checked, rephrase it.

## Break Up Long Forms into Multiple Steps

For forms with many fields, **break into steps** (wizard/multi-step form).

### Guidelines

- **5-7 fields per step** ideal
- **Progress indicator** showing current step
- **Back button** to review/edit previous steps
- **Save progress** for long forms
- **Clear step labels** (not just "Step 1")

### Progress Indicator

```
Step 1 of 3: Contact Details
[●]——[○]——[○]
```

### Benefits

- Less overwhelming
- Focused attention
- Sense of progress
- Can save and resume

### When Single Form is OK

- Under 5-6 fields
- Simple task
- All fields related

## Group Related Fields Under Headings

**Group related fields** visually and with headings.

### Example Groups

- Contact Details (name, email, phone)
- Shipping Address (street, city, state, zip)
- Payment Information (card number, expiry, CVV)

### Implementation

- Clear heading for each group
- Visual spacing between groups
- Keep related fields adjacent
- Logical flow between groups

## Ensure Form Field Borders Are High Contrast

**WCAG 2.1 AA:** Form field borders must have **3:1 contrast** against background.

### Why?

- Users need to find input fields
- Low contrast borders invisible to many
- Essential for low vision users

### Testing

Use a contrast checker to verify border colour against page background.

### Alternatives to Borders

- Filled background (different from page)
- Underline (must be 3:1 contrast)
- Combination of both

## Write Clear Error Messages

See Copywriting chapter for full details.

### Error Message Formula

**What's wrong + Why + How to fix**

### Examples

**Bad:** "Invalid"
**Good:** "Enter a valid email address (e.g., name@example.com)"

**Bad:** "Error"  
**Good:** "Password must be at least 8 characters"

## Ensure Form Field Labels Are Close to Their Fields

**Labels should be close to their fields** - proximity indicates relationship.

### Spacing

- **Maximum gap:** ~8pt between label and field
- Closer is better
- More space between fields than between label and its field

### Why?

- Users can see what label belongs to what field
- Especially important with multiple fields
- Screen magnifiers show both together

### Layout

```
Label          [Gap: 4-8pt]
[Input field_______________]

[Gap: 24pt]

Label          [Gap: 4-8pt]
[Input field_______________]
```

## Validate on Submit Rather Than Inline

**Validate when user submits**, not while they're typing.

### Problems with Inline Validation

- Interrupts typing
- Premature errors (email flagged before @ typed)
- Confusing UX
- Annoying for complex fields

### When Inline Validation is OK

- After field loses focus (on blur)
- For confirming password match
- For checking username availability (after delay)
- Format validation (after typing stops)

### Best Approach

1. Let user complete field
2. Validate on blur (leaving field) OR
3. Validate on submit
4. Show all errors at once
5. Focus first error field

## Error Display

### Summary at Top

Show error summary above form:
- "Please fix 3 errors below"
- Link to each error field

### Individual Errors

Show error message above each field:
- Red icon + red border
- Error text explaining issue
- Focus first error field

### Error States

- **Border:** Red (or thicker + red)
- **Icon:** Error icon before label or in field
- **Background:** Light red tint (optional)
- **Text:** Error message above or below field

---

# Chapter 8: Buttons

## Define 3 Button Weights

Establish a hierarchy with **three button weights**:

### Primary Button
- **Style:** Solid fill with contrasting text (usually white)
- **Usage:** Most important action on the page
- **Rule:** Only ONE primary button per view/section
- **Examples:** Submit, Save, Continue, Sign up, Buy now

### Secondary Button
- **Style:** Border/outline only, no fill
- **Usage:** Less important actions
- **Examples:** Cancel, Back, Learn more, Save draft

### Tertiary Button
- **Style:** Text only (underlined or just coloured)
- **Usage:** Least important actions
- **Examples:** Skip, Dismiss, Reset, View details

### Visual Hierarchy

```
[████ PRIMARY ████]    Most prominent
[    Secondary    ]    Medium prominence
     Tertiary          Least prominent
```

### Contrast Requirements

| Element | Requirement |
|---------|-------------|
| Button shape/border | 3:1 against background |
| Button text | 4.5:1 against button fill |
| Between button weights | 3:1 contrast difference |

## Use a Single Primary Button for the Most Important Action

**One primary button per view** - multiple primary buttons create confusion.

### Why Only One?

- Clear call-to-action
- Guides user to main goal
- Reduces decision fatigue
- Creates visual hierarchy

### Exception

Side-by-side equally important options:
- "Sign in" and "Create account" (both could be primary-styled)
- But even then, consider which is MORE important

### Common Mistake

```
[████ DELETE ████]  [████ SAVE ████]  ← Wrong: two primary
```

```
[████ SAVE ████]  [ Delete ]  ← Right: primary + secondary
```

## Use Secondary Buttons for Less Important Actions

**Secondary buttons** for actions that are available but not the main goal.

### Common Uses

- Cancel
- Back
- Save as draft
- Skip
- Alternative actions

### Pairing with Primary

```
[████ Submit ████]  [ Cancel ]
```

Primary always more prominent than secondary.

## Use Tertiary Buttons for the Least Important Actions

**Tertiary buttons** (text links styled as buttons) for lowest-priority actions.

### Common Uses

- Reset form
- Skip this step
- Dismiss
- View more details
- Less prominent navigation

### Style

- Text only
- Underline (optional but recommended for accessibility)
- Same colour as primary or muted

## Try to Avoid Disabled Buttons

**Disabled buttons are problematic:**

### Problems

1. **Low contrast** - Hard to see
2. **No explanation** - User doesn't know why
3. **Not focusable** - Can't be reached by keyboard
4. **Frustrating UX** - Dead end without guidance

### 4 Alternatives to Disabled Buttons

#### Alternative 1: Keep Button Enabled, Validate on Click

Let users click, then show what's wrong:
- Show error messages
- Highlight incomplete fields
- Guide user to fix issues

**Best for:** Forms, input validation

#### Alternative 2: Remove Unavailable Actions

If action isn't available, don't show the button at all:
- Show explanation of why action isn't available
- Show when it will become available

**Best for:** Permission-based features, eligibility requirements

#### Alternative 3: Use Lock Icon with Tooltip

Show button normally but with a lock icon:
- Still visible and recognizable
- Tooltip explains why it's locked
- Can be keyboard-focused

**Best for:** Premium features, permission needed

#### Alternative 4: If You Must Use Disabled

If disabled button is absolutely necessary:

**Requirements:**
1. Add explanation text nearby explaining why
2. Make it keyboard-focusable for screen readers
3. Add tooltip with explanation
4. Use 3:1 contrast (minimum)
5. Use `aria-describedby` for explanation

```html
<button disabled aria-describedby="disable-reason">
  Submit
</button>
<p id="disable-reason">
  Complete all required fields to submit
</p>
```

## Left Align Buttons

**Left-align buttons** in most cases.

### Why Left Align?

1. **F-pattern reading** - Eyes start left, buttons visible
2. **Screen magnifiers** - Left content always visible
3. **Mobile consistency** - Touch targets at expected location
4. **Reduced interaction cost** - Closer to most content

### Button Placement

#### Forms
```
[████ Submit ████]  [ Cancel ]
```
Both left-aligned, primary first.

#### Modal Dialogs
```
                    [ Cancel ]  [████ Confirm ████]
```
Exception: Modals often right-align with primary rightmost.

#### Mobile
```
[████████████ Primary ████████████]
[          Secondary              ]
```
Full-width, stacked vertically, primary on top.

### When Right Align is OK

- Modal confirmation dialogs
- Wizard "Next" buttons (progress flows right)
- Table row actions

## Ensure Button Text Describes the Action

**Button labels should describe what happens**, not how.

### Bad Labels

- "Click here"
- "Submit"
- "OK"
- "Yes / No"
- "Continue"

### Good Labels

- "Create account"
- "Send message"
- "Delete project"
- "Save changes"
- "Add to cart"

### Formula: Verb + Noun

```
[Verb] + [Object]
"Save" + "changes" = "Save changes"
"Delete" + "file" = "Delete file"
"Send" + "invitation" = "Send invitation"
```

### Why Descriptive?

- User knows what will happen
- Reduces anxiety
- Confirms intent
- Accessible to screen readers

### Context Exception

When context makes it clear:
- In a "Delete Project" modal: "Delete" is OK (context provides object)
- In a form: "Submit" could work if form purpose is clear

## Ensure Buttons Have a Sufficient Target Size

**Minimum touch target: 48pt × 48pt** (WCAG 2.1)

### Why 48pt?

- Average fingertip ~10mm
- Accounts for imprecise tapping
- Includes people with motor impairments
- Room for error

### Measuring Target Size

Target includes:
- Button content
- Padding
- Any clickable area

Can be achieved with:
- Large button (48pt+ height)
- Smaller button with larger clickable area (padding)

### Guidelines

| Device | Minimum Target |
|--------|----------------|
| Touch (mobile) | 48pt × 48pt |
| Desktop (mouse) | 32pt × 32pt (24pt minimum) |

### Common Mistakes

- Icon buttons too small
- Link text with no padding
- Close buttons in corners (hard to tap)

## Balance Icon and Text Pairs

When buttons have **both icon and text**, balance their visual weight.

### Icon Position

| Position | Usage |
|----------|-------|
| Leading (left of text) | Most common, natural reading flow |
| Trailing (right of text) | "Next" with arrow, external links |

### Visual Balance

- **Icon size:** Match the x-height of text (or slightly larger)
- **Spacing:** 8pt between icon and text
- **Weight:** Icon shouldn't overpower text (or vice versa)

### Examples

```
[🔍 Search]        ← Leading icon
[Next ➡]           ← Trailing icon
[+ Add item]       ← Leading icon
[Download ↓]       ← Trailing icon
```

### Icon-Only Buttons

If icon-only (no text):
- **Must have accessible label** (`aria-label`)
- **Consider tooltip** for clarity
- **48pt minimum target**

## Add Friction to Destructive Actions

**Destructive actions** (delete, remove permanently) need **friction** to prevent accidents.

### Friction Levels

| Level | Method | Example |
|-------|--------|---------|
| Light | Confirmation dialog | "Delete this file?" |
| Medium | Retype confirmation | "Type DELETE to confirm" |
| Heavy | Multi-step confirmation | Slack's channel deletion |
| Best | Allow undo | Gmail's "Undo" after delete |

### Choosing Friction Level

| Consequence | Friction |
|-------------|----------|
| Reversible (soft delete) | Light or none |
| Moderate impact | Light confirmation |
| Significant impact | Medium confirmation |
| Irreversible, high impact | Heavy confirmation |

### Best Practice: Allow Undo

If possible, don't truly delete immediately:
1. "Delete" moves to trash
2. Show "Undo" option (5-10 seconds)
3. Empty trash later or auto-delete after period

**Gmail example:** "Message deleted. Undo"

### Destructive Button Styling

**Don't use primary style for destructive actions:**

```
[████ DELETE ████]  ← Dangerous: looks like primary action
[     Delete     ]  ← Better: secondary style
[ Delete ]          ← Best: tertiary with red text
```

Consider using:
- Red text colour for destructive actions
- Secondary or tertiary weight
- Warning icon

## Common Button Mistakes

### 1. Multiple Primary Buttons
Only one primary button per view.

### 2. Disabled Without Explanation
Add text explaining why button is disabled.

### 3. Vague Labels
"Submit" → "Create account"

### 4. Wrong Hierarchy
Delete as primary, Save as secondary → Swap them.

### 5. Poor Contrast
Ensure 4.5:1 text contrast, 3:1 shape contrast.

### 6. Tiny Touch Targets
Minimum 48pt × 48pt for touch.

### 7. Icons Without Labels
Always add accessible labels for icon-only buttons.

### 8. Inconsistent Styling
Same button type should look the same everywhere.

### 9. Missing Focus State
All buttons need visible focus state for keyboard users.

## Button States

Every button needs these states designed:

| State | Description |
|-------|-------------|
| Default | Normal appearance |
| Hover | Mouse over (desktop) |
| Active/Pressed | Being clicked |
| Focus | Keyboard focus |
| Disabled | Can't be used (if necessary) |

### Focus State

Must be clearly visible:
- Outline (not just colour change)
- 3:1 contrast against surroundings
- Doesn't rely on colour alone

---

*Source: Practical UI by Adham Dannaway*
