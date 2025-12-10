/**
 * Header Logo Component - Molecule Component
 * Single logo with link
 */

/**
 * Creates a header logo element with link
 *
 * @param {Object} config - Configuration object
 * @param {HTMLElement|string} config.logo - Logo image element or URL
 * @param {string} config.href - Link URL
 * @returns {HTMLElement} Header logo element
 */
export function createHeaderLogo(config = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'header-logo-wrapper';

  const link = document.createElement('a');
  link.href = config.href || '/';
  link.setAttribute('aria-label', 'home-page');
  link.className = 'header-logo-link';

  if (config.logo) {
    const logoElement = config.logo instanceof HTMLElement
      ? config.logo.cloneNode(true)
      : (() => {
        const img = document.createElement('img');
        img.src = config.logo;
        img.alt = '';
        return img;
      })();
    link.appendChild(logoElement);
  }

  wrapper.appendChild(link);
  return wrapper;
}

/**
 * Extracts header logo data from AEM rows
 *
 * @param {Array<HTMLElement>} rows - Array of row elements
 * @returns {Object} Header logo configuration
 */
function extractHeaderLogoData(rows) {
  const config = {};

  // Row 0: Logo
  const logoElement = rows[0]?.querySelector('img, picture');
  config.logo = logoElement || (() => {
    const img = document.createElement('img');
    img.src = '/content/dam/unipol/logo/Unipol-Logo-OnDark.svg';
    img.alt = '';
    return img;
  })();

  // Row 1: Link Href
  const href = rows[1]?.querySelector('a')?.href || rows[1]?.textContent?.trim() || '/';
  config.href = href;

  return config;
}

/**
 * Decorates a header-logo block (AEM EDS) — UE-safe
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  const hamburgerContainer = document.createElement('div');
  hamburgerContainer.className = 'hamburger-menu-container';

  const hamburgerButton = document.createElement('button');
  hamburgerButton.className = 'hamburger-menu-button';

  const icon = document.createElement('span');
  icon.className = 'icon un-icon-arrow-down-right';

  hamburgerButton.appendChild(icon);
  hamburgerContainer.appendChild(hamburgerButton);

  block.insertBefore(hamburgerContainer, block.firstChild);

  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualRows = wrapper ? Array.from(wrapper.children) : rows;
  const config = extractHeaderLogoData(actualRows);
  const headerLogoElement = createHeaderLogo(config);

  block.innerHTML = '';
  while (headerLogoElement.firstChild) {
    block.appendChild(headerLogoElement.firstChild);
  }

  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      block.setAttribute(attr.name, attr.value);
    }
  });

  block.classList.add('header-logo');
  block.insertBefore(hamburgerContainer, block.firstChild);
}
