export default function decorate(block) {
  // Itera sui componenti footer-link senza rimuovere block.children
  [...block.children].forEach((row) => {
    const children = [...row.children];
    const hideTitle = children[0]?.textContent.trim() === 'true';
    const title = children[1]?.textContent.trim();
    const linkText = children[2]?.textContent.trim();
    const linkHref = children[3]?.querySelector('a');

    // Gestisci titolo
    if (hideTitle && title) {
      const titleDiv = children[1]; // usa il div originale
      titleDiv.style.display = 'block';
    } else if (children[1]) {
      children[1].style.display = 'none';
    }

    // Gestisci testo del link
    if (linkHref && linkText) {
      if ((hideTitle && linkText.toLowerCase() === 'true') ||
          (!hideTitle && linkText.toLowerCase() === 'false')) {
        linkHref.style.display = 'none';
      } else {
        linkHref.style.display = 'block';
        linkHref.textContent = linkText;
      }
    }
  });
};
