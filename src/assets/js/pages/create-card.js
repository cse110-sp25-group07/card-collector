import { Card } from '../data/card.js';
import { addCard, getDeckById, updateDeck } from '../data/indexedDB.js';

const form = document.getElementById('card-form');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const backButton = document.getElementById('back-button');
let imageURL = '';

//Grab deckId from the URL
const urlParams = new URLSearchParams(window.location.search);
const deckId = urlParams.get('deckId');

//Helper function for base64 image encoding
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // this gives base64 encoded string
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//Function for user feedback
function showFeedbackMessage(message, isError = false) {
  const messageEl = document.getElementById('feedback-message');
  messageEl.textContent = message;
  messageEl.className = 'feedback-message';
  messageEl.classList.add(isError ? 'feedback-error' : 'feedback-success');
  messageEl.style.display = 'block';

  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}
// Immediately check for a valid deck before doing anything else
(async function verifyDeck() {
  // No deckId at all
  if (!deckId) {
    form.style.display = 'none';
    showFeedbackMessage(
      'No deck selected. Please go back and choose a deck first.',
      true
    );
    return;
  }

  // Deck ID exists but doesn’t actually match a stored deck
  const deck = await getDeckById(deckId);
  if (!deck) {
    form.style.display = 'none';
    showFeedbackMessage(
      'Deck not found. Please use a valid deck link.',
      true
    );
    return;
  }
})();
//When an image is uploaded... change the image preview to that image
imageUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    imageURL = await toBase64(file);
    imagePreview.src = imageURL;
    imagePreview.style.display = 'block';
  }
});

backButton.addEventListener('click', () => {
  window.location.href = `/src/pages/card-grid.html?deckId=${deckId}`;
});

// When the form is submitted, create a new card and store it in IndexedDB
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevents losing info from page reload

  if (!deckId) {
    showFeedbackMessage(
      'You currently have no deck selected, access your decks from the deck view.',
      true,
    );
    return;
  }

  const deck = await getDeckById(deckId);
  if (!deck) {
    showFeedbackMessage('Deck not found. Please use valid deck link.', true);
    return;
  }

  const name = document.getElementById('card-name').value;
  const type = document.getElementById('card-type').value;
  const hp = parseInt(document.getElementById('card-hp').value);
  const evolution = document.getElementById('card-evolution').value;

  // Create a new Card object using the imported Card class
  const card = new Card({ name, imageURL, type, hp, evolution });

  try {
    const id = await addCard(card.toJSON()); //Adding card to general store

    if (deckId) {
      const deck = await getDeckById(deckId);
      if (deck) {
        deck.cardIds.push(id);
        await updateDeck(deck);
      }
    }

    console.log('Card saved successfully');
    showFeedbackMessage('Card saved successfully!');
    form.reset();
    imagePreview.style.display = 'none';
    imageURL = '';
  } catch (error) {
    console.error('Failed to save card!! ->', error);
    showFeedbackMessage('Failed to save card, check console.', true);
  }
});
