import { Card } from '../../data/card.js';
import { addCard } from '../../data/indexedDB.js';

const selectedCard = new Card({
  name: 'Umbreon',
  imageURL:
    'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSHP/SWSHP_EN_SWSH129.png',
  type: 'Dark',
  hp: '110',
  evolution: 'Stage 1',
});

const manageButton = document.getElementsByClassName('manage-button')[0];
const cardInformation = document.getElementById('card-information');
const manageCardInformation = document.getElementById(
  'manage-card-information',
);

let editMode = false;

manageButton.addEventListener('click', async () => {
  if (editMode) {
    try {
      selectedCard.name =
        document.getElementsByClassName('card-name-input')[0].value;
      selectedCard.type =
        document.getElementsByClassName('card-types-input')[0].value;
      // selectedCard.rarity = document.getElementsByClassName('card-rarity-input')[0].value;
      // selectedCard.generation = document.getElementsByClassName('card-generation-input')[0].value;

      await addCard(selectedCard.toJSON());
    } catch (error) {
      console.error('Failed to save card! ->', error);
      alert('Error saving the card, check console');
    }
  }

  ToggleEditMode();
});

function ToggleEditMode() {
  editMode = !editMode;

  manageButton.innerHTML = editMode ? 'Confirm' : 'Manage';
  cardInformation.style.display = editMode ? 'none' : 'block';
  manageCardInformation.style.display = editMode ? 'block' : 'none';

  document.getElementsByClassName('card-name-input')[0].value =
    selectedCard.name;
  document.getElementsByClassName('card-types-input')[0].value =
    selectedCard.type;
  document.getElementsByClassName('card-rarity-input')[0].value = 'N/A';
  document.getElementsByClassName('card-generation-input')[0].value = 'N/A';
}
