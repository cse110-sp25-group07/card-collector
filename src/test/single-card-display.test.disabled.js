import 'expect-puppeteer';
import { jest } from '@jest/globals';

import 'fake-indexeddb/auto';
import { addCard, addDeck } from '../assets/js/data/indexedDB.js';
import { Card } from '../assets/js/data/card.js';
import { Deck } from '../assets/js/data/deck.js';
import { expect } from 'expect-puppeteer';

describe('Single Card View Test', () => {
  const eeveeCardJSONs = [
    {
      name: 'Eevee',
      imageURL:
        'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH45/SWSH45_EN_52.png',
      type: 'Normal',
      hp: '60',
      evolution: 'Basic',
    },
    {
      name: 'Vaporeon',
      imageURL:
        'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH4/SWSH4_EN_30.png',
      type: 'Water',
      hp: '110',
      evolution: 'Stage 1',
    },
    {
      name: 'Eevee',
      imageURL:
        'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH118.png',
      type: 'Normal',
      hp: '60',
      evolution: 'Basic',
    },
    {
      name: 'Jolteon',
      imageURL:
        'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_135.png',
      type: 'Electric',
      hp: '110',
      evolution: 'Stage 1',
    },
    {
      name: 'Eevee',
      imageURL:
        'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH042.png',
      type: 'Normal',
      hp: '60',
      evolution: 'Basic',
    },
    {
      name: 'Flareon',
      imageURL:
        'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_136.png',
      type: 'Fire',
      hp: '130',
      evolution: 'Stage 1',
    },
  ];

  beforeAll(async () => {
    // Create cards and deck in local storage
    let deck = new Deck({
      name: 'Original Eeveelutions',
      cardIds: [],
    });
    for (let eeveeJSON of eeveeCardJSONs) {
      let cardId = await addCard(Card.fromJSON(eeveeJSON));
      deck.addCard(cardId);
    }
    let deckId = await addDeck(deck);

    // Open the Single Card Display to the first card
    let link = `https://cse110-sp25-group07.github.io/card-collector/src/pages/single-card-display.html?cardId=${deck.cardIds[0]}&deckId=${deckId}`;
    await page.goto(link);
  });

  it('should open without errors', async () => {
    await page.screenshot({ path: 'opening.png', fullPage: true });
  });

  it('should toggle the manage button', async () => {
    const manageButton = await page.$('#manage-button');
    await manageButton.click();

    expect(manageButton.toElement('button').innerHTML).toBe('Confirm');
    await manageButton.click();

    expect(manageButton.toElement('button').innerHTML).toBe('Manage');
  });

  it('should have the correct values for the second card', async () => {
    const nextButton = await page.$('.next-button');
    nextButton.click();

    const cardName = (await page.$('#mainCardName')).getProperty('innerHTML');
    const cardType = (await page.$('.card-type')).getProperty('innerHTML');
    const cardEvo = (await page.$('.card-evolution')).getProperty('innerHTML');
    const cardHP = (await page.$('.card-hp')).getProperty('innerHTML');

    expect(cardName).toBe('Vaporeon');
    expect(cardType).toBe('Water');
    expect(cardEvo).toBe('Stage 1');
    expect(cardHP).toBe('110');
  });
});
