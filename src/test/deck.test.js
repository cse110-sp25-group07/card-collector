import { Deck } from '../data/deck';

describe('Deck class', () => {
  describe('constructor', () => {
    it('should set provided id, name, imageURL, and cardIds', () => {
      const props = {
        id: 'deck-123',
        name: 'My Deck',
        imageURL: '/img/deck.png',
        cardIds: ['c1', 'c2'],
      };
      const deck = new Deck(props);

      expect(deck.id).toBe('deck-123');
      expect(deck.name).toBe('My Deck');
      expect(deck.imageURL).toBe('/img/deck.png');
      expect(deck.cardIds).toEqual(['c1', 'c2']);
    });

    it('should generate a UUID id when none is provided', () => {
      const deck = new Deck({});

      expect(typeof deck.id).toBe('string');
      expect(deck.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(deck.name).toBe('');
      expect(deck.imageURL).toBeUndefined();
      expect(deck.cardIds).toEqual([]);
    });
  });

  describe('addCard()', () => {
    it('should add a new cardId if not already present', () => {
      const deck = new Deck({ cardIds: ['a'] });
      deck.addCard('b');
      expect(deck.cardIds).toEqual(['a', 'b']);
    });

    it('should not add duplicates', () => {
      const deck = new Deck({ cardIds: ['a'] });
      deck.addCard('a');
      expect(deck.cardIds).toEqual(['a']);
    });
  });

  describe('removeCard()', () => {
    it('should remove an existing cardId', () => {
      const deck = new Deck({ cardIds: ['x', 'y', 'z'] });
      deck.removeCard('y');
      expect(deck.cardIds).toEqual(['x', 'z']);
    });

    it('should do nothing if cardId not present', () => {
      const deck = new Deck({ cardIds: ['x'] });
      deck.removeCard('y');
      expect(deck.cardIds).toEqual(['x']);
    });
  });

  describe('toJSON()', () => {
    it('should output a plain object matching instance properties', () => {
      const props = {
        id: 'deck-A',
        name: 'Alpha',
        imageURL: '/deck/A.png',
        cardIds: ['cA', 'cB'],
      };
      const deck = new Deck(props);
      expect(deck.toJSON()).toEqual({
        id: 'deck-A',
        name: 'Alpha',
        imageURL: '/deck/A.png',
        cardIds: ['cA', 'cB'],
      });
    });
  });

  describe('static fromJSON()', () => {
    it('should create a Deck instance from a plain object', () => {
      const obj = {
        id: 'deck-xyz',
        name: 'Zeta',
        imageURL: '/z.png',
        cardIds: ['1', '2', '3'],
      };
      const deck = Deck.fromJSON(obj);

      expect(deck).toBeInstanceOf(Deck);
      expect(deck.id).toBe('deck-xyz');
      expect(deck.name).toBe('Zeta');
      expect(deck.imageURL).toBe('/z.png');
      expect(deck.cardIds).toEqual(['1', '2', '3']);
    });
  });
});
