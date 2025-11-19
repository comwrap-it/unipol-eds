import { moveInstrumentation } from '../../scripts/scripts.js';
import { createLinkButton } from '../atoms/buttons/link-button/link-button.js';
let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/link-button/link-button.css`,
    )
  ]);
  isStylesLoaded = true;
}


export default async function decorate(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.footer-list-link-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'footer-list-link-wrapper';

  rows.forEach((row) => {
    if (!row) return;

    const showTitleDiv = row.querySelector('div:nth-child(1)');
    const titleDiv = row.querySelector('div:nth-child(2)');
    const textDiv = row.querySelector('div:nth-child(3)');
    const buttonDiv = row.querySelector('div:nth-child(4) a');

    if (!textDiv || !buttonDiv) return;

    const showTitle = showTitleDiv?.textContent.trim() === 'true';
    const linkText = textDiv.textContent.trim();
    const linkHref = buttonDiv.getAttribute('href');

    const newLinkDiv = document.createElement('div');

    if (showTitle && titleDiv) {
      const p = document.createElement('p');
      p.textContent = titleDiv.textContent.trim();
      newLinkDiv.appendChild(p);
    }

    const a = document.createElement('a');
    a.href = linkHref;
    a.title = linkText;
    a.className = 'button';
    a.textContent = linkText;

    newLinkDiv.appendChild(a);

    moveInstrumentation(row, newLinkDiv);

    footerWrapper.appendChild(newLinkDiv);
  });

  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      footerWrapper.setAttribute(attr.name, attr.value);
    }
  });

  if (block.dataset.blockName) {
    footerWrapper.dataset.blockName = block.dataset.blockName;
  }

  footerWrapper.classList.add('block');
  block.classList.forEach((cls) => {
    if (cls !== 'block') footerWrapper.classList.add(cls);
  });

  block.replaceWith(footerWrapper);
}
