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

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
(function wrapFooterTextLists() {
  const section = footer.querySelector('.section.text-list-container.footer-download-link-container');
  if (!section) return;

  const wrappers = Array.from(section.querySelectorAll(':scope > .text-list-wrapper'));
  if (!wrappers.length) return;

  const container = document.createElement('div');
  container.className = 'footer-text-list-container';

  section.insertBefore(container, wrappers[0]);

  wrappers.forEach(w => container.appendChild(w));
})();


}
