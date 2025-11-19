export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-list-links-wrapper';

  [...block.children].forEach((row) => {
    const linkDiv = document.createElement('div');
    const children = [...row.children];

    const hideTitleText = children[0]?.textContent.trim();
    const hideTitle = hideTitleText === 'true';
    const title = children[1]?.textContent.trim();
    const linkText = children[2]?.textContent.trim();
    const linkHref = children[3]?.querySelector('a')?.getAttribute('href') || '#';

    if (hideTitle && title) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'footer-link-title';
      const p = document.createElement('p');
      p.textContent = title;
      titleDiv.append(p);
      linkDiv.append(titleDiv);
    }

    if (linkText && !(hideTitle && linkText.toLowerCase() === 'true') && !(hideTitleText === 'false' && linkText.toLowerCase() === 'false')) {
      const linkContainerDiv = document.createElement('div');
      linkContainerDiv.className = 'button-container';
      const a = document.createElement('a');
      a.href = linkHref;
      a.title = linkHref;
      a.className = 'button';
      a.textContent = linkText;
      linkContainerDiv.append(a);
      linkDiv.append(linkContainerDiv);
    }

    wrapper.append(linkDiv);
  });

  block.textContent = '';
  block.append(wrapper);
}
