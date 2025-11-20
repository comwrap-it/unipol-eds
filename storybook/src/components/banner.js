export class AppBanner extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="banner">${this.getAttribute('text') || 'Welcome to the site!'}</div>`;
  }
}
customElements.define('app-banner', AppBanner);
