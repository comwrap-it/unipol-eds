import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block, isFirstBlock = false) {
  if (!block) return;

  const initialAlignment = block.dataset.initialAlignment || 'left';
  const items = [...block.children];

  items.forEach((item, index) => {
    item.classList.add('image-text-item');

    // Align images
    const align = (initialAlignment === 'left' && index % 2 === 0)
      || (initialAlignment === 'right' && index % 2 !== 0)
      ? 'left'
      : 'right';
    item.classList.add(`image-${align}`);

    const imgElement = item.querySelector('img, picture, a');
    const contentNodes = Array.from(item.childNodes).filter(
      (n) => n !== imgElement && (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== '')),
    );

    // Image functions
    const getOptimizedImage = (el) => {
      if (!el) return null;

      const altTextField = item.querySelector('[data-field-name="imageAlt"]');
      const altText = altTextField ? altTextField.textContent.trim() : '';

      if (el.tagName === 'PICTURE') return el;

      const src = (el.tagName === 'IMG' && el.src) || (el.tagName === 'A' && el.href) || null;
      if (!src) return null;

      const optimizedPic = createOptimizedPicture(
        src,
        altText,
        isFirstBlock,
        [
          { media: '(min-width: 769px)', width: '600' },
          { media: '(max-width: 768px)', width: '400' },
          { media: '(max-width: 392px)', width: '343' },
        ],
      );

      const newImg = optimizedPic.querySelector('img');
      if (newImg) moveInstrumentation(el, newImg);
      if (isFirstBlock && newImg) {
        newImg.setAttribute('loading', 'eager');
        newImg.setAttribute('fetchpriority', 'high');
      }

      return optimizedPic;
    };

    // Img wrapper
    const imageWrapperDiv = document.createElement('div');
    imageWrapperDiv.classList.add('image-wrapper');
    const optimizedPic = getOptimizedImage(imgElement);
    if (optimizedPic) imageWrapperDiv.appendChild(optimizedPic);

    // Content wrapper
    const contentWrapperDiv = document.createElement('div');
    contentWrapperDiv.classList.add('content-wrapper');
    contentNodes.forEach((node) => contentWrapperDiv.appendChild(node));

    item.innerHTML = '';
    item.appendChild(imageWrapperDiv);
    item.appendChild(contentWrapperDiv);
  });
}
