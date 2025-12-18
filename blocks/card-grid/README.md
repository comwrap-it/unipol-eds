# Card Grid

Grid layout for nested Warranty Card blocks. No direct fields; accepts only specific child components via filter. Logic in `card-grid.js`.

## Overview
- Renders a grid of cards, each sourced from the child rows as Warranty Card blocks.
- Loads the Warranty Card styles on demand.
- Preserves UE instrumentation when moving content into the grid.

## Field Reference (UE Model)
- This block defines no direct model fields.

## Filters
- Filter: `card-grid` → Allowed components: `warranty-card`.
- Purpose: Authoring UI restricts children to Warranty Cards inside this container.

## Runtime Behavior (card-grid.js)
- Reads each row as a child card configuration and calls `createWarrantyCardFromRows` to build it.
- Wraps all generated cards inside a `.card-grid` container.
- Uses `moveInstrumentation` to preserve UE attributes from the source row to the generated card.

## Authoring Notes (Universal Editor)
- Add Warranty Card items as rows inside the Card Grid section; each row becomes one card.
- Since there are no direct fields, the card content is entirely driven by the nested Warranty Card block configuration.

## Defaults and Fallbacks
- If no rows are present, the grid renders empty.
