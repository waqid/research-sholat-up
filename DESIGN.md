---
name: Sholat UP
description: Accurate prayer time schedules for Indonesian cities
colors:
  sky-blue: "#43B3E0"
  sky-blue-light: "#43bff0"
  sky-blue-dark: "#3BA8D3"
  ink: "#3e3e3e"
  ink-light: "#666"
  ink-muted: "#bbb"
  surface-white: "#fff"
  surface-off-white: "#fafafa"
  surface-light-gray: "#f4f4f4"
  nav-dark: "#282828"
  nav-hover: "#383838"
  nav-active: "#484848"
  border-light: "#ddd"
  divider: "#eee"
typography:
  display:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "3.25em"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "2em"
    fontWeight: 700
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "1.5em"
    fontWeight: 700
  body:
    fontFamily: "Open Sans, sans-serif"
    fontSize: "1em"
    fontWeight: 300
    lineHeight: 1.85
rounded:
  sm: "6px"
  md: "8px"
  full: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "#43B3E0"
    textColor: "#fff"
    rounded: "8px"
    padding: "1em 2.35em"
  button-primary-hover:
    backgroundColor: "#43bff0"
    transform: "translateY(-2px)"
  button-secondary:
    backgroundColor: "#444"
    textColor: "#fff"
    rounded: "8px"
  card:
    backgroundColor: "#fff"
    rounded: "0"
    shadow: "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.1)"
  nav:
    backgroundColor: "#282828"
    textColor: "#fff"
    position: "fixed"
---

# Design System: Sholat UP

## 1. Overview

**Creative North Star: "The Precision Tool"**

A utility-first prayer time display. The interface is invisible — users come for the times, not the design. Clean, fast, no fluff. The existing Miniport template provides a functional skeleton but feels dated; the goal is modernization within the existing constraint.

**Key Characteristics:**
- Minimal visual noise — every element serves the prayer time display
- High contrast for outdoor readability
- Mobile-first responsive design
- Fast page load, no JavaScript bloat

## 2. Colors

The palette is functional: neutral surfaces with a single accent color for interaction.

### Primary
- **Sky Blue** (#43B3E0): Primary accent for buttons, links, active states. Used sparingly — less than 10% of the interface. Evokes dawn (Subuh) and clarity.

### Secondary
- **Charcoal** (#444): Secondary buttons, darker accents when needed.

### Neutral
- **Ink** (#3e3e3e): Primary text color. High contrast for readability.
- **Gray** (#666): Body text, descriptions. Now meets WCAG AA.
- **Light Gray** (#bbb): Placeholder text, disabled states.
- **Surface White** (#fff): Card backgrounds, content areas.
- **Off-White** (#fafafa): Subtle section differentiation.
- **Light Gray** (#f4f4f4): Alternate section backgrounds.
- **Navigation Dark** (#282828): Fixed nav background.

## 3. Typography

**Font Family:** Open Sans (Google Fonts) with sans-serif fallback

**Character:** Clean, legible, functional. No personality — pure utility.

### Hierarchy
- **Display** (300 weight, 3.25em, -0.025em letter-spacing): Hero headings, city names.
- **Headline** (700 weight, 2em, -0.015em letter-spacing): Section titles, prayer names.
- **Title** (700 weight, 1.5em): Card headings.
- **Body** (300 weight, 1em, 1.85 line-height): Descriptions, notes. Max line length ~65ch.

## 4. Elevation

The system uses subtle shadows for depth, primarily on cards and interactive elements.

### Shadow Vocabulary
- **Card Shadow** (`inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.1)`): Default card state. Subtle lift.
- **Button Shadow** (`inset 0px 0px 0px 1px rgba(0, 0, 0, 0.5), inset 0px 2px 1px 0px rgba(255, 255, 255, 0.75)`): Subtle 3D button effect, dated aesthetic worth modernizing.
- **Input Shadow** (`inset 0px 2px 3px 1px rgba(0, 0, 0, 0.05)`): Inset depth for form fields.

**The Flat-By-Default Rule.** Consider removing button 3D effects and using flat design with hover state changes.

## 5. Components

### Buttons
- **Shape:** 8px radius
- **Primary:** Sky blue (#43B3E0), white text, padding 1em 2.35em
- **Hover:** Lighter blue (#43bff0), smooth 0.2s transition
- **Secondary:** Charcoal (#444), same shape

### Cards / Prayer Time Boxes
- **Corner Style:** Sharp (0px radius) — current implementation
- **Background:** White (#fff)
- **Shadow Strategy:** Subtle inset border + light shadow
- **Internal Padding:** 2em

### Navigation
- **Style:** Fixed top, dark background (#282828)
- **Typography:** White text, 600 weight, 8px border-radius on links
- **Hover:** Lighter background (#383838)
- **Active indicator:** White triangle caret below active link

### Prayer Time Display (Signature Component)
- **Layout:** 6-column grid on desktop, stacked on mobile
- **Each prayer:** Box with prayer name (headline), time (display)
- **Time formatting:** HH:MM, bold, large (3.25em)

## 6. Do's and Don'ts

### Do:
- **Do** keep the interface minimal — utility first
- **Do** ensure text contrast meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Do** use the sky blue accent sparingly
- **Do** prioritize mobile responsiveness

### Don't:
- **Don't** add features that distract from prayer times
- **Don't** use generic Bootstrap-style gradients or effects
- **Don't** increase visual complexity — users want quick time lookups
- **Don't** use gray body text (#888) that fails contrast — use #666 or darker
- **Don't** use 3D button effects — use flat design with hover state changes
