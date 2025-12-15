import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load header as fragment
  const headerMeta = getMetadata('nav');
  const headerPath = headerMeta ? new URL(headerMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(headerPath);

  // decorate header DOM
  block.textContent = '';
  const header = document.createElement('div');
  while (fragment.firstElementChild) header.append(fragment.firstElementChild);

  block.append(header);
}
