// Helper function to generate UUID v4 compatible fallback
function generateFallbackUUID() {
  // Generate a UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
        } catch {
          // Fallback UUID generation if crypto.randomUUID fails
          id = generateFallbackUUID();
        }
      } else {
        // Fallback UUID generation
        id = generateFallbackUUID();
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
