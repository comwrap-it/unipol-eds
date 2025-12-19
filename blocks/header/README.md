# Header

Site header loaded via Fragment reference determined by page metadata. Behavior in `header.js`.

## Overview
- Resolves the header path from the `nav` metadata (defaults to `/nav`).
- Loads the fragment content and injects it into the header block.

## Field Reference (UE Model)
- This block does not define a UE model; it relies on page metadata and the referenced fragment for content.

## Runtime Behavior (header.js)
- Reads `nav` metadata using `getMetadata('nav')`.
- Loads the referenced fragment via `loadFragment()` and replaces the block contents with the fragment’s DOM.

## Authoring Notes (Universal Editor)
- Ensure the page metadata `nav` points to a valid header fragment path.
- Edit the header by modifying the referenced fragment.

## Defaults and Fallbacks
- If metadata is missing, falls back to `/nav`.
- If the fragment fails to load, the block remains empty.
