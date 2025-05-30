import { getAllDecks, deleteDeck } from '../../data/indexedDB.js';
import { Deck } from '../../data/deck.js';

document.addEventListener('DOMContentLoaded', () => {
    // dom elements
    const deckDisplay = document.querySelector('.deck-display');
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const createDeckBtn = document.getElementById('create-deck-btn');
    const editDeckBtn = document.getElementById('edit-deck-btn');
    const deleteDeckBtn = document.getElementById('delete-deck-btn');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');

    let selectedDeckId = null;

    // initialize
    loadDecks();

    // event listeners for menu
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.deck-controls')) {
            dropdownMenu.style.display = 'none';
        }
    });

    // event listeners for buttons
    createDeckBtn.addEventListener('click', () => {
        window.location.href = '../create-deck/deckui.html';
    });

    editDeckBtn.addEventListener('click', () => {
        if (selectedDeckId) {
            window.location.href = `../create-deck/deckui.html?edit=${selectedDeckId}`;
        }
    });

    deleteDeckBtn.addEventListener('click', () => {
        if (selectedDeckId) {
            deleteModal.classList.add('show');
        }
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (selectedDeckId) {
            try {
                await deleteDeck(selectedDeckId);
                deleteModal.classList.remove('show');
                loadDecks(); // refresh the deck display
                selectedDeckId = null;
                updateButtonStates();
            } catch (error) {
                console.error('Error deleting deck:', error);
                alert('Failed to delete deck. Please try again.');
            }
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('show');
    });

    // close modal when clicking outside
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('show');
        }
    });

    async function loadDecks() {
        try {
            const decks = await getAllDecks();
            displayDecks(decks);
        } catch (error) {
            console.error('Error loading decks:', error);
            deckDisplay.innerHTML = '<p class="error">Error loading decks. Please refresh the page.</p>';
        }
    }

    function displayDecks(decks) {
        if (!decks || decks.length === 0) {
            deckDisplay.innerHTML = '<p class="empty-state">No decks found. Create your first deck!</p>';
            return;
        }

        deckDisplay.innerHTML = '';
        const deckGrid = document.createElement('div');
        deckGrid.className = 'deck-grid';

        decks.forEach(deckData => {
            const deck = new Deck(deckData);
            const deckElement = createDeckElement(deck);
            deckGrid.appendChild(deckElement);
        });

        deckDisplay.appendChild(deckGrid);
    }

    function createDeckElement(deck) {
        const element = document.createElement('div');
        element.className = 'deck-item';
        element.dataset.deckId = deck.id;
        
        element.innerHTML = `
            <img src="${deck.imageURL}" alt="${deck.name}" class="deck-thumbnail">
            <h3>${deck.name}</h3>
            <p>${deck.cardIds.length} cards</p>
        `;

        element.addEventListener('click', () => {
            // remove selection from other decks
            document.querySelectorAll('.deck-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // select this deck
            element.classList.add('selected');
            selectedDeckId = deck.id;
            updateButtonStates();
        });

        return element;
    }

    function updateButtonStates() {
        const hasSelection = Boolean(selectedDeckId);
        editDeckBtn.disabled = !hasSelection;
        deleteDeckBtn.disabled = !hasSelection;
    }
}); 