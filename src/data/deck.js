export class Deck {
  /**
   * Creates a deck with a unique ID, a name, and a list of card IDs.
   * @param {string} id - Unique deck ID (auto-generated if not provided).
   * @param {string} name - Deck name.
   * @param {string[]} cardIds - Array of card IDs in the deck.
   */
  constructor({ id = crypto.randomUUID(), name = '', cardIds = [] }) {
    this.id = id;
    this.name = name;
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
