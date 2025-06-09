# 6/08 Sprint 4

Meeting Time: 6/08

Meeting Location: Zoom

**Attendance:**
Ashton, Tanner, Jonathan, Guthry, Max, Karim, Graydon, Luis, Preity, Vish

---

### _Ashton & Karim_

- Karim: Worked with Ashton on discussing and agreeing potential designs and style for the card collecting site. What I did was I wrote the style that was needed for our index.html file that’s located at the root. Not only that, but I pushed what I did to our branch.
- Ashton: Worked with Ashton on discussing and agreeing potential designs and style for the card collecting site. What I did was I wrote the style that was needed for our index.html file that’s located at the root.

### _Luis, Eric, Jonathan_

- Jonathan: Put in work with final logisitics of app, began setting up groundwork for e2e tests, worked heavily on single card view (indexedDB integration)
- Luis:
  - Fixed card unit size to not be in pixels and use actual size measurements in height and width, enlarging the card
    Fixed concerns of the user not being able to edit their card name and not knowing which fields they are editing when managing a card

### _Preity, Tanner, Graydon_

- Tanner: Fully integrated card-grid and create-card with the rest of the app. Performed code reviews/merges for multiple teams' PRs. Fixed numerous errors in deck validation. Worked with Ashton on his major refactoring, fixed imports, integrations, and other bugs
- Graydon: Created card-grid.tests.js that has unit tests for the sort and search functions in card-grid.js. Tested all the functions to make sure that they worked properly
  Went through card-grid.js to clean up the code and make it look nicer. Also added exports for the functions tested in card-grid.tests.js (not sure if this needs to be there in the final submission)
- Preity: Improved Delete UX in card-grid.js:
  Replaced window.location.reload() with in-place DOM updates
  Preserved manage-mode state after delete
  Wrote 4 Integration Tests in integration.test.js:
  Covered card creation, deck updates, deletions, card fetch, and cross-deck isolation
  Used fake-indexeddb
  Branch: delete-ux-and-tests

### _Vish, Guthry, Max_

- Vish:
  Added a fallback UUID generator method for Card and Deck classes when crypto.randomUUID() is unavailable or fails in some case
  Improved deck management UI/UX:
  Implemented a back button in deckui.html and added styling/hover effects
  Refactored a lot of deckui.css for better responsiveness and layout
  Added a “bulk delete” feature in the deck view page, where users can select as many decks as they want to delete, and delete said decks. Used selectable <deck-display> type elements, and implemented a confirmation modal.
  Fixed deck management dashboard layout by replacing the old Manage button with a dropdown menu that follows the Miro UI layout, with “Create”, “Edit” and “Delete” options and their respective icons for the mobile view
  Added separate state for choosing which decks to edit and delete
  Set up deleteDeck from the database + UI refresh after successful deletion
  Added an empty state view, has its own “Create Deck” handler when no decks initially exist.
- Max
  - Fixed id parsing to align with indexedDB; added back button in edit page; manual test on deck view functionality.
    Guthry: Linked the decks in the deck view to go to their corresponding card-grid pages to view their cards on click. made minor change in card grid deck parsing for this to be functional.
