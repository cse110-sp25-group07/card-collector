import { Deck } from '../data/deck.js';
import { DeckDisplay } from '../components/deck-display.js';
import { getAllDecks } from '../data/indexedDB.js';

customElements.define('deck-display', DeckDisplay);

window.addEventListener('DOMContentLoaded', init);

async function init() {
  const addBtn = document.getElementById('add-deck-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      window.location.href = '/src/pages/deck-ui.html';
    });
  }
  await loadDecks();
}

async function loadDecks() {
  const viewer = document.getElementById('deck-viewer');
  const emptyState = document.getElementById('empty-state');
  try {
    const decks = await getAllDecks();
    viewer.innerHTML = '';
    if (!decks || decks.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    emptyState.style.display = 'none';
    decks.forEach(d => {
      const wrapper = document.createElement('div');
      wrapper.className = 'deck-item-wrapper';
      wrapper.dataset.deckId = d.id;
      const dd = document.createElement('deck-display');
      dd.data = new Deck(d);
      wrapper.appendChild(dd);
      wrapper.addEventListener('click', () => {
        window.location.href = `../pages/card-grid.html?deckId=${d.id}`;
      });
      viewer.appendChild(wrapper);
    });
  } catch (error) {
    console.error('Error loading decks:', error);
    viewer.innerHTML = '<p class="error">Error loading decks.</p>';
  }
}
