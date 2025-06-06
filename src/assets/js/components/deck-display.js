import { getCardById } from '../data/indexedDB.js';
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

    // Check if deck has any cards
    const hasCards = this.cardIds.length > 0;
    const numCardsToShow = hasCards ? Math.min(this.cardIds.length, 3) : 1;

    this.shadowRoot.innerHTML = '';

    const width = 240; ////////// Only need to set width to change the scale to match card-back.webp aspect ratio //////////
    const height = (196 / 140) * width;
    const infomargins = (2 / 140) * width;
    const fallbackWidth = width;

    const maxFontSize = 0.11 * width;
    const fontSize = Math.min(maxFontSize, (width / this.name.length) * 2.0);

    // Generate CSS for dynamic number of cards
    let imgStyles = '';
    let imgElements = '';

    if (hasCards) {
      // Show actual card images
      ////////// This can be changed to change how spread apart the card images are. //////////
      const imgStackStepPercentage = 0.05;

      for (let i = 0; i < numCardsToShow; i++) {
        const cardId = this.cardIds[i];
        const cardImageURL = await this.getCardImage(cardId);
        const zIndex = numCardsToShow - i - 1; // Reverse z-index so first card is on top
        const topOffset =
          height * imgStackStepPercentage * (numCardsToShow - i - 1);
        const leftOffset =
          width * imgStackStepPercentage * (numCardsToShow - i - 1);

        imgStyles += `
          #cardImg${i} {
            top: ${topOffset}px;
            left: ${leftOffset}px; 
            z-index: ${zIndex};
          }
        `;

        imgElements += `<img id='cardImg${i}' src='${cardImageURL}' onerror="this.onerror=null;this.src='${fallbackImage}';" alt='Card ${i + 1}'>`;
      }
    } else {
      // Show single deck image
      const deckImageURL = this.deckimageURL || fallbackImage;

      imgStyles += `
        #deckImg {
          top: ${(height - height * 0.9) / 2}px;
          left: ${(width - width * 0.9) / 2}px;  
          z-index: 0;
        }
      `;

      imgElements += `<img id='deckImg' src='${deckImageURL}' onerror="this.onerror=null;this.src='${fallbackImage}';" alt='Deck Image'>`;
    }

    this.shadowRoot.innerHTML = `
    <style>
    * {
        position:relative;
      --width: ${width}px;
      --height: ${height}px;
      --infomargins: ${infomargins}px;
    }
      h3{
        display:flex;
        white-space:nowrap;
        justify-content:center;
        align-items:center;
        height:${maxFontSize * 2.5}px;
        line-height:${(maxFontSize * 2.5) / 2}px;
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
        width: ${width * 0.9}px;
        height: ${height * 0.9}px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      ${imgStyles}
      .card-count{
        font-size:${maxFontSize}px;
      }
    </style>

    <h3>
      <span class="name">${this.name}<span><br>
      <span class="card-count">${this.cardIds.length} Card${this.cardIds.length === 1 ? '' : 's'}<span> 
     </h3>
     <div class="deckImageStack">
      ${imgElements}
     </div>
     `;
    this.shadowRoot
      .querySelector('.deckImageStack')
      .addEventListener('click', () => {
        window.location = `../card-grid/card-grid.html?deckId=${this.id}`;
      });
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
