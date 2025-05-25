// import { getAllCards } from '../../data/indexedDB.js';
// import { Card } from '../../data/card.js';


// Dummy card data — replace with real getAllCards() later
const dummyCards = [
    {
      id: '1',
      name: 'Pikachu',
      imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    },
    {
      id: '2',
      name: 'Charmander',
      imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
    },
    {
      id: '3',
      name: 'Bulbasaur',
      imageURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    }
  ];

// build and render the card grid
function renderCardGrid(cards) {
    const container = document.createElement('div');
    container.classList.add('card-grid');
  
    cards.forEach(card => {
      const tile = document.createElement('div');
      tile.classList.add('card-tile');
  
      tile.innerHTML = `
        <img src="${card.imageURL}" alt="${card.name}" />
        <p>${card.name}</p>
      `;
  
      tile.addEventListener('click', () => {
        alert(`You clicked ${card.name}`);
      });
  
      container.appendChild(tile);
    });
  
    return container;
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
  }
  
  init();