export default function decorate(block) {
  [...block.children].forEach((row) => {
    const children = [...row.children];
    const titleDiv = children[0];
    const linkDiv = children[1];

    if (titleDiv) {
      const linkTextP = titleDiv.querySelector('p');
      const linkText = linkTextP ? linkTextP.textContent.trim() : '';

      titleDiv.textContent = '';

      if (linkDiv) {
        const linkA = linkDiv.querySelector('a');
        if (linkA) {
          linkA.textContent = linkText;
        }
      }
    }
  });
}
