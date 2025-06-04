import { Card } from '../../data/card.js';
import { addCard } from '../../data/indexedDB.js';

const cardElements = getElementsByClassName('card');
let editMode = false;

manageButton.addEventListener('click', async () => {
  if (editMode) {
    try {

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
