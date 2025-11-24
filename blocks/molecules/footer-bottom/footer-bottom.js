/**
 * Footer Bottom - Molecule Component
 * Bottom section with copyright text and social icons
 */

import { createFooterText } from '../../footer-text/footer-text.js';
import { createFooterSocialIcon } from '../../atoms/footer-social-icon/footer-social-icon.js';

/**
 * Creates a footer bottom section
 *
 * @param {Object} config - Configuration object
 * @param {string|HTMLElement} config.copyrightText - Copyright text
 * @param {Array<Object>} config.socialIcons - Array of social icon configs
 * @param {Array<HTMLElement>} [config.socialIconElements] - Pre-created social icon elements
 * @returns {HTMLElement} Footer bottom section element
 */
export function createFooterBottom(config = {}) {
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';

  // Copyright Text
  if (config.copyrightText) {
    const copyrightElement = createFooterText(config.copyrightText);
    copyrightElement.className = 'footer-bottom-copyright';
    bottom.appendChild(copyrightElement);
  }

  // Social Icons
  if (config.socialIconElements && config.socialIconElements.length > 0) {
    const socialContainer = document.createElement('div');
    socialContainer.className = 'footer-bottom-social';

    config.socialIconElements.forEach((icon) => {
      if (icon) {
        socialContainer.appendChild(icon);
      }
    });

    bottom.appendChild(socialContainer);
  } else if (config.socialIcons && config.socialIcons.length > 0) {
    const socialContainer = document.createElement('div');
    socialContainer.className = 'footer-bottom-social';

    config.socialIcons.forEach((iconConfig) => {
      const icon = createFooterSocialIcon(
        iconConfig.iconUrl || '',
        iconConfig.href || '#',
        iconConfig.ariaLabel || '',
        iconConfig.instrumentation || {},
      );
      socialContainer.appendChild(icon);
    });

    bottom.appendChild(socialContainer);
  }

  return bottom;
}

/**
 * Extracts footer bottom data from AEM rows
 *
 * @param {Array<HTMLElement>} rows - Array of row elements
 * @returns {Object} Footer bottom configuration
 */
function extractFooterBottomData(rows) {
  const config = {};

  // First row: Copyright text
  const copyrightRow = rows[0];
  if (copyrightRow) {
    const textElement = copyrightRow.querySelector('.footer-text, p');
    config.copyrightText = textElement || copyrightRow.textContent?.trim() || '';
  }

  // Remaining rows: Social icons
  const socialRows = rows.slice(1);
  config.socialIconElements = [];

  socialRows.forEach((row) => {
    const picture = row.querySelector('picture');
    const img = row.querySelector('img');
    const link = row.querySelector('a');

    if (picture || img) {
      const iconUrl = img?.src || picture?.querySelector('img')?.src || '';
      const href = link?.href || row.querySelector('a')?.href || '#';
      const ariaLabel = img?.alt || link?.textContent?.trim() || href;

      const instrumentation = {};
      [...row.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
          instrumentation[attr.name] = attr.value;
        }
      });

      const icon = createFooterSocialIcon(iconUrl, href, ariaLabel, instrumentation);
      config.socialIconElements.push(icon);
    }
  });

  return config;
}

/**
 * Decorates a footer-bottom block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualRows = wrapper ? Array.from(wrapper.children) : rows;

  const config = extractFooterBottomData(actualRows);
  const bottom = createFooterBottom(config);

  // Preserve block attributes for Universal Editor
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      bottom.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    bottom.dataset.blockName = block.dataset.blockName;
  }

  // Preserve id if present
  if (block.id) {
    bottom.id = block.id;
  }

  block.replaceWith(bottom);
}
