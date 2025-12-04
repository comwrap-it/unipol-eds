/**
 * Initializes reveal animations for elements as they enter the viewport.
 * @param {Object} options - Configuration options for the reveal functionality.
 * @param {string} [options.selector=".reveal-in, .reveal-in-up"] - CSS selector.
 * @param {Element|null} [options.root=null] - The root element for the IntersectionObserver.
 * @param {string} [options.rootMargin="0px 0px -10% 0px"] - Margin around the root.
 * @param {number} [options.threshold=0.15] - Percentage of the element's visibility required.
 */
export default function initReveal({
  selector = '.reveal-in, .reveal-in-up',
  root = null,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.05,
} = {}) {
  console.log('Initializing reveal animations');
  const items = Array.from(document.querySelectorAll(selector));
  console.log('🚀 ~ initReveal ~ items:', items);
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
