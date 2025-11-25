/**
 * Header Unipol - Main navigation header component
 * Organism that combines logo and navigation pills
 */

import { createNavigationPill, NAVIGATION_PILL_VARIANTS } from '../atoms/navigation-pill/navigation-pill.js';

/**
 * Creates the header-unipol component
 *
 * @param {HTMLElement|string} logoContent - Logo image element or URL
 * @param {Array<Object>} navigationItems - Array of navigation pill configs
 * @param {Array<HTMLElement>} [navigationElements] - Pre-created nav elements
 * @returns {HTMLElement} The complete header element
 *
 * @example
 * // Programmatic creation (Storybook)
 * const header = createHeaderUnipol(
 *   '/logo.png',
 *   [
 *     { label: 'Link 1', href: '#', variant: 'primary' },
 *     { label: 'Link 2', href: '#', variant: 'secondary' }
 *   ]
 * );
 *
 * @example
 * // From AEM EDS (with pre-created elements)
 * const header = createHeaderUnipol(
 *   logoElement,
 *   null,
 *   navigationPillElements
 * );
 */
export function createHeaderUnipol(
  logoContent,
  navigationItems = [],
  navigationElements = [],
) {
  const header = document.createElement('div');
  header.className = 'header-unipol block';

  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-unipol-container';

  // === LOGO SECTION ===
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'header-unipol-logo';

  if (logoContent) {
    if (logoContent instanceof HTMLElement) {
      // Use existing element (from AEM)
      logoWrapper.appendChild(logoContent);
    } else {
      // Create new image (for Storybook)
      const logoImg = document.createElement('img');
      logoImg.src = logoContent;
      logoImg.alt = 'Unipol Logo';
      logoImg.className = 'header-unipol-logo-img';
      logoWrapper.appendChild(logoImg);
    }
  }

  headerContainer.appendChild(logoWrapper);

  // === NAVIGATION SECTION ===
  const navWrapper = document.createElement('nav');
  navWrapper.className = 'header-unipol-nav';
  navWrapper.setAttribute('role', 'navigation');
  navWrapper.setAttribute('aria-label', 'Main navigation');

  // Use pre-created elements (from AEM) or create new ones (Storybook)
  if (navigationElements && navigationElements.length > 0) {
    navigationElements.forEach((element) => {
      if (element) {
        navWrapper.appendChild(element);
      }
    });
  } else if (navigationItems && navigationItems.length > 0) {
    navigationItems.forEach((item) => {
      const pill = createNavigationPill(
        item.label || 'Navigation Pill',
        item.href || '',
        item.variant || NAVIGATION_PILL_VARIANTS.PRIMARY,
        item.leftIcon || '',
        item.leftIconSize || '',
        item.rightIcon || '',
        item.rightIconSize || '',
        item.instrumentation || {},
      );
      navWrapper.appendChild(pill);
    });
  }

  headerContainer.appendChild(navWrapper);
  header.appendChild(headerContainer);

  return header;
}

/**
 * Extracts logo element from AEM rows
 *
 * @param {HTMLElement} row - The row containing the logo
 * @returns {HTMLElement|null}
 */
function extractLogoElement(row) {
  if (!row) return null;

  // Look for image element
  const img = row.querySelector('img');
  if (img) {
    return img;
  }

  // Look for picture element
  const picture = row.querySelector('picture');
  if (picture) {
    return picture;
  }

  return null;
}

/**
 * Extracts navigation pill elements from referenced blocks
 *
 * @param {HTMLElement} block - The header-unipol block
 * @returns {Promise<Array<HTMLElement>>} Array of navigation pill elements
 */
async function extractNavigationElements(block) {
  // Find all navigation-pill blocks (references)
  const navPillBlocks = Array.from(block.querySelectorAll('[data-block-name="navigation-pill"]'));

  // If no blocks found, check for already decorated pills (fallback)
  if (navPillBlocks.length === 0) {
    const decoratedPills = Array.from(block.querySelectorAll('.navigation-pill'));
    return decoratedPills;
  }

  // Load and decorate each navigation-pill block
  const { loadBlock } = await import('../../scripts/aem.js');
  const decorateNavigationPill = (await import('../atoms/navigation-pill/navigation-pill.js')).default;

  // Process all blocks in parallel using Promise.all
  const processedPills = await Promise.all(
    navPillBlocks.map(async (navPillBlock) => {
      // Check if already decorated
      let decoratedPill = navPillBlock.querySelector('.navigation-pill');
      if (decoratedPill) {
        return decoratedPill;
      }

      // Load the block (loads CSS and JS)
      await loadBlock(navPillBlock);

      // Decorate the navigation pill
      await decorateNavigationPill(navPillBlock);

      // Extract the decorated navigation pill element
      // The decorator adds the pill inside the block
      decoratedPill = navPillBlock.querySelector('.navigation-pill');

      if (decoratedPill) {
        // Move the pill (not clone) to preserve event handlers and functionality
        return decoratedPill;
      }

      // Fallback: try to find any link or button that might be the pill
      const pill = navPillBlock.querySelector('a, button');
      return pill || null;
    }),
  );

  // Filter out null values and return
  return processedPills.filter((pill) => pill !== null);
}

/**
 * Preserves AEM Universal Editor instrumentation and metadata
 *
 * @param {HTMLElement} originalBlock - Original block with AEM attributes
 * @param {HTMLElement} newBlock - New block to receive attributes
 */
function preserveBlockAttributes(originalBlock, newBlock) {
  // Preserve data-aue-* attributes
  [...originalBlock.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-')) {
      newBlock.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve id and custom classes (but not default block classes)
  if (originalBlock.id) {
    newBlock.id = originalBlock.id;
  }

  [...originalBlock.classList].forEach((className) => {
    if (!className.startsWith('header-unipol') && className !== 'block') {
      newBlock.classList.add(className);
    }
  });
}

/**
 * Decorator for header-unipol block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  if (!block) return;

  // === STEP 1: Extract rows from Universal Editor ===
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // === STEP 2: Extract logo (first row or reference) ===
  // Look for logo reference first, then fallback to row-based extraction
  let logoElement = null;
  const logoReference = block.querySelector('[data-block-name]:not([data-block-name="navigation-pill"])');
  if (logoReference) {
    // Logo is a reference - extract image/picture from it
    logoElement = extractLogoElement(logoReference);
  } else {
    // Fallback to row-based extraction
    const logoRow = rows[0];
    logoElement = extractLogoElement(logoRow);
  }

  // === STEP 3: Extract navigation pills from references ===
  const navigationElements = await extractNavigationElements(block);

  // === STEP 4: Create the header using the centralized function ===
  const header = createHeaderUnipol(
    logoElement,
    null, // No config objects when using pre-created elements
    navigationElements,
  );

  // === STEP 5: Preserve AEM instrumentation and metadata ===
  preserveBlockAttributes(block, header);

  // === STEP 6: Replace the original block ===
  block.replaceWith(header);
}
