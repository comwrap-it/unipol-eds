# Category Carousel

Carousel of Category Cards. Defines a label field and restricts to only 3 children category cards. Model in `_category-carousel.json`; behavior in `category-carousel.js`.

## Overview
- Renders a horizontal, swipeable carousel of `category-card` items.
- On tablet, shows scroll indicator (arrows + dots); on mobile the cards are in column.
- Loads card CSS on demand and preserves UE instrumentation.

## Field Reference (UE Model)
Source: `_category-carousel.json` (model: `category-carousel`).

## Filters
- Filter: `category-carousel` → Allowed components: `category-card`.
- Constraints: `only 3 cards embedded`.

## Runtime Behavior (insurance-product-carousel.js)
- Builds `.category-carousel-container.swiper` and `.category-carousel.swiper-wrapper` with slide items.
- Tablet: appends scroll indicator and initializes Swiper.
- Mobile: shoes in column the 3 cards.
- Instrumentation: Moves/preserves UE attributes when transforming rows into slides and cards.

## Authoring Notes (Universal Editor)
- The rows are `category-card` items.
