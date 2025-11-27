import { moveInstrumentation } from '../../scripts/scripts.js';
import { createHero, extractHeroPropertiesFromRows } from '../hero/hero.js';

export default async function decorate(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const carousel = document.createElement('div');
  carousel.className = 'full-screen-hero-carousel swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'full-screen-hero-carousel-track swiper-wrapper';
  track.setAttribute('role', 'list');

  rows.forEach((row) => {
    const childrenRows = Array.from(row.children);
    const {
      variant,
      heroBackground,
      isVideoBackground,
      showHeroButton,
      showHeroLogo,
      heroLogo,
      showHeroPauseIcon,
      title,
      subtitleBold,
      subtitle,
      showHeroBulletList,
      bulletList,
      btnText,
      btnHref,
      btnOpenInNewTab,
      btnVariant,
      btnIconSize,
      btnLeftIcon,
      btnRightIcon,
    } = extractHeroPropertiesFromRows(childrenRows);
    const hero = createHero(
      variant,
      heroBackground,
      isVideoBackground,
      showHeroButton,
      showHeroLogo,
      heroLogo,
      showHeroPauseIcon,
      title,
      subtitleBold,
      subtitle,
      showHeroBulletList,
      bulletList,
      btnText,
      btnHref,
      btnOpenInNewTab,
      btnVariant,
      btnIconSize,
      btnLeftIcon,
      btnRightIcon,
    );
    moveInstrumentation(row, hero);
    track.appendChild(hero);
  });

  carousel.appendChild(track);
  moveInstrumentation(block, carousel);
  block.replaceWith(carousel);
}
