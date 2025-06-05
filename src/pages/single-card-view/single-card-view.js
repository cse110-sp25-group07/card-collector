import { addCard, getCardById, getDeckById } from '../../data/indexedDB.js';

let currentIndex = 0;
const carousel = document.getElementById('carousel');
const mainCardName = document.getElementById('mainCardName');
const cardIndicator = document.getElementById('cardIndicator');
const cardElements = [];

async function renderCards() {
  carousel.innerHTML = '';
  cardIndicator.innerHTML = '';

  // Create all cards
  deck.cardIds.forEach(async (cardID, index) => {
    let card = await getCardById(cardID);

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    cardDiv.innerHTML = `
      <img class="card-image" src="${card.imageURL}" alt="${card.name} card picture"></img>
      <div class="card-info">
        <div class="card-type">${card.type}</div>
        <div class="card-evolution">${card.evolution}</div>
        <div class="card-hp">${card.hp}</div>
      </div>
      <form class="card-info-edit" style="display: none">
        <input class="card-type-input" value="${card.type}"></input>
        <input class="card-evolution-input" value="${card.evolution}"></input>
        <input class="card-hp-input" value="${card.hp}"></input>
      </div>
    `;

    carousel.appendChild(cardDiv);
    cardElements.push(cardDiv);

    // Create indicator dots
    const dot = document.createElement('div');
    dot.className = `indicator-dot ${index === currentIndex ? 'active' : ''}`;
    dot.onclick = () => goToCard(index);
    cardIndicator.appendChild(dot);
  });

  // Update main card name
  mainCardName.textContent = currentCard.name;

  // Position carousel
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  updateIndicators();
}

function updateIndicators() {
  const dots = cardIndicator.querySelectorAll('.indicator-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function prevCard() {
  if (editMode) return;

  currentIndex = (currentIndex - 1 + deck.cardIds.length) % deck.cardIds.length;
  animateToCard();
}

function nextCard() {
  if (editMode) return;

  currentIndex = (currentIndex + 1) % deck.cardIds.length;
  animateToCard();
}

function goToCard(index) {
  currentIndex = index;
  animateToCard();
}

async function animateToCard() {
  if (editMode) return;

  currentCard = await getCardById(deck.cardIds[currentIndex]);

  // Update main card name immediately for responsiveness
  mainCardName.textContent = currentCard.name;

  // Animate carousel
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Update indicators
  updateIndicators();
}

// Return to deck view
function goBack() {
  // Add a subtle animation before the alert
  const container = document.querySelector('.card-container');
  container.style.transform = 'scale(0.98)';
  container.style.opacity = '0.8';

  setTimeout(() => {
    container.style.transform = 'scale(1)';
    container.style.opacity = '1';
    alert('Going back to Card View...');
  }, 150);
}

// Button navigation
document
  .getElementsByClassName('prev-button')[0]
  .addEventListener('click', prevCard);
document
  .getElementsByClassName('next-button')[0]
  .addEventListener('click', nextCard);

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

// Manage card values
let editMode = false;
const manageButton = document.getElementsByClassName('manage-button')[0];

manageButton.addEventListener('click', async () => {
  if (editMode) {
    try {
      // currentCard.name = cardElements[currentIndex].getElementsByClassName('card-name-input').value;
      currentCard.type =
        cardElements[currentIndex].getElementsByClassName(
          'card-type-input',
        )[0].value;
      currentCard.hp =
        cardElements[currentIndex].getElementsByClassName(
          'card-hp-input',
        )[0].value;
      currentCard.evolution = cardElements[currentIndex].getElementsByClassName(
        'card-evolution-input',
      )[0].value;

      await addCard(currentCard);
    } catch (error) {
      console.error('Failed to save card! ->', error);
      alert('Error saving the card, check console');
    }
  }

  ToggleEditMode();
});

function ToggleEditMode() {
  editMode = !editMode;
  manageButton.innerHTML = editMode ? 'Confirm' : 'Manage';

  const cardInfoElement =
    cardElements[currentIndex].getElementsByClassName('card-info')[0];
  const cardInfoEditElement =
    cardElements[currentIndex].getElementsByClassName('card-info-edit')[0];
  cardInfoElement.style.display = editMode ? 'none' : 'block';
  cardInfoEditElement.style.display = editMode ? 'block' : 'none';

  mainCardName.textContent = currentCard.name;

  cardElements[currentIndex].getElementsByClassName(
    'card-type',
  )[0].textContent = currentCard.type;
  cardElements[currentIndex].getElementsByClassName('card-hp')[0].textContent =
    currentCard.hp;
  cardElements[currentIndex].getElementsByClassName(
    'card-evolution',
  )[0].textContent = currentCard.evolution;
}

// TODO: Once deck is given in URL, load in correctly similar to below
// const params = new URLSearchParams(window.location.search);
// const deckId = params.get('deckId');
// const cardId = params.get('cardId');
// if (!deckId) console.error('No deckId found in URL.');
// let deck = getDeckById(deckId);
// if (!cardId) console.error('No cardId found in URL.');
// let currentCard = getCardById(cardId);

// Using fixed dummy data stored in IndexedDB
let deck = await getDeckById('eeveelutions');
let currentCardID = deck.cardIds[0];
let currentCard = await getCardById(currentCardID);

renderCards();
