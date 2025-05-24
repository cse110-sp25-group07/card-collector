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
    this.id = id || crypto.randomUUID();
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
