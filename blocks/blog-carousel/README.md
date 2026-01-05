# Blog Carousel

Carousel of blog preview cards with optional small-device button configuration. Universal Editor (UE) model in `_blog-carousel.json`; logic in `blog-carousel.js`.

## Overview
- Renders a horizontal, swipeable carousel of blog preview cards.
- Supports navigation arrows and dot indicators when multiple cards are present.
- Optionally renders a small-device button configured via embedded Standard Button fields.
- Loads dependent styles for tags and blog card lazily.
- Initializes Swiper for scrolling; keyboard/touch interactions supported.

## Field Reference (UE Model)
Source: `_blog-carousel.json`.

- standardButtonLabel (text): Button label.
- standardButtonVariant (select): `primary` | `secondary` | `accent`.
- standardButtonHref (aem-content): Target URL (optional). If provided, renders as `<a>`; otherwise `<button>`.
- standardButtonOpenInNewTab (boolean): Opens in a new tab when true.
- standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
- standardButtonLeftIcon / standardButtonRightIcon (select): Optional icon classes.
- Purpose: Configure the button shown on small screens.
- Fields: Inlines all fields from `atoms/buttons/standard-button/_standard-button.json`.
- How it works: The block reads the first row to `createButtonFromRows(...)`, attaching the resulting button with class `blog-carousel-button`.

## Runtime Behavior (blog-carousel.js)
- Structure: Builds `.blog-carousel-container.swiper` with `.blog-carousel.swiper-wrapper` and slide cards.
- Data: Uses mocked blog card data via `scripts/mock.js` (replace with real data integration if available).
- Navigation: If more than one card, adds scroll indicator with left/right buttons and dots; wires Swiper events to update indicator.
- Accessibility: Sets `role="region"`, `aria-label="Blog carousel"`, and `tabindex="0"` on the container; disables Swiper a11y module in favor of custom semantics.
- Styling: Ensures dependent CSS for tags and blog preview card is loaded before rendering.

## Authoring Notes (Universal Editor)
- Field-to-row mapping:
  - Row 0 → `button-container` (Standard Button rows)
- To show a button on small devices, configure the Standard Button fields in the first row.
- The carousel content/cards are currently sourced programmatically; authoring controls for cards are not part of this block's model.

## Defaults and Fallbacks
- No configured button: a warning is logged, and only the carousel renders.
- Single card: carousel chrome (arrows/dots) is omitted; the card is displayed statically.
