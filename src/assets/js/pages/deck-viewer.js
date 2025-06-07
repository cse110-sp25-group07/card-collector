import { Deck } from '../data/deck.js';
import { DeckDisplay } from '../components/deck-display.js';
import { getAllDecks, deleteDeck } from '../data/indexedDB.js';

customElements.define('deck-display', DeckDisplay);

// Global variables for deck management
let currentMode = 'view'; // 'view', 'edit', 'delete'
let deckElements = [];
let selectedDecks = new Set(); // Track selected decks for bulk operations

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
function init() {
  // Initialize deck management controls first
  initDeckManagementControls();

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
 * Initialize deck management controls and event listeners
 */
function initDeckManagementControls() {
  // DOM elements
  const manageBtnContainer = document.getElementById('manage-btn-container');
  const manageBtn = document.getElementById('manage-btn');
  const manageMenuExpanded = document.getElementById('manage-menu-expanded');
  const backBtn = document.getElementById('back-btn');
  const createDeckBtn = document.getElementById('create-deck-btn');
  const editDeckBtn = document.getElementById('edit-deck-btn');
  const deleteDeckBtn = document.getElementById('delete-deck-btn');
  const deleteModal = document.getElementById('delete-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelDeleteBtn = document.getElementById('cancel-delete');

  // Event listeners for manage button
  manageBtn.addEventListener('click', () => {
    expandManageMenu();
  });

  // Event listener for back button
  backBtn.addEventListener('click', () => {
    collapseManageMenu();
  });

  // Functions to expand and collapse manage menu
  function expandManageMenu() {
    manageBtnContainer.style.display = 'none';
    manageMenuExpanded.style.display = 'flex';
  }

  function collapseManageMenu() {
    manageMenuExpanded.style.display = 'none';
    manageBtnContainer.style.display = 'flex';
  }

  // Event listeners for buttons
  createDeckBtn.addEventListener('click', () => {
    window.location.href = '/src/pages/deck-ui.html';
  });

  editDeckBtn.addEventListener('click', () => {
    if (currentMode === 'edit') {
      exitEditMode();
    } else {
      enterEditMode();
    }
    collapseManageMenu(); // Close manage menu when entering a mode
  });

  deleteDeckBtn.addEventListener('click', () => {
    if (currentMode === 'delete') {
      exitDeleteMode();
    } else {
      enterDeleteMode();
    }
    collapseManageMenu(); // Close manage menu when entering a mode
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    const isBulkDelete = deleteModal.dataset.bulkDelete === 'true';

    if (isBulkDelete) {
      // Handle bulk delete
      try {
        const deletePromises = Array.from(selectedDecks).map((deckId) =>
          deleteDeck(deckId),
        );
        await Promise.all(deletePromises);

        deleteModal.classList.remove('show');
        deleteModal.removeAttribute('data-bulk-delete');
        selectedDecks.clear();
        loadDecks(); // refresh the deck display
        exitDeleteMode();
      } catch (error) {
        console.error('Error deleting decks:', error);
        alert('Failed to delete some decks. Please try again.');
      }
    } else {
      // Handle single deck delete (legacy)
      const selectedDeckId = deleteModal.dataset.deckId;
      if (selectedDeckId) {
        try {
          await deleteDeck(selectedDeckId);
          deleteModal.classList.remove('show');
          loadDecks(); // refresh the deck display
          exitDeleteMode();
        } catch (error) {
          console.error('Error deleting deck:', error);
          alert('Failed to delete deck. Please try again.');
        }
      }
    }
  });

  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('show');
    deleteModal.removeAttribute('data-bulk-delete');
  });

  // Close modal when clicking outside
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.remove('show');
      deleteModal.removeAttribute('data-bulk-delete');
    }
  });

  // Handle create deck button in empty state
  const createDeckBtnEmpty = document.querySelector('.create-deck-btn');
  if (createDeckBtnEmpty) {
    createDeckBtnEmpty.addEventListener('click', () => {
      window.location.href = '/src/pages/deck-ui.html';
    });
  }
}

/**
 * Enter edit mode - highlight all decks as selectable
 */
function enterEditMode() {
  currentMode = 'edit';
  updateModeDisplay();
  showModeInstructions('Click a deck to edit it');
}

/**
 * Enter delete mode - highlight all decks as selectable
 */
function enterDeleteMode() {
  currentMode = 'delete';
  selectedDecks.clear(); // Clear any previous selections
  updateModeDisplay();
  showModeInstructions(
    'Select decks to delete (click multiple decks to select)',
  );
}

/**
 * Exit edit mode
 */
