import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [image, imageAlt] = block.children[0].children;
  const text = block.children[1].children;

  const teaser = document.createElement('div');
  teaser.classList.add('teaser-wrapper');

  if (image) {
    const img = image.querySelector('img');
    const optimizedPic = createOptimizedPicture(img, imageAlt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
    if (img) teaser.append(img);
  }

  const content = document.createElement('div');
  content.classList.add('teaser-content');

  if (imageAlt) content.append(imageAlt);
  if (text) content.append(text);

  teaser.append(content);
  block.textContent = '';
  block.append(teaser);
}
