import loadSwiper, { handleSlideChange } from '../../scripts/lib/utils.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createHero, extractHeroPropertiesFromRows } from '../hero/hero.js';
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';

/**
 *
 * @param {} Swiper the swiper instance
 * @param {HTMLElement} carousel the carousel element
 * @param {HTMLElement} leftIconButton the left navigation button
 * @param {HTMLElement} rightIconButton the right navigation button
 */
const initSwiper = (
  Swiper,
  carousel,
  leftIconButton = null,
  rightIconButton = null,
) => {
  // Initialize Swiper after DOM insertion
  const swiper = new Swiper(carousel || '.swiper', {
    navigation: {
      nextEl: rightIconButton || '.swiper-button-next',
      prevEl: leftIconButton || '.swiper-button-prev',
      addIcons: false,
    },
    slidesPerView: 1,
    // Optional accessibility tweaks
    a11y: { enabled: true },
  });

  return swiper;
};

/**
 * ensures styles are loaded only once
 */
let isStylesAlreadyLoaded = false;
const ensureStylesLoaded = async () => {
  if (isStylesAlreadyLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const cssPromises = [
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    `${window.hlx.codeBasePath}/blocks/hero/hero.css`,
  ].map((cssPath) => loadCSS(cssPath));
  await Promise.all(cssPromises);
  isStylesAlreadyLoaded = true;
};

export function getParentProp(block, propName) {
  const parentBlock = block.closest('.section');
  if (!parentBlock) return null;
  const propValue = parentBlock.dataset[propName];
  if (propValue === undefined) return null;
  if (propValue === 'true') return true;
  if (propValue === 'false') return false;
  return propValue;
}

export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  // Setting dark mode for hero
  const parentBlock = block.closest('.section');
  if (parentBlock) {
    parentBlock.dataset.heroWidgetDarkTheme = 'true';
  }

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const darkTheme = getParentProp(block, 'heroWidgetDarkTheme') ?? false;
  if (darkTheme) {
    block.classList.add('theme-dark');
  }

  const isCarousel = rows.length > 1;

  const carousel = document.createElement('div');
  carousel.className = 'swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Hero carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'swiper-wrapper';
  track.setAttribute('role', 'list');

  const promises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const {
      heroBackground,
      isVideoBackground,
      showHeroButton,
      showHeroLogo,
      heroLogo,
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
    const hero = await createHero(
      heroBackground,
      isVideoBackground,
      showHeroButton,
      showHeroLogo,
      heroLogo,
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
      isCarousel,
    );
    moveInstrumentation(row, hero);
    track.appendChild(hero);
  });
  await Promise.all(promises);

  carousel.appendChild(track);
  block.replaceChildren(carousel);

  if (isCarousel) {
    const {
      leftIconButton, scrollIndicator, rightIconButton, setExpandedDot,
    } = await createScrollIndicator(true);
    carousel.appendChild(scrollIndicator);
    // initialize Swiper
    const Swiper = await loadSwiper();
    const swiperInstance = initSwiper(
      Swiper,
      carousel,
      leftIconButton,
      rightIconButton,
    );
    handleSlideChange(
      swiperInstance,
      setExpandedDot,
      leftIconButton,
      rightIconButton,
    );
  }
}
