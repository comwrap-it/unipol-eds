import { loadCSS } from '../../../scripts/aem.js';
import loadSwiper from '../../../scripts/delayed.js';
import { handleSlideChange } from '../../../scripts/utils.js';
import createScrollIndicator from '../../molecules/scroll-indicator/scroll-indicator.js';
import { createMiniHero } from '../mini-hero/mini-hero.js';

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
  const cssPromises = [
    '../../atoms/buttons/standard-button/standard-button.css',
    '../mini-hero/mini-hero.css',
  ].map((cssPath) => loadCSS(cssPath));
  await Promise.all(cssPromises);
  isStylesAlreadyLoaded = true;
};

/**
 * @typedef {Object} MiniHeroProps
 * @property {string} heroBackground - the background media source
 * @property {boolean} isVideoBackground
 * @property {boolean} showHeroButton
 * @property {string} title (required)
 * @property {string} subtitle
 * @property {boolean} showHeroBulletList
 * @property {string[]} bulletList
 * @property {string} btnLabel - Button text/label
 * @property {string} btnHref - Button URL (optional)
 * @property {boolean} btnOpenInNewTab - Open link in new tab (optional)
 * @property {string} btnVariant - Button variant (primary, secondary, accent)
 * @property {string} btnIconSize - Icon size (small, medium, large, extra-large)
 * @property {string} btnLeftIcon - Left icon (optional)
 * @property {string} btnRightIcon - Right icon (optional)
 */

/**
 * Builds a full screen hero carousel.
 * Each card supports the documented properties above.
 * @param {MiniHeroProps[]} heros
 * @returns {Promise<HTMLElement>} The card grid element
 */
export default async function createMiniHeroCarousel(miniHeros) {
  await ensureStylesLoaded();

  const miniHeroCarousel = document.createElement('div');
  miniHeroCarousel.className = 'mini-hero-carousel theme-dark';

  const isCarousel = miniHeros.length > 1;

  const carousel = document.createElement('div');
  carousel.className = 'swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Hero carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'swiper-wrapper';
  track.setAttribute('role', 'list');

  const promises = miniHeros.map(async (miniHero) => {
    const hero = await createMiniHero(
      miniHero.heroBackground,
      miniHero.isVideoBackground,
      miniHero.title,
      miniHero.subtitle,
      miniHero.showHeroBulletList,
      miniHero.bulletList,
      miniHero.showHeroButton,
      miniHero.btnLabel,
      miniHero.btnHref,
      miniHero.btnOpenInNewTab,
      miniHero.btnVariant,
      miniHero.btnIconSize,
      miniHero.btnLeftIcon,
      miniHero.btnRightIcon,
      isCarousel,
    );
    track.appendChild(hero);
  });
  await Promise.all(promises);

  carousel.appendChild(track);
  miniHeroCarousel.replaceChildren(carousel);

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
