import {
  getCardsFromDeck,
  getDeckById,
  deleteCard,
  addDeck,
} from '../../data/indexedDB.js';

//List of Dummy Cards
//TODO Delete this and create unit tests for sort and search
/*
const dummyCards = [
  {
    name: 'Pikachu',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    type: "electric",
    hp: 100,
    evolution: 'Raichu'
  },
  {
    name: 'Charmander',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    type: "fire",
    hp: 80,
    evolution: 'Charmeleon'
  },
  {
    name: 'Raichu',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
    type: "electric",
    hp: 101,
    evolution: ''
  },
  {
    name: 'Bulbasaur',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    type: "grass",
    hp: 101,
    evolution: 'Ivysaur'
  },
  {
    name: 'Electrode',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png',
    type: "electric",
    hp: 99,
    evolution: 'Voltorb'
  },
  {
    name: 'Voltorb',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/101.png',
    type: "electric",
    hp: 140,
    evolution: ''
  },
  {
    name: 'Ivysaur',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
    type: "grass",
    hp: 150,
    evolution: 'Venosaur'
  },
  {
    name: 'Venosaur',
    imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    type: "grass",
    hp: 200,    
    evolution: ''
  }
];
*/

async function updateTitleWithDeckName(deckId) {
  const deck = await getDeckById(deckId);
  const heading = document.querySelector('h1');
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
function backSearchSortManageBtnsSetup(allCards) {
  const back = document.getElementById('go-back');
  back.addEventListener('click', () => {
    window.location.href = '../deck-grid/deckviewui.html';
  });

  //Manage Button
  const manage = document.getElementById('manage-toggle');
  manage.addEventListener('click', () => {
    document.body.classList.toggle('manage-visible');
  });

  //Create Button
  const create = document.getElementById('create-card');
  create.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const deckId = params.get('deckId');
    window.location.href = `../create-card/create-card.html?deckId=${deckId}`;
  });

  //Sort Cards Selection
  const sort = document.getElementById('sort-cards');
  sort.addEventListener('change', (e) => {
    //console.log(`Implement sorting by ${e.target.value}`);
    sortCards(allCards, e.target.value);
  });

  //Search Cards
  const search = document.getElementById('search-cards');
  search.addEventListener('input', (e) => {
    //console.log(`Implement searching by ${e.target.value}`);
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
      //console.log('Name ', cardName);
      //console.log('Id ', card.id);
    }
  }
  //console.log(filteredCards.length);
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
        return firstCard.type.localeCompare(secondCard.type);
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
  /*
  //This is just for the dummyCards testing
  //TODO Delete this once I implement some unit tests
  
  const root = document.getElementById('card-grid-root');
  const grid = renderCardGrid(dummyCards);
  root.appendChild(grid);
  backSearchSortManageBtnsSetup(dummyCards);
*/
}

init();
