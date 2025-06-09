global.indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
  // You can mock more methods as needed
};
import {
  sortCards,
  sortAlpha,
  sortEvolutions,
  searchCards,
} from '../assets/js/pages/card-grid.js';

describe('Card Grid Search and Sort Tests', () => {
  // group of test cards (no need for images)
  const testCards = [
    { id: '1', name: 'Pikachu', type: 'Electric', hp: 40, evolution: 'Raichu' },
    { id: '2', name: 'Raichu', type: 'Electric', hp: 60, evolution: null },
    {
      id: '3',
      name: 'Charmeleon',
      type: 'Grass',
      hp: 50,
      evolution: 'Charizard',
    },
    { id: '4', name: 'Charizard', type: 'Grass', hp: 100, evolution: null },
    { id: '5', name: 'Venusaur', type: 'Grass', hp: 120, evolution: null },
    {
      id: '6',
      name: 'Charmander',
      type: 'Fire',
      hp: 35,
      evolution: 'Charmeleon',
    },
    { id: '7', name: 'Eevee', type: 'Normal', hp: 40, evolution: null },
    { id: '8', name: 'Ivysaur', type: 'Normal', hp: 40, evolution: 'Venusaur' },
  ];

  beforeAll(() => {
    document.body.innerHTML = `
      <button id="go-back"></button>
        <div id="card-grid-root"></div>
        <select id="sort-cards">
          <option value="default">Default</option>
          <option value="names-alpha">A-Z</option>
          <option value="names-rev-alpha">Z-A</option>
          <option value="evolution">Evolution</option>
          <option value="type">Type</option>
          <option value="hp">HP</option>
        </select>
        <input id="search-cards" type="text" />
      `;
  });

  describe('sortAlpha()', () => {
    it('should sort cards alphabetically', () => {
      const sorted = sortAlpha(testCards);
      //Sorts it alphabetically (a->z)
      expect(sorted[0].name).toBe('Charizard');
      expect(sorted[1].name).toBe('Charmander');
      expect(sorted[2].name).toBe('Charmeleon');
      expect(sorted[3].name).toBe('Eevee');
      expect(sorted[4].name).toBe('Ivysaur');
      expect(sorted[5].name).toBe('Pikachu');
      expect(sorted[6].name).toBe('Raichu');
      expect(sorted[7].name).toBe('Venusaur');
    });
  });

  //not a real function but mimics the logic used to sort rev in the js code
  describe('sortRevAlpha', () => {
    it('should sort cards reverse alphabetically', () => {
      const sorted = sortAlpha(testCards);
      sorted.reverse();
      //Sorts it reverese alphabetically (z->a)
      expect(sorted[0].name).toBe('Venusaur');
      expect(sorted[1].name).toBe('Raichu');
      expect(sorted[2].name).toBe('Pikachu');
      expect(sorted[3].name).toBe('Ivysaur');
      expect(sorted[4].name).toBe('Eevee');
      expect(sorted[5].name).toBe('Charmeleon');
      expect(sorted[6].name).toBe('Charmander');
      expect(sorted[7].name).toBe('Charizard');
    });
  });
  describe('sortEvolutions()', () => {
    it('should sort cards by evolution chain (with the base forms being in alpha order)', () => {
      const sorted = sortEvolutions(testCards);
      // Charmander -> Charmeleon -> Charizard
      expect(sorted[0].name).toBe('Charmander');
      expect(sorted[1].name).toBe('Charmeleon');
      expect(sorted[4].name).toBe('Venusaur');
      // Ivysaur -> Venusaur
      expect(sorted[3].name).toBe('Ivysaur');
      expect(sorted[4].name).toBe('Venusaur');
      // Pikachu -> Raichu
      expect(sorted[5].name).toBe('Pikachu');
      expect(sorted[6].name).toBe('Raichu');
    });

    it('should handle cards without evolutions', () => {
      const sorted = sortEvolutions(testCards);
      expect(sorted[7].name).toBe('Eevee');
      expect(sorted[4].name).toBe('Venusaur');
      expect(sorted[4].name).toBe('Venusaur');
    });
  });

  //tests for the different sorts (alpha, rev alpha, evolution, type, hp)
  describe('sortCards()', () => {
    beforeEach(() => {
      document.getElementById('card-grid-root').innerHTML = '';
    });

    it('should sort alpha (a->z)', () => {
      sortCards(testCards, 'names-alpha');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual([
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

    it('should sort reverse alphabetically (z->a)', () => {
      sortCards(testCards, 'names-rev-alpha');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual([
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

    it('should sort cards by evolution chain (with the base forms being in alpha order)', () => {
      sortCards(testCards, 'evolution');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual([
        'Charmander',
        'Charmeleon',
        'Charizard',
        'Ivysaur',
        'Venusaur',
        'Pikachu',
        'Raichu',
        'Eevee',
      ]);
    });

    it('sorts by type', () => {
      sortCards(testCards, 'type');
      const displayedTypes = Array.from(
        document.querySelectorAll('.card-tile img'),
      ).map((el) => el.alt);
      // sorts alpha by type (Electric, Fire, Grass, Normal)
      expect(displayedTypes).toEqual([
        'Pikachu',
        'Raichu',
        'Charmander',
        'Charizard',
        'Charmeleon',
        'Venusaur',
        'Eevee',
        'Ivysaur',
      ]);
    });

    it('should sort by HP (lowest -> highest)', () => {
      sortCards(testCards, 'hp');
      const displayedHPs = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => {
        const cardName = el.textContent;
        return testCards.find((c) => c.name === cardName).hp;
      });
      expect(displayedHPs).toEqual([35, 40, 40, 50, 60, 100, 120]);
    });
  });

  //to test the search function
  describe('searchCards()', () => {
    beforeEach(() => {
      document.getElementById('card-grid-root').innerHTML = '';
    });

    it('should show all cards when search term is empty', () => {
      searchCards(testCards, '');
      const displayedCards = document.querySelectorAll('.card-tile');
      expect(displayedCards.length).toBe(testCards.length);
    });

    it('should be able to search by a substring', () => {
      searchCards(testCards, 'char');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual(['Charmeleon', 'Charizard', 'Charmander']);
    });

    it('should be to sort without case sensitivity', () => {
      searchCards(testCards, 'PIKA');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual(['Pikachu']);
    });

    it('should be to sort without case sensitivity', () => {
      searchCards(testCards, 'pika');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual(['Pikachu']);
    });

    it('should return multiple matches and be able to search by any part of the name', () => {
      searchCards(testCards, 'saur');
      const displayedNames = Array.from(
        document.querySelectorAll('.card-tile p'),
      ).map((el) => el.textContent);
      expect(displayedNames).toEqual(['Venusaur', 'Ivysaur']);
    });

    it('should return empty when no matches found', () => {
      searchCards(testCards, 'xyz');
      const displayedCards = document.querySelectorAll('.card-tile');
      expect(displayedCards.length).toBe(0);
    });
  });
});
