# Header Utilities Section

Row of small utility navigation pills (e.g., actions/icons) for the header. Restricts children to utilities pills. Model/filter in `_header-utilities-section.json`; behavior in `header-utilities-section.js`.

## Overview
- Displays a horizontal list of Navigation Pills tailored for utility actions.
- Dynamically hides pill labels on small screens while keeping ARIA labels for accessibility.

## Field Reference (UE Model)
Source: `_header-utilities-section.json`.

Model: `header-utilities-navigation-pill`
- Includes all fields from `atoms/navigation-pill/_navigation-pill.json`.

## Filters
- Filter: `header-utilities-section` → Allowed components: `header-utilities-navigation-pill`.

## Runtime Behavior (header-utilities-section.js)
- Builds pills with `createNavigationPill()` and injects into `.header-utilities-container`.
- Preserves UE instrumentation where present.
- On resize, toggles visual label visibility while preserving `aria-label` for accessibility.

## Authoring Notes (Universal Editor)
- Configure each pill’s label/icon/variant/link.
- Use the first row’s boolean to hide the visual label while retaining accessible labeling.

## Defaults and Fallbacks
- If no pills are authored, the container remains empty.
