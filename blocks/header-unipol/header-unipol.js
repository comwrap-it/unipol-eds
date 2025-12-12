import { createNavigationPill, NAVIGATION_PILL_VARIANTS } from '../atoms/navigation-pill/navigation-pill.js';

export const DEFAULT_NAV_ITEMS = [
  { label: 'Navigation Pill', href: '#', variant: NAVIGATION_PILL_VARIANTS.PRIMARY },
];

export function createHeaderUnipol(logoUrl = '', navItems = DEFAULT_NAV_ITEMS) {
  const container = document.createElement('header');
  container.className = 'header-unipol';

  const logo = document.createElement('div');
  logo.className = 'header-unipol-logo';
  if (logoUrl) {
    const img = document.createElement('img');
    img.src = logoUrl;
    img.alt = 'Logo';
    img.loading = 'lazy';
    logo.appendChild(img);
  }
  container.appendChild(logo);

  const nav = document.createElement('nav');
  nav.className = 'header-unipol-nav';

  (navItems || []).forEach((item) => {
    const pill = createNavigationPill(
      item.label || 'Navigation Pill',
      item.href || '#',
      item.variant || NAVIGATION_PILL_VARIANTS.PRIMARY,
      item.leftIcon,
      item.leftIconSize,
      item.rightIcon,
      item.rightIconSize,
      item.instrumentation,
      item.hideLabel,
    );
    nav.appendChild(pill);
  });

  container.appendChild(nav);
  return container;
}

export default createHeaderUnipol;
