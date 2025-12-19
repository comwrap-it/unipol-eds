# Data Table Row

Configurable row used inside Data Table. Controls column content, optional tooltip, and conditional title vs text per column. Model in `_data-table-row.json`.

## Overview
- Provides three columns of content with per-column configuration.
- Column 1 can show a clickable title with an optional tooltip.
- Columns 2 and 3 can switch between title-style and text-style content.

## Field Reference (UE Model)
Source: `_data-table-row.json` (model: `data-table-row`).

1) data-table-col (tab)
- Purpose: Visual grouping for Column 1 fields.

2) showDataTableRow (boolean)
- Purpose: When true, renders the Column 1 title as a button and enables tooltip configuration.
- Default: false.

3) titleDataTableRow (text)
- Purpose: Title for Column 1.
- Validation: `maxLength: 25`.

4) data-table-tooltip (container)
- Purpose: Tooltip configuration for Column 1 when `showDataTableRow` is true.
- Fields: Inlines all fields from `tooltip/_tooltip.json`.
- Condition: Visible only when `showDataTableRow === true`.

5) data-table-col-2 (tab)
- Purpose: Visual grouping for Column 2 fields.

6) changeTableTextContent (boolean)
- Purpose: When true, Column 2 content is a title; when false, it's text.
- Default: false.

7) titleDataTableRow2 (text)
- Purpose: Title for Column 2.
- Validation: `maxLength: 20`.
- Condition: Visible only when `changeTableTextContent === true`.

8) titleDataTableRow3 (text)
- Purpose: Text content for Column 2.
- Validation: `maxLength: 50`.
- Condition: Visible only when `changeTableTextContent === false`.

9) data-table-col-3 (tab)
- Purpose: Visual grouping for Column 3 fields.

10) changeTableTextContent2 (boolean)
- Purpose: When true, Column 3 content is a title; when false, it's text.
- Default: false.

11) titleDataTableRow4 (text)
- Purpose: Title for Column 3.
- Validation: `maxLength: 20`.
- Condition: Visible only when `changeTableTextContent2 === true`.

12) titleDataTableRow5 (text)
- Purpose: Text content for Column 3.
- Validation: `maxLength: 35`.
- Condition: Visible only when `changeTableTextContent2 === false`.

13) titleDataTableRow6 (text)
- Purpose: Benefit text for Column 3 (alternative text field).
- Validation: `maxLength: 35`.
- Condition: Visible only when `changeTableTextContent2 === false`.

## Runtime Behavior
- No decoration logic is defined in `data-table-row.js` at this time; rows are rendered by the parent table or by templates.

## Authoring Notes (Universal Editor)
- Use the boolean toggles to switch each column between title vs text.
- Configure the tooltip only when making the Column 1 title clickable.

## Defaults and Fallbacks
- All text fields are optional but constrained by max lengths.
- Hidden fields become visible depending on the related booleans.
