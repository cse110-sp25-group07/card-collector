import { Card } from '../../data/card.js';
import { addCard, getCardsFromDeck } from '../../data/indexedDB.js

const cards = [
  {
    name: 'Pikachu',
    type: 'Electric',
    rarity: 'Rare',
    generation: 'Gen 1',
  },
  {
    name: 'Eevee',
    type: 'Normal',
    rarity: 'Common',
    generation: 'Gen 1',
  },
  {
    name: 'Charmander',
    type: 'Fire',
    rarity: 'Rare',
    generation: 'Gen 1',
  },
  {
    name: 'Bulbasaur',
    type: 'Grass',
    rarity: 'Uncommon',
    generation: 'Gen 1',
  },
  {
    name: 'Squirtle',
    type: 'Water',
    rarity: 'Rare',
    generation: 'Gen 1',
  },
  {
    name: 'Umbreon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH129.png',
    type: 'Dark',
    hp: '110',
    evolution: 'Stage 1',
  },
];

let currentIndex = 0;
let isAnimating = false;
const carousel = document.getElementById('carousel');
const mainCardName = document.getElementById('mainCardName');
const cardIndicator = document.getElementById('cardIndicator');

function renderCards() {
  carousel.innerHTML = '';
  cardIndicator.innerHTML = '';

  // Create all cards
  cards.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    cardDiv.innerHTML = `
      <div class="card-image"></div>
      <div class="card-info">
        <div class="card-type">${card.name}</div>
        <div class="card-hp">${card.type}</div>
        <div class="card-evolution>${card.evolution}</div>
      </div>
    `;

    carousel.appendChild(cardDiv);

    // Create indicator dots
    const dot = document.createElement('div');
    dot.className = `indicator-dot ${index === currentIndex ? 'active' : ''}`;
    dot.onclick = () => goToCard(index);
    cardIndicator.appendChild(dot);
  });

  // Update main card name
  mainCardName.textContent = cards[currentIndex].name;

  // Position carousel
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Update indicators
  updateIndicators();
}

function updateIndicators() {
  const dots = cardIndicator.querySelectorAll('.indicator-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function prevCard() {
  if (isAnimating) return;
  isAnimating = true;

  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  animateToCard();
}

function nextCard() {
  if (isAnimating) return;
  isAnimating = true;

  currentIndex = (currentIndex + 1) % cards.length;
  animateToCard();
}

function goToCard(index) {
  if (isAnimating || index === currentIndex) return;
  isAnimating = true;

  currentIndex = index;
  animateToCard();
}

function animateToCard() {
  // Update main card name immediately for responsiveness
  mainCardName.textContent = cards[currentIndex].name;

  // Animate carousel
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Update indicators
  updateIndicators();

  // Reset animation flag
  setTimeout(() => {
    isAnimating = false;
  }, 400);
}

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

document.getElementsByClassName('prev-button')[0].addEventListener('click', prevCard);
document.getElementsByClassName('next-button')[0].addEventListener('click', nextCard);

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

const cardElements = [document.getElementsByClassName('card')];
let editMode = false;

manageButton.addEventListener('click', async () => {
  if (editMode) {
    try {
      cards[currentIndex].name = mainCardName.textContent;
      cards[currentIndex].type = cardElements[currentIndex].querySelector('card-type').textContent;
      cards[currentIndex].hp = cardElements[currentIndex].querySelector('card-hp').textContent;
      cards[currentIndex].evolution = cardElements[currentIndex].querySelector('card-evolution').textContent;

      await addCard(selectedCard.toJSON());
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
  cardInformation.style.display = editMode ? 'none' : 'block';
  manageCardInformation.style.display = editMode ? 'block' : 'none';

  mainCardName.textContent = cards[currentIndex].name;
  cardElements[currentIndex].querySelector('card-type').textContent = cards[currentIndex].type;
  cardElements[currentIndex].querySelector('card-hp').textContent = cards[currentIndex].hp;
  cardElements[currentIndex].querySelector('card-evolution').textContent = cards[currentIndex].evolution;
}

// Initialize
renderCards();