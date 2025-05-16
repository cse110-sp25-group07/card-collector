# ADR 4: PIPELINE PLAN

**Status:** [Accepted / **Proposed** / Deprecated]  
**Date:** 2025-05-11  
**Deciders:** All members

## Context  

The team needs to set up a robust development pipeline for the project. The goal is to ensure that code is thoroughly reviewed, tested, and formatted before merging into the main branch. In the first phase, we want to enforce code quality, maintain consistency, and prevent bugs. We also want to allow for manual code review to ensure good practices. In Phase 2, we'll expand our testing to include end-to-end (e2e) tests for components.


## Decision  

**Pipeline Phase 1:**
1. Pull Request Approval: One person is required to approve a pull request (PR) before merging.

2. Code Review: Other team members will review the code for quality and provide comments to improve it.

3. Testing:
    - Jest Tests: Unit tests for ensuring that individual functions work as expected.
    - ESLint Check: To ensure the code is free of common issues and follows style guidelines.
    - Prettier Check: To maintain consistent file formatting.


**Pipeline Phase 2:**

- Update Jest Tests: Expand testing coverage.
- End-to-End Testing (e2e): Introduce e2e testing for components to verify the full system's functionality.


## Consequences  

**Pros:**
- Reviews will improve collaboration and code quality
- Using Jest for function tests and ESLint/Prettier will help catch bugs early and maintain clean code

**Cons:**
- Team members will need to be diligent in following the process to avoid delays
- Process will slow down development in the short term due to the additional review and testing steps