# Category Chip

## Overview
Compact category marker with an icon and capitalized label (Mobility, Welfare, Property). Preserves UE instrumentation.

## Field Reference (UE Model)
- categoryChipCategory (select, required): `mobility` | `welfare` | `property`.
- categoryChipIcon (select, required): Icon class (e.g., `un-icon-search`, `un-icon-phone`).

## Runtime Behavior
- DOM: `<div.category-chip {category}>` with `<span.icon {icon}>` and text label derived from the category.
- Instrumentation: Attributes restored onto the root via `extractInstrumentationAttributes()`.
- Standalone block: `decorateCategoryChip(block)` reads two rows and renders/updates the chip.

## Authoring Notes
- Provide category first, then icon class.
- The icon list is curated; choose one that fits the use case.

## Defaults and Fallbacks
- Missing category defaults to `mobility`.
- Missing icon yields an empty icon span.
