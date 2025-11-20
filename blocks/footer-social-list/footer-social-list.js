export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const imgWrapper = cells[0];
    const urlWrapper = cells[1];

    const url = urlWrapper?.textContent?.trim();
    const picture = imgWrapper?.querySelector('picture');

    if (!url || !picture) return;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('aria-label', url);

    link.appendChild(picture.cloneNode(true));

    row.innerHTML = '';
    row.appendChild(link);
  });
}
