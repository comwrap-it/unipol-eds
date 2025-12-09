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

/**
 *
 * checks if the document is in author mode
 * the html elemtent is required to access the document because in author we have nested iframes
 * @param {HTMLElement} htmlElement any html element within the document to check
 * @returns {boolean} true if in author mode, false otherwise
 */
export const isAuthorMode = (htmlElement) => {
  if (!htmlElement || !htmlElement.ownerDocument) {
    console.warn('Invalid htmlElement provided to isAuthorMode');
    return false;
  }
  const doc = htmlElement.ownerDocument;
  const root = doc.documentElement;
  if (!root) {
    return false;
  }
  const isInAuthorMode = root.classList.contains('adobe-ue-preview')
    || root.classList.contains('adobe-ue-edit');
  return isInAuthorMode;
};

/**
 * Extract instrumentation attributes from an element
 *
 * @param {HTMLElement} element - The element to extract attributes from
 * @returns {Object} An object containing instrumentation attributes
 */
export const extractInstrumentationAttributes = (element) => {
  const instrumentation = {};
  if (element) {
    [...element.attributes].forEach((attr) => {
      if (
        attr.name.startsWith('data-aue-')
        || attr.name.startsWith('data-richtext-')
      ) {
        instrumentation[attr.name] = attr.value;
      }
    });
  }
  return instrumentation;
};

export function restoreInstrumentation(element, instrumentation) {
  Object.entries(instrumentation).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

/**
 * Extracts editorial values from UE
 */
export function getValuesFromBlock(block, keys) {
  const result = {};

  if (!block) return result;

  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const items = row.querySelectorAll(':scope > div');
    const key = items[0].textContent.trim();
    const valueNode = items[1];
    const instrumentation = extractInstrumentationAttributes(items);

    const value = valueNode.querySelector('a')?.getAttribute('href') || valueNode.textContent.trim();

    if (keys.includes(key)) {
      result[key] = {
        value,
        instrumentation,
      };
    }
  });

  return result;
}
