document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const deckNameInput = document.getElementById('deckName')
  const deckTypeSelect = document.getElementById('deckType')
  const deckBackImageInput = document.getElementById('deckBackImage')
  const backPreviewImg = document.getElementById('backPreview')
  const cardImagesInput = document.getElementById('cardImages')
  const cardPreviewContainer = document.getElementById('cardPreviewContainer')
  const selectAllBtn = document.getElementById('selectAll')
  const deselectAllBtn = document.getElementById('deselectAll')
  const selectedCountSpan = document.getElementById('selectedCount')
  const saveDeckBtn = document.getElementById('saveDeck')
  const clearFormBtn = document.getElementById('clearForm')
  const notification = document.getElementById('notification')

  // State
  let uploadedCards = []
  let selectedCards = new Set()
  let deckBackImageData = null

  // Initialize from local storage if available
  initFromLocalStorage()

  // Event Listeners
  deckBackImageInput.addEventListener('change', handleBackImageUpload)
  cardImagesInput.addEventListener('change', handleCardImagesUpload)
  selectAllBtn.addEventListener('click', selectAllCards)
  deselectAllBtn.addEventListener('click', deselectAllCards)
  saveDeckBtn.addEventListener('click', saveDeck)
  clearFormBtn.addEventListener('click', clearForm)

  // Handle drag and drop for card images
  cardPreviewContainer.addEventListener('dragover', function (e) {
    e.preventDefault()
    cardPreviewContainer.classList.add('drag-over')
  })

  cardPreviewContainer.addEventListener('dragleave', function () {
    cardPreviewContainer.classList.remove('drag-over')
  })

  cardPreviewContainer.addEventListener('drop', function (e) {
    e.preventDefault()
    cardPreviewContainer.classList.remove('drag-over')

    if (e.dataTransfer.files.length > 0) {
      handleCardImagesUpload({ target: { files: e.dataTransfer.files } })
    }
  })

  // Functions
  function handleBackImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function (event) {
      backPreviewImg.src = event.target.result
      deckBackImageData = event.target.result
    }
    reader.readAsDataURL(file)
  }

  function handleCardImagesUpload(e) {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (files.length === 0) {
      showNotification('No valid image files selected')
      return
    }

    // Remove "no cards" message if it exists
    const noCardsMsg = cardPreviewContainer.querySelector('.no-cards')
    if (noCardsMsg) {
      cardPreviewContainer.removeChild(noCardsMsg)
    }

    // Process each file
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = function (event) {
        const cardData = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          imageData: event.target.result,
        }

        uploadedCards.push(cardData)
        addCardPreview(cardData)
        updateSelectedCount()
      }
      reader.readAsDataURL(file)
    })

    // Clear the input to allow uploading the same files again
    cardImagesInput.value = ''
  }

  function addCardPreview(cardData) {
    const cardPreviewDiv = document.createElement('div')
    cardPreviewDiv.className = 'card-preview'
    cardPreviewDiv.dataset.cardId = cardData.id

    const cardImg = document.createElement('img')
    cardImg.src = cardData.imageData
    cardImg.alt = cardData.name

    cardPreviewDiv.appendChild(cardImg)
    cardPreviewContainer.appendChild(cardPreviewDiv)

    // Add click event to toggle selection
    cardPreviewDiv.addEventListener('click', function () {
      toggleCardSelection(cardData.id, cardPreviewDiv)
    })
  }

  function toggleCardSelection(cardId, cardElement) {
    if (selectedCards.has(cardId)) {
      selectedCards.delete(cardId)
      cardElement.classList.remove('selected')
    } else {
      selectedCards.add(cardId)
      cardElement.classList.add('selected')
    }
    updateSelectedCount()
  }

  function selectAllCards() {
    uploadedCards.forEach((card) => {
      selectedCards.add(card.id)
      const cardElement = document.querySelector(
        `.card-preview[data-card-id="${card.id}"]`,
      )
      if (cardElement) {
        cardElement.classList.add('selected')
      }
    })
    updateSelectedCount()
  }

  function deselectAllCards() {
    selectedCards.clear()
    document.querySelectorAll('.card-preview').forEach((card) => {
      card.classList.remove('selected')
    })
    updateSelectedCount()
  }

  function updateSelectedCount() {
    selectedCountSpan.textContent = `${selectedCards.size} cards selected`
  }

  function saveDeck() {
    const deckName = deckNameInput.value.trim()

    if (!deckName) {
      showNotification('Please enter a deck name')
      return
    }

    if (selectedCards.size === 0) {
      showNotification('Please select at least one card')
      return
    }

    // Create deck object
    const deck = {
      id: Date.now().toString(),
      name: deckName,
      type: deckTypeSelect.value,
      backImage: deckBackImageData,
      cards: uploadedCards.filter((card) => selectedCards.has(card.id)),
      createdAt: new Date().toISOString(),
    }

    // Save to local storage
    saveToLocalStorage(deck)

    showNotification(`Deck "${deckName}" saved successfully!`)

    // Optional: Clear form after saving
    // clearForm();
  }

  function saveToLocalStorage(deck) {
    // Get existing decks or initialize empty array
    const existingDecks = JSON.parse(localStorage.getItem('cardDecks') || '[]')

    // Add new deck
    existingDecks.push(deck)

    // Save back to local storage
    localStorage.setItem('cardDecks', JSON.stringify(existingDecks))

    // Save current form state for resuming later
    saveFormState()
  }

  function saveFormState() {
    const formState = {
      deckName: deckNameInput.value,
      deckType: deckTypeSelect.value,
      backImage: deckBackImageData,
      uploadedCards: uploadedCards,
      selectedCards: Array.from(selectedCards),
    }

    localStorage.setItem('deckFormState', JSON.stringify(formState))
  }

  function initFromLocalStorage() {
    const formState = JSON.parse(localStorage.getItem('deckFormState'))

    if (!formState) return

    // Restore form values
    deckNameInput.value = formState.deckName || ''
    deckTypeSelect.value = formState.deckType || 'pokemon'

    if (formState.backImage) {
      backPreviewImg.src = formState.backImage
      deckBackImageData = formState.backImage
    }

    // Restore uploaded cards
    if (formState.uploadedCards && formState.uploadedCards.length > 0) {
      uploadedCards = formState.uploadedCards

      // Remove "no cards" message
      const noCardsMsg = cardPreviewContainer.querySelector('.no-cards')
      if (noCardsMsg) {
        cardPreviewContainer.removeChild(noCardsMsg)
      }

      // Add card previews
      uploadedCards.forEach((card) => {
        addCardPreview(card)
      })
    }

    // Restore selected cards
    if (formState.selectedCards && formState.selectedCards.length > 0) {
      selectedCards = new Set(formState.selectedCards)

      // Update UI to show selected cards
      selectedCards.forEach((cardId) => {
        const cardElement = document.querySelector(
          `.card-preview[data-card-id="${cardId}"]`,
        )
        if (cardElement) {
          cardElement.classList.add('selected')
        }
      })

      updateSelectedCount()
    }
  }

  function clearForm() {
    deckNameInput.value = ''
    deckTypeSelect.value = 'pokemon'
    backPreviewImg.src = 'assets/images/deckplaceholder.png'
    deckBackImageData = null

    // Clear card previews
    cardPreviewContainer.innerHTML =
      '<p class="no-cards">No cards uploaded yet. Upload images to see previews.</p>'

    // Reset state
    uploadedCards = []
    selectedCards.clear()
    updateSelectedCount()

    // Clear local storage form state
    localStorage.removeItem('deckFormState')

    showNotification('Form cleared')
  }

  function showNotification(message) {
    notification.textContent = message
    notification.classList.add('show')

    setTimeout(() => {
      notification.classList.remove('show')
    }, 3000)
  }
})
