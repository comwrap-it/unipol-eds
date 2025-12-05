import decorateTextBlock from '../text-block/text-block.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block, isFirstBlock = false) {
  if (!block) return;

  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const items = wrapper ? Array.from(wrapper.children) : rows;

  // Img Settings Wrapper
  const imageContainer = items[0];
  const textBlockRows = items.slice(1);

  const container = document.createElement('div');
  container.className = 'image-text-block block';

  // Image wrapper
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'itb-image-wrapper';

  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    const picture = imageContainer.querySelector('picture');
    const link = imageContainer.querySelector('a');
    const altTextField = imageContainer.querySelector('[data-field-name="imageAlt"]');
    const altText = altTextField ? altTextField.textContent.trim() : '';

    if (picture) {
      imageWrapper.appendChild(picture);
    } else if (img) {
      const optimizedPic = createOptimizedPicture(
        img.src,
        altText,
        isFirstBlock,
        [
          { media: '(min-width: 769px)', width: '600' },
          { media: '(max-width: 768px)', width: '400' },
          { media: '(max-width: 392px)', width: '343' },
        ]
      );
      const newImg = optimizedPic.querySelector('img');
      if (newImg) moveInstrumentation(img, newImg);
      if (isFirstBlock) {
        newImg.setAttribute('loading', 'eager');
        newImg.setAttribute('fetchpriority', 'high');
      }
      imageWrapper.appendChild(optimizedPic);
    } else if (link && link.href) {
      const optimizedPic = createOptimizedPicture(
        link.href,
        altText,
        isFirstBlock,
        [
          { media: '(min-width: 769px)', width: '600' },
          { media: '(max-width: 768px)', width: '400' },
          { media: '(max-width: 392px)', width: '343' },
        ]
      );
      const newImg = optimizedPic.querySelector('img');
      if (newImg) moveInstrumentation(link, newImg);
      if (isFirstBlock) {
        newImg.setAttribute('loading', 'eager');
        newImg.setAttribute('fetchpriority', 'high');
      }
      imageWrapper.appendChild(optimizedPic);
    }
  }

  // Text wrapper
  const textWrapper = document.createElement('div');
  textWrapper.className = 'itb-text-wrapper';
  textBlockRows.forEach(r => textWrapper.appendChild(r));

  container.appendChild(imageWrapper);
  container.appendChild(textWrapper);

  block.replaceWith(container);

  // Decorate Text Block
  const textBlock = textWrapper.querySelector('.text-block');
  if (textBlock) decorateTextBlock(textBlock);
}
