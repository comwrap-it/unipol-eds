# Scroll Indicator

## Overview
Molecule component providing left/right navigation icon buttons and a three-dot progress indicator. Commonly used inside carousels (e.g., Mini Hero Carousel).

## Field Reference (UE Model)
- No fields. It is instantiated programmatically by other blocks.

## Runtime Behavior
- Styles: Lazily ensures `icon-button` and `scroll-indicator` CSS are loaded once.
- Structure: `.scroll-indicator` (adds `.hero-indicator` when used inside hero) containing:
  - Left button: `createIconButton('un-icon-chevron-left', primary, medium)` inside `.left-icon-button.swiper-button-prev`.
  - Dots: `.expanding-dots` with three dots; one dot is always `expanded`. The container toggles positional classes based on state.
  - Right button: `createIconButton('un-icon-chevron-right', primary, medium)` inside `.right-icon-button.swiper-button-next`.
- API: Returns `{ leftIconButton, scrollIndicator, rightIconButton, setExpandedDot }`. `setExpandedDot({ isBeginning, isEnd })` sets dot positions (left/center/right).

## Authoring Notes
- This block is designed for programmatic use; do not author content directly.
- Hosting blocks (e.g., carousels) should append the returned elements and wire navigation events.

## Defaults and Fallbacks
- If styles are already loaded, subsequent calls won’t reload them.
