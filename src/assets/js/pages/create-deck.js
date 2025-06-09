import {
  addCard,
  addDeck,
  getDeckById,
  updateDeck,
} from '../data/indexedDB.js';
import { Deck } from '../data/deck.js';
import { Card } from '../data/card.js';

/**
 * script.js — Connects the Deck Creator UI to IndexedDB via the reusable API.
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Check if we're editing an existing deck
  const urlParams = new URLSearchParams(window.location.search);
  const editDeckId = urlParams.get('edit');
  let existingDeck = null;

  // Deck form elements
  const deckNameInput = document.getElementById('deckName');
  const thumbnailContainer = document.getElementById('cardBackContainer');
  const thumbnailUpload = document.getElementById('thumbnailUpload');
  const thumbnailInput = document.getElementById('thumbnailInput');
  const cardBackImage = document.getElementById('cardBackImage');
  const addIconOverlay = document.getElementById('addIconOverlay');
  const thumbnailImage = document.getElementById('thumbnailImage');
  const saveDeckBtn = document.getElementById('saveDeckBtn');
  const addCardsBtn = document.getElementById('addCardsBtn');
  const backBtn = document.getElementById('backBtn');

  // Selected cards preview
  const selectedCardsSection = document.getElementById('selectedCardsSection');
  const selectedCardsCount = document.getElementById('selectedCardsCount');
  const selectedCardsGrid = document.getElementById('selectedCardsGrid');

  // Card selection modal elements
  const cardModal = document.getElementById('cardModal');
  const closeModalBtn = document.getElementById('closeModal');
  const uploadBtn = document.getElementById('uploadBtn');
  const cardImagesInput = document.getElementById('cardImages');
  const selectionControls = document.getElementById('selectionControls');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const deselectAllBtn = document.getElementById('deselectAllBtn');
  const selectionCount = document.getElementById('selectionCount');
  const cardsGrid = document.getElementById('cardsGrid');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const confirmCount = document.getElementById('confirmCount');
  const notification = document.getElementById('notification');
  const clearBtn = document.getElementById('clearBtn');

  // Default deck image (fallback if no custom thumbnail)
  const defaultDeckImage = document.getElementById('cardBackImage')?.src || '';

  // In-memory state
  let thumbnail = null;
  const uploadedCards = [];
  const selectedCards = new Set();
  let selectedCardsData = [];

  backBtn.addEventListener('click', handleBackNavigation);
  // ---- Initialization for editing mode ----

  if (editDeckId) {
    try {
      existingDeck = await getDeckById(editDeckId);

      if (!existingDeck) {
        showNotification(
          '⚠️ Deck not found—creating a new deck instead.',
          'error'
        );
        history.replaceState(null, '', window.location.pathname);
      } else {
        // Valid deck, so we can edit
        document.querySelector('h2').textContent = 'Edit Deck';
        document.querySelector('#backBtn .btn-text').textContent = 'View Deck';
        document.title = (`Edit Deck: ${existingDeck.name}`);
        backBtn.addEventListener('click', () => {
          window.location.href = `/src/pages/card-grid.html?deckId=${existingDeck.id}`;
        });
        saveDeckBtn.textContent = 'Save Changes';
        deckNameInput.value = existingDeck.name;
        if (existingDeck.imageURL) {
          thumbnail = existingDeck.imageURL;
          thumbnailImage.src = thumbnail;
          thumbnailImage.style.display = 'block';
          cardBackImage.style.display = 'none';
          addIconOverlay.style.display = 'none';
          thumbnailContainer.classList.add('has-custom-image');
        }
      }
    } catch (err) {
      console.error('Error loading deck for editing:', err);
      showNotification('Error loading deck data', 'error');
      history.replaceState(null, '', window.location.pathname);
    }
  }

  document.querySelector('.create-deck-header').style.visibility = 'visible';

  // ---- Event Listeners ----

  thumbnailUpload.addEventListener('click', () => thumbnailInput.click());
  thumbnailInput.addEventListener('change', handleThumbnailUpload);
  addCardsBtn.addEventListener('click', openCardModal);
  saveDeckBtn.addEventListener('click', saveDeck);


  closeModalBtn.addEventListener('click', closeCardModal);
  cancelBtn.addEventListener('click', closeCardModal);
  uploadBtn.addEventListener('click', () => cardImagesInput.click());
  cardImagesInput.addEventListener('change', handleCardImagesUpload);
  selectAllBtn.addEventListener('click', selectAllCards);
  deselectAllBtn.addEventListener('click', deselectAllCards);
  clearBtn.addEventListener('click', clearUploads);
  confirmBtn.addEventListener('click', confirmCardSelection);
  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) closeCardModal();
  });

  // ---- Handlers ----

  /**
   * Handles uploading of a new deck thumbnail.
   * @param {Event} e - The change event from the file input.
   */
  function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      thumbnail = target.result;
      thumbnailImage.src = thumbnail;
      thumbnailImage.style.display = 'block';
      cardBackImage.style.display = 'none';
      addIconOverlay.style.display = 'none';
      thumbnailContainer.classList.add('has-custom-image');
      showNotification('Thumbnail uploaded successfully');
    };
    reader.readAsDataURL(file);
  }

  /**
   * Opens the card selection modal.
   */
  function openCardModal() {
    cardModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the card selection modal.
   */
  function closeCardModal() {
    cardModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  /**
   * Processes multiple image uploads for cards.
   * @param {Event} e - The change event from the file input.
   */
  function handleCardImagesUpload(e) {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (!files.length) {
      showNotification('No valid image files selected', 'error');
      return;
    }
    const emptyState = cardsGrid.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    selectionControls.style.display = 'flex';

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        const cardId = generateCardId();
        const cardData = {
          id: cardId,
          name: '', // no name by default
          imageData: target.result,
        };
        uploadedCards.push(cardData);
        addCardToGrid(cardData);
        updateSelectionCount();
      };
      reader.readAsDataURL(file);
    });
    cardImagesInput.value = '';
  }

  /**
   * Generates a unique ID for a card.
   * @returns {string} A unique card identifier.
   */
  function generateCardId() {
    if (crypto?.randomUUID) {
      try {
        return crypto.randomUUID();
      } catch { }
    }
    return (
      'c_' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  /**
   * Renders a single card tile into the grid.
   * @param {{id: string, name: string, imageData: string}} cardData
   */
  function addCardToGrid(cardData) {
    const el = document.createElement('div');
    el.className = 'card-item';
    el.dataset.cardId = cardData.id;

    let html = `
      <div class="card-image-container">
        <img src="${cardData.imageData}" alt="${cardData.name}" class="card-image" />
      </div>
      <div class="card-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </div>
    `;
    if (cardData.name.trim()) {
      html += `<p class="card-name">${cardData.name}</p>`;
    }

    el.innerHTML = html;
    el.addEventListener('click', () =>
      toggleCardSelection(cardData.id, el)
    );
    cardsGrid.appendChild(el);
  }

  /**
   * Toggles selection state for a given card element.
   * @param {string} id - The card's unique identifier.
   * @param {HTMLElement} el - The card-item element.
   */
  function toggleCardSelection(id, el) {
    if (selectedCards.has(id)) {
      selectedCards.delete(id);
      el.classList.remove('selected');
    } else {
      selectedCards.add(id);
      el.classList.add('selected');
    }
    updateSelectionCount();
  }

  /**
   * Clears all uploaded cards and resets the grid.
   */
  function clearUploads() {
    uploadedCards.length = 0;
    selectedCards.clear();
    selectedCardsData = [];
    cardsGrid.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7,10 12,15 17,10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <p>No cards uploaded yet. Upload images to see previews.</p>
      </div>`;
    selectionControls.style.display = 'none';
    updateSelectedCardsPreview();
    showNotification('All uploads cleared', 'success');
  }

  /**
   * Selects all uploaded cards in the grid.
   */
  function selectAllCards() {
    uploadedCards.forEach((c) => {
      selectedCards.add(c.id);
      const el = cardsGrid.querySelector(`[data-card-id="${c.id}"]`);
      el?.classList.add('selected');
    });
    updateSelectionCount();
  }

  /**
   * Deselects all cards in the grid.
   */
  function deselectAllCards() {
    selectedCards.clear();
    cardsGrid
      .querySelectorAll('.card-item.selected')
      .forEach((el) => el.classList.remove('selected'));
    updateSelectionCount();
  }

  /**
   * Updates the selection counter UI and confirm button.
   */
  function updateSelectionCount() {
    const count = selectedCards.size;
    selectionCount.textContent = `${count} cards selected`;
    confirmCount.textContent = count;
    confirmBtn.disabled = count === 0;
  }

  /**
   * Confirms current card selection and updates the preview.
   */
  function confirmCardSelection() {
    selectedCardsData = uploadedCards.filter((c) =>
      selectedCards.has(c.id)
    );
    closeCardModal();
    updateSelectedCardsPreview();
    showNotification(`${selectedCardsData.length} cards selected for deck`);
  }

  /**
   * Renders selected cards into the preview section below the form.
   */
  function updateSelectedCardsPreview() {
    if (!selectedCardsSection) return;
    if (!selectedCardsData.length) {
      selectedCardsSection.style.display = 'none';
      return;
    }
    selectedCardsSection.style.display = 'block';
    selectedCardsCount.textContent = selectedCardsData.length;
    selectedCardsGrid.innerHTML = '';
    selectedCardsData.slice(0, 20).forEach((card) => {
      const el = document.createElement('div');
      el.className = 'selected-card-item';
      el.innerHTML = `<img src="${card.imageData}" alt="${card.name}" />`;
      selectedCardsGrid.appendChild(el);
    });
    if (selectedCardsData.length > 20) {
      const moreEl = document.createElement('div');
      moreEl.className = 'selected-card-more';
      moreEl.innerHTML = `<span>+${selectedCardsData.length - 20}</span>`;
      selectedCardsGrid.appendChild(moreEl);
    }
  }

  /**
   * Saves the deck (new or edited) into IndexedDB.
   */
  async function saveDeck() {
    const name = deckNameInput.value.trim();
    if (!name) {
      showNotification('Please enter a deck name', 'error');
      return;
    }

    try {
      if (editDeckId && existingDeck) {
        const updatedDeck = new Deck({
          id: editDeckId,
          name,
          imageURL: thumbnail || defaultDeckImage,
          cardIds: existingDeck.cardIds,
        });
        await updateDeck(updatedDeck.toJSON());
        showNotification(`Deck "${name}" updated successfully!`);
      } else {
        const deck = new Deck({
          name,
          imageURL: thumbnail || defaultDeckImage,
          cardIds: [],
        });
        for (const data of selectedCardsData) {
          const card = new Card({
            name: data.name,
            imageURL: data.imageData,
          });
          const id = await addCard(card.toJSON());
          deck.addCard(id);
        }
        await addDeck(deck.toJSON());
        showNotification(`Deck "${name}" saved successfully!`);
        resetForm();
        window.location.href = '/src/pages/deck-view-ui.html';
      }

    } catch (err) {
      console.error('Error saving deck:', err);
      showNotification('Error saving deck. Please try again.', 'error');
    }
  }

  /**
   * Resets the form inputs after saving.
   */
  function resetForm() {
    deckNameInput.value = '';
    selectedCardsData = [];
    updateSelectedCardsPreview();
  }

  /**
   * Redirects back to the deck view screen.
   */
  function handleBackNavigation() {
    window.location.href = '/src/pages/deck-view-ui.html';
  }

  /**
   * Displays a transient notification message.
   * @param {string} msg - Message to show.
   * @param {'success'|'error'} [type='success'] - Notification style.
   */
  function showNotification(msg, type = 'success') {
    notification.textContent = msg;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
  }
});
