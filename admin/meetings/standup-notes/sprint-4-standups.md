# 6/1-6/8 Sprint 4 Standup Notes

## Sprint 4 Standup Notes:

### UI & Styling/Navigation & Page Integration(Frontend)

- Whole Repository and Source Code Coverage

**Members:**

- Ashton:

  - Accomplished: Created global styling in test page, improved on Karim's navbar, put global styling in each page, updated documents to synchronize with code, tested each component/page thoroughly to fit uniform style of UI and also that things worked properly
  - To-do: Final bug fixes, work with Tanner on final videos
  - Blockers: None

- Karim:
  - Accomplished: Worked with Ashton on discussing and agreeing potential designs and style for the card collecting site. What I did was I wrote the style that was needed for our index.html file that’s located at the root.
  - To-do: Write tests, help out where needed
  - Blockers: None

### UI for each card component on Card Component Page (single Card Page)

- Display a card and its fields

**Members:**

- Luis: Fixed card unit size to not be in pixels and use actual size measurements in height and width, enlarging the card
  Fixed concerns of the user not being able to edit their card name and not knowing which fields they are editing when managing a card
- Jonathan:
  - Accomplished: Put in work with final logisitics of app, began setting up groundwork for e2e tests, worked heavily on single card view (indexedDB integration)
  - To-do: Finish e2e tests
  - Blockers: None

### View All Cards (Frontend & Backend)

- UI to view and sort through cards

**Members:**

- Preity: Improved Delete UX in card-grid.js:
  Replaced window.location.reload() with in-place DOM updates
  Preserved manage-mode state after delete
  Wrote 4 Integration Tests in integration.test.js:
  Covered card creation, deck updates, deletions, card fetch, and cross-deck isolation
  Used fake-indexeddb
  Branch: delete-ux-and-tests

- Tanner
  - Accomplished: Fully integrated card-grid and create-card with the rest of the app. Performed code reviews/merges for multiple teams' PRs. Fixed numerous errors in deck validation. Worked with Ashton on his major refactoring, fixed imports, integrations, and other bugs
  - To-do: Final polish, bug fixes, work with Asthon on final videos.
  - Blockers: None.
- Graydon
  - Accomplished: Created card-grid.tests.js that has unit tests for the sort and search functions in card-grid.js. Tested all the functions to make sure that they worked properly
    Went through card-grid.js to clean up the code and make it look nicer. Also added exports for the functions tested in card-grid.tests.js (not sure if this needs to be there in the final submission)
  - To-do: None
  - Blockers: None

### Create Deck Feature (Page) – Frontend & Backend

- Visualize card deck

**Members:**

- Vishruth: Added a fallback UUID generator method for Card and Deck classes when crypto.randomUUID() is unavailable or fails in some case
  Improved deck management UI/UX:
  Implemented a back button in deckui.html and added styling/hover effects
  Refactored a lot of deckui.css for better responsiveness and layout
  Added a “bulk delete” feature in the deck view page, where users can select as many decks as they want to delete, and delete said decks. Used selectable <deck-display> type elements, and implemented a confirmation modal.
  Fixed deck management dashboard layout by replacing the old Manage button with a dropdown menu that follows the Miro UI layout, with “Create”, “Edit” and “Delete” options and their respective icons for the mobile view
  Added separate state for choosing which decks to edit and delete
  Set up deleteDeck from the database + UI refresh after successful deletion
  Added an empty state view, has its own “Create Deck” handler when no decks initially exist.

- Guthry: Linked the decks in the deck view to go to their corresponding card-grid pages to view their cards on click. made minor change in card grid deck parsing for this to be functional.

- Max:
  - Accomplished: Fixed id parsing to align with indexedDB; added back button in edit page; manual test on deck view functionality.
  - To-do: None
  - Blockers: None
