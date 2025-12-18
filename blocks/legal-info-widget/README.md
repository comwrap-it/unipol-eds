# Legal Info Widget

Simple rich-text legal information content. Model in `_legal-info-widget.json`; behavior in `legal-info-widget.js`.

## Overview
- Renders provided rich-text as legal content within the block.
- Preserves Universal Editor instrumentation when present.

## Field Reference (UE Model)
Source: `_legal-info-widget.json` (model: `legal-info-widget`).

1) text (richtext)
- Purpose: Legal content HTML.
- Required: Yes. Max 1000 characters.

## Runtime Behavior (legal-info-widget.js)
- Extracts the first row’s HTML and injects it into `.legal-info-content`.
- In authoring, keeps the original row and nests the content to preserve instrumentation.
- Outside authoring, replaces the block content with the rendered container.

## Authoring Notes (Universal Editor)
- Provide the legal text in the rich-text field; it is rendered as-is inside the widget container.

## Defaults and Fallbacks
- Empty content results in an empty widget.
