# sudoku-pro: Sudoku Generator and Sudoku Solver

sudoku-pro is a JavaScript package that provides functionalities to generate, solve, and print Sudoku puzzles of varying difficulty levels using the backtracking algorithm. It offers an easy-to-use interface to create Sudoku puzzles for both recreational and educational purposes.

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
```

## Example: How to use the functions in your applications

```javascript
// Import the module
const { generateSudoku, printSudoku, solveSudoku } = require("sudoku-pro");

// Get the difficulty level
const args = process.argv.slice(2);

const difficulty = args[0]; // Get the difficulty level from command line arguments

// Generate a Sudoku puzzle
const sudoku = generateSudoku(difficulty);

// Print the puzzle
printSudoku(sudoku);

// Solve the puzzle
solveSudoku(sudoku);

// Print the solved puzzle
printSudoku(sudoku);

process.exit();
```
