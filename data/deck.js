import { Card } from './card.js';

export class Deck {
    //creates deck based on id, name, and card array that we will fill with card objects
    constructor({ id = crypto.randomUUID(), name = '', cards = [] }) {
        this.id = id;
        this.name = name;
        this.cards = cards.map(card => card instanceof Card ? card : new Card(card));
    }

    //adds a card to the deck
    addCard(card) {
        this.cards.push(card);
        this.saveToStorage();
    }

    //removes card from the deck
    removeCard(id) {
        this.cards = this.cards.filter(card => card.id !== id);
        this.saveToStorage();
    }

    //returns a specific card
    getCard(id) {
        return this.cards.find(card => card.id === id);
    }

    //saves the deck to localStorage
    saveToStorage() {
        localStorage.setItem(`deck-${this.id}`, JSON.stringify(this.cards.map(card => card.toJSON())));
    }

    //returns the deck from local storage
    loadFromStorage() {
        const stored = localStorage.getItem(`deck-${this.id}`);
        if (!stored) return [];
        return JSON.parse(stored).map(Card.fromJSON);
    }

    //removes the whole deck
    clearDeck() {
        this.cards = [];
        localStorage.removeItem(`deck-${this.id}`);
    }
}