function exitEditMode() {
  currentMode = 'view';
  updateModeDisplay();
  hideModeInstructions();
}

/**
 * Exit delete mode
 */
function exitDeleteMode() {
  currentMode = 'view';
  selectedDecks.clear(); // Clear selections when exiting delete mode
  updateModeDisplay();
  hideModeInstructions();
}

/**
 * Update visual display based on current mode
 */
function updateModeDisplay() {
  const deckViewer = document.querySelector('#deck-viewer');
  const editBtn = document.getElementById('edit-deck-btn');
  const deleteBtn = document.getElementById('delete-deck-btn');

  // Remove all mode classes
  deckViewer.classList.remove('edit-mode', 'delete-mode');

  // Update button states
  if (currentMode === 'edit') {
    deckViewer.classList.add('edit-mode');
    editBtn.innerHTML =
      '<span class="btn-icon">✕</span><span class="btn-text">Cancel Edit</span>';
    editBtn.classList.add('cancel-mode');
    deleteBtn.disabled = true;
  } else if (currentMode === 'delete') {
    deckViewer.classList.add('delete-mode');
    deleteBtn.innerHTML =
      '<span class="btn-icon">✕</span><span class="btn-text">Cancel Delete</span>';
    deleteBtn.classList.add('cancel-mode');
    editBtn.disabled = true;
  } else {
    // View mode
    editBtn.innerHTML =
      '<span class="btn-icon">✎</span><span class="btn-text">Edit Deck</span>';
    deleteBtn.innerHTML =
      '<span class="btn-icon">🗑</span><span class="btn-text">Delete Deck</span>';
    editBtn.classList.remove('cancel-mode');
    deleteBtn.classList.remove('cancel-mode');
    editBtn.disabled = false;
    deleteBtn.disabled = false;
  }

  // Update deck click handlers and selection states
  deckElements.forEach((element) => {
    const deck = element.deckData;
    element.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDeckClick(deck, element);
    };

    // Update selection display based on current mode
    if (currentMode === 'delete') {
      if (selectedDecks.has(deck.id)) {
        element.classList.add('selected');
      } else {
        element.classList.remove('selected');
      }
    } else {
      element.classList.remove('selected');
    }
  });
}

/**
 * Handle deck click based on current mode
 */
function handleDeckClick(deck, element) {
  if (currentMode === 'view') {
    // Navigate to card view for this deck
    window.location.href = `/src/pages/card-grid.html?deckId=${deck.id}`;
  } else if (currentMode === 'edit') {
    // Navigate to edit page
    window.location.href = `/src/pages/deck-ui.html?edit=${deck.id}`;
  } else if (currentMode === 'delete') {
    // Toggle selection for bulk delete
    toggleDeckSelection(deck, element);
  }
}

/**
 * Toggle deck selection for bulk delete
 */
function toggleDeckSelection(deck, element) {
  if (selectedDecks.has(deck.id)) {
    selectedDecks.delete(deck.id);
    element.classList.remove('selected');
  } else {
    selectedDecks.add(deck.id);
    element.classList.add('selected');
  }

  updateBulkDeleteButton();
}

/**
 * Select all decks
 */
function selectAllDecks() {
  deckElements.forEach((element) => {
    const deck = element.deckData;
    selectedDecks.add(deck.id);
    element.classList.add('selected');
  });
  updateBulkDeleteButton();
}

/**
 * Deselect all decks
 */
function deselectAllDecks() {
  selectedDecks.clear();
  deckElements.forEach((element) => {
    element.classList.remove('selected');
  });
  updateBulkDeleteButton();
}

/**
 * Update bulk delete button visibility and text
 */
function updateBulkDeleteButton() {
  const bulkDeleteBtn = document.querySelector('.bulk-delete-btn');
  if (bulkDeleteBtn) {
    if (selectedDecks.size > 0) {
      const count = selectedDecks.size;
      bulkDeleteBtn.textContent = `Delete ${count} Selected Deck${count === 1 ? '' : 's'}`;
      bulkDeleteBtn.style.display = 'inline-block';
    } else {
      bulkDeleteBtn.style.display = 'none';
    }
  }
}

/**
 * Show bulk delete confirmation modal
 */
