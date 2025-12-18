# Text List

## Overview
Flexible list that can either display a title-only row or a single link per row, based on an authoring toggle. Preserves Universal Editor instrumentation.

## Field Reference (UE Model)
- hideTextLinkList (boolean): `true` → show Title/Text configuration; `false` → show Link configuration per row.
- When `true` (Title/Text mode):
  - listLinks (richtext): Intended for rich text content; current implementation uses the second column as title text.
- When `false` (Link mode):
  - linkTextComp (text, required): Link text.
  - linkHrefComp (aem-content, required): Link URL; can be provided as a link element or plain URL.

## Runtime Behavior
- Per-row parsing: Reads four columns as `[hide, title, linkText, linkHref]`.
- Title mode (`hideTextLinkList` true): Renders `.text-link-title` from the second column.
- Link mode (`hideTextLinkList` false): Renders a single anchor `.text-link` using columns 3–4.
- Instrumentation: Moves UE instrumentation from source cells onto the rendered title/link.
- Wrapper: Produces `.text-link-list` with rows `.text-link-row`.

## Authoring Notes
- Create one row per item. Toggle the first column to `true` for a title row or `false` for a link row.
- For link rows, ensure both text and href are provided; you may supply a link element so its `href` is read automatically.
- The `listLinks` richtext field is defined in the model but not consumed by the current script; use the second column for title text in Title mode.

## Defaults and Fallbacks
- Rows with missing values are skipped or rendered minimally.
- No global block-level fields; behavior is row-based.
