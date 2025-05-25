# ADR 4: INDEXEDDB PLAN

**Status:** Accepted
**Date:** 2025-05-21
**Deciders:** All members

## Context

The team needs to store the deck data, card data, and card images in a local format. The goal is to have a storage system that works efficiently and offline. Initially we were thinking about LocalStorage as that was all we were familiar with but after we quickly ran out of storage space we decided to make the switch to IndexedDB instead for a better alternative.

## Decision

**Switch from localStorage to IndexedDB:**

1. We need to open a branch and refactor existing code to use IndexedDB.

2. Any future code needs to be written with the limitations of localStorage vs. IndexedDB in mind.

## Consequences

**Pros:**

- We expand our storage space from 10MB to roughly 1GB.
- IndexedDB then allows us to solve the issue of how to store a large number of images locally.

**Cons:**

- IndexedDB is more complex and can slow the team down in their process to be able to use it effectively.
- IndexedDB can potentially open us to more bugs due to its complexity and also some bugs when it comes to which browser it's used in.
