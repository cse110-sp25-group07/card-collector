// import { getAllCards } from '../../data/indexedDB.js';
// import { Card } from '../../data/card.js';

// Dummy card data — replace with real getAllCards() later
const dummyCards = [
  {
    id: '1',
    name: 'Pikachu',
    imageURL:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
  {
    id: '2',
    name: 'Charmander',
    imageURL:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  },
  {
    id: '3',
    name: 'Bulbasaur',
    imageURL:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
];

// build and render the card grid
function renderCardGrid(cards) {
  const container = document.createElement('div');
  container.classList.add('card-grid');

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
    editBtn.classList.add('card-btn');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering cardLink click
      alert(`Edit ${card.name} (not implemented yet)`);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('card-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering cardLink click
      alert(`Delete ${card.name} (not implemented yet)`);
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
    console.log('Implement toggling of create and delete');
    console.log('Make it so delete pops up on each card');
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
  const grid = renderCardGrid(dummyCards);
  root.appendChild(grid);

  //to be implemented next sprint
  // try {
  //     const rawCards = await getAllCards();       // fetch from IndexedDB
  //     const cards = rawCards.map(Card.fromJSON);  // turn plain objects into Card instances
  //     const grid = renderCardGrid(cards);
  //     root.appendChild(grid);
  //   } catch (err) {
  //     root.innerHTML = `<p style="color: red;">Error loading cards. Check the console.</p>`;
  //     console.error('Failed to load cards:', err);
  //   }

  eventListenerSetup();
}

init();
