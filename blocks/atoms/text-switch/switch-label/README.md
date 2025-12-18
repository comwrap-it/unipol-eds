# Switch Label

## Overview
Atom used within Text Switch; label button with optional active dot.

## Field Reference (UE Model)
- status (select): "default" or "active".
- label (text): Text inside the switch label.

## Runtime Behavior
- DOM: `.switch-label` with `.switch-label-text`; if status is "active", adds `.active` class and `.switch-label-dot` child.
- Programmatic: Used by Text Switch to compose left/right options.
- Standalone block: `decorateSwitchLabel(block)` reads two rows and renders the label.

## Authoring Notes
- Provide status and label text in two rows.

## Defaults and Fallbacks
- Status defaults to "default"; label defaults to empty string.
