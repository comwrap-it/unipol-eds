# Columns

Multi-column layout helper. Defines number of columns/rows for authoring and lightly decorates image-only columns for styling. Model in `_columns.json`; logic in `columns.js`.

## Overview
- Adds a class based on the number of columns to enable responsive styling.
- Detects columns that contain only an image and marks them for specialized styles.

## Field Reference (UE Model)
Source: `_columns.json` (model: `columns`).

1) columns (text, number)
- Purpose: Desired number of columns in the layout.

2) rows (text, number)
- Purpose: Number of rows to initialize within the layout.

## Filters
- Filter: `columns` → Allowed components: `column`.
- Filter: `column` → Allowed components within a column: `text`, `image`, `button`, `title`.

## Runtime Behavior (columns.js)
- Computes number of columns from the first row's children and adds `columns-{n}-cols` to the block.
- For any column whose wrapper contains only a `<picture>`, adds `columns-img-col` to that wrapper.

## Authoring Notes (Universal Editor)
- The `columns` and `rows` fields guide initial authoring structure; the runtime adapts based on actual content present.
- Place images as standalone items in a column to get the `columns-img-col` styling hook.

## Defaults and Fallbacks
- If no rows/columns are set, the script infers the current DOM structure and still decorates image-only columns when applicable.
