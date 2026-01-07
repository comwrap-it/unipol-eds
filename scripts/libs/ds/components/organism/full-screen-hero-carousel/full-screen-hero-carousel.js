import { loadCSS } from "../../../scripts/aem.js";
import loadSwiper from "../../../scripts/delayed.js";
import { handleSlideChange } from "../../../scripts/utils.js";
import createScrollIndicator from "../../molecules/scroll-indicator/scroll-indicator.js";
import { createHero } from "../hero/hero.js";

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
    speed: 700,
    allowTouchMove: true,
    breakpoints: {
      // width >= 1200
      1200: {
        allowTouchMove: false,
      },
    },
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
    // Optional accessibility tweaks
    a11y: { enabled: false },
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
    `../../atoms/buttons/standard-button/standard-button.css`,
    `../hero/hero.css`,
  ].map((cssPath) => loadCSS(cssPath));
  await Promise.all(cssPromises);
  isStylesAlreadyLoaded = true;
};


/**
 * @typedef {Object} HeroProps
 * @property {string} heroBackground - the background media source
 * @property {boolean} isVideoBackground
 * @property {boolean} showHeroButton
 * @property {boolean} showHeroLogo
 * @property {string} heroLogo - the hero logo element
 * @property {string} title (required)
 * @property {string} subtitleBold
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
 * @property {boolean} isCarousel - Flag indicating if the hero is part of a carousel (optional)
 */

/**
 * Builds a full screen hero carousel.
 * Each card supports the documented properties above.
 * @param {HeroProps[]} heros
 * @returns {Promise<HTMLElement>} The card grid element
 */
export default async function createFullScreenHeroCarousel(heros) {
  await ensureStylesLoaded();

  const isCarousel = heros.length > 1;

  const carousel = document.createElement('div');
  carousel.className = 'swiper theme-dark';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Hero carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'swiper-wrapper';
  track.setAttribute('role', 'list');

  const promises = heros.map(async (hero) => {
    const newHero = await createHero(
        hero.heroBackground,
        hero.isVideoBackground,
        hero.showHeroButton,
        hero.showHeroLogo,
        hero.heroLogo,
        hero.title,
        hero.subtitleBold,
        hero.subtitle,
        hero.showHeroBulletList,
        hero.bulletList,
        hero.btnLabel,
        hero.btnHref,
        hero.btnOpenInNewTab,
        hero.btnVariant,
        hero.btnIconSize,
        hero.btnLeftIcon,
        hero.btnRightIcon,
        isCarousel
    )
    track.appendChild(newHero);
  });
  await Promise.all(promises);

  carousel.appendChild(track);

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
  return carousel;
}
