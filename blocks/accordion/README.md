# Accordion

Expandable/collapsible FAQ-style block with a question label and a rich-text answer. Universal Editor (UE) model is in `_accordion.json`; runtime logic in `accordion.js`.

## Overview
- Renders a single accordion item with header and content.
- Click on header toggles open/closed state and updates plus/minus icon.
- Preserves UE instrumentation on label and content nodes.
- Opens by default when authoring in UE to aid editing.

## Field Reference (UE Model)
Source: `_accordion.json` (fields are read by row order).

1) accordionLabel (text)
- Purpose: The question/title shown in the header.
- Validation: `maxLength: 120` (custom error message on overflow).
- Default: empty string.

2) accordionDescriptionRichtext (richtext)
- Purpose: The answer/description content displayed when open.
- Validation: `maxLength: 800` (custom error message on overflow).
- Default: empty rich text.

## Runtime Behavior (accordion.js)
- Structure: Creates wrapper `.accordion` with `.accordion-header` and `.accordion-content`.
- Header: Contains `.accordion-label` and an icon span with `un-icon-plus`/`un-icon-minus`.
- Toggle: Clicking header toggles `.open` on wrapper and animates content height/padding.
- Authoring: In author mode, the item starts open for easier editing.
- Instrumentation: Any UE instrumentation from the model rows is restored on the rendered label/content.

## Authoring Notes (Universal Editor)
- Field-to-row mapping (by order):
  - Row 0 → `accordionLabel`
  - Row 1 → `accordionDescriptionRichtext`
- With instrumentation present, content remains editable; the decorator rebuilds the accordion while preserving attributes.

## Defaults and Fallbacks
- Empty label renders as blank text; consider providing a concise question.
- Empty description renders no content area.
- In author mode, the accordion starts open; on published pages it is closed by default.
