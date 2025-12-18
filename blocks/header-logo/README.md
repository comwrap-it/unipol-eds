# Header Logo

Header logo with link and a built-in mobile hamburger menu container. Model in `_header-logo.json`; behavior in `header-logo.js`.

## Overview
- Renders a clickable logo linking to home (or a configured URL).
- Injects a hamburger button and an empty dropdown container for mobile navigation; listens for `unipol-mobile-menu-ready` to inject menu content.
- Implements focus trapping and accessibility attributes for the dropdown.

## Field Reference (UE Model)
Source: `_header-logo.json` (model: `header-logo`).

1) unipolHeaderLogo (reference)
- Purpose: Logo image placed inside the link.

2) UnipolHeaderLogoHref (aem-content)
- Purpose: Href for the logo link (defaults to `/`).

## Runtime Behavior (header-logo.js)
- Builds `.header-logo-wrapper` with an `<a.header-logo-link>`; adds a hamburger button and `.hamburger-dropdown`.
- Toggles dropdown open/close and traps focus within menu when open; restores focus on close.
- Maintains ARIA attributes: `aria-expanded`, `aria-controls`, `aria-hidden`, and appropriate labels.
- Updates menu content when `unipol-mobile-menu-ready` is dispatched with a DOM subtree in `event.detail`.

## Authoring Notes (Universal Editor)
- Provide a logo image and an optional destination URL.
- The mobile menu content is not authored here; it is injected dynamically by other header components.

## Defaults and Fallbacks
- Missing logo: a default Unipol logo is used.
- Missing href: falls back to `/`.
