# ADR 2: BRANCHING STRATEGY

**Status:** [Accepted / **Proposed** / Deprecated]  
**Date:** 2025-05-11  
**Deciders:** All members

## Context  
Researched different Git branching strategies for our team project. Git Flow felt too heavy for our timeline, and Trunk-Based Development seemed risky for a student team without automated testing. We want a simple way to manage parallel work and avoid conflicts.

## Decision  
We will benefit from using Feature Branching. Each new feature or fix will be created in a separate branch off main and merged via Pull Requests once reviewed. 

## Consequences  
-Work will be organized and isolated, making collaboration easier.  
-We'll avoid merge conflicts and improve code quality through PRs.  
-Main will always be stable.  
-With this, we give up the structure of Git Flow and must stay disciplined with syncing and testing before merges.