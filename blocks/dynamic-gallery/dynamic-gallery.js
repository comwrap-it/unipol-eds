export default async function decorate(block) {
  if (!block) return;

  const gallery = document.createElement('div');
  gallery.className = 'dynamic-gallery';

  block.replaceChildren(gallery);
}
