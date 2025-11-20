export default function decorate(block) {
  [...block.children].forEach((row) => {
    const children = [...row.children];
    const hideTitle = children[0]; // div che contiene <picture>
    const titleDiv = children[1]; // contiene la URL

    const url = titleDiv?.textContent?.trim();
    const picture = hideTitle.querySelector('picture');

    if (!url || !picture) return;

    const a = document.createElement('a');
    a.href = url;

    const clonedPicture = picture.cloneNode(true);
    a.appendChild(clonedPicture);

    row.innerHTML = '';
    row.appendChild(a);
  });
}
