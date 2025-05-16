# ADR 3: Coding Formatting and Guidelines 

**Status:** [Accepted / **Proposed** / Deprecated]  

**Date:** 2025-05-07

**Deciders:** Preity Singh & Rest of Team

## Context
As our team collaborates on this project, it's important that our codebase remains readable, maintainable, and consistent. Without consistent and agreed-upon formatting and style guidelines, our work could become disorganized, hard to debug, and more difficult to extend or hand off.

## Decision
**Code Style:**
- We are implementing Google’s Java Style Guide. https://google.github.io/styleguide/javaguide.html
- We are also implementing Google’s HTML/CSS Style Guide https://google.github.io/styleguide/htmlcssguide.html
- Enforce formatting tools like Prettier for JavaScript

**Branching:**
- Require code review before merging to main.

**Documentation:**
- All major functions/modules must include comments
- Maintain an updated README.md with setup, contribution, and feature info.

**Naming conventions:**
- snake_case for Python, camelCase for JS variables/function

## Consequences
**Positive outcomes (benefits)**
- Improved team collaboration and productivity. 
- Clearer communication through code.
- Reduced conflicts and common bugs due to standard practices.

**Limitations or tradeoffs (what are you giving up?)**
- Initial time investment in understanding formatters and learning style guides.
- Slower workflow due to mandatory code reviews and formatting checks.

**How will this affect future decisions or directions?**
- Easier to extend the codebase later
- Makes transitioning to CI/CD easier later on