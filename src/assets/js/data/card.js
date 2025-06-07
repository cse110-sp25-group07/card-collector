// Helper function to generate UUID v4 compatible fallback
function generateFallbackUUID() {
  // Generate a UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class Card {
  /**
   * Each card has the required field of an ID and optional fields of name, imageURL, type, hp, and evolution.
   * @constructor
   * @param {int} id - The unique ID for a card.
   * @param {string} name - The pokemon's name.
   * @param {string} imageURL - The URL from indexDB of the card image.
   * @param {string} type - The pokemon's specific type.
   * @param {int} hp - The amount of health points the pokemon has.'
   * @param {string} evolution - The evolution stage of a pokemon (Basic, Stage 1, Stage 2).
   */
  constructor({ id, name, imageURL, type, hp, evolution }) {
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
    this.type = type;
    this.hp = hp;
    this.evolution = evolution;
  }

  // Converts object to plain JSON for storage in IndexedDB
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      imageURL: this.imageURL,
      type: this.type,
      hp: this.hp,
      evolution: this.evolution,
    };
  }

  static fromJSON(json) {
    return new Card(json);
  }
}
