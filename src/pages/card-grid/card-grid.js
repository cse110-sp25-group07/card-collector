import {
  getCardsFromDeck,
  getDeckById,
  deleteCard,
  addDeck,
} from '../../data/indexedDB.js';

async function updateTitleWithDeckName(deckId) {
  const deck = await getDeckById(deckId);
  const heading = document.querySelector('h1');
  if (deck && deck.name) {
    heading.textContent = `${deck.name} Deck`;
  }
}

// build and render the card grid
function renderCardGrid(cards) {
  const container = document.createElement('div');
  container.classList.add('card-grid');
  const params = new URLSearchParams(window.location.search);
  const deckId = params.get('deckId');

  cards.forEach((card) => {
    const tile = document.createElement('div');
    tile.classList.add('card-tile');

    // clickable image + name div
    const cardLink = document.createElement('div');
    cardLink.classList.add('card-content');
    cardLink.innerHTML = `
          <img src="${card.imageURL}" alt="${card.name}" />
          <p>${card.name}</p>
        `;
    cardLink.addEventListener('click', () => {
      window.location.href = `../single-card-view/display.html?id=${card.id}`;
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('card-btn', 'manage-hidden');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering cardLink click
      alert(`Edit ${card.name} (not implemented yet)`);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('card-btn', 'manage-hidden');
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); // prevent triggering cardLink click
      try {
        // Delete the card from IndexedDB
        await deleteCard(card.id);

        // Remove card ID from the deck
        const deck = await getDeckById(deckId);
        if (!deck) throw new Error('Deck not found');

        // Remove the card ID from the deck's cardIds
        const updatedDeck = {
          ...deck,
          cardIds: deck.cardIds.filter((id) => id !== card.id),
        };

        // Save the updated deck
        await addDeck(updatedDeck);

        // Refresh the page to show changes
        window.location.reload();
      } catch (err) {
        console.error('Failed to delete card:', err);
        alert('Failed to delete card. See console for details.');
      }
    });

    tile.appendChild(cardLink);
    tile.appendChild(editBtn);
    tile.appendChild(deleteBtn);
    container.appendChild(tile);
  });

  return container;
}

//sets up the search, filter and manage buttons
function eventListenerSetup() {
  const back = document.getElementById('go-back');
  back.addEventListener('click', () => {
    console.log('Implement go back to deck view logic');
  });

  const manage = document.getElementById('manage-toggle');
  manage.addEventListener('click', () => {
    document.body.classList.toggle('manage-visible');
  });

  const create = document.getElementById('create-card');
  create.addEventListener('click', () => {
    console.log('Implement creation of cards');
  });

  const sort = document.getElementById('sort-cards');
  sort.addEventListener('change', (e) => {
    console.log(`Implement sorting by ${e.target.value}`);
  });
}

// entry point
async function init() {
  const root = document.getElementById('card-grid-root');

  const params = new URLSearchParams(window.location.search);
  const deckId = params.get('deckId');
  if (!deckId) {
    console.error('No deckId found in URL.');
    return;
  }
  updateTitleWithDeckName(deckId);

  const deck = await getDeckById(deckId);
  if (!deck) {
    console.error(`Deck with id ${deckId} not found.`);
    return;
  }

  const cards = await getCardsFromDeck(deckId);

  const grid = renderCardGrid(cards);
  root.appendChild(grid);

  eventListenerSetup();
}

init();
