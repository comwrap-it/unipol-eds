/**
 * Footer Download Section - Molecule Component
 * Download area with brand button, QR code, and app store buttons
 */

/**
 * Creates a footer download section
 *
 * @param {Object} config - Configuration object
 * @param {HTMLElement|string} config.logo - Logo image element or URL
 * @param {string} config.brandText - Brand button text
 * @param {string} config.brandHref - Brand button URL
 * @param {HTMLElement|string} config.brandIcon - Brand button icon element or URL
 * @param {HTMLElement|string} config.qrCode - QR code image element or URL
 * @param {string} config.qrCodeText - QR code description text
 * @param {HTMLElement|string} config.googlePlayImage - Google Play image element or URL
 * @param {string} config.googlePlayHref - Google Play URL
 * @param {HTMLElement|string} config.appStoreImage - App Store image element or URL
 * @param {string} config.appStoreHref - App Store URL
 * @returns {HTMLElement} Footer download section element
 */
export function createFooterDownloadSection(config = {}) {
  const section = document.createElement('div');
  section.className = 'footer-download-section';

  // Brand Button Container
  const brandContainer = document.createElement('div');
  brandContainer.className = 'footer-download-brand';

  if (config.logo) {
    const logoElement = config.logo instanceof HTMLElement
      ? config.logo.cloneNode(true)
      : (() => {
        const img = document.createElement('img');
        img.src = config.logo;
        img.alt = 'Unipol Logo';
        return img;
      })();
    brandContainer.appendChild(logoElement);
  }

  if (config.brandText && config.brandHref) {
    const brandButton = document.createElement('a');
    brandButton.href = config.brandHref;
    brandButton.className = 'footer-download-brand-button';
    brandButton.textContent = config.brandText;

    if (config.brandIcon) {
      const iconElement = config.brandIcon instanceof HTMLElement
        ? config.brandIcon.cloneNode(true)
        : (() => {
          const img = document.createElement('img');
          img.src = config.brandIcon;
          img.alt = '';
          img.className = 'footer-download-brand-icon';
          return img;
        })();
      brandButton.appendChild(iconElement);
    }

    brandContainer.appendChild(brandButton);
  }

  section.appendChild(brandContainer);

  // QR Code Container
  const qrContainer = document.createElement('div');
  qrContainer.className = 'footer-download-qr';

  if (config.qrCode) {
    const qrElement = config.qrCode instanceof HTMLElement
      ? config.qrCode.cloneNode(true)
      : (() => {
        const img = document.createElement('img');
        img.src = config.qrCode;
        img.alt = 'QR Code';
        img.className = 'footer-download-qr-img';
        return img;
      })();
    qrContainer.appendChild(qrElement);
  }

  if (config.qrCodeText) {
    const qrText = document.createElement('span');
    qrText.className = 'footer-download-qr-text';
    qrText.textContent = config.qrCodeText;
    qrContainer.appendChild(qrText);
  }

  section.appendChild(qrContainer);

  // App Store Buttons Container
  const appButtonsContainer = document.createElement('div');
  appButtonsContainer.className = 'footer-download-apps';

  if (config.googlePlayImage && config.googlePlayHref) {
    const googlePlayLink = document.createElement('a');
    googlePlayLink.href = config.googlePlayHref;
    googlePlayLink.className = 'footer-download-app-link footer-download-app-google';
    googlePlayLink.setAttribute('aria-label', 'Download on Google Play');

    const googlePlayImg = config.googlePlayImage instanceof HTMLElement
      ? config.googlePlayImage.cloneNode(true)
      : (() => {
        const img = document.createElement('img');
        img.src = config.googlePlayImage;
        img.alt = 'Get it on Google Play';
        return img;
      })();
    googlePlayLink.appendChild(googlePlayImg);
    appButtonsContainer.appendChild(googlePlayLink);
  }

  if (config.appStoreImage && config.appStoreHref) {
    const appStoreLink = document.createElement('a');
    appStoreLink.href = config.appStoreHref;
    appStoreLink.className = 'footer-download-app-link footer-download-app-apple';
    appStoreLink.setAttribute('aria-label', 'Download on the App Store');

    const appStoreImg = config.appStoreImage instanceof HTMLElement
      ? config.appStoreImage.cloneNode(true)
      : (() => {
        const img = document.createElement('img');
        img.src = config.appStoreImage;
        img.alt = 'Download on the App Store';
        return img;
      })();
    appStoreLink.appendChild(appStoreImg);
    appButtonsContainer.appendChild(appStoreLink);
  }

  section.appendChild(appButtonsContainer);

  return section;
}

/**
 * Extracts download section data from AEM rows
 *
 * @param {Array<HTMLElement>} rows - Array of row elements
 * @returns {Object} Download section configuration
 */
function extractDownloadSectionData(rows) {
  const config = {};

  // Row 0: Logo
  const logoRow = rows[0];
  const logoElement = logoRow?.querySelector('img, picture');
  if (logoElement) {
    config.logo = logoElement;
  }

  // Row 1: Brand Text
  config.brandText = rows[1]?.textContent?.trim() || '';

  // Row 2: Brand Href
  config.brandHref = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || '';

  // Row 3: Brand Icon
  const brandIconElement = rows[3]?.querySelector('img, picture');
  if (brandIconElement) {
    config.brandIcon = brandIconElement;
  }

  // Row 4: QR Code
  const qrElement = rows[4]?.querySelector('img, picture');
  if (qrElement) {
    config.qrCode = qrElement;
  }

  // Row 5: QR Code Text
  config.qrCodeText = rows[5]?.textContent?.trim() || '';

  // Row 6: Google Play Image
  const googlePlayImg = rows[6]?.querySelector('img, picture');
  if (googlePlayImg) {
    config.googlePlayImage = googlePlayImg;
  }

  // Row 7: Google Play Href
  config.googlePlayHref = rows[7]?.querySelector('a')?.href || rows[7]?.textContent?.trim() || '';

  // Row 8: App Store Image
  const appStoreImg = rows[8]?.querySelector('img, picture');
  if (appStoreImg) {
    config.appStoreImage = appStoreImg;
  }

  // Row 9: App Store Href
  config.appStoreHref = rows[9]?.querySelector('a')?.href || rows[9]?.textContent?.trim() || '';

  return config;
}

/**
 * Decorates a footer-download-section block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualRows = wrapper ? Array.from(wrapper.children) : rows;

  if (actualRows.length < 10) {
    console.warn('footer-download-section: insufficient rows'); // esline warning
    return;
  }

  const config = extractDownloadSectionData(actualRows);
  const section = createFooterDownloadSection(config);

  // Preserve block attributes for Universal Editor
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      section.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    section.dataset.blockName = block.dataset.blockName;
  }

  // Preserve id if present
  if (block.id) {
    section.id = block.id;
  }

  block.replaceWith(section);
}
