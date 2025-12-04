// Adds theme-dark class when editorial property is set to true

export default function decorateBlogCarouselWidget(block) {
  const rows = [...block.children];

  const darkThemeText = rows[1]?.textContent?.trim().toLowerCase();
  const darkTheme = darkThemeText === 'true';

  const section = block.closest('.section');

  if (darkTheme) {
    section?.classList.add('theme-dark');
  } else {
    section?.classList.remove('theme-dark');
  }
}
