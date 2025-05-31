/*  ---------------------------------------------------------------
    Unit-test (or integration test?) for getCardsFromDeck(deckId) in data/indexedDB.js.
    - Uses fake-indexeddb so no real browser DB is required.
---------------------------------------------------------------- */

import 'fake-indexeddb/auto';
import { addCard, addDeck, getCardsFromDeck } from '../data/indexedDB.js';
import { Card } from '../data/card.js';
import { Deck } from '../data/deck.js';

describe('indexedDB data layer – getCardsFromDeck', () => {
  let deckIdA, deckIdB, deckIdC; // Electric/Fire, Water, Grass

  beforeAll(async () => {
    //Create + store four cards
    const pikachu = new Card({
      name: 'Pikachu',
      imageURL: 'pikachu.png',
      type: 'Electric',
    });
    const charmander = new Card({
      name: 'Charmander',
      imageURL: 'charmander.png',
      type: 'Fire',
    });
    const squirtle = new Card({
      name: 'Squirtle',
      imageURL: 'squirtle.png',
      type: 'Water',
    });
    const bulbasaur = new Card({
      name: 'Bulbasaur',
      imageURL: 'bulbasaur.png',
      type: 'Grass',
    });

    const pikachuId = await addCard(pikachu.toJSON());
    const charmanderId = await addCard(charmander.toJSON());
    const squirtleId = await addCard(squirtle.toJSON());
    const bulbasaurId = await addCard(bulbasaur.toJSON());

    // Deck A: cardIds pushed directly
    const deckA = new Deck({
      name: 'Electric/Fire Deck',
      cardIds: [pikachuId, charmanderId],
    });
    deckIdA = await addDeck(deckA.toJSON());

    // Deck B
    const deckB = new Deck({ name: 'Water Deck', cardIds: [squirtleId] });
    deckIdB = await addDeck(deckB.toJSON());

    // Deck C: demonstrate Deck.addCard()
    const deckC = new Deck({ name: 'Grass Deck' }); // starts empty
    deckC.addCard(bulbasaurId); // use model method (/data/deck.js)
    deckIdC = await addDeck(deckC.toJSON()); // save updated deck
  });

  test('returns only cards from Electric/Fire deck', async () => {
    const cards = await getCardsFromDeck(deckIdA);
    expect(cards.map((c) => c.name).sort()).toEqual(['Charmander', 'Pikachu']);
  });

  test('returns only cards from Water deck', async () => {
    const cards = await getCardsFromDeck(deckIdB);
    expect(cards.length).toBe(1);
    expect(cards[0].name).toBe('Squirtle');
  });

  test('returns cards added via Deck.addCard()', async () => {
    const cards = await getCardsFromDeck(deckIdC);
    expect(cards.length).toBe(1);
    expect(cards[0].name).toBe('Bulbasaur');
  });

  test('returns empty array for deck with no cards', async () => {
    const emptyDeckId = await addDeck(
      new Deck({ name: 'Empty Deck' }).toJSON(),
    );
    const cards = await getCardsFromDeck(emptyDeckId);
    expect(cards).toEqual([]);
  });
});
