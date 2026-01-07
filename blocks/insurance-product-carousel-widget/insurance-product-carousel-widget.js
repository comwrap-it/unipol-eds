export default async function handleInsuranceProductCarouselWidget() {
  const block = document.querySelector('.insurance-product-carousel-container');

  const section = block.closest('.section');
  const darkThemeText = section.dataset.insuranceProductCarouselWidgetDarkTheme;
  const darkThemeValue = darkThemeText === 'true';


  if (darkThemeValue) {
    section?.classList.add('theme-dark');
  } else {
    section?.classList.remove('theme-dark');
  }

  let isStylesLoaded = false;

  async function ensureStylesLoaded() {
    if (isStylesLoaded) return;
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(
        `${window.hlx.codeBasePath}/blocks/insurance-product-carousel-widget/insurance-product-carousel-widget.css`,
      ),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();
}
