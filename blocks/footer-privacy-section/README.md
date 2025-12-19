# Footer Privacy Section

List of privacy-related links for the footer. Defines a per-item model and a section filter. Model in `_footer-privacy-section.json`; behavior in `footer-privacy-section.js`.

## Overview
- Each row represents one privacy link with text and URL.
- UE-safe decoration: replaces row content with a single anchor while preserving structure.

## Field Reference (UE Model)
Source: `_footer-privacy-section.json`.

Model: `footer-privacy-link`
1) footerPrivacyLink (text)
- Purpose: Link label.
- Required: Yes.
- Validation: `maxLength: 40`.

2) footerPrivacyLinkHref (aem-content)
- Purpose: Link URL.
- Required: Yes.

## Filters
- Filter: `footer-privacy-section` → Allowed components: `footer-privacy-link`.

## Runtime Behavior (footer-privacy-section.js)
- For each row, extracts text and URL and outputs a single `<a.footer-privacy-link>`.
- Applies `footer-privacy-section` class to the block wrapper.

## Authoring Notes (Universal Editor)
- Create one `footer-privacy-link` item per row with the required fields.

## Defaults and Fallbacks
- Missing text or URL: item renders as an empty row (no anchor output).
