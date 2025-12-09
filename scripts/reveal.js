/**
 * Initializes reveal animations for elements as they enter the viewport.
 * @param {Object} options - Configuration options for the reveal functionality.
 * @param {string} [options.selector=".reveal-in, .reveal-in-up"] - CSS selector.
 * @param {Element|null} [options.root=null] - The root element for the IntersectionObserver.
 * @param {string} [options.rootMargin="0px 0px -10% 0px"] - Margin around the root.
 * @param {number} [options.threshold=0.15] - Percentage of the element's visibility required.
 */
export function initRevealAnimations({
  selector = '.reveal-in:not(.swiper-slide), .reveal-in-up:not(.swiper-slide)',
  root = null,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.05,
} = {}) {
  const items = Array.from(document.querySelectorAll(selector));
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          obs.unobserve(e.target);
        }
      });
    },
    { root, rootMargin, threshold },
  );

  items.forEach((el) => io.observe(el));
}

/**
 * Initializes reveal animations specifically for a carousel element.
 * When any slide becomes visible inside the carousel viewport,
 * all slides get revealed and the observer stops.
 * @param {HTMLElement} carousel - The carousel element containing slides to be revealed.
 */
function animateCarouselSlideProgressively(carousel) {
  const slides = carousel.querySelectorAll('.swiper-slide');
  if (!slides.length) return;

  const CARD_ANIMATION_DELAY = 100; // milliseconds
  slides.forEach((el, index) => {
    el.style.setProperty('--slide-reveal-offset', `${index * CARD_ANIMATION_DELAY}ms`);
    el.classList.add('is-revealed');
  });
}

export function initCarouselAnimations(carousel) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      const intersected = entries.some((e) => e.isIntersecting);
      if (intersected) {
        animateCarouselSlideProgressively(carousel);
        obs.unobserve(carousel);
        obs.disconnect();
      }
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );

  observer.observe(carousel);
}
