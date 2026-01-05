# Mini Hero Carousel

## Overview
Swiper-based carousel of Mini Hero slides with navigation and pagination dots. Forces dark theme on the section and supports both image and video backgrounds per slide.

## Field Reference (UE Model)
- No direct fields on the carousel. Each slide is a Mini Hero using its own model. The filter allows `mini-hero` items to be placed in the carousel.

## Runtime Behavior
- Styles: Lazily loads `standard-button` and `mini-hero` CSS once.
- Container: Builds `div.swiper[role=region][aria-label="Hero carousel"][tabindex=0]` with an inner `div.swiper-wrapper[role=list]`.
- Slides: For each row, extracts Mini Hero properties and creates a slide via `createMiniHero(..., isCarousel=true)`. UE instrumentation is moved from source rows to the generated slide.
- Navigation & Dots: When more than one slide, appends a scroll indicator with left/right buttons and dots, initializes Swiper with navigation, and wires `handleSlideChange` to keep dots and arrows in sync. `slidesPerView=1`, `a11y` enabled.
- The block receives `theme-dark` to match visual design.

## Authoring Notes
- Author one row per slide. Inside each slide row, follow the Mini Hero row order (background, flags, title, bullets, button config).
- A single slide renders without the scroll indicator and navigation arrows. Multiple slides enable full carousel controls.
- Instrumentation is preserved: `moveInstrumentation()` transfers `data-aue-*` and related attributes onto each generated slide.

## Defaults and Fallbacks
- Empty blocks render nothing.
- CSS is loaded only once per page to avoid duplicates.
