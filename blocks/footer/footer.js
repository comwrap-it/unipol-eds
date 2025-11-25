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

  // decorate footer DOM
  block.textContent = '';
  const footerContainer = document.createElement('div');
  footerContainer.className = 'unipol-footer';

  while (fragment.firstElementChild) footerContainer.append(fragment.firstElementChild);

  const textListBlocks = footerContainer.querySelectorAll('.text-list');
  if (textListBlocks) decorateTextLink(textListBlocks);

  // --- FOOTER DOWNLOAD SECTION ---
  const downloadBlock = footerContainer.querySelector('.footer-download-section');
  if (downloadBlock) decorateFooterDownload(downloadBlock);

  // --- FOOTER PRIVACY SECTION ---
  const privacyBlock = footerContainer.querySelector('.footer-privacy-section');
  if (privacyBlock) decorateFooterPrivacy(privacyBlock);

  // --- FOOTER SOCIAL SECTION ---
  const socialBlock = footerContainer.querySelector('.footer-social-section');
  if (socialBlock) decorateFooterSocial(socialBlock);

  // --- FOOTER COPYRIGHT SECTION ---
  const copyrightBlock = footerContainer.querySelector('.footer-copyright-section');
  if (copyrightBlock) decorateFooterCopyright(copyrightBlock);

  // append final footerContainer to block
  block.append(footerContainer);
}
