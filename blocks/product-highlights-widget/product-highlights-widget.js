import { loadCSS } from '../../scripts/aem.js';

let stylesLoaded = false;
export default async function decorateProductHighlightsWidget() {
  if (stylesLoaded) return;
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/product-highlights-widget/product-highlights-widget.css`,
  );
  stylesLoaded = true;
}
