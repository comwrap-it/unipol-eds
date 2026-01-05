# Fragment

Includes content from another page path into the current page. Model in `_fragment.json`; behavior in `fragment.js`.

## Overview
- Fetches the referenced path’s plain HTML and injects its first `.section` content.
- Adjusts relative media paths to resolve against the fragment’s base path.
- Re-runs section decoration on the loaded content.

## Field Reference (UE Model)
Source: `_fragment.json` (model: `fragment`).

1) reference (aem-content)
- Purpose: Path/URL to the fragment to load.

## Runtime Behavior (fragment.js)
- Fetches `{path}.plain.html`, parses into a temporary `<main>`, and fixes media URLs starting with `./media_`.
- Calls `decorateMain()` and `loadSections()` to apply standard decorations.
- Replaces the block with the fragment’s `.section` children, merging classes onto the block.

## Authoring Notes (Universal Editor)
- Provide a valid reference link or text for the path.
- The referenced asset should contain a `.section`; its classes are applied to the host block.

## Defaults and Fallbacks
- If fetch fails or no section is found, the block remains unchanged.
