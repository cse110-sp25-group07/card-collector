import {
  getCardsFromDeck,
  getDeckById,
  deleteCard,
  addDeck,
  deleteDeck,
} from '../data/indexedDB.js';

const feedbackEl = document.getElementById('feedback-message');
const headerEl = document.querySelector('.view-deck-header');
const gridRoot = document.getElementById('card-grid-root');
const controlsEl = document.querySelector('.manage-controls');
const sortEl = document.querySelector('.sort-controls');
const searchEl = document.getElementById('search-cards');

// grab deckId
const params = new URLSearchParams(window.location.search);
const deckId = params.get('deckId');

// helper to show/hide everything
function showError(msg) {
  feedbackEl.textContent = msg;
  feedbackEl.className = 'feedback-message feedback-error';
  feedbackEl.style.display = 'block';
  headerEl.style.display = 'none';
  sortEl.style.display = 'none';
  searchEl.style.display = 'none';
  gridRoot.style.display = 'none';
  controlsEl.style.display = 'none';
}

// run immediately
(async function verifyDeck() {
  if (!deckId) {
    showError('No deck selected. Please go back and choose a deck.');
    return;
  }
  const deck = await getDeckById(deckId);
  if (!deck) {
    showError('Deck not found. Please use a valid deck link.');
    return;
  }
  // if valid, reveal your header and continue
  headerEl.style.visibility = 'visible';
})();

async function updateTitleWithDeckName(deckId) {
  const deck = await getDeckById(deckId);
  const heading = document.querySelector('h2');
  if (deck && deck.name) {
    heading.textContent = `${deck.name}`;
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

    // clickable image + name
    const cardLink = document.createElement('div');
    cardLink.classList.add('card-content');
    cardLink.innerHTML = `
    <img src="${card.imageURL}" alt="${card.name}" />
    <p>${card.name}</p>
  `;
    cardLink.addEventListener('click', () => {
      window.location.href = `/src/pages/single-card-display.html?deckId=${deckId}&cardId=${card.id}`;
    });

    // DELETE‐MODE “×” ICON
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-icon');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        // remove the card row from IndexedDB
        await deleteCard(card.id);
        // update the deck’s cardIds in IndexedDB
        const deck = await getDeckById(deckId);
        await addDeck({
          ...deck,
          cardIds: deck.cardIds.filter((id) => id !== card.id),
        });
        // remove this tile from the DOM immediately
        tile.remove();
      } catch (err) {
        console.error('Failed to delete card:', err);
        alert('Could not delete card. See console for details.');
      }
    });

    tile.appendChild(cardLink);
    tile.appendChild(deleteBtn);
    container.appendChild(tile);
  });

  return container;
}
function handleEditDeck(deck) {
  window.location.href = `/src/pages/create-deck-ui.html?edit=${deck.id}`;
}
//sets up the search, filter and manage buttons
function backSearchSortManageBtnsSetup(allCards = []) {
  const back = document.getElementById('go-back');
  back.addEventListener('click', () => {
    window.location.href = '/index.html';
  });

  //Create Button
  const create = document.getElementById('create-card');
  create.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const deckId = params.get('deckId');
    window.location.href = `/src/pages/create-card.html?deckId=${deckId}`;
  });

  if (!allCards.length) return;

  //Manage Button
  const manage = document.getElementById('manage-toggle');
  let inDeleteMode = false;
  manage.addEventListener('click', () => {
    inDeleteMode = !inDeleteMode;

    // Toggle the body class to show/hide delete icons
    document.body.classList.toggle('manage-visible', inDeleteMode);

    if (inDeleteMode) {
      // Entering delete mode
      manage.textContent = 'Cancel Delete';
      manage.classList.add('btn-outline-danger');
      manage.classList.remove('btn-secondary');
    } else {
      // Exiting delete mode
      manage.textContent = 'Delete Cards';
      manage.classList.remove('btn-outline-danger');
      manage.classList.add('btn-secondary');
    }
  });
  //Sort Cards Selection
  const sort = document.getElementById('sort-cards');
  sort.addEventListener('change', (e) => {
    sortCards(allCards, e.target.value);
  });

  //Search Cards
  const search = document.getElementById('search-cards');
  search.addEventListener('input', (e) => {
    searchCards(allCards, e.target.value);
  });
}

