import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // clear original block
  block.textContent = '';

  // create main footer container
  const footerContainer = document.createElement('div');
  footerContainer.className = 'unipol-footer';

  // append all fragment children to footerContainer temporarily
  while (fragment.firstElementChild) footerContainer.append(fragment.firstElementChild);

  // --- CREATE TOP AND BOTTOM CONTAINERS ---
  const topContainer = document.createElement('div');
  topContainer.className = 'unipol-footer-top';

  const bottomContainer = document.createElement('div');
  bottomContainer.className = 'unipol-footer-bottom';

  // --- DISTRIBUTE BLOCKS INTO CONTAINERS ---
  const textListWrappers = footerContainer.querySelectorAll('.text-list-wrapper');
  textListWrappers.forEach((wrapper) => topContainer.append(wrapper));

  const downloadWrapper = footerContainer.querySelector('.footer-download-section-wrapper');
  if (downloadWrapper) {
    topContainer.append(downloadWrapper);
  }

  const privacyWrapper = footerContainer.querySelector('.footer-privacy-section-wrapper');
  if (privacyWrapper) {
    bottomContainer.append(privacyWrapper);
  }

  const socialWrapper = footerContainer.querySelector('.footer-social-section-wrapper');
  if (socialWrapper) {
    bottomContainer.append(socialWrapper);
  }

  // --- COPYRIGHT SECTION ---
  const copyrightBlock = footerContainer.querySelector('.footer-copyright-section');
  // clear footerContainer and append organized sections
  footerContainer.textContent = '';
  footerContainer.append(topContainer, bottomContainer);
  if (copyrightBlock) footerContainer.append(copyrightBlock);

  block.append(footerContainer);
}
