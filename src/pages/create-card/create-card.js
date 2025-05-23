import { Card } from '../../card.js';

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

// When the form is submitted, create a new card and store it in localStorage
form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevents losing info from page reload

  const name = document.getElementById('card-name').value;
  const type = document.getElementById('card-type').value;
  const hp = parseInt(document.getElementById('card-hp').value);
  const evolution = document.getElementById('card-evolution').value;

  // Create a new Card object using the imported Card class
  const card = new Card({ name, imageURL, type, hp, evolution });

  // Retrieve existing cards array from localStorage, or create a new one.
  let cards = JSON.parse(localStorage.getItem('cards')) || [];

  // Add the new card to the array
  cards.push(card.toJSON());

  // Save this array back to localStorage
  localStorage.setItem('cards', JSON.stringify(cards));

  //Resetting form after card creation
  alert('TESTING: Card saved');
  form.reset();
  imagePreview.style.display = 'none';
});
