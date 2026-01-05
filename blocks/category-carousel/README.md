# Insurance Product Carousel

Carousel of Insurance Product Cards with optional mobile “Show more” button. Defines a label field and restricts children to product cards. Model in `_insurance-product-carousel.json`; behavior in `insurance-product-carousel.js`.

## Overview
- Renders a horizontal, swipeable carousel of `insurance-product-card` items.
- On desktop, shows scroll indicator (arrows + dots) for many cards; on mobile, hides cards after the first four and shows a configurable “Show more”.
- Loads card CSS on demand and preserves UE instrumentation.

## Field Reference (UE Model)
Source: `_insurance-product-carousel.json` (model: `insurance-product-carousel`).

1) showMoreButtonLabel (text)
- Purpose: Label for the mobile-only “Show more” button.
- Default: "Mostra di più". Max 15 chars.

## Filters
- Filter: `insurance-product-carousel` → Allowed components: `insurance-product-card`.
- Constraints: `min: 1`, `max: 8` cards.

## Runtime Behavior (insurance-product-carousel.js)
- Builds `.insurance-product-carousel-container.swiper` and `.insurance-product-carousel.swiper-wrapper` with slide items.
- Desktop: If >4 cards, appends scroll indicator and initializes Swiper.
- Mobile: If >4 cards, hides extra slides and shows "Show more" that reveals all.
- Instrumentation: Moves/preserves UE attributes when transforming rows into slides and cards.

## Authoring Notes (Universal Editor)
- First row sets `showMoreButtonLabel`; subsequent rows are `insurance-product-card` items.
- First card is treated as LCP candidate for image loading.

## Defaults and Fallbacks
- No label provided: defaults to "Mostra di più".
- ≤4 cards: no scroll indicator on desktop and no “Show more” on mobile.
