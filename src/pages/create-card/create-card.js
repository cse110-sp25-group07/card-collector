import { Card } from '../../data/card.js';
import { addCard } from '../../data/indexedDB.js';

const form = document.getElementById('card-form');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
let imageURL = '';

//When an image is uploaded... change the image preview to that image
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    imageURL = URL.createObjectURL(file); //generates temp URL
    imagePreview.src = imageURL;
    imagePreview.style.display = 'block';
  }
});

// When the form is submitted, create a new card and store it in IndexedDB
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevents losing info from page reload

  const name = document.getElementById('card-name').value;
  const type = document.getElementById('card-type').value;
  const hp = parseInt(document.getElementById('card-hp').value);
  const evolution = document.getElementById('card-evolution').value;

  // Create a new Card object using the imported Card class
  const card = new Card({ name, imageURL, type, hp, evolution });

  try {
    await addCard(card.toJSON());
    alert('Card just saved succesfully.');
    form.reset();
    imagePreview.style.display = 'none';
    imageURL = '';
  } catch (error) {
    console.error('Failed to save card!! ->', error);
    alert('Error saving the card, check console');
  }
});
