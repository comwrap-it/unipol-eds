import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateTextLink from '../text-list/text-list.js';
import decorateFooterDownload from '../footer-download-section/footer-download-section.js';
import decorateFooterPrivacy from '../footer-privacy-section/footer-privacy-section.js';
import decorateFooterSocial from '../footer-social-section/footer-social-section.js';
import decorateFooterCopyright from '../footer-copyright-section/footer-copyright-section.js';

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

  // decorate text-link blocks
  const textListBlocks = footerContainer.querySelectorAll('.text-list');
  if (textListBlocks) decorateTextLink(textListBlocks);

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
    decorateFooterDownload(downloadWrapper.querySelector('.footer-download-section'));
    topContainer.append(downloadWrapper);
  }

  const privacyWrapper = footerContainer.querySelector('.footer-privacy-section-wrapper');
  if (privacyWrapper) {
    decorateFooterPrivacy(privacyWrapper.querySelector('.footer-privacy-section'));
    bottomContainer.append(privacyWrapper);
  }

  const socialWrapper = footerContainer.querySelector('.footer-social-section-wrapper');
  if (socialWrapper) {
    decorateFooterSocial(socialWrapper.querySelector('.footer-social-section'));
    bottomContainer.append(socialWrapper);
  }

  // --- COPYRIGHT SECTION ---
  const copyrightBlock = footerContainer.querySelector('.footer-copyright-section');
  if (copyrightBlock) {
    decorateFooterCopyright(copyrightBlock);
  }

  // clear footerContainer and append organized sections
  footerContainer.textContent = '';
  footerContainer.append(topContainer, bottomContainer);
  if (copyrightBlock) footerContainer.append(copyrightBlock);

  block.append(footerContainer);
}
