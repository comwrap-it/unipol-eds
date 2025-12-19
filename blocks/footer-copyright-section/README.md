# Footer Copyright Section

Two-line copyright area for the footer. UE model in `_footer-copyright-section.json`; behavior in `footer-copyright-section.js`.

## Overview
- Displays up to two rich-text lines: top and bottom.
- UE-safe decoration: preserves existing nodes when present and assigns classes.

## Field Reference (UE Model)
Source: `_footer-copyright-section.json` (model: `footer-copyright-section`).

1) footer-copyright-top (richtext)
- Purpose: Upper copyright text content.
- Default: empty.

2) footer-copyright-bottom (richtext)
- Purpose: Lower copyright text content.
- Default: empty.

## Runtime Behavior (footer-copyright-section.js)
- Extracts up to two child nodes; sets their text content and applies classes.
- If a node is missing but text exists, creates a `<p>` for it.
- Keeps UE attributes intact and adds the block class for styling.

## Authoring Notes (Universal Editor)
- Map the first two rows to top/bottom texts respectively.
- Rich text is supported for both rows.

## Defaults and Fallbacks
- Missing top/bottom values result in that line being omitted.
