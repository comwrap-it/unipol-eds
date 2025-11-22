import { getMetadata, loadBlock, loadSection } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateFooterSection from '../footer-section/footer-section.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  if (!fragment) {
    // eslint-disable-next-line no-console
    console.warn('Footer fragment not found');
    return;
  }

  // Check if fragment contains footer-section
  const footerSection = fragment.querySelector('.footer-section');

  if (footerSection) {
    // Load all blocks in the section first
    await loadSection(footerSection);
    // Then decorate the section to organize blocks
    await decorateFooterSection(footerSection);
    // Append the decorated section to the footer block
    block.textContent = '';
    block.appendChild(footerSection);
    return;
  }

  // Legacy: Check if fragment contains footer-unipol block
  let footerUnipolBlock = fragment.querySelector('.footer-unipol');
  const undecoratedBlock = fragment.querySelector('[data-block-name="footer-unipol"]');

  if (undecoratedBlock && !footerUnipolBlock) {
    // Block exists but not yet decorated - decorate it
    await loadBlock(undecoratedBlock);
    // After decoration, find the decorated block
    const parent = undecoratedBlock.parentElement;
    footerUnipolBlock = parent?.querySelector('.footer-unipol') || fragment.querySelector('.footer-unipol');
  }

  if (footerUnipolBlock) {
    // Use footer-unipol component directly
    block.textContent = '';
    block.appendChild(footerUnipolBlock);
    return;
  }

  // Fallback to default footer structure
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);
}
