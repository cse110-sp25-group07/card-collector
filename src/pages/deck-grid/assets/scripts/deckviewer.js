import { Card } from '../../../../data/card.js';
import { Deck } from '../../../../data/deck.js';
import { DeckDisplay } from '../../../../data/deckdisplay.js';
import { getAllDecks, addDeck, addCard } from '../../../../data/indexedDB.js';

customElements.define('deck-display', DeckDisplay);

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
function init() {
  //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: REMOVE UPON ACTUAL USE //////////////////////////////////////////////////////////////////////////////////////////
  const storageExampleDeck = new Deck({
    id: 4,
    imageUrl: '',
    name: 'servkjqhferk fhwerkjvhwdkjh',
    cardIds: [],
  });
  const storageExampleDeck2 = new Deck({
    id: 5,
    imageUrl: '',
    name: 'n',
    cardIds: [],
  });

  const cardImgExample = new Card({
    id: 1,
    name: 'gyatt',
    imageURL: '../create-deck/assets/images/card-back-evil.jpg',
    type: 'water',
    hp: 5,
    evolution: 'vaporeon idk man',
  });
  const cardImgExample2 = new Card({
    id: 2,
    name: 'gyatt',
    imageURL: '../create-deck/assets/images/card-back-evil.jpg',
    type: 'water',
    hp: 5,
    evolution: 'vaporeon idk man',
  });
  const cardImgExample3 = new Card({
    id: 3,
    name: 'gyatt',
    imageURL: '../create-deck/assets/images/card-back-evil.jpg',
    type: 'water',
    hp: 5,
    evolution: 'vaporeon idk man',
  });
  const cardImgExample4 = new Card({
    id: 4,
    name: 'gyatt',
    imageURL: '../create-deck/assets/images/card-back.webp',
    type: 'water',
    hp: 5,
    evolution: 'vaporeon idk man',
  });
  addCard(cardImgExample);
  addCard(cardImgExample2);
  storageExampleDeck.addCard(cardImgExample.id);
  storageExampleDeck.addCard(cardImgExample2.id);

  addCard(cardImgExample3);
  addCard(cardImgExample4);
  storageExampleDeck2.addCard(cardImgExample3.id);
  storageExampleDeck2.addCard(cardImgExample4.id);

  addDeck(storageExampleDeck);
  addDeck(storageExampleDeck2);
  //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: MANUALLY DELETE INDEXDB STORAGE IN DEV TOOLS TO RESET /////////////////////////////////////////////////////////////

  customElements.whenDefined('deck-display').then(async () => {
    // Get the decks from localStorage
    let decks = await getDecksFromStorage();
    //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: REMOVE UPON ACTUAL USE //////////////////////////////////////////////////////////////////////////////////////////
    //const exampleDeck = { id: 1, name: 'exampleDeck', cards: [] };
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //decks.push(exampleDeck);
    //////////////////////////////////////////////////////////// EXAMPLE DECKS AND CARDS: REMOVE UPON ACTUAL USE //////////////////////////////////////////////////////////////////////////////////////////
    addDeckstoDocument(decks);
  });
}

/**
 * Reads 'decks' from localStorage and returns an array of
 * all of the decks found (parsed, not in string form). If
 * nothing is found in localStorage for 'decks', an empty array
 * is returned.
 * @returns {Promise<Object[]>} An array of decks found in index
 */
async function getDecksFromStorage() {
  let decks = await getAllDecks();
  console.log(decks.length);
  return decks;
}

/**
 * Takes in an array of decks and for each deck creates a
 * new <deck-display> element, adds the deck data to that deck-view
 * using element.data = {...}, and then appends that new deck
 * to <deck>
 * @param {Array<Object>} decks An array of decks
 */
function addDeckstoDocument(decks) {
  const deckviewer = document.querySelector('#deck-viewer');
  deckviewer.innerHTML = '';
  //  					Loop through each of the decks in the passed in array,
  //            create a <deck-display> element for each one, and populate
  //            each <deck-display> with that deck data using element.data = ...
  //            Append each element to the deck-viewer div
  for (let i = 0; i < decks.length; i++) {
    let deck = document.createElement('deck-display');
    deck.data = decks[i];
    deckviewer.append(deck);
  }
}
