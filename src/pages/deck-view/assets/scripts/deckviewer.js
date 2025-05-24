import {Deck} from '../../../../data/deck.js';

customElements.define('deck-display', Deck);


//const decks = indexedDB.open("deck-collection");

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

// Starts the program, all function calls trace back here
function init() {
  customElements.whenDefined('deck-display').then(() => {


    // Get the recipes from localStorage
    let decks = getDecksFromStorage();
    // Add each recipe to the <main> element
    const exampleDeck = { id: 1, 
													name: "exampleDeck",
													cards: [] };

    decks.push(exampleDeck);



    addDeckstoDocument(decks);



    // Add the event listeners to the form elements
    //initFormHandler();
  });
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage for 'recipes', an empty array
 * is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
function getDecksFromStorage() {
  return [];
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} decks An array of recipes
 */
function addDeckstoDocument(decks) {
	// A10. TODO - Get a reference to the <main> element
	//const body = document.querySelector('body');
	const deckviewer = document.querySelector('#deck-viewer');
	// A11. TODO - Loop through each of the recipes in the passed in array,
	//            create a <recipe-card> element for each one, and populate
	//            each <recipe-card> with that recipe data using element.data = ...
	//            Append each element to <main>
	for (let i = 0;i < decks.length;i++){
		let deck = document.createElement('deck-display');
		deck.data = decks[i];
		deckviewer.append(deck);
	};
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} decks An array of recipes
 */
function saveRecipesToStorage(decks) {
	// EXPLORE - START (All explore numbers start with B)
	// B1. TODO - Complete the functionality as described in this function
	//            header. It is possible in only a single line, but should
	//            be no more than a few lines.
	localStorage.setItem('deckStorage',JSON.stringify(decks));
}

///**
 //* Adds the necessary event handlers to <form> and the clear storage
 //* <button>.
 //*/
//function initFormHandler() {
	//// B2. TODO - Get a reference to the <form> element
	//const formElement = document.querySelector('form');
	//// B3. TODO - Add an event listener for the 'submit' event, which fires when the
	////            submit button is clicked
	//formElement.addEventListener('submit', function () {
		//// Steps B4-B9 will occur inside the event listener from step B3
		//// B4. TODO - Create a new FormData object from the <form> element reference above
		//const formData = new FormData(formElement);
		//// B5. TODO - Create an empty object (we'll refer to this object as recipeObject to
		////            make this easier to read), and then extract the keys and corresponding
		////            values from the FormData object and insert them into recipeObject
		//let recipeObject = {};
		//for (const [key, value] of formData.entries()) {
			//recipeObject[key] = value;
			//console.log(JSON.stringify(recipeObject));
		//}

		//console.log(JSON.stringify(recipeObject));

		////recipeObject.FormData = formData;
		//// B6. TODO - Create a new <recipe-card> element
		//const recipeCardElement = document.createElement('recipe-card');
		//// B7. TODO - Add the recipeObject data to <recipe-card> using element.data
		//recipeCardElement.data = recipeObject;
		//// B8. TODO - Append this new <recipe-card> to <main>

		//const main = document.querySelector('main');
		//main.append(recipeCardElement);
		//// B9. TODO - Get the recipes array from localStorage, add this new recipe to it, and
		////            then save the recipes array back to localStorage
		//let recipes = JSON.parse(localStorage.getItem('recipes'));
		//if (recipes == null){
			//recipes = [];
		//}
			//recipes.push(recipeObject);
		//localStorage.setItem('recipes', JSON.stringify(recipes));
	//});
	//// B10. TODO - Get a reference to the "Clear Local Storage" button
	//let clearLocalStorageButton = document.querySelector('button.danger');

	//// B11. TODO - Add a click event listener to clear local storage button
	//clearLocalStorageButton.addEventListener('click', function () {
		//const main = document.querySelector('main');

		//// Steps B12 & B13 will occur inside the event listener from step B11
		//// B12. TODO - Clear the local storage
		//localStorage.clear();
		//// B13. TODO - Delete the contents of <main>
		//main.innerHTML = '';
	//});

//}
