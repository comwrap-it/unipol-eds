export default function initUnipolFooter() {
  const footerRoot = document.querySelector(
    '.section.text-list-container.footer-download-link-container.footer-privacy-link-list-container.footer-social-list-container.footer-text-container',
  );

  if (!footerRoot) {
    return;
  }

  const textListWrappers = Array.from(footerRoot.querySelectorAll('.text-list-wrapper'));
  const downloadWrappers = Array.from(footerRoot.querySelectorAll('.footer-download-link-wrapper'));

  if (textListWrappers.length === 0 && downloadWrappers.length === 0) {
    return;
  }

  const textListContainer = document.createElement('div');
  textListContainer.classList.add('unipol-text-list-container');

  textListWrappers.forEach((el) => textListContainer.appendChild(el));

  const topFooter = document.createElement('div');
  topFooter.classList.add('unipol-top-footer');

  topFooter.appendChild(textListContainer);
  downloadWrappers.forEach((el) => topFooter.appendChild(el));

  footerRoot.insertBefore(topFooter, footerRoot.firstChild);
}
