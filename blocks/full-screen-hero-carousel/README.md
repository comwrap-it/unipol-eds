# Full Screen Hero Carousel

Carousel for full-screen hero slides. Restricts children to `hero` items via filter. Logic in `full-screen-hero-carousel.js`.

## Overview
- Renders one or more Hero slides; enables carousel UI when multiple slides exist.
- Loads required CSS for Hero and Standard Button.
- Uses scroll indicator (arrows + dots) on multi-slide setups; keyboard/touch supported.

## Field Reference (UE Model)
- This block defines no direct model fields.

## Filters
- Filter: `full-screen-hero-carousel` → Allowed components: `hero`.

## Runtime Behavior (full-screen-hero-carousel.js)
- Transforms each row into a Hero slide using `extractHeroPropertiesFromRows` + `createHero`.
- Wraps slides in `.swiper` + `.swiper-wrapper`, sets region roles and labels.
- When multiple slides, appends scroll indicator and initializes Swiper; otherwise renders a single hero without controls.

## Authoring Notes (Universal Editor)
- Add one or more `hero` items as rows. Each row maps to one slide.
- The block applies `theme-dark` by default; adjust styles if needed.

## Defaults and Fallbacks
- With only one slide, no navigation UI is rendered.
