import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer Unipol Decorator
 */
export default async function decorate(block) {
  // Load fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  if (!fragment) {
    // eslint-disable-next-line no-console
    console.warn('Footer fragment not found');
    return;
  }

  // Extract blocks
  const linkColumns = [...fragment.querySelectorAll('.text-list.block')];
  const downloadSection = fragment.querySelector('.footer-download-link.block');
  const privacyLinks = fragment.querySelector('.footer-privacy-link-list.block');
  const socialLinks = fragment.querySelector('.footer-social-list.block');
  const bottomText = fragment.querySelector('.footer-text.block');

  // Build new footer
  const container = document.createElement('div');
  container.className = 'footer-unipol';

  if (linkColumns.length > 0) {
    const colsWrapper = document.createElement('div');
    colsWrapper.className = 'footer-unipol-columns';
    linkColumns.forEach((col) => colsWrapper.appendChild(col.cloneNode(true)));
    container.appendChild(colsWrapper);
  }

  if (downloadSection) {
    const dlWrapper = document.createElement('div');
    dlWrapper.className = 'footer-unipol-download';
    dlWrapper.appendChild(downloadSection.cloneNode(true));
    container.appendChild(dlWrapper);
  }

  if (privacyLinks) {
    const privacyWrapper = document.createElement('div');
    privacyWrapper.className = 'footer-unipol-privacy';
    privacyWrapper.appendChild(privacyLinks.cloneNode(true));
    container.appendChild(privacyWrapper);
  }

  if (socialLinks) {
    const socialWrapper = document.createElement('div');
    socialWrapper.className = 'footer-unipol-social';
    socialWrapper.appendChild(socialLinks.cloneNode(true));
    container.appendChild(socialWrapper);
  }

  if (bottomText) {
    const bottomWrapper = document.createElement('div');
    bottomWrapper.className = 'footer-unipol-bottom';
    bottomWrapper.appendChild(bottomText.cloneNode(true));
    container.appendChild(bottomWrapper);
  }

  // Apply to block
  block.textContent = '';
  block.appendChild(container);
}
