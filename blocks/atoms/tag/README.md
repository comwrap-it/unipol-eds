# Tag

## Overview
Small label atom categorised by domain and type, used across cards and lists. Preserves UE instrumentation.

## Field Reference (UE Model)
- tagLabel (text, required): Tag text.
- tagCategory (select, required): `mobility` | `welfare` | `property`.
- tagVariant (select, required): `default` | `secondary` | `neutral` | `custom`.

## Runtime Behavior
- DOM: `<div.tag {category} {type}>` with either a generated `span.tag-label` or plain text, based on UE instrumentation presence.
- Instrumentation: Restores attributes onto the final element; uses `createTextElementFromRow()` for UE-authored label content.
- Helpers: `createTag(label, category, type, instrumentation, labelRow)` and `createTagFromRows(rows)`.
- Standalone block: `decorateTag(block)` reads rows and renders/updates the tag.

## Authoring Notes
- Provide label, category, and type in order across three rows/columns.
- The tag’s visual style derives from both category and type.

## Defaults and Fallbacks
- No label → tag is not created.
