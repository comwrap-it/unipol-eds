# Footer Social Section

Footer area containing a list of social links with icons. Defines item model and section filter. Model in `_footer-social-section.json`; behavior in `footer-social-section.js`.

## Overview
- Each row represents one social item: an icon (image/picture) and a URL.
- UE-safe: decorates each row into a single anchor wrapping the icon.

## Field Reference (UE Model)
Source: `_footer-social-section.json`.

Model: `footer-social-link`
1) socialFooterImg (reference)
- Purpose: Social icon image.

2) logoSocialHref (aem-content)
- Purpose: Link URL for the social icon.

## Filters
- Filter: `footer-social-section` → Allowed components: `footer-social-link`.

## Runtime Behavior (footer-social-section.js)
- Extracts `picture` and `href` from each row and replaces content with `<a aria-label="{href}">` containing the icon.
- Applies `footer-social-section` class to the wrapper.

## Authoring Notes (Universal Editor)
- Provide both the icon image and the link URL for each item.

## Defaults and Fallbacks
- Items missing either icon or URL are omitted during decoration.
