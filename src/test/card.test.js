import { Card } from '../assets/js/data/card';

describe('Card class', () => {
  describe('constructor', () => {
    it('should set all provided properties', () => {
      const props = {
        id: 'custom-id',
        name: 'Pikachu',
        imageURL: 'http://img.url/pika.png',
        type: 'Electric',
        hp: 60,
        evolution: 'Basic',
      };
      const card = new Card(props);

      expect(card.id).toBe('custom-id');
      expect(card.name).toBe('Pikachu');
      expect(card.imageURL).toBe('http://img.url/pika.png');
      expect(card.type).toBe('Electric');
      expect(card.hp).toBe(60);
      expect(card.evolution).toBe('Basic');
    });

    it('should generate a random UUID if no id is provided', () => {
      const props = { name: 'Bulbasaur' };
      const card = new Card(props);

      expect(typeof card.id).toBe('string');

      expect(card.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(card.name).toBe('Bulbasaur');
    });

    it('should allow undefined optional fields', () => {
      const card = new Card({ id: '123' });
      expect(card.id).toBe('123');
      expect(card.name).toBeUndefined();
      expect(card.imageURL).toBeUndefined();
      expect(card.type).toBeUndefined();
      expect(card.hp).toBeUndefined();
      expect(card.evolution).toBeUndefined();
    });
  });

  describe('toJSON()', () => {
    it('should return a plain object matching the instance properties', () => {
      const props = {
        id: 'xyz-789',
        name: 'Charmander',
        imageURL: '/images/char.png',
        type: 'Fire',
        hp: 50,
        evolution: 'Basic',
      };
      const card = new Card(props);
      const json = card.toJSON();

      expect(json).toEqual({
        id: 'xyz-789',
        name: 'Charmander',
        imageURL: '/images/char.png',
        type: 'Fire',
        hp: 50,
        evolution: 'Basic',
      });
    });
  });

  describe('static fromJSON()', () => {
    it('should create an equivalent Card instance from JSON', () => {
      const original = new Card({
        id: 'from-json-id',
        name: 'Squirtle',
        imageURL: '/images/squir.png',
        type: 'Water',
        hp: 55,
        evolution: 'Basic',
      });
      const json = original.toJSON();
      const reconstructed = Card.fromJSON(json);

      expect(reconstructed).toBeInstanceOf(Card);

      expect(reconstructed).toEqual(original);
    });

    it('should accept a plain object literal too', () => {
      const plain = {
        id: 'plain-id',
        name: 'Eevee',
        imageURL: '/images/eevee.png',
        type: 'Normal',
        hp: 45,
        evolution: 'Basic',
      };
      const card = Card.fromJSON(plain);

      expect(card).toBeInstanceOf(Card);
      expect(card.id).toBe('plain-id');
      expect(card.name).toBe('Eevee');
      expect(card.imageURL).toBe('/images/eevee.png');
      expect(card.type).toBe('Normal');
      expect(card.hp).toBe(45);
      expect(card.evolution).toBe('Basic');
    });
  });
});
