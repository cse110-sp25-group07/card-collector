import { getCardById } from './indexedDB.js'
/**
 * Creates a deck display based upon an exisiting deck
 * @property {number} id - Unique deck ID
 * @property {string} name - Deck name.
 * @property {number[]} cardIds - Array of card IDs in the deck.
 * @property {string} deckimageURL - fallback deck Image(back of the card)
 * 
 * @extends HTMLElement
 */
export class DeckDisplay extends HTMLElement {
  // Constructor doesn't do much other than super() as it muddles stuff up as a web component
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * @param {Deck} deck - Deck object to build display off of.
   */
  set data(deck) {
    this.cardIds = Array.isArray(deck.cardIds) ? deck.cardIds : [];
    this.id = deck.id;
    this.name = deck.name;
    this.deckimageURL = deck.imageURL;

    this.setDisplayAsync();
  }

  /**
   * Async as retreiving the cards to obtain their imageURLs is async
   */
  async setDisplayAsync() {
    const fallbackImage = '../create-deck/assets/images/card-back.webp';

    const card0 = this.cardIds[0];
    const card1 = this.cardIds[1];
    const card2 = this.cardIds[2];

    const card0imageURL = await this.getCardImage(card0);
    const card1imageURL = await this.getCardImage(card1);
    const card2imageURL = await this.getCardImage(card2);
    const imgStackStepPercentage = 0.05; ////////// This can be changed to change how spread apart the card images are. //////////

    this.shadowRoot.innerHTML = '';

    const width = 240; ////////// Only need to set width to change the scale to match card-back.webp aspect ratio //////////
    const height = 196/140 *width;
    const infomargins = 2/140 * width;
    const fallbackWidth = width;
    const fallbackHeight = height;

    const maxFontSize = .11 * width;
    const fontSize = Math.min(maxFontSize, width / this.name.length * 2.0);

    this.shadowRoot.innerHTML = `
    <style>
    * {
        position:relative;
      --width: ${width}px;
      --height: ${height}px;
      --infomargins ${infomargins}px:
    }
      h3{
        display:flex;
        white-space:nowrap;
        justify-content:center;
        align-items:center;
        height:${maxFontSize * 2.5}px;
        line-height:${maxFontSize * 2.5 / 2}px;
        width: var(--width,${fallbackWidth}px);
        font-size:${fontSize}px;
        text-align:center;
        margin-top: var(--infomargins,${infomargins}px);
        margin-bottom: var(--infomargins,${infomargins}px);
      }
      .deckImageStack {
        position:relative;
        width: ${width}px;
        height: ${height}px;
      }
      img {
        position:absolute;
        width: ${width * (1 - 2 * imgStackStepPercentage)}px;
        height: ${height * (1 - 2 * imgStackStepPercentage)}px;
      }
      #cardImg0 {
        top: ${height * imgStackStepPercentage * 2}px;
        left: ${width * imgStackStepPercentage * 2}px; 
        z-index: 2;
      }
      #cardImg1 {
        top: ${height * imgStackStepPercentage}px;
        left: ${width * imgStackStepPercentage}px; 
        z-index: 1;
      }
      #cardImg2 {
        top: 0px;
        left: 0px; 
        z-index: 0;
      }
      .card-count{
        font-size:${maxFontSize}px;
      }
    </style>
     <h3>
      <span class="name">${this.name}<span><br>
      <span class="card-count">${this.cardIds.length} Card${this.cardIds.length === 1 ? '' : 's'}<span> 
     </h3>
     <div class="deckImageStack">
      <img id='cardImg0' src='${card0imageURL}' onerror="this.onerror=null;this.src='${fallbackImage}';" alt='Deck Back'> 
      <img id='cardImg1' src='${card1imageURL}' onerror="this.onerror=null;this.src='${fallbackImage}';" alt='Deck Back'> 
      <img id='cardImg2' src='${card2imageURL}' onerror="this.onerror=null;this.src='${fallbackImage}';" alt='Deck Back'> 
     </div>
     `;

  }

  /**
   * Gets imageURL from a cardId
   */
  async getCardImage(cardId) {
    if (cardId !== undefined) {
      const card = await getCardById(cardId);
      return card?.imageURL ?? this.deckimageURL;
    }
    return this.deckimageURL;
  }
}
