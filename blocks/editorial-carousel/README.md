# Editorial Carousel

Carousel of editorial cards with optional mobile “Show more” button. Defines a label for the mobile button and restricts children to editorial cards. Model in `_editorial-carousel.json`; behavior in `editorial-carousel.js`.

## Overview
- Renders a horizontal, swipeable carousel of `editorial-carousel-card` items.
- On desktop, shows scroll indicator (arrows + dots) when there are many cards.
- On mobile, hides cards after the first four and shows a configurable “Show more” button.
- Loads card CSS on demand and preserves UE instrumentation.

## Field Reference (UE Model)
Source: `_editorial-carousel.json` (model: `editorial-carousel`).

1) showMoreButtonLabel (text)
- Purpose: Label for the mobile-only “Show more” button.
- Default: "Mostra di più".
- Constraint: `maxlength: 15`.

## Filters
- Filter: `editorial-carousel` → Allowed components: `editorial-carousel-card`.
- Constraints: `min: 1`, `max: 8` cards.

## Runtime Behavior (editorial-carousel.js)
- Structure: Builds `.editorial-carousel-container.swiper` → `.editorial-carousel.swiper-wrapper` with slide items.
- Desktop: If >4 cards, adds scroll indicator and initializes Swiper; otherwise centers slides group.
- Mobile: If >4 cards, hides cards beyond the fourth and shows the "Show more" button which reveals hidden cards.
- Instrumentation: Moves/restores UE attributes when transforming rows into slides and cards.

## Authoring Notes (Universal Editor)
- First row is used to set `showMoreButtonLabel`; subsequent rows are card items.
- Add 1–8 `editorial-carousel-card` items as rows; the first card is treated as LCP candidate for image loading optimizations.

## Defaults and Fallbacks
- No label provided: defaults to "Mostra di più".
- ≤4 cards: no scroll indicator on desktop and no “Show more” on mobile.
