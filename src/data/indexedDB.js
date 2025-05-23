/* /data/indexedDB.js  ----------------------------------------------
   Reusable data layer for Card Collector App
   Stores card objects in browser storage using IndexedDB
   Choosing to use the idb library to simplify IndexedDB calls
------------------------------------------------------------------- */

import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

// DB CONSTANTS -----------------------------------------------------
const DB_NAME = 'card-vault-db';
const DB_VERSION = 1;
const CARD_STORE = 'cards';

// Open or create the IndexedDB database.
// If the database doesn't exist or the version number has increased,
// `upgrade` function runs to create or update object stores.
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(CARD_STORE)) {
      db.createObjectStore(CARD_STORE, { keyPath: 'id' });
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
