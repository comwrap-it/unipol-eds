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

  /** ------------------------------
   *  CREATE HAMBURGER + MENU BOX
   * ------------------------------ */
  const hamburgerContainer = document.createElement('div');
  hamburgerContainer.className = 'hamburger-menu-container';

  const hamburgerButton = document.createElement('button');
  hamburgerButton.className = 'hamburger-menu-button';
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-controls', 'header-hamburger-menu');

  const icon = document.createElement('span');
  icon.className = 'icon un-icon-arrow-down-right';

  hamburgerButton.appendChild(icon);
  hamburgerContainer.appendChild(hamburgerButton);

  // The dropdown (white box)
  const dropdownMenu = document.createElement('div');
  dropdownMenu.id = 'header-hamburger-menu';
  dropdownMenu.className = 'hamburger-dropdown';
  dropdownMenu.setAttribute('role', 'menu');
  dropdownMenu.setAttribute('aria-hidden', 'true');

  hamburgerContainer.appendChild(dropdownMenu);

  /** ------------------------------
   *  BUILD HEADER LOGO
   * ------------------------------ */
  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualRows = wrapper ? Array.from(wrapper.children) : rows;
  const config = extractHeaderLogoData(actualRows);
  const headerLogoElement = createHeaderLogo(config);

  block.innerHTML = '';
  while (headerLogoElement.firstChild) {
    block.appendChild(headerLogoElement.firstChild);
  }

  // Preserve AUE attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      block.setAttribute(attr.name, attr.value);
    }
  });

  block.classList.add('header-logo');
  block.insertBefore(hamburgerContainer, block.firstChild);

  /** ------------------------------
   *  ACCESSIBLE TOGGLE LOGIC
   * ------------------------------ */
  function toggleMenu(open) {
    const isOpen = open ?? hamburgerButton.getAttribute('aria-expanded') === 'false';

    hamburgerButton.setAttribute('aria-expanded', isOpen);
    dropdownMenu.setAttribute('aria-hidden', !isOpen);

    if (isOpen) {
      dropdownMenu.classList.add('open');
    } else {
      dropdownMenu.classList.remove('open');
    }
  }

  hamburgerButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  /** ------------------------------
     *  CLOSE MENU ON RESIZE
     * ------------------------------ */
  let resizeTimeout;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      const isMobile = window.matchMedia('(max-width: 1200px)').matches;

      if (!isMobile) {
        toggleMenu(false);
      }
    }, 50);
  });

  document.body.addEventListener('click', () => {
    if (hamburgerButton.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  });

  dropdownMenu.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('unipol-mobile-menu-ready', (e) => {
    const dropdown = dropdownMenu;

    const oldMenu = dropdown.querySelector('.mobile-nav-hidden-pills');
    if (oldMenu) oldMenu.remove();

    dropdown.appendChild(e.detail);
  });
}
