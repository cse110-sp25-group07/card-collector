import {
  addCard,
  addDeck,
  getCardById,
  getDeckById,
} from '../../data/indexedDB.js';
import { Deck } from '../../data/deck.js';
import { Card } from '../../data/card.js';

let currentIndex = 0;
let isAnimating = false;
const carousel = document.getElementById('carousel');
const mainCardName = document.getElementById('mainCardName');
const cardIndicator = document.getElementById('cardIndicator');
const cardElements = [];

async function renderCards() {
  carousel.innerHTML = '';
  cardIndicator.innerHTML = '';

  // Create all cards
  let currentDeck = await getDeckById(currentDeckID);
  currentDeck.cardIDs.forEach(async (cardID, index) => {
    let card = await getCardById(cardID);

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    cardDiv.innerHTML = `
      <img class="card-image" src="${card.imageURL}" alt="Picture of the ${card.name} card"></img>
      <div class="card-info">
        <div class="card-type">${card.type}</div>
        <div class="card-evolution">${card.evolution}</div>
        <div class="card-hp">${card.hp}</div>
      </div>
      <form class="card-info-edit" style="display: none">
        <input class="card-type" value="${card.type}"></input>
        <input class="card-evolution" value="${card.evolution}"></input>
        <input class="card-hp" value="${card.hp}"></input>
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
  mainCardName.textContent = debugCards[currentIndex].name;

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

  currentIndex = (currentIndex - 1 + debugCards.length) % debugCards.length;
  animateToCard();
}

function nextCard() {
  if (isAnimating) return;
  isAnimating = true;

  currentIndex = (currentIndex + 1) % debugCards.length;
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
  mainCardName.textContent = debugCards[currentIndex].name;

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

// Touch/swipe support
let startX = 0;
let startY = 0;
let distX = 0;
let distY = 0;

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

document.getElementsByClassName('prev-button')[0].addEventListener('click', prevCard);
document.getElementsByClassName('next-button')[0].addEventListener('click', nextCard);

// Manage card values
let editMode = false;
const manageButton = document.getElementsByClassName('manage-button')[0];

manageButton.addEventListener('click', async () => {
  if (editMode) {
    try {
      let currentCard = await getCardById(currentCardID);

      currentCard.name = cardElements[currentIndex].getElementsByClassName('card-name-input').textContent;
      currentCard.type = cardElements[currentIndex].getElementsByClassName('card-type-input').textContent;
      currentCard.hp = cardElements[currentIndex].getElementsByClassName('card-hp-input').textContent;
      currentCard.evolution = cardElements[currentIndex].getElementsByClassName('card-evolution-input').textContent;

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

  const cardInfoElement = cardElements[currentIndex].getElementsByClassName('card-info')[0];
  const cardInfoEditElement = cardElements[currentIndex].getElementsByClassName('card-info-edit')[0];
  cardInfoElement.style.display = editMode ? 'none' : 'block';
  cardInfoEditElement.style.display = editMode ? 'block' : 'none';

  mainCardName.textContent = debugCards[currentIndex].name;
  cardElements[currentIndex].getElementsByClassName('card-type')[0].textContent = debugCards[currentIndex].type;
  cardElements[currentIndex].getElementsByClassName('card-hp')[0].textContent = debugCards[currentIndex].hp;
  cardElements[currentIndex].getElementsByClassName('card-evolution')[0].textContent = debugCards[currentIndex].evolution;
}

// TODO: Remove debug deck when Deck ID is fixed
const debugCards = [
  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH45/SWSH45_EN_52.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Vaporeon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH4/SWSH4_EN_30.png',
    type: 'Water',
    hp: '110',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH118.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Jolteon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_135.png',
    type: 'Electric',
    hp: '110',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH042.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Flareon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_136.png',
    type: 'Fire',
    hp: '130',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SVP/SVP_EN_43.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Espeon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH174.png',
    type: 'Psychic',
    hp: '110',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SMP/SMP_EN_SM184.png',
    type: 'Normal',
    hp: '50',
    evolution: 'Basic',
  },
  {
    name: 'Umbreon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV03/SV03_EN_130.png',
    type: 'Dark',
    hp: '110',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH175.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Leafeon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV06/SV06_EN_11.png',
    type: 'Grass',
    hp: '120',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH190.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Glaceon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH192.png',
    type: 'Water',
    hp: '110',
    evolution: 'Stage 1',
  },

  {
    name: 'Eevee',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH095.png',
    type: 'Normal',
    hp: '60',
    evolution: 'Basic',
  },
  {
    name: 'Sylveon',
    imageURL: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV6PT5/SV6PT5_EN_22.png',
    type: 'Psychic',
    hp: '120',
    evolution: 'Stage 1',
  },
];
const debugDeck = new Deck({ name: 'Oops! All Eeveelutions' });
let cardID = "";
debugCards.forEach(async (cardJSON) => {
  cardID = await addCard(Card.fromJSON(cardJSON));
  debugDeck.addCard(cardID);
});
let currentDeckID = await addDeck(debugDeck);
let currentCardID = await getCardById(cardID);

window.onload = () => {
  addDeck(debugDeck);
  renderCards();
};
