import loadSwiper from '../../scripts/delayed.js';
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
 *
 * @param {swiperInstance} the swiper instance
 * @param {function} setExpandedDot function to set the expanded dot in the scroll indicator
 * @param {HTMLElement} leftIconButton the left navigation button
 * @param {HTMLElement} rightIconButton the right navigation button
 */
const setSwiperListeners = (
  swiperInstance,
  setExpandedDot,
  leftIconButton,
  rightIconButton,
) => {
  if (!swiperInstance) return;

  const handleSlideChange = () => {
    const { isBeginning, isEnd } = swiperInstance;
    setExpandedDot({
      isBeginning,
      isEnd,
    });
    if (isBeginning && leftIconButton) {
      leftIconButton.disabled = true;
    } else {
      leftIconButton.disabled = false;
    }

    if (isEnd && rightIconButton) {
      rightIconButton.disabled = true;
    } else {
      rightIconButton.disabled = false;
    }
  };

  swiperInstance.on('slideChange', () => {
    handleSlideChange();
  });
};

export default async function decorate(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const isCarousel = rows.length > 1;

  const carousel = document.createElement('div');
  carousel.className = 'full-screen-hero-carousel swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Hero carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'full-screen-hero-carousel-track swiper-wrapper';
  track.setAttribute('role', 'list');

  rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const {
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
    const hero = await createHero(
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
      isCarousel,
    );
    moveInstrumentation(row, hero);
    track.appendChild(hero);
  });

  carousel.appendChild(track);
  moveInstrumentation(block, carousel);
  block.replaceWith(carousel);

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
    setSwiperListeners(
      swiperInstance,
      setExpandedDot,
      leftIconButton,
      rightIconButton,
    );
  }
}
