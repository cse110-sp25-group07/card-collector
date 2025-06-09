import 'fake-indexeddb/auto';

import {
  sortCards,
  sortAlpha,
  sortEvolutions,
  searchCards,
} from '../assets/js/pages/card-grid.js';

describe('Card Grid Search and Sort Tests', () => {
  const testCards = [
    { id: '1', name: 'Pikachu', type: 'Electric', hp: 40, evolution: 'Raichu' },
    { id: '2', name: 'Raichu', type: 'Electric', hp: 60, evolution: null },
    {
      id: '3',
      name: 'Charmeleon',
      type: 'Fire',
      hp: 50,
      evolution: 'Charizard',
    },
    { id: '4', name: 'Charizard', type: 'Fire', hp: 100, evolution: null },
    { id: '5', name: 'Venusaur', type: 'Grass', hp: 120, evolution: null },
    {
      id: '6',
      name: 'Charmander',
      type: 'Fire',
      hp: 35,
      evolution: 'Charmeleon',
    },
    { id: '7', name: 'Eevee', type: 'Normal', hp: 40, evolution: null },
    { id: '8', name: 'Ivysaur', type: 'Grass', hp: 40, evolution: 'Venusaur' },
  ];

  beforeAll(() => {
    document.body.innerHTML = `
      <section class="view-deck-header">
        <button id="go-back" class="back-btn" aria-label="Go Back"></button>
        <h2>No Deck Chosen</h2>
        <div class="button-group">
          <button id="edit-deck-details" class="btn-edit"></button>
          <button id="delete-deck" class="btn-danger"></button>
        </div>
      </section>
      <div class="sort-controls">
        <select id="sort-cards">
          <option value="default">Default</option>
          <option value="names-alpha">A-Z</option>
          <option value="names-rev-alpha">Z-A</option>
          <option value="evolution">Evolution</option>
          <option value="type">Type</option>
          <option value="hp">HP</option>
        </select>
      </div>
      <input type="text" id="search-cards" placeholder="Search cards by name" />
      <div id="card-grid-root"></div>
    `;

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      },
      writable: true,
    });
  });

  beforeEach(() => {
    const gridRoot = document.getElementById('card-grid-root');
    if (gridRoot) gridRoot.innerHTML = '';
  });

  describe('sortAlpha()', () => {
    it('should sort cards alphabetically', () => {
      const sorted = sortAlpha([...testCards]);
      expect(sorted.map((c) => c.name)).toEqual([
        'Charizard',
        'Charmander',
        'Charmeleon',
        'Eevee',
        'Ivysaur',
        'Pikachu',
        'Raichu',
        'Venusaur',
      ]);
    });

    it('should handle empty array', () => {
      expect(sortAlpha([])).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...testCards];
      const sorted = sortAlpha(original);
      expect(original).toEqual(testCards);
      expect(sorted).not.toBe(original);
    });
  });

  describe('sortRevAlpha()', () => {
    it('should sort cards reverse alphabetically', () => {
      const sorted = sortAlpha([...testCards]).reverse();
      expect(sorted.map((c) => c.name)).toEqual([
        'Venusaur',
        'Raichu',
        'Pikachu',
        'Ivysaur',
        'Eevee',
        'Charmeleon',
        'Charmander',
        'Charizard',
      ]);
    });
  });

  describe('sortEvolutions()', () => {
    it('should respect evolution chain order', () => {
      const sorted = sortEvolutions([...testCards]);
      const names = sorted.map((c) => c.name);

      const toIndex = (name) => names.indexOf(name);

      expect(toIndex('Charmander')).toBeLessThan(toIndex('Charmeleon'));
      expect(toIndex('Charmeleon')).toBeLessThan(toIndex('Charizard'));
      expect(toIndex('Ivysaur')).toBeLessThan(toIndex('Venusaur'));
      expect(toIndex('Pikachu')).toBeLessThan(toIndex('Raichu'));
      expect(names).toContain('Eevee');
    });

    it('should handle cards without evolution data', () => {
      const cards = [
        { id: '1', name: 'Pikachu', type: 'Electric' },
        { id: '2', name: 'Charizard', type: 'Fire' },
      ];
      expect(() => sortEvolutions(cards)).not.toThrow();
    });
  });

  describe('sortCards()', () => {
    it('should sort by name A→Z', () => {
      sortCards([...testCards], 'names-alpha');
      const names = Array.from(document.querySelectorAll('.card-tile p')).map(
        (el) => el.textContent,
      );
      expect(names).toEqual([
        'Charizard',
        'Charmander',
        'Charmeleon',
        'Eevee',
        'Ivysaur',
        'Pikachu',
        'Raichu',
        'Venusaur',
      ]);
    });

    it('should sort by name Z→A', () => {
      sortCards([...testCards], 'names-rev-alpha');
      const names = Array.from(document.querySelectorAll('.card-tile p')).map(
        (el) => el.textContent,
      );
      expect(names).toEqual([
        'Venusaur',
        'Raichu',
        'Pikachu',
        'Ivysaur',
        'Eevee',
        'Charmeleon',
        'Charmander',
        'Charizard',
      ]);
    });

    it('should sort by evolution', () => {
      sortCards([...testCards], 'evolution');
      const names = Array.from(document.querySelectorAll('.card-tile p')).map(
        (el) => el.textContent,
      );

      const toIndex = (name) => names.indexOf(name);
      expect(toIndex('Charmander')).toBeLessThan(toIndex('Charmeleon'));
      expect(toIndex('Charmeleon')).toBeLessThan(toIndex('Charizard'));
      expect(toIndex('Ivysaur')).toBeLessThan(toIndex('Venusaur'));
      expect(toIndex('Pikachu')).toBeLessThan(toIndex('Raichu'));
      expect(names).toContain('Eevee');
    });

    it('should sort by HP (ascending)', () => {
      sortCards([...testCards], 'hp');
      const hps = Array.from(document.querySelectorAll('.card-tile p')).map(
        (el) => testCards.find((c) => c.name === el.textContent)?.hp,
      );
      expect(hps).toEqual([35, 40, 40, 40, 50, 60, 100, 120]);
    });
  });

  describe('searchCards()', () => {
    it('should show all cards when search is empty', () => {
      searchCards([...testCards], '');
      const cards = document.querySelectorAll('.card-tile');
      expect(cards.length).toBe(testCards.length);
    });

    it('should find names by substring', () => {
      searchCards([...testCards], 'char');
      const names = Array.from(document.querySelectorAll('.card-tile p'))
        .map((el) => el.textContent)
        .sort();
      expect(names).toEqual(['Charizard', 'Charmander', 'Charmeleon']);
    });

    it('should be case insensitive', () => {
      searchCards([...testCards], 'PIKA');
      const names = Array.from(document.querySelectorAll('.card-tile p')).map(
        (el) => el.textContent,
      );
      expect(names).toEqual(['Pikachu']);
    });

    it('should return multiple matches with partial names', () => {
      searchCards([...testCards], 'saur');
      const names = Array.from(document.querySelectorAll('.card-tile p'))
        .map((el) => el.textContent)
        .sort();
      expect(names).toEqual(['Ivysaur', 'Venusaur']);
    });

    it('should return empty result when no match', () => {
      searchCards([...testCards], 'xyz');
      const cards = document.querySelectorAll('.card-tile');
      expect(cards.length).toBe(0);
    });

    it('should handle special characters in search', () => {
      const cards = [
        ...testCards,
        { id: '9', name: 'Porygon-Z', type: 'Normal', hp: 50 },
      ];
      searchCards(cards, 'porygon');
      const names = Array.from(document.querySelectorAll('.card-tile p')).map(
        (el) => el.textContent,
      );
      expect(names).toEqual(['Porygon-Z']);
    });

    it('should handle empty search term with spaces', () => {
      searchCards([...testCards], '   ');
      const cards = document.querySelectorAll('.card-tile');
      expect(cards.length).toBe(testCards.length);
    });
  });
});
