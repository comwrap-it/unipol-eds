# FAQ Widget

Section with a title, subtitle, and a list of FAQ accordions loaded from fragments, with an optional “Show more” button. Model in `_faq-widget.json`; behavior in `faq-widget.js`.

## Overview
- Displays a title and subtitle, followed by referenced Accordion fragments.
- Initially shows up to 5 items; reveals more in batches via a button.
- Preserves UE instrumentation on heading/subtitle.

## Field Reference (UE Model)
Source: `_faq-widget.json` (model: `faq-widget`).

1) title (text)
- Purpose: Section title.
- Required: Yes.
- Validation: `maxLength: 40`.

2) description (text)
- Purpose: Subtitle under the title.
- Required: Yes.
- Validation: `maxLength: 150`.

3) showMoreButtonLabel (text)
- Purpose: Label for the “Show more” button.
- Default: "Mostra di più".
- Validation: `maxLength: 15`.

## Filters
- Filter: `faq-widget` → Allowed components: `fragment` (one or more references to load accordion content).

## Runtime Behavior (faq-widget.js)
- Loads Accordion CSS once.
- Builds a text header and a container for accordions.
- Loads fragments from references (only link-bearing rows in published mode; all rows in author mode).
- Hides items beyond the first 5 (in non-author mode) and attaches a button to reveal more in groups of 5.

## Authoring Notes (Universal Editor)
- First three rows are used by the model fields; subsequent rows should be `fragment` references pointing to content with Accordion blocks.
- The show-more behavior is suppressed in author mode to enable full editing.

## Defaults and Fallbacks
- If no fragments are provided, only the title/subtitle render.
- Missing label: the button defaults to "Carica altro".