function showBulkDeleteConfirmation() {
  const deleteModal = document.getElementById('delete-modal');
  const modalContent = deleteModal.querySelector('.modal-content h2');
  const modalMessage = deleteModal.querySelector('.modal-content p');

  const count = selectedDecks.size;
  modalContent.textContent = `Delete ${count} deck${count === 1 ? '' : 's'}?`;

  if (count === 1) {
    const deckId = [...selectedDecks][0];
    const deckElement = deckElements.find((el) => el.dataset.deckId === deckId);
    const deckName = deckElement ? deckElement.deckData.name : 'deck';
    modalMessage.textContent = `Are you sure you want to delete "${deckName}"?`;
  } else {
    modalMessage.textContent = `Are you sure you want to delete these ${count} decks? This action cannot be undone.`;
  }

  deleteModal.dataset.bulkDelete = 'true';
  deleteModal.classList.add('show');
}

/**
 * Show mode instructions
 */
function showModeInstructions(message) {
  let instructionBar = document.querySelector('.mode-instruction-bar');

  if (!instructionBar) {
    instructionBar = document.createElement('div');
    instructionBar.className = 'mode-instruction-bar';

    const leftSection = document.createElement('div');
    leftSection.className = 'instruction-left';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-mode-btn';
    cancelBtn.innerHTML = '✕ Cancel';
    cancelBtn.onclick = () => {
      if (currentMode === 'edit') exitEditMode();
      if (currentMode === 'delete') exitDeleteMode();
    };

    leftSection.appendChild(cancelBtn);

    const messageSpan = document.createElement('span');
    messageSpan.className = 'mode-message';

    const rightSection = document.createElement('div');
    rightSection.className = 'instruction-right';

    instructionBar.appendChild(leftSection);
    instructionBar.appendChild(messageSpan);
    instructionBar.appendChild(rightSection);

    const deckBox = document.querySelector('#deck-box');
    deckBox.insertBefore(instructionBar, deckBox.firstChild);
  }

  const messageSpan = instructionBar.querySelector('.mode-message');
  const rightSection = instructionBar.querySelector('.instruction-right');

  messageSpan.textContent = message;

  // Add delete mode specific controls
  if (currentMode === 'delete') {
    rightSection.innerHTML = '';

    // Select All button
    const selectAllBtn = document.createElement('button');
    selectAllBtn.className = 'select-all-btn';
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.onclick = selectAllDecks;
    rightSection.appendChild(selectAllBtn);

    // Deselect All button
    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.className = 'deselect-all-btn';
    deselectAllBtn.textContent = 'Deselect All';
    deselectAllBtn.onclick = deselectAllDecks;
    rightSection.appendChild(deselectAllBtn);

    // Delete Selected button (initially hidden)
    const deleteSelectedBtn = document.createElement('button');
    deleteSelectedBtn.className = 'bulk-delete-btn danger-btn';
    deleteSelectedBtn.textContent = 'Delete Selected';
    deleteSelectedBtn.onclick = showBulkDeleteConfirmation;
    deleteSelectedBtn.style.display = 'none';
    rightSection.appendChild(deleteSelectedBtn);
  } else {
    rightSection.innerHTML = '';
  }

  instructionBar.style.display = 'flex';
}

/**
 * Hide mode instructions
 */
function hideModeInstructions() {
  const instructionBar = document.querySelector('.mode-instruction-bar');
  if (instructionBar) {
    instructionBar.style.display = 'none';
  }
}

/**
 * Load decks
 */
async function loadDecks() {
  try {
    const decks = await getAllDecks();
    displayDecks(decks);
  } catch (error) {
    console.error('Error loading decks:', error);
    const deckviewer = document.querySelector('#deck-viewer');
    deckviewer.innerHTML =
      '<p class="error">Error loading decks. Please refresh the page.</p>';
  }
}

/**
 * Display decks
 */
function displayDecks(decks) {
  const deckviewer = document.querySelector('#deck-viewer');
  const emptyState = document.querySelector('#empty-state');

  deckviewer.innerHTML = '';
  deckElements = [];

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

  // Create deck elements
  decks.forEach((deckData) => {
    const deck = new Deck(deckData);
    const deckElement = createDeckElement(deck);
    deckviewer.appendChild(deckElement);
    deckElements.push(deckElement);
  });

  // Update mode display after creating elements
  updateModeDisplay();
}

/**
 * Create deck element
 */
function createDeckElement(deck) {
  // Create a wrapper for the deck-display
  const wrapper = document.createElement('div');
  wrapper.className = 'deck-item-wrapper';
  wrapper.dataset.deckId = deck.id;
  wrapper.deckData = deck;

  // Create the deck-display element
  const deckDisplayElement = document.createElement('deck-display');
  deckDisplayElement.data = deck;

  wrapper.appendChild(deckDisplayElement);
  return wrapper;
}

/**
 * Handle create deck button click
 */
function handleCreateDeck() {
  window.location.href = '/src/pages/deck-ui.html';
}
