export default function initUnipolFooter() {
  const selectors = [
    '.section.text-list-container',
    '.section.footer-download-link-container',
    '.section.footer-privacy-link-list-container',
    '.section.footer-social-list-container',
    '.section.footer-text-container',
  ];

  const footerRoot = selectors
    .map((selector) => document.querySelector(selector))
    .find((el) => el !== null);

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