//looks through all the cards in the deck and tries to find the one with a name matching searchTerm
//updates display to have all cards found with a substring containing searchTerm
function searchCards(allCards, searchTerm) {
  if (searchTerm == null || searchTerm.trim() === '') {
    const root = document.getElementById('card-grid-root');
    root.innerHTML = '';
    root.appendChild(renderCardGrid(allCards));
    return;
  }
  const root = document.getElementById('card-grid-root');
  root.innerHTML = '';

  const term = searchTerm.toLowerCase();
  const filteredCards = [];

  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i];
    const cardName = card.name.toLowerCase();
    //can change -1 to 0 to make it match the start of the card name instead
    if (cardName.indexOf(term) > -1) {
      filteredCards.push(card);
    }
  }
  root.appendChild(renderCardGrid(filteredCards));
}

//sorts the cards by the given sortOption
function sortCards(allCards, sortOption) {
  const root = document.getElementById('card-grid-root');
  root.innerHTML = ''; // Clear current view

  if (allCards == null || allCards.length <= 1) {
    root.appendChild(renderCardGrid(allCards));
    return;
  }

  //makes a copy of all the Cards
  let sortedCards = [...allCards];
  switch (sortOption) {
    case 'names-alpha':
      sortedCards = sortAlpha(allCards);
      break;
    case 'names-rev-alpha':
      sortedCards = sortAlpha(allCards);
      sortedCards.reverse();
      break;
    case 'evolution':
      sortedCards = sortEvolutions(allCards);
      break;
    //when sorting by type we sort by alpha first then type
    case 'type':
      sortedCards = sortAlpha(allCards);
      sortedCards.sort((firstCard, secondCard) => {
        //use locale Compare so we can sort pokemon types that arent completely english chars
        //just sorts types alphabetically
        //first two lines are to ensure that this works with absent type
        const typeA = firstCard.type || '';
        const typeB = secondCard.type || '';
        return typeA.localeCompare(typeB);
      });
      break;
    //when sorting by hp we sort by alpha first then hp
    case 'hp':
      sortedCards = sortAlpha(allCards);
      sortedCards.sort((firstCard, secondCard) => {
        //only works if hp is an int not a string
        //sorts hp in increasing order
        return firstCard.hp - secondCard.hp;
      });
      break;
    case 'default':
      break;
    default:
      break;
  }
  //return sortedCards;
  root.appendChild(renderCardGrid(sortedCards));
}

//takes in allCards and returns an array of them sorted alphabetically
function sortAlpha(allCards) {
  const sortedCards = [...allCards];
  sortedCards.sort((firstCard, secondCard) => {
    //use locale Compare so we can sort pokemon names that arent completely english chars
    return firstCard.name.localeCompare(secondCard.name);
  });
  return sortedCards;
}

//returns an array of cards with their evolutions (in alphabetically order)
//is a slow function if big O of n^2 so maybe there is a better way to do this
function sortEvolutions(allCards) {
  const sortedAlpha = sortAlpha(allCards);
  const seen = [];
  const sorted = [];

  //Loop through the alphabetically sorted list of cards
  for (let i = 0; i < sortedAlpha.length; i++) {
    const card = sortedAlpha[i];
    //skip the card if we have seen it already
    if (seen.includes(card)) continue;
    let curr = card;
    while (curr != null) {
      sorted.push(curr);
      seen.push(curr);
      //finds the nextCard that has the same name as the current cards evolution
      const nextCard = sortedAlpha.find((c) => c.name === curr.evolution);
      curr = nextCard;
    }
  }
  return sorted;
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
  backSearchSortManageBtnsSetup(cards);
  const editDeckBtn = document.getElementById('edit-deck-details');
  editDeckBtn.addEventListener('click', () => {
    handleEditDeck(deck, editDeckBtn);
  });
  const deleteDeckBtn = document.getElementById('delete-deck');
  deleteDeckBtn.addEventListener('click', async () => {
    // get the current deckId
    const params = new URLSearchParams(window.location.search);
    const deckId = params.get('deckId');
    if (!deckId) {
      return alert('No deck selected to delete.');
    }

    // simple JS confirmation
    const ok = confirm('Are you sure you want to delete this entire deck?');
    if (!ok) return;

    try {
      await deleteDeck(deckId);
      // redirect back to deck list
      window.location.href = '/index.html';
    } catch (err) {
      console.error('Deck deletion failed:', err);
      alert('Failed to delete deck. Check console for details.');
    }
  });
  document.querySelector('.view-deck-header').style.visibility = 'visible';
}

init();

backSearchSortManageBtnsSetup();

export { sortCards, sortAlpha, sortEvolutions, searchCards };