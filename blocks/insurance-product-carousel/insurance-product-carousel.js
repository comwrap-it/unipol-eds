/**
 * Insurance Product Carousel Component
 *
 * A carousel block that displays a horizontal scrollable list of card components.
 * Uses card as a molecule component, which in turn uses primary-button as an atom.
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

import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Create carousel navigation (prev/next arrows)
 * @returns {Object} Object with navContainer, prevBtn and nextBtn elements
 */
function createNavigationButtons() {
  const navContainer = document.createElement('div');
  navContainer.className = 'carousel-nav';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav-btn carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '<span aria-hidden="true">‹</span>';
  prevBtn.disabled = true; // Disabled at start

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav-btn carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<span aria-hidden="true">›</span>';

  navContainer.appendChild(prevBtn);
  navContainer.appendChild(nextBtn);

  return { navContainer, prevBtn, nextBtn };
}

/**
 * Create carousel dots indicator
 * @param {number} totalSlides - Total number of slides
 * @returns {Object} Object with dotsContainer and updateDots function
 */
function createDotsIndicator(totalSlides) {
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Carousel slides');

  for (let i = 0; i < totalSlides; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      // This will be connected to scroll logic later
      dot.dispatchEvent(new CustomEvent('dot-click', { detail: { index: i }, bubbles: true }));
    });

    dotsContainer.appendChild(dot);
  }

  return dotsContainer;
}

/**
 * Update navigation button states based on scroll position
 * @param {HTMLElement} track - The carousel track
 * @param {HTMLElement} prevBtn - Previous button
 * @param {HTMLElement} nextBtn - Next button
 */
function updateNavigationState(track, prevBtn, nextBtn) {
  const { scrollLeft, scrollWidth, clientWidth: trackWidth } = track;
  const isAtStart = scrollLeft <= 0;
  const isAtEnd = scrollLeft + trackWidth >= scrollWidth - 1;

  prevBtn.disabled = isAtStart;
  nextBtn.disabled = isAtEnd;

  prevBtn.classList.toggle('disabled', isAtStart);
  nextBtn.classList.toggle('disabled', isAtEnd);
}

/**
 * Update dots indicator based on scroll position
 * @param {HTMLElement} track - The carousel track
 * @param {HTMLElement} dotsContainer - Dots container
 */
function updateDotsIndicator(track, dotsContainer) {
  const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
  if (dots.length === 0) return;

  const { scrollLeft, scrollWidth } = track;
  const slideWidth = scrollWidth / dots.length;
  const currentIndex = Math.round(scrollLeft / slideWidth);

  dots.forEach((dot, index) => {
    const isActive = index === currentIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

/**
 * Scroll to a specific slide
 * @param {HTMLElement} track - The carousel track
 * @param {number} index - Slide index
 */
function scrollToSlide(track, index) {
  const slides = Array.from(track.children);
  if (index < 0 || index >= slides.length) return;

  const slide = slides[index];
  if (!slide) return;

  track.scrollTo({
    left: slide.offsetLeft,
    behavior: 'smooth',
  });
}

/**
 * Initialize carousel interactions (navigation, keyboard, scroll)
 * @param {HTMLElement} carousel - The carousel container
 * @param {HTMLElement} track - The carousel track
 * @param {HTMLElement} prevBtn - Previous button
 * @param {HTMLElement} nextBtn - Next button
 * @param {HTMLElement} dotsContainer - Dots container
 */
function initializeCarouselInteractions(carousel, track, prevBtn, nextBtn, dotsContainer) {
  const slides = Array.from(track.children);

  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    const slideWidth = slides[0]?.offsetWidth || 0;
    const gap = parseInt(getComputedStyle(track).gap || '0', 10);
    track.scrollBy({
      left: -(slideWidth + gap),
      behavior: 'smooth',
    });
  });

  nextBtn.addEventListener('click', () => {
    const slideWidth = slides[0]?.offsetWidth || 0;
    const gap = parseInt(getComputedStyle(track).gap || '0', 10);
    track.scrollBy({
      left: slideWidth + gap,
      behavior: 'smooth',
    });
  });

  // Dots navigation
  dotsContainer.addEventListener('dot-click', (e) => {
    const { index } = e.detail;
    scrollToSlide(track, index);
  });

  // Update navigation state on scroll
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    // Debounce updates for performance
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateNavigationState(track, prevBtn, nextBtn);
      updateDotsIndicator(track, dotsContainer);
    }, 50);
  }, { passive: true });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // Initialize state
  updateNavigationState(track, prevBtn, nextBtn);
  updateDotsIndicator(track, dotsContainer);

  // Update on resize (responsive behavior)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateNavigationState(track, prevBtn, nextBtn);
      updateDotsIndicator(track, dotsContainer);
    }, 100);
  }, { passive: true });
}

