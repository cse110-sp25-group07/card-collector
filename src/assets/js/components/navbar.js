/**
 * @class NavBar
 * @extends HTMLElement
 * @description
 * Defines a reusable <nav-bar> custom element that renders the main site header,
 * including the site title and navigation links.
 */
class NavBar extends HTMLElement {
  /**
   * Constructs the NavBar component linking the home deck view page and any future pages
   */
  constructor() {
    super();

    const wrapper = document.createElement('header');
    wrapper.classList.add('page-header');

    wrapper.innerHTML = `
      <h1 class="site-title">
        <a href="/card-collector/index.html">Card Collector</a>
      </h1>
      <nav class="navbar">
        <ul>
          <li><a href="/index.html">Deck View</a></li>
        </ul>
      </nav>
    `;

    this.appendChild(wrapper);
  }
}

customElements.define('nav-bar', NavBar);
