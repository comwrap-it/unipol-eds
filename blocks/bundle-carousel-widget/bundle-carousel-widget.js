export default async function handleBundleCarouselWidget() {
  const block = document.querySelector('.bundle-carousel-container');

  const rows = [...block.children];
  const darkThemeText = rows[1]?.textContent?.trim().toLowerCase();
  const darkThemeValue = darkThemeText === 'true';

  const section = block.closest('.section');
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
        `${window.hlx.codeBasePath}/blocks/bundle-carousel-widget/bundle-carousel-widget.css`,
      ),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();
}
