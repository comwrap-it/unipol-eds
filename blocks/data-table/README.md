# Data Table

Tabular layout composed of `data-table-row` items with an optional button configuration (e.g., Show more). Model in `_data-table.json`.

## Overview
- Acts as a container for a fixed number of `data-table-row` entries.
- Optionally provides a button configuration via Standard Button fields.

## Field Reference (UE Model)
Source: `_data-table.json` (model: `data-table`).

- standardButtonLabel (text): Button label.
- standardButtonVariant (select): `primary` | `secondary` | `accent`.
- standardButtonHref (aem-content): Target URL (optional). If provided, renders as `<a>`; otherwise `<button>`.
- standardButtonOpenInNewTab (boolean): Opens in a new tab when true.
- standardButtonSize (select): Icon size `small` | `medium` | `large` | `extra-large`.
- standardButtonLeftIcon / standardButtonRightIcon (select): Optional icon classes.
- Purpose: Configure an action button associated with the table (e.g., Show more).
- Fields: Inlines all fields from `atoms/buttons/standard-button/_standard-button.json`.

## Filters
- Filter: `data-table` → Allowed components: `data-table-row`.
- Constraints: `min: 4`, `max: 8` rows.

## Runtime Behavior
- No decoration logic is defined in `data-table.js` at this time; rendering is driven by child row components.

## Authoring Notes (Universal Editor)
- Add between 4 and 8 `data-table-row` items as children.
- Configure the optional button using the Standard Button fields under `show-more-data-table`.

## Defaults and Fallbacks
- Without a configured button, only the rows render.
