# ADR 7: BULK IMAGE FEATURE

**Status:** Accepted
**Date:** 2025-05-25  
**Deciders:** Ashton, Max, Tanner

## Context

Card collectors often want to upload many cards at once rather than adding them individually. In fact, the ability to just upload a large card deck might be more important to some collectors than sorting/filtering. Max explored this bulk image feature that allows users to upload multiple images at once, select which ones to include, and then generate a deck using those. Max implemented this as a part of the create deck page, and recently integrated the IndexedDB storage and cleaned up the UI.

## Decision

We decided to include bulk image upload as a core feature on the Create Deck page. The pipeline allows users to:

- Upload multiple card images at the same time
- Preview and select and subset or all of them
- Save the selected cards to the IndexedDB
- Automatically create a new deck from those selected card IDs

## Consequences

**Pros:**

- Speeds up deck creation, especially for large collections (creating one by one might be a dealbreaker for some collectors)
- Can be used in combination with editing cards for the full sorting and filtering

**Cons:**

- More complexity
- Cards have blank fields which need to be dealt with for decks with a combination of blank fields and filled fields when sorting/filtering
