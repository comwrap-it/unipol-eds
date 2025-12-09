// utils functions for swiper carousels
/**
 * @typedef {Object} DotState
 * @property {boolean} isBeginning - Whether the carousel is at the beginning
 * @property {boolean} isEnd - Whether the carousel is at the end
 */

/**
 *
 * @param {swiperInstance} the swiper instance
 * @param {function(DotState): void} setExpandedDot function returned from createScrollIndicator
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

/**
 *
 * adds animation class to the nearest section of the given element
 * @param {HTMLElement} element the element from which to find the nearest section
 * @param {string} animationClass the animation class to add to the nearest section
 */
export const addAnimationClassToNearestSection = (
  element,
  animationClass = 'reveal-in-up',
) => {
  if (!element) return;
  const section = element.closest('.section');
  if (section) {
    section.classList.add(animationClass);
  }
};
