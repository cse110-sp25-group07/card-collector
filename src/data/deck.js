export class Deck {
  /**
   * Creates a deck with a unique ID, a name, and a list of card IDs.
   * @param {string} id - Unique deck ID (auto-generated if not provided).
   * @param {string} name - Deck name.
   * @param {string[]} cardIds - Array of card IDs in the deck.
   */
  constructor({ id, imageURL, name = '', cardIds = [] }) {
    // Generate ID if not provided - using a fallback for crypto.randomUUID
    if (!id) {
      if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
      ) {
        try {
          id = crypto.randomUUID();
        } catch (e) {
          // Fallback if crypto.randomUUID fails
          id =
            'd_' +
            Date.now().toString(36) +
            Math.random().toString(36).slice(2);
        }
      } else {
        // Fallback ID generation
        id =
          'd_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
      }
    }
    this.id = id;
    this.name = name;
    this.imageURL = imageURL;
    this.cardIds = cardIds;
  }

  /**
   * Add a card to the deck.
   * @param {string} cardId
   */
  addCard(cardId) {
    if (!this.cardIds.includes(cardId)) {
      this.cardIds.push(cardId);
    }
  }

  /**
   * Remove a card from the deck.
   * @param {string} cardId
   */
  removeCard(cardId) {
    this.cardIds = this.cardIds.filter((id) => id !== cardId);
  }

  /**
   * Convert to plain object for saving to IndexedDB
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      imageURL: this.imageURL,
      cardIds: this.cardIds,
    };
  }

  /**
   * Convert a raw object to a Deck instance
   */
  static fromJSON(obj) {
    return new Deck(obj);
  }
}
