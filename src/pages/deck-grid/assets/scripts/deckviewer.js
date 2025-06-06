import { Card } from '../../../../data/card.js';
import { Deck } from '../../../../data/deck.js';
import { DeckDisplay } from '../../../../data/deckdisplay.js';
import { getAllDecks, addDeck, addCard, deleteDeck } from '../../../../data/indexedDB.js';

customElements.define('deck-display', DeckDisplay);

// Global variables for deck management
let selectedDeckId = null;

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
function init() {
  // Initialize deck management controls first
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

  // Load decks immediately
  loadDecks();
  
  // Refresh when page becomes visible (e.g., returning from create/edit)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      loadDecks();
    }
  });
  
  // Also refresh when window gains focus
  window.addEventListener('focus', () => {
    loadDecks();
  });
}

/**
 * Initialize deck management controls and event listeners - COPIED FROM WORKING DECK-MANAGEMENT
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

  // Event listeners for menu - EXACT COPY FROM WORKING VERSION
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
  });

  // Close dropdown when clicking outside - EXACT COPY FROM WORKING VERSION
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.deck-controls')) {
      dropdownMenu.style.display = 'none';
    }
  });

  // Event listeners for buttons - ENHANCED WITH RETURN ROUTING
  createDeckBtn.addEventListener('click', () => {
    window.location.href = '../create-deck/deckui.html?returnTo=deck-view';
  });

  editDeckBtn.addEventListener('click', () => {
    if (selectedDeckId) {
      window.location.href = `../create-deck/deckui.html?edit=${selectedDeckId}&returnTo=deck-view`;
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
        loadDecks(); // refresh the deck display - USE OUR LOAD FUNCTION
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

  // Close modal when clicking outside - EXACT COPY FROM WORKING VERSION
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.remove('show');
    }
  });

  // Handle create deck button in empty state
  const createDeckBtnEmpty = document.querySelector('.create-deck-btn');
  if (createDeckBtnEmpty) {
    createDeckBtnEmpty.addEventListener('click', () => {
      window.location.href = '../create-deck/deckui.html?returnTo=deck-view';
    });
  }
}

/**
 * Load decks - ADAPTED FROM WORKING DECK-MANAGEMENT VERSION
 */
async function loadDecks() {
  try {
    const decks = await getAllDecks();
    displayDecks(decks);
  } catch (error) {
    console.error('Error loading decks:', error);
    const deckviewer = document.querySelector('#deck-viewer');
    deckviewer.innerHTML = '<p class="error">Error loading decks. Please refresh the page.</p>';
  }
}

/**
 * Display decks - HYBRID APPROACH: Use deck-display elements but with working selection logic
 */
function displayDecks(decks) {
  const deckviewer = document.querySelector('#deck-viewer');
  const emptyState = document.querySelector('#empty-state');
  
  deckviewer.innerHTML = '';
  
  // Show empty state if no decks
  if (!decks || decks.length === 0) {
    emptyState.style.display = 'flex';
    
    // Re-attach empty state button listener
    const createDeckBtnEmpty = document.querySelector('.create-deck-btn');
    if (createDeckBtnEmpty) {
      createDeckBtnEmpty.removeEventListener('click', handleCreateDeck);
      createDeckBtnEmpty.addEventListener('click', handleCreateDeck);
    }
    return;
  } else {
    emptyState.style.display = 'none';
  }
  
  // Create deck elements with WORKING selection logic from deck-management
  decks.forEach((deckData) => {
    const deck = new Deck(deckData);
    const deckElement = createDeckElement(deck);
    deckviewer.appendChild(deckElement);
  });
}

/**
 * Create deck element - ADAPTED FROM WORKING DECK-MANAGEMENT VERSION
 */
function createDeckElement(deck) {
  // Create a wrapper for the deck-display with selection functionality
  const wrapper = document.createElement('div');
  wrapper.className = 'deck-item-wrapper';
  wrapper.dataset.deckId = deck.id;
  
  // Create the deck-display element
  const deckDisplayElement = document.createElement('deck-display');
  deckDisplayElement.data = deck;
  
  // Add selection functionality - EXACT COPY FROM WORKING VERSION
  wrapper.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove selection from other decks
    document.querySelectorAll('.deck-item-wrapper').forEach((item) => {
      item.classList.remove('selected');
    });

    // Select this deck
    wrapper.classList.add('selected');
    selectedDeckId = deck.id;
    updateButtonStates();
  });
  
  wrapper.appendChild(deckDisplayElement);
  return wrapper;
}

/**
 * Update button states - EXACT COPY FROM WORKING VERSION
 */
function updateButtonStates() {
  const editDeckBtn = document.getElementById('edit-deck-btn');
  const deleteDeckBtn = document.getElementById('delete-deck-btn');
  
  const hasSelection = Boolean(selectedDeckId);
  editDeckBtn.disabled = !hasSelection;
  deleteDeckBtn.disabled = !hasSelection;
}

/**
 * Handle create deck button click
 */
function handleCreateDeck() {
  window.location.href = '../create-deck/deckui.html?returnTo=deck-view';
}
