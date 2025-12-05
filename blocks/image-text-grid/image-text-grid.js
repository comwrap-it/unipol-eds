import decorateChild from './../image-text-block/image-text-block.js';

export default function decorate(block) {
  if (!block) return;

  const startAlign = block.dataset.startAlign || 'right';
  const items = [...block.querySelectorAll(':scope > .image-text-block')];

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const opposite = startAlign === 'right' ? 'left' : 'right';
    const align = isEven ? startAlign : opposite;

    item.classList.remove('image-left', 'image-right');
    item.classList.add(`image-${align}`);

    decorateChild(item, index === 0);
  });

  block.setAttribute('data-aue-filter', 'image-text-grid');
}
