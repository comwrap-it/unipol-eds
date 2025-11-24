export default function decorate(block) {
  [...block.children].forEach((row) => {
    const children = [...row.children];

    const hideTitle = children[0]?.textContent.trim() === 'true';
    const titleDiv = children[1];
    const linkTextP = children[2]?.querySelector('p');
    const linkHref = children[3]?.querySelector('a');

    if (children[0]) children[0].textContent = '';

    if (titleDiv) {
      titleDiv.style.display = hideTitle ? 'block' : 'none';
    }

    if (linkTextP && linkHref) {
      const linkText = linkTextP.textContent.trim();

      if (!hideTitle) {
        linkHref.style.display = 'block';
        linkHref.textContent = linkText;
      } else {
        linkHref.style.display = 'none';
      }

      linkTextP.style.display = 'none';
      linkTextP.textContent = '';
    }
  });
}
