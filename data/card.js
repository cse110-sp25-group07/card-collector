export class Card {
    // constructor creates card object based on image we created
    constructor({ id, name, imageURL, type, hp, evolution }) {
        this.id = id || crypto.randomUUID();
        this.name = name;
        this.imageURL = imageURL;
        this.type = type;
        this.hp = hp;
        this.evolution = evolution;
    }

    // converts object to JSON to store in localStorage
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            imageURL: this.imageURL,
            type: this.type,
            hp: this.hp,
            evolution: this.evolution 
        };
    }

    static fromJSON(json) {
        return new Card(json);
    }

}