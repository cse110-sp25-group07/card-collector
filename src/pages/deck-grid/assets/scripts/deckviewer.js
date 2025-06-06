import { Card } from '../../../../data/card.js';
import { Deck } from '../../../../data/deck.js';
import { DeckDisplay } from '../../../../data/deckdisplay.js';
import {
  getAllDecks,
  addDeck,
  addCard,
  deleteDeck,
} from '../../../../data/indexedDB.js';

customElements.define('deck-display', DeckDisplay);

// Global variables for deck management
let selectedDeckId = null;

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
function init() {
  // Initialize deck management controls
  initDeckManagementControls();

  //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: REMOVE UPON ACTUAL USE //////////////////////////////////////////////////////////////////////////////////////////
  const storageExampleDeck = new Deck({
    id: 4,
    imageUrl: '',
    name: 'servkjqhferk fhwerkjvhwdkjh',
    cardIds: [],
  });
  const storageExampleDeck2 = new Deck({
    id: 5,
    imageUrl: '',
    name: 'n',
    cardIds: [],
  });

  const cardImgExample = new Card({
    id: 1,
    name: 'gyatt',
    imageURL: '../create-deck/assets/images/card-back-evil.jpg',
    type: 'water',
    hp: 5,
    evolution: 'vaporeon idk man',
  });
  const cardImgExample2 = new Card({
    id: 2,
    name: 'gyatt',
    imageURL: '../create-deck/assets/images/card-back-evil.jpg',
    type: 'water',
    hp: 5,
    evolution: 'vaporeon idk man',
  });
  addCard(cardImgExample);
  addCard(cardImgExample2);
  storageExampleDeck.addCard(cardImgExample.id);
  storageExampleDeck.addCard(cardImgExample2.id);

  addDeck(storageExampleDeck);
  addDeck(storageExampleDeck2);
  //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: MANUALLY DELETE INDEXDB STORAGE IN DEV TOOLS TO RESET /////////////////////////////////////////////////////////////

  customElements.whenDefined('deck-display').then(async () => {
    // Get the decks from localStorage
    let decks = await getDecksFromStorage();
    //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: REMOVE UPON ACTUAL USE //////////////////////////////////////////////////////////////////////////////////////////
    // const exampleDeck = { id: 1, name: 'exampleDeck', cards: [] };
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    // decks.push(exampleDeck);
    //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: REMOVE UPON ACTUAL USE //////////////////////////////////////////////////////////////////////////////////////////
    addDeckstoDocument(decks);
  });
}

/**
 * Initialize deck management controls and event listeners
 */
function initDeckManagementControls() {
  // DOM elements
  const menuBtn = document.getElementById('menu-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const createDeckBtn = document.getElementById('create-deck-btn');
  const editDeckBtn = document.getElementById('edit-deck-btn');
  const deleteDeckBtn = document.getElementById('delete-deck-btn');
  const deleteModal = document.getElementById('delete-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelDeleteBtn = document.getElementById('cancel-delete');

  // Menu toggle functionality
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = dropdownMenu.style.display === 'flex';
    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
    menuBtn.setAttribute('aria-expanded', !isVisible);
    dropdownMenu.setAttribute('aria-hidden', isVisible);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.deck-controls')) {
      dropdownMenu.style.display = 'none';
      menuBtn.setAttribute('aria-expanded', 'false');
      dropdownMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Control button event listeners
  createDeckBtn.addEventListener('click', () => {
    window.location.href = '../create-deck/deckui.html';
  });

  editDeckBtn.addEventListener('click', () => {
    if (selectedDeckId) {
      window.location.href = `../create-deck/deckui.html?edit=${selectedDeckId}`;
    }
  });

  deleteDeckBtn.addEventListener('click', () => {
    if (selectedDeckId) {
      deleteModal.classList.add('show');
    }
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    if (selectedDeckId) {
      try {
        await deleteDeck(selectedDeckId);
        deleteModal.classList.remove('show');

        // Refresh the deck display
        const decks = await getDecksFromStorage();
        addDeckstoDocument(decks);

        selectedDeckId = null;
        updateButtonStates();
      } catch (error) {
        console.error('Error deleting deck:', error);
        alert('Failed to delete deck. Please try again.');
      }
    }
  });

  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('show');
  });

  // Close modal when clicking outside
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.remove('show');
    }
  });
}

/**
 * Update button states based on selection
 */
function updateButtonStates() {
  const editDeckBtn = document.getElementById('edit-deck-btn');
  const deleteDeckBtn = document.getElementById('delete-deck-btn');

  const hasSelection = Boolean(selectedDeckId);
  editDeckBtn.disabled = !hasSelection;
  deleteDeckBtn.disabled = !hasSelection;
}

/**
 * Handle deck selection
 */
function handleDeckSelection(deckElement, deckId) {
  // Remove selection from other decks
  document.querySelectorAll('deck-display').forEach((deck) => {
    deck.classList.remove('selected');
  });

  // Select this deck
  deckElement.classList.add('selected');
  selectedDeckId = deckId;
  updateButtonStates();
}

/**
 * Reads 'decks' from localStorage and returns an array of
 * all of the decks found (parsed, not in string form). If
 * nothing is found in localStorage for 'decks', an empty array
 * is returned.
 * @returns {Promise<Object[]>} An array of decks found in index
 */
async function getDecksFromStorage() {
  let decks = await getAllDecks();
  console.log(decks.length);
  return decks;
}

/**
 * Takes in an array of decks and for each deck creates a
 * new <deck-display> element, adds the deck data to that deck-view
 * using element.data = {...}, and then appends that new deck
 * to <deck>
 * @param {Array<Object>} decks An array of decks
 */
function addDeckstoDocument(decks) {
  const deckviewer = document.querySelector('#deck-viewer');
  const emptyState = document.querySelector('#empty-state');

  deckviewer.innerHTML = '';

  // Show empty state if no decks
  if (!decks || decks.length === 0) {
    emptyState.style.display = 'flex';

    // Handle create deck button in empty state
    const createDeckBtnEmpty = document.querySelector('.create-deck-btn');
    if (createDeckBtnEmpty) {
      // Remove any existing listeners to avoid duplicates
      createDeckBtnEmpty.removeEventListener('click', handleCreateDeck);
      createDeckBtnEmpty.addEventListener('click', handleCreateDeck);
    }
    return;
  } else {
    emptyState.style.display = 'none';
  }

  // Loop through each of the decks in the passed in array,
  // create a <deck-display> element for each one, and populate
  // each <deck-display> with that deck data using element.data = ...
  // Append each element to the deck-viewer div
  for (let i = 0; i < decks.length; i++) {
    let deck = document.createElement('deck-display');
    deck.data = decks[i];

    // Add click handler for deck selection
    deck.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDeckSelection(deck, decks[i].id);
    });

    deckviewer.append(deck);
  }
}

/**
 * Handle create deck button click
 */
function handleCreateDeck() {
  window.location.href = '../create-deck/deckui.html';
}
