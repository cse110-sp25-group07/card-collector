import { addCard, addDeck } from '../../data/indexedDB.js';
import { Deck } from '../../data/deck.js';
import { Card } from '../../data/card.js';

/**
 * script.js — Connects the Deck Creator UI to IndexedDB via the reusable API.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Deck form elements
  const deckNameInput = document.getElementById('deckName');
  const thumbnailUpload = document.getElementById('thumbnailUpload');
  const thumbnailInput = document.getElementById('thumbnailInput');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const thumbnailImage = document.getElementById('thumbnailImage');
  const saveDeckBtn = document.getElementById('saveDeckBtn');
  const addCardsBtn = document.getElementById('addCardsBtn');

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

  // In-memory state
  let thumbnail = null;
  const uploadedCards = [];
  const selectedCards = new Set();
  let selectedCardsData = [];

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
  confirmBtn.addEventListener('click', confirmCardSelection);
  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) closeCardModal();
  });
  clearBtn.addEventListener('click', clearUploads);

  // ---- Handlers ----
  // Upload and preview deck thumbnail
  function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      thumbnail = target.result;
      thumbnailImage.src = thumbnail;
      thumbnailImage.style.display = 'block';
      uploadPlaceholder.style.display = 'none';
      showNotification('Thumbnail uploaded successfully');
    };
    reader.readAsDataURL(file);
  }

  // Open/close the card selection modal
  function openCardModal() {
    cardModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeCardModal() {
    cardModal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  // Handle multiple card image uploads into the modal
  function handleCardImagesUpload(e) {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (!files.length) {
      showNotification('No valid image files selected', 'error');
      return;
    }
    // Remove empty placeholder, show selection controls
    const emptyState = cardsGrid.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    selectionControls.style.display = 'flex';

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        const cardData = {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^/.]+$/, ''),
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

  // Render a card thumbnail in the modal grid
  function addCardToGrid(cardData) {
    const el = document.createElement('div');
    el.className = 'card-item';
    el.dataset.cardId = cardData.id;
    el.innerHTML = `
      <div class="card-image-container">
        <img src="${cardData.imageData}" alt="${cardData.name}" class="card-image" />
      </div>
      <div class="card-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </div>
      <p class="card-name">${cardData.name}</p>
    `;
    el.addEventListener('click', () => toggleCardSelection(cardData.id, el));
    cardsGrid.appendChild(el);
  }

  // Toggle selection state of a card in the modal
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

  // Clears all uploaded data and resets preview
  function clearUploads() {
    // clear the in-modal uploads array & selection state
    uploadedCards.length = 0;
    selectedCards.clear();
    selectedCardsData = [];

    // clear the **modal** grid
    cardsGrid.innerHTML = `<div class="empty-state">
      <svg class="empty-icon" …></svg>
      <p>No cards uploaded yet. Upload images to see previews.</p>
    </div>`;
    selectionControls.style.display = 'none';

    // also clear the bottom preview
    updateSelectedCardsPreview();

    showNotification('All uploads cleared', 'success');
  }

  // Select or deselect all cards in the modal
  function selectAllCards() {
    uploadedCards.forEach((c) => {
      selectedCards.add(c.id);
      const el = cardsGrid.querySelector(`[data-card-id="${c.id}"]`);
      if (el) el.classList.add('selected');
    });
    updateSelectionCount();
  }
  function deselectAllCards() {
    selectedCards.clear();
    cardsGrid
      .querySelectorAll('.card-item')
      .forEach((el) => el.classList.remove('selected'));
    updateSelectionCount();
  }

  // Update the "X cards selected" indicator
  function updateSelectionCount() {
    const count = selectedCards.size;
    selectionCount.textContent = `${count} cards selected`;
    confirmCount.textContent = count;
    confirmBtn.disabled = count === 0;
  }

  // Confirm choices, update preview, and notify
  function confirmCardSelection() {
    selectedCardsData = uploadedCards.filter((c) => selectedCards.has(c.id));
    closeCardModal();
    updateSelectedCardsPreview();
    showNotification(`${selectedCardsData.length} cards selected for deck`);
  }

  // Display selected cards under the main form
  function updateSelectedCardsPreview() {
    if (!selectedCardsSection) return;
    if (selectedCardsData.length === 0) {
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

  // Save deck and cards to IndexedDB
  async function saveDeck() {
    const name = deckNameInput.value.trim();
    if (!name) {
      showNotification('Please enter a deck name', 'error');
      return;
    }
    try {
      const deck = new Deck({ name, cardIds: [] });
      for (const data of selectedCardsData) {
        const card = new Card({ name: data.name, imageURL: data.imageData });
        const id = await addCard(card.toJSON());
        deck.addCard(id);
      }
      await addDeck(deck.toJSON());
      showNotification(`Deck "${name}" saved successfully!`);
      resetForm();
    } catch (err) {
      console.error('Error saving deck:', err);
      showNotification('Error saving deck. Please try again.', 'error');
    }
  }

  // Reset form state after saving
  function resetForm() {
    deckNameInput.value = '';
    thumbnail = null;
    thumbnailImage.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
    selectedCardsData = [];
    updateSelectedCardsPreview();
  }

  // Temporary notification banner
  function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
  }
});
