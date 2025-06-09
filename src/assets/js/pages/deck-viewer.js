import { Deck } from '../data/deck.js';
import { DeckDisplay } from '../components/deck-display.js';
import { getAllDecks } from '../data/indexedDB.js';

customElements.define('deck-display', DeckDisplay);

window.addEventListener('DOMContentLoaded', init);
/**
 * @typedef {Object} DeckJSON
 * @property {string} id
 * @property {string} name
 * @property {Array<CardJSON>} cards
 */

/**
 * @typedef {Object} CardJSON
 * @property {string} id
 * @property {string} name
 * @property {string} image
 */
/**
 * Entry point: sets up the "Add Deck" button and loads existing decks.
 * @returns {Promise<void>}
 */
async function init() {
  const addBtn = document.getElementById('add-deck-btn');
  if (addBtn) {
    /**
     * Navigate to the Create Deck page when the Add button is clicked.
     * @listens MouseEvent
     */
    addBtn.addEventListener('click', () => {
      window.location.href = '/src/pages/create-deck-ui.html';
    });
  }

  await loadDecks();
  document.getElementById('deck-box').style.visibility = 'visible';
}

/**
 * Fetches all decks from IndexedDB and renders them.
 * If no decks exist, shows the empty-state element.
 * @returns {Promise<void>}
 */
async function loadDecks() {
  const viewer = /** @type {HTMLElement} */ (
    document.getElementById('deck-viewer')
  );
  const emptyState = /** @type {HTMLElement} */ (
    document.getElementById('empty-state')
  );

  try {
    /** @type {DeckJSON[]} */
    const decks = await getAllDecks();

    // Clear out any existing items
    viewer.innerHTML = '';

    if (!decks || decks.length === 0) {
      // Show placeholder if there are no decks
      emptyState.style.display = 'flex';
      return;
    }

    // Hide the empty-state message
    emptyState.style.display = 'none';

    // Render each deck
    decks.forEach((deckData) => {
      // Create a container for the deck-display element
      const wrapper = document.createElement('div');
      wrapper.className = 'deck-item-wrapper';
      wrapper.dataset.deckId = deckData.id;

      // Create and configure <deck-display>
      const deckEl = document.createElement('deck-display');
      deckEl.data = new Deck(deckData);

      // When clicked, navigate to the card grid for this deck
      /**
       * @listens MouseEvent
       */
      wrapper.addEventListener('click', () => {
        window.location.href = `/src/pages/card-grid.html?deckId=${deckData.id}`;
      });

      wrapper.appendChild(deckEl);
      viewer.appendChild(wrapper);
    });
  } catch (error) {
    console.error('Error loading decks:', error);
    viewer.innerHTML = '<p class="error">Error loading decks.</p>';
  }
}
