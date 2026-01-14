# Dynamic Gallery Row - Developer Documentation

## Overview
`dynamic-gallery-row` is an organism-level block that renders a horizontally scrolling, infinite marquee of `dynamic-gallery-card` items.

This block is Universal Editor friendly:
- It preserves instrumentation on authored items.
- It avoids cloning instrumentation/IDs when duplicating slides (non-author mode).

## Architecture

### Component Structure
- **Block Component**: `dynamic-gallery-row`
- **Item Component**: `dynamic-gallery-card`

### File Structure
- `_dynamic-gallery-row.json`: Universal Editor definition + filter
- `dynamic-gallery-row.js`: Block entrypoint that delegates rendering to DS lib
- `dynamic-gallery-row.css`: Layout styles (marquee container, track, spacing, play/pause button)

## Universal Editor Definition (`_dynamic-gallery-row.json`)

### Block Definition
- Filter template: `dynamic-gallery-row`
- Allowed components: `dynamic-gallery-card`

This block has no dedicated model fields; content is represented by its children (cards).

## JavaScript Implementation

### Entry Point (`blocks/dynamic-gallery-row/dynamic-gallery-row.js`)
The block is a thin wrapper that delegates to the design-system implementation:
- `createDynamicGalleryRow([], block)`

### DS Implementation (`scripts/libs/ds/components/organism/dynamic-gallery-row/dynamic-gallery-row.js`)
Core responsibilities:

1. **Ensure required styles are loaded**
   - Loads CSS for standard button, tag, and dynamic gallery card.

2. **Read authored rows and build cards**
   - Iterates block children (each row = one card)
   - Uses `createDynamicGalleryCardFromRows()` to build each card
   - Uses `moveInstrumentation(row, card)` to preserve UE instrumentation

3. **Infinite marquee behavior (non-author mode)**
   - Duplicates slides to ensure a minimum amount of content
   - Creates two identical groups (segment + clone) to loop seamlessly
   - Cloned nodes have `data-aue-*`, `data-richtext-*`, and `id` stripped to avoid duplicates

4. **Play/Pause controls**
   - Adds a single `.dynamic-gallery-play-pause-btn` to the containing section
   - Toggles the icon class and dispatches `pauseDynamicGallery` / `playDynamicGallery` events on the section

5. **Hover speed control**
   - On hover, speed is reduced smoothly (using a target speed + interpolation)

6. **Row-dependent speed**
   - If the block is the second `dynamic-gallery-row` in the same parent/section, it uses a faster base speed.

### Events
- `pauseDynamicGallery` (dispatched on section)
- `playDynamicGallery` (dispatched on section)

Listeners:
- The marquee container listens for `mouseenter` / `mouseleave` to adjust speed.
- The section listens for play/pause events to control the animation loop.

## CSS Styling (`dynamic-gallery-row.css`)

### Key classes
- `.dynamic-gallery-marquee`: overflow viewport
- `.dynamic-gallery-row.marquee-track`: translated belt (animated)
- `.dynamic-gallery-row-group`: a segment of cards (duplicated for looping)
- `.dynamic-gallery-play-pause-btn`: play/pause icon button appended to the section

## Data Flow
1. **Authoring**: UE authors a `dynamic-gallery-row` with `dynamic-gallery-card` items
2. **Extraction**: row reads authored children and converts each row into a card
3. **Rendering**: replaces block content with marquee DOM structure
4. **Duplication** (non-author): duplicates items to ensure a seamless loop
5. **Animation**: starts `requestAnimationFrame` loop and responds to play/pause + hover

## Dependencies
- `scripts/libs/ds/components/molecules/cards/dynamic-gallery-card/dynamic-gallery-card.js`
- `scripts/scripts.js`: `moveInstrumentation()`
- `scripts/utils.js`: `isAuthorMode()`
- `scripts/aem.js`: `loadCSS()`
- `scripts/domHelpers.js` and `scripts/fragment.js` (via card)
