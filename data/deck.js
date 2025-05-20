import { Card } from './card.js';

export class Deck {
    constructor() {
        this.cards = this.loadFromStorage();
    }

    addCard(card) {
        this.cards.push(card);
        this.saveToStorage();
    }

    removeCard(id) {
        this.cards = this.cards.filter(card => card.id !== id);
        this.saveToStorage();
    }

    getCard(id) {
        return this.cards.find(card => card.id === id);
    }

    saveToStorage() {
        localStorage.setItem('pokemonDeck', JSON.stringify(this.cards.map(card => card.toJSON())));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('pokemonDeck');
        if (!stored) return [];
        return JSON.parse(stored).map(Card.fromJSON);
    }

    clearDeck() {
        this.cards = [];
        localStorage.removeItem('pokemonDeck');
    }
}
