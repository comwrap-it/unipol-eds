export default function decorate(block) {
  const wrapper = block.closest('.text-list-wrapper');
  const lastRow = block.children[block.children.length - 1];
  const styleValue = lastRow?.children?.[4]?.textContent?.trim?.() || '';

  if (wrapper) {
    const allLinks = wrapper.querySelectorAll('a');
    const allTitles = wrapper.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (styleValue === 'text-list-dark') {
      allLinks.forEach(a => a.classList.add('text-list-link-dark'));
      allTitles.forEach(t => t.classList.add('text-list-title-dark'));
    }

    if (styleValue === 'text-list-light') {
      allLinks.forEach(a => a.classList.add('text-list-link-light'));
      allTitles.forEach(t => t.classList.add('text-list-title-light-dark'));
    }
  }

  [...block.children].forEach((row) => {
    const children = [...row.children];

    const hideTitle = children[0]?.textContent.trim() === 'true';

    const titleElem = children[1]?.querySelector('h1, h2, h3, h4, h5, h6');
    const linkTextP = children[2]?.querySelector('p');
    const linkHref = children[3]?.querySelector('a');

    if (children[0]) children[0].textContent = '';

    if (titleElem) {
      titleElem.style.display = hideTitle ? 'block' : 'none';
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
