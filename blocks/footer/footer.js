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
  // Footer section may not have .footer-section class yet (added by section metadata)
  // Look for section with footer-related container classes or check section metadata
  let footerSection = fragment.querySelector('.footer-section');
  // eslint-disable-next-line no-console
  console.log('footerSection', footerSection);

  // If not found by class, look for section with footer blocks
  if (!footerSection) {
    const sections = fragment.querySelectorAll('.section, div[data-section-status]');
    footerSection = Array.from(sections).find((section) => section.querySelector('[data-block-name="text-list"]')
        || section.querySelector('[data-block-name="footer-download-section"]')
        || section.querySelector('[data-block-name="footer-utility-links"]')
        || section.querySelector('[data-block-name="footer-bottom"]')
        || section.classList.contains('footer-section'));
  }

  if (footerSection) {
    // Ensure footer-section class is present (from section metadata style)
    if (!footerSection.classList.contains('footer-section')) {
      footerSection.classList.add('footer-section');
    }
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
