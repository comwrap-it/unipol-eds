let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/category-carousel-widget/category-carousel-widget.css`,
    ),
  ]);
  isStylesLoaded = true;
}

export default async function handleCategoryCarouselWidget() {
  const block = document.querySelector('.category-carousel-container');

  const section = block.closest('.section');
  const darkThemeText = section.dataset.categoryCarouselWidgetDarkTheme;
  const darkThemeValue = darkThemeText === 'true';

  if (darkThemeValue) {
    section?.classList.add('theme-dark');
  } else {
    section?.classList.remove('theme-dark');
  }

  await ensureStylesLoaded();
}
