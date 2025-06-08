import 'fake-indexeddb/auto';
import {
  addCard,
  addDeck,
  updateDeck,
  deleteCard,
  getCardsFromDeck,
  getDeckById,
  getCardById,
} from '../assets/js/data/indexedDB.js';

import { Card } from '../assets/js/data/card.js';
import { Deck } from '../assets/js/data/deck.js';

describe('Integration Tests: Cards and Decks', () => {
  test('create card and update deck with card ID', async () => {
    const deck = new Deck({ name: 'Test Deck' });
    const deckId = await addDeck(deck.toJSON());

    const card = new Card({ name: 'Test Card', type: 'Starfighter' });
    const cardId = await addCard(card.toJSON());

    const fetchedDeck = await getDeckById(deckId);
    fetchedDeck.cardIds.push(cardId);
    await updateDeck(fetchedDeck);

    const cardsInDeck = await getCardsFromDeck(deckId);
    expect(cardsInDeck.map((c) => c.name)).toContain('Test Card');
  });

  test('deleting card removes it from deck', async () => {
    const deck = new Deck({ name: 'Delete Test', cardIds: [] });
    const deckId = await addDeck(deck.toJSON());

    const card = new Card({ name: 'ToDelete' });
    const cardId = await addCard(card.toJSON());

    const updatedDeck = await getDeckById(deckId);
    updatedDeck.cardIds.push(cardId);
    await updateDeck(updatedDeck);

    await deleteCard(cardId);
    const cleanedDeck = await getDeckById(deckId);
    cleanedDeck.cardIds = cleanedDeck.cardIds.filter((id) => id !== cardId);
    await updateDeck(cleanedDeck);

    const cards = await getCardsFromDeck(deckId);
    expect(cards.find((c) => c.id === cardId)).toBeUndefined();
  });

  test('getCardById returns correct Star Wars card', async () => {
    const card = new Card({ name: 'Yoda', type: 'Jedi', hp: 900 });
    const cardId = await addCard(card.toJSON());

    const fetched = await getCardById(cardId);
    expect(fetched.name).toBe('Yoda');
    expect(fetched.type).toBe('Jedi');
    expect(fetched.hp).toBe(900);
  });

  test('cards from Rebel deck do not appear in Empire deck', async () => {
    const luke = new Card({ name: 'Luke Skywalker', type: 'Jedi' });
    const vader = new Card({ name: 'Darth Vader', type: 'Sith' });

    const lukeId = await addCard(luke.toJSON());
    const vaderId = await addCard(vader.toJSON());

    const rebelDeck = new Deck({ name: 'Rebel Alliance', cardIds: [lukeId] });
    const empireDeck = new Deck({ name: 'Galactic Empire', cardIds: [vaderId] });

    const rebelDeckId = await addDeck(rebelDeck.toJSON());
    const empireDeckId = await addDeck(empireDeck.toJSON());

    const rebelCards = await getCardsFromDeck(rebelDeckId);
    const empireCards = await getCardsFromDeck(empireDeckId);

    expect(rebelCards.map((c) => c.name)).toEqual(['Luke Skywalker']);
    expect(empireCards.map((c) => c.name)).toEqual(['Darth Vader']);
  });
});
