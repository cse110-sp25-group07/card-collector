/* /data/indexedDB.js  ----------------------------------------------
   Reusable data layer for our Card Collector
   Stores card objects in browser storage using IndexedDB
   Choosing to use the idb library to simplify IndexedDB calls
------------------------------------------------------------------- */

import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

// DB CONSTANTS -----------------------------------------------------
const DB_NAME = 'card-vault-db';
const DB_VERSION = 2;
const CARD_STORE = 'cards';
const DECK_STORE = 'decks';

// Open or create the IndexedDB database.
// If the database doesn't exist or the version number has increased,
// `upgrade` function runs to create or update object stores.
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(CARD_STORE)) {
      db.createObjectStore(CARD_STORE, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(DECK_STORE)) {
      db.createObjectStore(DECK_STORE, { keyPath: 'id' });
    }
  },
});

// ID HELPER --------------------------------------------------------
const genId = () =>
  'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2);

// API FUNCTIONS ----------------------------------------------------

/**
 * Add or update a card in IndexedDB.
 * @param {Object} card  - card object. If there's no `id`, one is generated.
 * @returns {Promise<string>} id of stored card
 */
export async function addCard(card) {
  const db = await dbPromise;
  if (!card.id) card.id = genId();
  await db.put(CARD_STORE, card); // put is add or overwrite
  return card.id;
}

/**
 * Fetch all cards.
 * @returns {Promise<Object[]>} array of card objects
 */
export async function getAllCards() {
  const db = await dbPromise;
  return db.getAll(CARD_STORE);
}

/**
 * Fetch a single card by its id.
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
export async function getCardById(id) {
  const db = await dbPromise;
  return db.get(CARD_STORE, id);
}

/**
 * Delete a card.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteCard(id) {
  const db = await dbPromise;
  return db.delete(CARD_STORE, id);
}

// DECK HELPERS -----------------------------------------------------

const genDeckId = () =>
  'd_' + Date.now().toString(36) + Math.random().toString(36).slice(2);

/**
 * A deck object should look like:
 * {
 *   id: 'd_xyz123',
 *   name: 'Best Electrics',
 *   cardIds: ['c_1', 'c_2', 'c_3']  // references to card IDs
 * }
 */
/**
 * Add or update a deck in IndexedDB.
 * @param {Object} deck - A deck object (must contain `name`, `cardIds`)
 * @returns {Promise<string>} The deck id
 */

export async function addDeck(deck) {
  const db = await dbPromise;
  if (!deck.id) deck.id = genDeckId();
  await db.put(DECK_STORE, deck);
  return deck.id;
}

/**
 * Update an existing deck in IndexedDB.
 * @param {Object} deck - A deck object (must contain `id`, `name`, `cardIds`)
 * @returns {Promise<string>} The deck id
 * @throws {Error} If deck with given id doesn't exist
 */
export async function updateDeck(deck) {
  const db = await dbPromise;
  if (!deck.id) {
    throw new Error('Cannot update deck: no id provided');
  }
  const existingDeck = await db.get(DECK_STORE, deck.id);
  if (!existingDeck) {
    throw new Error(`Cannot update deck: no deck found with id ${deck.id}`);
  }
  await db.put(DECK_STORE, deck);
  return deck.id;
}

/**
 * Fetch all decks.
 * @returns {Promise<Object[]>} array of deck objects
 */
export async function getAllDecks() {
  const db = await dbPromise;
  return db.getAll(DECK_STORE);
}

/**
 * Fetch a single deck by id.
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
export async function getDeckById(id) {
  const db = await dbPromise;
  return db.get(DECK_STORE, id);
}

/**
 * Delete a deck.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteDeck(id) {
  const db = await dbPromise;
  return db.delete(DECK_STORE, id);
}
