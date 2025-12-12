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

  // --- NEW: TEXT LIST CONTAINER ---
  const textListContainer = document.createElement('div');
  textListContainer.className = 'text-list-container';

  // --- DISTRIBUTE BLOCKS INTO CONTAINERS ---
  const textListWrappers = footerContainer.querySelectorAll('.text-list-wrapper');
  textListWrappers.forEach((wrapper) => textListContainer.append(wrapper));

  // append container into top section
  topContainer.append(textListContainer);

  const downloadWrapper = footerContainer.querySelector('.footer-download-section-wrapper');
  if (downloadWrapper) topContainer.append(downloadWrapper);

  const privacyWrapper = footerContainer.querySelector('.footer-privacy-section-wrapper');
  if (privacyWrapper) bottomContainer.append(privacyWrapper);

  const socialWrapper = footerContainer.querySelector('.footer-social-section-wrapper');
  if (socialWrapper) bottomContainer.append(socialWrapper);

  // --- COPYRIGHT SECTION ---
  const copyrightBlock = footerContainer.querySelector('.footer-copyright-section');
  footerContainer.textContent = '';
  footerContainer.append(topContainer, bottomContainer);
  if (copyrightBlock) footerContainer.append(copyrightBlock);

  // --- ACCESSIBILITY FOR MOBILE: text-link-title ---

  function toggleAccordion(e) {
    const title = e.currentTarget;
    const wrapper = title.closest('.text-list-wrapper');
    const links = wrapper.querySelectorAll('.text-link');
    function escCloseHandler(event) {
      if (event.key === 'Escape') {
        title.setAttribute('aria-expanded', 'false');
        links.forEach((l) => {
          l.style.display = 'none';
          l.style.opacity = '';
          l.style.transform = '';
          l.style.transition = '';
          l.removeEventListener('keydown', escCloseHandler);
        });
      }
    }

    if (!window.matchMedia('(max-width: 768px)').matches) return;

    const expanded = title.getAttribute('aria-expanded') === 'true';
    const newState = !expanded;

    title.setAttribute('aria-expanded', newState);

    links.forEach((link) => {
      if (newState) {
        link.style.display = 'block';
        link.style.opacity = 0;
        link.style.transform = 'translateY(-4px)';
        link.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        requestAnimationFrame(() => {
          link.style.opacity = 1;
          link.style.transform = 'translateY(0)';
        });

        link.addEventListener('keydown', escCloseHandler);
      } else {
        link.style.opacity = 0;
        link.style.transform = 'translateY(-4px)';
        link.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        setTimeout(() => {
          link.style.display = 'none';
        }, 250);

        link.removeEventListener('keydown', escCloseHandler);
      }
    });
  }

  function applyMobileAttributes(isMobile) {
    const titles = footerContainer.querySelectorAll('.text-link-title');
    const textLinks = footerContainer.querySelectorAll('.unipol-footer-top div .text-link');

    // --- TITLE ATTRIBUTES ---
    titles.forEach((title) => {
      if (isMobile) {
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        title.setAttribute('aria-expanded', 'false');
      } else {
        title.removeAttribute('role');
        title.removeAttribute('tabindex');
        title.removeAttribute('aria-expanded');
      }
    });

    textLinks.forEach((link) => {
      if (isMobile) {
        link.style.display = 'none';
      } else {
        link.style.display = '';
        link.style.opacity = '';
        link.style.transform = '';
        link.style.transition = '';
      }
    });
  }

  // --- MOBILE ACCORDION
  function setupAccordion() {
    const titles = footerContainer.querySelectorAll('.text-link-title');

    titles.forEach((title) => {
      if (title.dataset.accordionAttached) return;
      title.dataset.accordionAttached = 'true';

      title.addEventListener('click', toggleAccordion);
      title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') toggleAccordion(e);
      });
    });
  }

  const mql = window.matchMedia('(max-width: 768px)');

  const titles = footerContainer.querySelectorAll('.text-link-title');
  titles.forEach((title) => {
    if (!title.querySelector('.un-icon-plus')) {
      const icon = document.createElement('span');
      icon.className = 'un-icon-plus';
      title.append(icon);
    }
  });

  applyMobileAttributes(mql.matches);

  mql.addEventListener('change', (e) => {
    applyMobileAttributes(e.matches);
  });

  block.append(footerContainer);
  setupAccordion();
}
