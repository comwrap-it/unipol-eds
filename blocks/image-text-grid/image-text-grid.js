import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createButton } from '../atoms/buttons/standard-button/standard-button.js';

export default function decorate(block, isFirstBlock = false) {
  if (!block) return;

  // First alignment
  const initialAlignment = block.children[0]?.textContent?.trim() || 'left';

  const items = [...block.children].slice(1);
  block.children[0].remove();

  items.forEach((item, index) => {
    item.classList.add('image-text-item');

    // Automatic alignment
    const align =
      (initialAlignment === 'left' && index % 2 === 0) ||
      (initialAlignment === 'right' && index % 2 !== 0)
        ? 'left'
        : 'right';

    item.classList.add(`image-${align}`);

    // Image
    const imgElement = item.querySelector('img, picture, a');

    const getOptimizedImage = (el) => {
      if (!el) return null;

      const altTextField = item.querySelector('[data-field-name="imageAlt"]');
      const altText = altTextField ? altTextField.textContent.trim() : '';

      if (el.tagName === 'PICTURE') return el;

      const src =
        (el.tagName === 'IMG' && el.src) ||
        (el.tagName === 'A' && el.href) ||
        null;

      if (!src) return null;

      const optimizedPic = createOptimizedPicture(
        src,
        altText,
        isFirstBlock,
        [
          { media: '(min-width: 1313px)', width: '648' },  // Desktop
          { media: '(min-width: 1152px) and (max-width: 1312px)', width: '600' },  // Desktop small
          { media: '(min-width: 768px) and (max-width: 1152px)', width: '364' },  // Tablet
          { media: '(max-width: 768px)', width: '343' },   // Mobile
        ]
      );

      const newImg = optimizedPic.querySelector('img');
      if (newImg) moveInstrumentation(el, newImg);
      if (isFirstBlock && newImg) {
        newImg.setAttribute('loading', 'eager');
        newImg.setAttribute('fetchpriority', 'high');
      }

      return optimizedPic;
    };

    // Retrieving items data
    const rows = [...item.children].filter((c) => c !== imgElement);

    const title              = rows[1]?.textContent.trim() || '';
    const description        = rows[2]?.textContent.trim() || '';
    const btnLabel           = rows[3]?.textContent.trim() || '';
    const btnVariant         = rows[4]?.textContent.trim() || 'primary';

    const btnHrefEl         = rows[5]?.querySelector('a');
    const btnHref           = btnHrefEl?.getAttribute('href') || '';

    const btnSize           = rows[6]?.textContent.trim() || 'medium';

    const rawOpen           = rows[7]?.textContent.trim().toLowerCase();
    const btnOpenInNewTab   = rawOpen === 'true' || rawOpen === '1' || rawOpen === 'yes';

    const btnLeftIcon       = rows[8]?.textContent.trim() || '';
    const btnRightIcon      = rows[9]?.textContent.trim() || '';

    // Button
    let buttonElement = null;
    if (btnLabel || btnHref) {
      buttonElement = createButton(
        btnLabel,
        btnHref,
        btnOpenInNewTab,
        btnVariant,
        btnSize,
        btnLeftIcon,
        btnRightIcon,
      );
    }

    // Render
    item.innerHTML = '';

    // Image
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');
    const optimized = getOptimizedImage(imgElement);
    if (optimized) imageWrapper.appendChild(optimized);

    // Content with text and button
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');

    // Wrapper for title + description
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('text-wrapper');

    if (title) {
      const t = document.createElement('div');
      t.classList.add('title');
      t.innerHTML = `<p>${title}</p>`;
      textWrapper.appendChild(t);
    }

    if (description) {
      const d = document.createElement('div');
      d.classList.add('description');
      d.innerHTML = `<p>${description}</p>`;
      textWrapper.appendChild(d);
    }

    contentWrapper.appendChild(textWrapper);

    // Button
    if (buttonElement) {
      const btnContainer = document.createElement('div');
      btnContainer.classList.add('button-container');
      btnContainer.appendChild(buttonElement);
      contentWrapper.appendChild(btnContainer);
    }

    item.appendChild(imageWrapper);
    item.appendChild(contentWrapper);
  });
}
