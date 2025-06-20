import { addCard, getCardById, getDeckById } from '../data/indexedDB.js';

// Initialization
let selectedCardIndex = 0;
let loadedDeck, selectedCard, currentCardId;
const carousel = document.getElementById('carousel');
const selectedCardName = document.getElementById('mainCardName');
const cardIndicator = document.getElementById('cardIndicator');
const cardElements = [];
const errorEl = document.getElementById('single-card-error');
const cardContainerEl = document.querySelector('.card-container');

await loadDataFromURL();
document.querySelector('main').classList.remove('hidden-until-ready');

// Creates a new element for each stored card and places them in the carousel
async function renderCards() {
  document.getElementById('deckName').textContent = loadedDeck.name;

  loadedDeck.cardIds.forEach(async (cardId, index) => {
    // Reconstruct card from card ids in loaded deck
    let cardData = await getCardById(cardId);
    if (cardId === selectedCard.id) goToCard(index);

    // Create card element from reconstructed card
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <img class="card-image" src="${cardData.imageURL}" alt="${cardData.name} card picture">
       <div class="card-info">
        <div><strong>Type:</strong> <span class="card-type">${cardData.type}</span></div>
        <div><strong>Stage:</strong> <span class="card-evolution">${cardData.evolution}</span></div>
        <div><strong>HP:</strong> <span class="card-hp">${cardData.hp}</span></div>
      </div>

      <form class="card-info-edit" style="display: none">
        <div class="edit-field">
          <label>Name: </label>
          <input class="card-name-input" value="${cardData.name}">
        </div>
        <div class="edit-field">
          <label>Type: </label>
          <input class="card-type-input" value="${cardData.type}">
        </div>
        <div class="edit-field">
          <label>Stage: </label>
          <input class="card-evolution-input" value="${cardData.evolution}">
        </div>
        <div class="edit-field">
          <label>HP: </label>
          <input class="card-hp-input" value="${cardData.hp}">
        </div>
      </form>
    `;
    carousel.appendChild(cardDiv);
    cardElements.push(cardDiv);

    // Creates indicator dots that jumps to another card
    const dot = document.createElement('div');
    dot.className = `indicator-dot ${index === selectedCardIndex ? 'active' : ''}`;
    dot.onclick = () => goToCard(index);
    cardIndicator.appendChild(dot);
  });

  // Selected/main card name element is placed outside of carousel
  selectedCardName.textContent = selectedCard.name;

  // Position carousel
  carousel.style.transform = `translateX(-${selectedCardIndex * 100}%)`;
  updateIndicators();
}

// Sets selected card's indicator to blue
function updateIndicators() {
  const dots = cardIndicator.querySelectorAll('.indicator-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === selectedCardIndex);
  });
}

function prevCard() {
  if (editMode) return;
  selectedCardIndex =
    (selectedCardIndex - 1 + loadedDeck.cardIds.length) %
    loadedDeck.cardIds.length;
  animateToCard();
}

function nextCard() {
  if (editMode) return;
  selectedCardIndex = (selectedCardIndex + 1) % loadedDeck.cardIds.length;
  animateToCard();
}

async function goToCard(index) {
  selectedCardIndex = index;
  currentCardId = loadedDeck.cardIds[selectedCardIndex];
  await animateToCard();
}

async function animateToCard() {
  if (editMode) return;
  currentCardId = loadedDeck.cardIds[selectedCardIndex];
  selectedCard = await getCardById(currentCardId);

  // Update main card name immediately for responsiveness
  selectedCardName.textContent = selectedCard.name;

  // Animate carousel swiping effect
  carousel.style.transform = `translateX(-${selectedCardIndex * 100}%)`;
  updateIndicators();
}

// Returns to deck view page
function goBack() {
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get('deckId');
  window.location.href = `card-grid.html?deckId=${deckId}`;
}

// Button navigation
document
  .getElementsByClassName('prev-button')[0]
  .addEventListener('click', prevCard);
document
  .getElementsByClassName('next-button')[0]
  .addEventListener('click', nextCard);

// Back Button
document.querySelector('.back-button').addEventListener('click', () => {
  goBack();
});

// Keyboard navigation
document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowLeft':
      prevCard();
      break;
    case 'ArrowRight':
      nextCard();
      break;
    case 'Escape':
      goBack();
      break;
  }
});

// Touch/swipe support
let startX = 0;
let startY = 0;
let distX = 0;
let distY = 0;

carousel.addEventListener('touchstart', function (e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

carousel.addEventListener('touchmove', function (e) {
  e.preventDefault();
});

carousel.addEventListener('touchend', function (e) {
  distX = e.changedTouches[0].clientX - startX;
  distY = e.changedTouches[0].clientY - startY;

  // Check if horizontal swipe is dominant
  if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
    if (distX > 0) {
      prevCard();
    } else {
      nextCard();
    }
  }
});

// Manage/edit card values
let editMode = false;
const manageButton = document.getElementsByClassName('manage-button')[0];

manageButton.addEventListener('click', async () => {
  if (editMode) {
    try {
      // Updates selected card's stored data upon exiting edit mode
      selectedCard.name =
        cardElements[selectedCardIndex].getElementsByClassName(
          'card-name-input',
        )[0].value;
      selectedCard.type =
        cardElements[selectedCardIndex].getElementsByClassName(
          'card-type-input',
        )[0].value;
      selectedCard.hp =
        cardElements[selectedCardIndex].getElementsByClassName(
          'card-hp-input',
        )[0].value;
      selectedCard.evolution = cardElements[
        selectedCardIndex
      ].getElementsByClassName('card-evolution-input')[0].value;
      await addCard(selectedCard);
    } catch (error) {
      console.error('Failed to save card! ->', error);
      alert('Error saving the card, check console');
    }
  }

  ToggleEditMode();
});

// Enable card info div and disable card info form, or vice versa
function ToggleEditMode() {
  const selectedCardElement = cardElements[selectedCardIndex];
  const indicatorEl = document.querySelector('.card-indicator');

  editMode = !editMode;
  manageButton.innerHTML = editMode ? 'Confirm' : 'Manage';
  document.querySelector('main').classList.toggle('edit-mode', editMode);

  // hide/show the nav bubbles
  indicatorEl.style.display = editMode ? 'none' : 'flex';

  // Finds selected card's corresponding card info
  const cardInfoElement =
    selectedCardElement.getElementsByClassName('card-info')[0];
  const cardInfoEditElement =
    selectedCardElement.getElementsByClassName('card-info-edit')[0];
  cardInfoElement.style.display = editMode ? 'none' : 'block';
  cardInfoEditElement.style.display = editMode ? 'block' : 'none';

  // Updates selected card's displayed info
  selectedCardName.textContent = selectedCard.name;
  selectedCardElement.getElementsByClassName('card-type')[0].textContent =
    selectedCard.type;
  selectedCardElement.getElementsByClassName('card-hp')[0].textContent =
    selectedCard.hp;
  selectedCardElement.getElementsByClassName('card-evolution')[0].textContent =
    selectedCard.evolution;
}

async function loadDataFromURL() {
  // Get selected deck and card IDs from URL
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get('deckId');
  const cardId = params.get('cardId');

  // Validate deckId
  if (!deckId) {
    showError('No deck specified. Please go back and choose a deck first.');
    return;
  }
  loadedDeck = await getDeckById(deckId);
  if (!loadedDeck) {
    showError(`Can't find deck “${deckId}”. Please use a valid link.`);
    return;
  }

  // Validate cardId
  if (!cardId) {
    showError('No card specified. Please pick a card from the deck.');
    return;
  }
  selectedCard = await getCardById(cardId);
  if (!selectedCard) {
    showError(`Can't find card “${cardId}”. It may have been deleted.`);
    return;
  }

  // Everything’s good!
  currentCardId = selectedCard.id;
  await renderCards();
}

// Helper to display an on-page error and hide the normal UI
function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  // hide the normal carousel UI
  cardContainerEl.style.display = 'none';
}
