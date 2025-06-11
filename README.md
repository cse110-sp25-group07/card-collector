# Card Collector - CSE 110 Project

Card Collector is a web app designed to bring physical card collecting to a digital interface.

## How to Run the Project

### Option 1: Use the Live Website (Recommended)

You can try out the app (v.1.5) by visiting our GitHub Pages deployment:

[https://cse110-sp25-group07.github.io/card-collector/](https://cse110-sp25-group07.github.io/card-collector/)

### Option 2: Run Locally with Live Server

If you want to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/cse110-sp25-group07/card-collector.git
   cd card-collector
   ```

2. **Install Live Server** (if not already installed):

   - VS Code users: Install the “Live Server” extension by **Ritwick Dey**.
   - Or use the CLI globally:

     ```bash
     npm install -g live-server
     ```

3. **Start the server:**

   - With VS Code: Right-click `index.html` and choose **“Open with Live Server.”**
   - Or with the CLI:

     ```bash
     live-server
     ```

> ⚠️ Opening `index.html` directly will result in broken scripts due to browser restrictions on the `file://` protocol.

---

## Quick Use Gifs

*Create a deck and use bulk image upload!*  
![create-deck-gif](https://github.com/user-attachments/assets/7f58545d-600c-4f76-b31a-7116f41ee092)

*Create, view, and edit cards and their fields!*  
![cards_demo_gif](https://github.com/user-attachments/assets/006d51a5-c5e4-411e-accf-c85a20c6064f)

## Sprint 1 Status Video

[Video Link](https://youtu.be/6OmUEN1WJqk)

## Documentation

All information should be kept within this repository and its wiki to maintain a single source of truth.

[Repository Wiki](https://github.com/cse110-sp25-group07/card-collector/wiki)

[JSDocs Github Page](https://cse110-sp25-group07.github.io/card-collector/jsdocs)

## Installation

Use npm install to install [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Jest](https://jestjs.io/), and [JSDoc](https://jsdoc.app/) for code formatting, validation, testing, and documentation.

```bash
npm install
```

## Development

Test JavaScript functions locally with jest:

```bash
npm run test
```

Run ESLint to ensure consistent code and identifying bugs:

```bash
npm run lint
```

Format files with Prettier:

```bash
npm run format
```

Generate documentation with JSDoc:

```bash
npm run jsdoc
```

## Contributing

Make sure to create/assign yourself to an issue and open up a feature branch to work on a component. When opening a pull request make sure to pass automated tests, get code reviewed, and document any new/edited components.

Please make sure to update tests as appropriate.
