# Tooltip

## Overview
Simple tooltip content block with title and rich text. Intended to be used by other components for inline help or informational overlays.

## Field Reference (UE Model)
- toolTip (text, required, max 60): Tooltip title.
- toolTipSub (richtext, max 300): Tooltip body content.

## Runtime Behavior
- The current script is empty; rendering is handled by the authored HTML in the block (via UE). Other components may import/use this content.

## Authoring Notes
- Provide the title in the first row and the rich text body in the second row.
- Rich text supports standard formatting and will be displayed as authored.

## Defaults and Fallbacks
- If the title is missing, the block may render with minimal or no visible content depending on host usage.
