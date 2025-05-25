# ADR 4: PIPELINE-JSDOC PLAN

**Status:** Accepted
**Date:** 2025-05-22  
**Deciders:** All members

## Context

In the second phase of our pipeline we wanted to add onto the existing formatting, lint, and unit tests with a way to autogenerate documentation using JSDoc. At this point in time with our web app we don't feel ready to add e2e testing yet and it would be a time waster since we still are only working with rough drafts.

## Decision

**Pipeline Phase 2:**

1. Pull Request Approval: One person is required to approve a pull request (PR) before merging.

2. Code Review: Other team members will review the code for quality and provide comments to improve it.

3. Testing:

   - Jest Tests: Unit tests for ensuring that individual functions work as expected.
   - ESLint Check: To ensure the code is free of common issues and follows style guidelines.
   - Prettier Check: To maintain consistent file formatting.

4. Docs:
   - Upon any pushes to main (including merges) JSDoc documentation is automatically generated and pushed to the codebase

**Pipeline Phase 3:**

- Update Jest Tests: Expand testing coverage.
- End-to-End Testing (e2e): Introduce e2e testing for components to verify the full system's functionality.

## Consequences

**Pros:**

- Using JSDoc allows for easier documentation as it is automated.

**Cons:**

- It can take time for team members to learn and adapt to this form of commenting that allows JSDoc to generate said documentation.
