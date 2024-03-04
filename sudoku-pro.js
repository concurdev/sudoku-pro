const readline = require("readline");

// Get the difficulty level
const args = process.argv.slice(2);

function shuffle(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateSudoku(difficulty) {
  const sudoku = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Fill the diagonal blocks (3x3 sub-grids) with valid numbers
  for (let i = 0; i < 9; i += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(nums);
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        sudoku[i + j][i + k] = nums.pop();
      }
    }
  }

  // Solve the puzzle
  const solvedSudoku = JSON.parse(JSON.stringify(sudoku)); // Create a deep copy for later use
  solveSudoku(solvedSudoku);

  // Determine the number of cells to remove based on difficulty level
  let numToRemove;
  switch (difficulty) {
    case "e":
      numToRemove = ensureNumToRemoveInRange(20, 20); // Easy difficulty
      break;
    case "m":
      numToRemove = ensureNumToRemoveInRange(25, 50); // Medium difficulty
      break;
    case "h":
      numToRemove = ensureNumToRemoveInRange(30, 60); // Hard difficulty
      break;
    case "v":
      numToRemove = ensureNumToRemoveInRange(35, 75); // Very hard difficulty
      break;
    default:
      throw new Error(
        'Invalid difficulty level. Please use "e" for easy, "m" for medium, "h" for hard, or "v" for very hard.'
      );
  }

  // Create a copy of the solved Sudoku to remove cells from
  const sudokuCopy = JSON.parse(JSON.stringify(solvedSudoku));

  // Remove some numbers to create the puzzle
  for (let i = 0; i < numToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (sudokuCopy[row][col] !== 0) {
      sudokuCopy[row][col] = 0;
    } else {
      i--; // Try again if the cell is already empty
    }
  }

  return { sudoku: sudokuCopy, solvedSudoku };
}

function ensureNumToRemoveInRange(lowerBound, upperBound) {
  let numToRemove;
  do {
    numToRemove = Math.floor(Math.random() * lowerBound) + upperBound;
  } while (numToRemove > 81); // Ensure numToRemove is within the range 0-81
  return numToRemove;
}

function solveSudoku(sudoku) {
  const emptyCell = findEmptyCell(sudoku);
  if (!emptyCell) {
    return true; // Puzzle solved successfully
  }

  const [row, col] = emptyCell;
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(sudoku, row, col, num)) {
      sudoku[row][col] = num;
      if (solveSudoku(sudoku)) {
        return true;
      }
      sudoku[row][col] = 0; // Undo the assignment
    }
  }

  return false; // No solution found, backtrack
}

function findEmptyCell(sudoku) {
  // Function to find an empty cell in the Sudoku grid
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (sudoku[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null; // No empty cell found
}

function isValidMove(sudoku, row, col, num) {
  // Check if assigning num to the cell at (row, col) is a valid move
  // Check row
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === num) {
      return false; // Number already exists in the row
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][col] === num) {
      return false; // Number already exists in the column
    }
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (sudoku[startRow + i][startCol + j] === num) {
        return false; // Number already exists in the subgrid
      }
    }
  }

  return true; // Valid move
}

function printSudoku(sudoku) {
  console.log("Sudoku Puzzle:");
  console.log("-------------------------");
  sudoku.forEach((row, rowIndex) => {
    if (rowIndex % 3 === 0 && rowIndex !== 0) {
      console.log("------|-------|-------");
    }
    row.forEach((cell, cellIndex) => {
      if (cellIndex % 3 === 0 && cellIndex !== 0) {
        process.stdout.write("| ");
      }
      process.stdout.write(String(cell || ".") + " ");
      if (cellIndex === 8) {
        console.log();
      }
    });
  });
  console.log("-------------------------");
}

function printSudokuWithAnswers(sudoku) {
  console.log("Sudoku Puzzle with Answers:");
  console.log("-------------------------");
  sudoku.forEach((row, rowIndex) => {
    if (rowIndex % 3 === 0 && rowIndex !== 0) {
      console.log("------|-------|-------");
    }
    row.forEach((cell, cellIndex) => {
      if (cellIndex % 3 === 0 && cellIndex !== 0) {
        process.stdout.write("| ");
      }
      process.stdout.write(String(cell) + " ");
      if (cellIndex === 8) {
        console.log();
      }
    });
  });
  console.log("-------------------------");
}

function getHint(sudoku, solvedSudoku) {
  const emptyCells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  if (emptyCells.length === 0) {
    console.log("No empty cells left to provide a hint.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];
  sudoku[row][col] = solvedSudoku[row][col];
  console.log(
    `Hint: The number at row ${row + 1}, column ${col + 1} is ${
      solvedSudoku[row][col]
    }`
  );
}

function waitForHint(sudoku, solvedSudoku) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Press 'h' for a hint or 'c' for the complete solution: ",
    (answer) => {
      if (answer.trim().toLowerCase() === "h") {
        getHint(sudoku, solvedSudoku);
        printSudoku(sudoku);
      } else if (answer.trim().toLowerCase() === "c") {
        printSudokuWithAnswers(solvedSudoku);
        process.exit();
      } else {
        console.log(
          "Invalid input. Please press 'h' for a hint or 'c' for the complete solution."
        );
      }
      rl.close();
      waitForHint(sudoku, solvedSudoku); // Ask again for hint or complete solution
    }
  );
}

const difficulty = args[0]; // Get the difficulty level from command line arguments

const { sudoku, solvedSudoku } = generateSudoku(difficulty);
printSudoku(sudoku);

waitForHint(sudoku, solvedSudoku);

module.exports = {
  generateSudoku,
  printSudoku,
  solveSudoku,
  printSudokuWithAnswers,
  getHint,
  waitForHint,
};
