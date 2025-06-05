# 5/25-6/1 Sprint 3 Standup Notes

## Sprint 3 Standup Notes:

### UI & Styling/Navigation & Page Integration(Frontend)

- Whole Repository and Source Code Coverage

**Members:**

- Ashton:

  - Accomplished: Worked with Karim on implementing styling, settled on and documented color palette for the website, also devised a new folder structure for the website so it can be cleaner and a true MPA
  - To-do: implement it into all the pages of the website and integrate features
  - Blockers: Waiting on other features to be fleshed out and merged to restructure

- Karim:
  - Accomplished: Worked with Ashton on discussing and agreeing potential designs and style for the card collecting site. What I did was I wrote the style that was needed for our index.html file that’s located at the root.
  - To-do: Implement the styles for each of the required files needed in order for our site to be visually appealing for the users and match with the theme. Also, maybe update the figma site if there’s changes needed.
  - Blockers: Waiting on other features to be fleshed out and merged to restructure

### UI for each card component on Card Component Page (single Card Page)

- Display a card and its fields

**Members:**

- Luis
- Eric
- Jonathan:
  - Accomplished: Pushed basic single card edit view
  - To-do: Integrating single card editing to rest of project
  - Blockers:Some of the card data doesn't line up or is missing some stuff. Obtaining the currently selected card. Need to check with Luis for styling

### View All Cards (Frontend & Backend)

- UI to view and sort through cards

**Members:**

- Preity
- Tanner
  - Accomplished: The card grid now loads and displays only the cards associated with the selected deck. Additionally, I implemented delete functionality for individual cards.
  - To-do: Integration, my team needs to finish making “create-card” deck aware
  - Blockers: Could not get testing working without locally installing fake-idb and idb. This means the unit test/integration test i designed cannot be run with our npm run test by default, so I had to disable it. The UI for deleting cards that I designed is not very user friendly, when you refresh page, all the delete button go away. (and page refreshes every time you delete a card)
- Graydon
  - Accomplished: Implemented the functionality for searching and sorting in a deck-view
  - To-do: Implement the Go Back and Create buttons, change delete button and edit button to match overall css theme
  - Blockers: Create unit tests to show that the search and sort function work in a wide variety of scenarios Need to make sure the app looks good on both mobile and desktop

### Create Deck Feature (Page) – Frontend & Backend

- Visualize card deck

**Members:**

- Vishruth: Created deck-management.html, script.js, style.css in /src/pages/deck-management , updated script.js in /src/pages/create-deck , and updated indexDB.js in /src/data
- Guthry: Created grid to display the deck displays, pulls all decks from indexedDB storage using getAllDecks() from src/data/indexedDB.js,
- Max:
  - Accomplished: Implemented the deck view page with Guthry. Vish implemented the menu button for creating, editing, and deleting decks.
  - To-do: Integrate deck menu button done by Vish into deck view page, and test the functionality of deck view and management. Add link for clicking the deck
  - Blockers: Auto checker issue. Decide whether to keep deck attribute: category (not in indexedDB)
