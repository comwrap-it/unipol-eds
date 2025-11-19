export default function decorate(block) {
  [...block.children].forEach((row) => {
    const children = [...row.children];

    const hideTitleText = children[0]?.textContent.trim();
    const hideTitle = hideTitleText === 'true';
    const titleDiv = children[1];
    const linkTextP = children[2]?.querySelector('p');
    const linkHref = children[3]?.querySelector('a');

    if (children[0]) children[0].textContent = '';

    if (titleDiv) {
      titleDiv.style.display = hideTitle ? 'block' : 'none';
    }

    if (linkTextP && linkHref) {
      const linkText = linkTextP.textContent.trim();

      const showLink = !((hideTitle && linkText.toLowerCase() === 'true')
                         || (!hideTitle && linkText.toLowerCase() === 'false'));

      linkHref.style.display = showLink ? 'block' : 'none';
      if (showLink) linkHref.textContent = linkText;

      linkTextP.style.display = 'none';
      linkTextP.textContent = '';
    }
  });
}
