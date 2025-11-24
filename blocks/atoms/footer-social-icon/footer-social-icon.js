/**
 * Footer Social Icon - Atom Component
 * Single social media icon link
 */

/**
 * Creates a footer social icon link
 *
 * @param {string} iconUrl - URL to icon image
 * @param {string} href - Social media link URL
 * @param {string} [ariaLabel] - Accessibility label
 * @param {Object} [instrumentation={}] - AEM Universal Editor attributes
 * @returns {HTMLElement} Social icon link element
 */
export function createFooterSocialIcon(iconUrl, href, ariaLabel = '', instrumentation = {}) {
  const link = document.createElement('a');
  link.href = href || '#';
  link.className = 'footer-social-icon';
  link.setAttribute('aria-label', ariaLabel || href || 'Social media link');
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');

  if (iconUrl) {
    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = ariaLabel || '';
    img.className = 'footer-social-icon-img';
    link.appendChild(img);
  }

  // Apply instrumentation attributes
  Object.entries(instrumentation).forEach(([attr, value]) => {
    if (attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')) {
      link.setAttribute(attr, value);
    }
  });

  return link;
}

/**
 * Extracts social icon data from AEM rows
 *
 * @param {HTMLElement} row - Row element containing icon data
 * @returns {Object} Icon configuration
 */
function extractSocialIconData(row) {
  const picture = row.querySelector('picture');
  const img = row.querySelector('img');
  const link = row.querySelector('a');

  const iconUrl = img?.src || picture?.querySelector('img')?.src || '';
  const href = link?.href || row.querySelector('a')?.href || '#';
  const ariaLabel = img?.alt || link?.textContent?.trim() || href;

  const instrumentation = {};
  [...row.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  return {
    iconUrl, href, ariaLabel, instrumentation,
  };
}

/**
 * Decorates a footer-social-icon block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  const {
    iconUrl, href, ariaLabel, instrumentation,
  } = extractSocialIconData(block);
  const icon = createFooterSocialIcon(iconUrl, href, ariaLabel, instrumentation);

  // Preserve block attributes for Universal Editor
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      icon.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    icon.dataset.blockName = block.dataset.blockName;
  }

  // Preserve id if present
  if (block.id) {
    icon.id = block.id;
  }

  block.replaceWith(icon);
}
