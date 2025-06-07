class NavBar extends HTMLElement {
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
          <li><a href="/card-collector/index.html">Deck View</a></li>
        </ul>
      </nav>
    `;

    this.appendChild(wrapper);
  }
}

customElements.define('nav-bar', NavBar);
