export default function decorate(block) {
  [...block.children].forEach((row) => {
    const children = [...row.children];

    const hideTitleText = children[0]?.textContent.trim();
    const hideTitle = hideTitleText === 'true';
    const titleDiv = children[1]; // div del titolo
    const linkTextP = children[2]?.querySelector('p');
    const linkHref = children[3]?.querySelector('a');

    // Nascondi il <p> con true/false
    if (children[0]) children[0].textContent = '';

    // Gestisci titolo
    if (titleDiv) {
      titleDiv.style.display = hideTitle ? 'block' : 'none';
    }

    // Gestisci link
    if (linkTextP && linkHref) {
      const linkText = linkTextP.textContent.trim();

      // Determina se mostrare il link
      const showLink = !((hideTitle && linkText.toLowerCase() === 'true') ||
                         (!hideTitle && linkText.toLowerCase() === 'false'));

      linkHref.style.display = showLink ? 'block' : 'none';
      if (showLink) linkHref.textContent = linkText;

      // Nascondi completamente il <p> originale
      linkTextP.style.display = 'none';
      linkTextP.textContent = '';
    }
  });
}
