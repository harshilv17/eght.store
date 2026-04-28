---
name: EGHT Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f1500'
  on-tertiary-container: '#c76c00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 100%
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 110%
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 120%
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 160%
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 160%
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 100%
    letterSpacing: 0.1em
spacing:
  unit: 8px
  gutter: 24px
  margin-edge: 40px
  section-gap: 120px
---

## Brand & Style

This design system is built for the intersection of high-fashion editorial and raw streetwear culture. The aesthetic is rooted in **Minimalism** and **High-Contrast Boldness**, favoring structural integrity over decorative elements. It aims to evoke a feeling of "quiet luxury" mixed with "urban authority"—the UI should feel like a premium printed lookbook rather than a standard e-commerce interface.

The design relies on extreme whitespace to create a sense of exclusivity. Visual tension is achieved through asymmetric layouts and tight typography, ensuring that photography remains the primary driver of the brand's narrative.

## Colors

The palette is strictly curated to emphasize form and photography. 
- **Deep Black (#121212):** Used for primary typography, structural borders, and high-impact backgrounds. It provides the "bold" anchor for the brand.
- **Crisp White (#FFFFFF):** The canvas. Used to create breathability and an editorial feel.
- **Off-White (#F5F5F5):** Used for subtle section differentiation and background containers to soften the high-contrast transitions.
- **Muted Orange (#D97706):** A surgical accent color. It must be used sparingly—only for critical calls to action, micro-interactions, or limited-edition labels.

## Typography

The typography system utilizes **Inter** to achieve a modern, utilitarian look reminiscent of Neue Haas Grotesk. 

- **Headlines:** Set with tight tracking and leading to create a "block" effect. Display sizes should be used aggressively to break the grid.
- **Body Text:** Focused on legibility with generous line height (160%) to balance the density of the headlines.
- **Labels:** Utilizes uppercase styling and wide letter-spacing for a technical, "product spec" appearance.

## Layout & Spacing

This design system employs a **12-column fixed grid** for desktop, but encourages **asymmetric placement** within that grid. Content should not always center-align; intentionally leaving "empty" columns creates an editorial pacing.

- **Vertical Rhythm:** Large vertical gaps (120px+) between sections to allow the brand campaign imagery to breathe.
- **Margins:** Wide side margins (40px+) to frame the content like a page in a magazine.
- **Asymmetry:** Key elements (like product descriptions) should often be offset from their primary imagery to create a dynamic visual flow.

## Elevation & Depth

To maintain a "flat" high-fashion aesthetic, this design system avoids traditional drop shadows. Depth is communicated through:

- **Tonal Layering:** Using the off-white (#F5F5F5) against pure white (#FFFFFF) to define different functional areas.
- **Low-Contrast Outlines:** Using very thin (1px) borders in a subtle grey or deep black to define boxes without adding visual "weight."
- **Stacking:** Elements may overlap (e.g., text over images) to create a physical, layered feel, but they remain mathematically flat.

## Shapes

The shape language is strictly **Sharp (0px)**. Rounded corners are perceived as too "soft" or "friendly" for a bold streetwear brand. Every button, input field, and image container must utilize hard 90-degree angles to reinforce the architectural and aggressive nature of the brand.

## Components

### Buttons
- **Primary:** Solid Black (#121212) with White text. Sharp corners. Large padding (16px 32px).
- **Secondary:** Transparent with a 1px Black border.
- **Accent:** Solid Muted Orange (#D97706) for "Limited Drop" or "Add to Cart" to draw immediate attention.

### Input Fields
- Underline style only (1px black bottom border) or a full sharp-edged box with a very thin border. Labels sit above the field in `label-caps`.

### Cards
- **Product Cards:** Image-first. No borders or shadows. Typography (Name/Price) is positioned in a minimal stack below the image, often left-aligned.
- **Editorial Cards:** Large-scale background images with `display-xl` typography overlaying the visual.

### Navigation
- Top-aligned, high whitespace. Links are in `label-caps`. Use a minimal "hamburger" or a simple text-based menu to maintain a clean aesthetic.

### Additional Elements
- **Marquee:** Scrolling text in `display-xl` for announcements.
- **Vertical Text:** Used for side-labels or "Collection Year" indicators to break the horizontal flow.