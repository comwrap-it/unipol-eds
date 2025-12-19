# Footer Download Section

Download area containing brand button, optional QR code with text, and app store buttons. UE model in `_footer-download-section.json`; behavior in `footer-download-section.js`.

## Overview
- Shows logo with a branded link/button (text + optional icon).
- Displays a QR code with supporting text.
- Provides Google Play and App Store download links with badges.

## Field Reference (UE Model)
Source: `_footer-download-section.json` (model: `footer-download-section`).

1) logoUnipolFooter (reference)
- Purpose: Unipol logo image for the section.

2) UnipolButtonGroup (text)
- Purpose: Label for the brand button/link.

3) UnipolButtonHref (aem-content)
- Purpose: URL for the brand button/link.

4) buttonIconUnipolGroup (reference)
- Purpose: Optional icon displayed within the brand button.

5) qrCodeFooterImg (reference)
- Purpose: QR code image.

6) qrCodeImg (richtext)
- Purpose: Text displayed near the QR code.

7) googlePlayImg (reference)
- Purpose: Google Play badge image.

8) googlePlayHref (aem-content)
- Purpose: Link to Google Play store.

9) appStoreImg (reference)
- Purpose: App Store badge image.

10) appStoreHref (aem-content)
- Purpose: Link to Apple App Store.

## Runtime Behavior (footer-download-section.js)
- Extracts authored rows and builds the brand area, QR area, and app store buttons.
- Accepts either prebuilt elements (from UE) or raw URLs and creates appropriate `<img>`/`<a>` elements.
- Applies section classes and preserves UE attributes on the block.

## Authoring Notes (Universal Editor)
- Recommended row mapping (by order):
  - Row 0 → logo
  - Row 1 → brand text
  - Row 2 → brand link
  - Row 3 → brand icon
  - Row 4 → QR code image
  - Row 5 → QR text
  - Row 6 → Google Play image
  - Row 7 → Google Play URL
  - Row 8 → App Store image
  - Row 9 → App Store URL

## Defaults and Fallbacks
- Missing QR/logo or store images: the script uses provided fallbacks for QR and ignores missing items otherwise.
- If fewer than 10 rows are present, decoration is skipped.
