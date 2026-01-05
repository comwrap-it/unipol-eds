# Number Block

## Overview
Displays up to three compact tiles showing a short title (typically a number) and a brief description. Non-interactive and presented with a reveal-in-up animation.

## Field Reference (UE Model)
- numberBlock1/2/3 (tab): Authoring-only grouping; not rendered.
- numberBlockText1/2/3 (text, max 7): Title/number for each item.
- numberBlockSubText1/2/3 (richtext, max 40): Short description under the title.

## Runtime Behavior
- Parsing: Treats block children as a flat sequence of rows in pairs: [title, description], [title, description], ...
- Rendering: For each pair, creates `.number-item` with `.number-item-title` and `.number-item-description`. Moves UE instrumentation into the final nodes.
- Wrapper: All items are wrapped in `.number-block-wrapper.reveal-in-up`.
- Skips items where both title and description are empty.

## Authoring Notes
- Provide rows in pairs: one for the title/number, immediately followed by its description.
- The model exposes three groups; additional pairs (if present) also render following the same pattern.
- Titles can include inline markup; keep content within the specified max lengths to fit the layout.

## Defaults and Fallbacks
- If only one of the pair is provided, the other renders empty; both missing → item is skipped.
- No interactivity or state; purely presentational.
