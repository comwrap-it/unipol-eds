/**
 * @typedef {Object} DotState
 * @property {boolean} isBeginning - Whether the carousel is at the beginning
 * @property {boolean} isEnd - Whether the carousel is at the end
 */

/**
 * @typedef {function(DotState): void} SetExpandedDot
 */

/**
 *
 * @param {swiperInstance} the swiper instance
 * @param {SetExpandedDot} setExpandedDot function returned from createScrollIndicator
 * @param {HTMLElement} leftIconButton the left navigation button
 * @param {HTMLElement} rightIconButton the right navigation button
 */
export const handleSlideChange = (
  swiperInstance,
  setExpandedDot,
  leftIconButton,
  rightIconButton,
) => {
  if (!swiperInstance) return;

  const onSlideChange = () => {
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
    onSlideChange();
  });
};

// Utils to include libs
// add delayed functionality here
export default function loadSwiper() {
  return new Promise((resolve, reject) => {
    // Check if Swiper is already loaded
    if (typeof window.Swiper !== 'undefined') {
      resolve(window.Swiper);
      return;
    }

    // Then load JavaScript
    const scriptRule = document.createElement('script');
    scriptRule.setAttribute('type', 'text/javascript');
    scriptRule.src = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js';

    scriptRule.onload = () => {
      // Give it a moment for the global Swiper to be available
      setTimeout(() => {
        if (typeof window.Swiper !== 'undefined') {
          resolve(window.Swiper);
        } else {
          reject(new Error('Swiper not found on window after CDN load'));
        }
      }, 100);
    };

    scriptRule.onerror = () => {
      reject(new Error('Failed to load Swiper script'));
    };

    document.head.append(scriptRule);
  });
}
