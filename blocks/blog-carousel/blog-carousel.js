/**
 * Blog Carousel Component
 *
 * A carousel block that displays a horizontal scrollable list of blog preview card components.
 * Uses blog preview card as a molecule component.
 *
 * Features:
 * - Horizontal scroll with navigation arrows
 * - Dot indicators for slide position
 * - Responsive design (mobile: 1 card, tablet: 2 cards, desktop: 3-4 cards)
 * - Smooth scrolling with snap points
 * - Touch/swipe support on mobile
 * - Keyboard navigation (arrow keys)
 * - Preserves Universal Editor instrumentation
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import loadSwiper from '../../scripts/delayed.js';
import { handleSlideChange } from '../../scripts/utils.js';
import mockBlogCards from '../../scripts/mock.js';
import { initCarouselAnimations } from '../../scripts/reveal.js';
import { createBlogCard } from '../blog-preview-card/blog-preview-card.js';
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/blog-preview-card/blog-preview-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

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
    slidesPerView: 'auto',
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
 * Decorates the blog carousel block
 * @param {HTMLElement} block - The carousel block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'blog-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Blog carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'blog-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Blog Carousel: No cards found');
    return;
  }

  const cardsData = await mockBlogCards();
  const isThereMultipleCards = cardsData.length > 1;

  const cardPromises = cardsData.map(async (cardData) => {
    const {
      image,
      title,
      durationIcon,
      durationText,
      tagLabel,
      tagCategory,
      tagType,
    } = cardData;
    const card = await createBlogCard(
      image,
      title,
      durationIcon,
      durationText,
      tagLabel,
      tagCategory,
      tagType,
      true, // isSlide
      'reveal-in-up', // animationClass
    );
    track.appendChild(card);
  });
  await Promise.all(cardPromises);
  carousel.appendChild(track);

  if (isThereMultipleCards) {
    initCarouselAnimations(carousel);

    const {
      leftIconButton, scrollIndicator, rightIconButton, setExpandedDot,
    } = await createScrollIndicator();
    carousel.appendChild(scrollIndicator);
    block.replaceChildren(carousel);

    // Initialize Swiper after DOM insertion
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
  } else {
    // If only one card, no need for carousel functionality
    block.replaceChildren(carousel);
  }
}