/**
 * Decorates the insurance product carousel block
 * @param {HTMLElement} block - The carousel block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Import card component dynamically
  const cardModule = await import('../card/card.js');
  const decorateCard = cardModule.default;

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'insurance-product-carousel';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.setAttribute('role', 'list');

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel: No cards found');
    return;
  }

  // Process each row as a card
  const cardPromises = rows.map(async (row) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'listitem');

    // Preserve instrumentation from row to slide
    moveInstrumentation(row, slide);

    // Create a card block element to decorate
    const cardBlock = document.createElement('div');
    cardBlock.className = 'card block';
    cardBlock.dataset.blockName = 'card';

    // Preserve row instrumentation on card block if present
    if (row.hasAttribute('data-aue-resource')) {
      cardBlock.setAttribute('data-aue-resource', row.getAttribute('data-aue-resource'));
      const aueBehavior = row.getAttribute('data-aue-behavior');
      if (aueBehavior) cardBlock.setAttribute('data-aue-behavior', aueBehavior);
      const aueType = row.getAttribute('data-aue-type');
      if (aueType) cardBlock.setAttribute('data-aue-type', aueType);
      const aueLabel = row.getAttribute('data-aue-label');
      if (aueLabel) cardBlock.setAttribute('data-aue-label', aueLabel);
    }

    // Move all children from row to card block (preserves their instrumentation)
    while (row.firstElementChild) {
      cardBlock.appendChild(row.firstElementChild);
    }

    // Temporarily append cardBlock to slide
    slide.appendChild(cardBlock);

    // Decorate the card using card component
    await decorateCard(cardBlock);

    // Load card styles
    const decoratedCard = slide.querySelector('.card-block, .card') || slide.firstElementChild;
    if (decoratedCard && decoratedCard.dataset.blockName) {
      await loadBlock(decoratedCard);
    }

    return slide;
  });

  // Wait for all cards to be processed
  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((slide) => {
    track.appendChild(slide);
  });

  // Create navigation
  const { navContainer, prevBtn, nextBtn } = createNavigationButtons(carousel);

  // Create dots indicator
  const dotsContainer = createDotsIndicator(cardElements.length);

  // Assemble carousel
  carousel.appendChild(track);
  carousel.appendChild(navContainer);
  carousel.appendChild(dotsContainer);

  // Initialize interactions
  initializeCarouselInteractions(carousel, track, prevBtn, nextBtn, dotsContainer);

  // Preserve block instrumentation
  if (block.hasAttribute('data-aue-resource')) {
    carousel.setAttribute('data-aue-resource', block.getAttribute('data-aue-resource'));
    carousel.setAttribute('data-aue-behavior', block.getAttribute('data-aue-behavior') || 'component');
    carousel.setAttribute('data-aue-type', block.getAttribute('data-aue-type') || 'block');
    const aueLabel = block.getAttribute('data-aue-label');
    if (aueLabel) carousel.setAttribute('data-aue-label', aueLabel);
  }

  // Preserve blockName if present
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  carousel.classList.add('block', 'insurance-product-carousel-block');

  // Replace block with carousel
  block.replaceWith(carousel);
}
