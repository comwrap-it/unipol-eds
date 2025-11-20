import './header.js';
import './footer.js';
import './banner.js';
import './card.js';

export class AppLayout extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <app-header title="My Web Components App"></app-header>
      <app-banner text="This is a sample banner"></app-banner>
      <main style="display:flex; gap:1rem; justify-content:center; padding:2rem;">
        <app-card title="First Card" text="Lorem ipsum dolor sit amet." img="https://via.placeholder.com/300x200" />
        <app-card title="Second Card" text="Consectetur adipiscing elit." img="https://via.placeholder.com/300x200" />
      </main>
      <app-footer text="Footer content here"></app-footer>
    `;
  }
}
customElements.define('app-layout', AppLayout);
