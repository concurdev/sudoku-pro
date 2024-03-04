# sudoku-pro: Sudoku Generator and Sudoku Solver

sudoku-pro is a JavaScript package that provides functionalities to generate, solve, and print Sudoku puzzles of varying difficulty levels using the backtracking algorithm. It offers an easy-to-use interface to create and solve Sudoku puzzles for both recreational and educational purposes.

## Installation

You can install the package via npm:

```bash
npm i sudoku-pro
```

## Usage

```npm
npm run easy
npm run medium
npm run hard
npm run very
```

## Example: How to use the functions in your applications

```javascript
// Import the module
const {
  generateSudoku,
  printSudoku,
  solveSudoku,
  getHint,
  waitForHint,
} = require("sudoku-pro");

// Get the difficulty level
const args = process.argv.slice(2);

const difficulty = args[0]; // Get the difficulty level from command line arguments

// Generate a Sudoku puzzle
const { sudoku, solvedSudoku } = generateSudoku(difficulty);

// Print the puzzle
printSudoku(sudoku);

// Function to wait for user input for hint or complete solution
waitForHint(sudoku, solvedSudoku);

// This script will continue running until the user chooses to exit

process.exit();
```

Now, in addition to generating and solving Sudoku puzzles, users can also request hints or print the complete solution while the script is running.
