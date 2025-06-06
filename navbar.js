document.addEventListener("DOMContentLoaded", () => {
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <div class="navbar">
      <a href="index.html">Home</a>
    </div>
  `;
  document.body.prepend(nav);
});