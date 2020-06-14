let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let player = {
  human: {
    sign: "x",
    paint: paintX,
  },
  ai: {
    sign: "o",
    paint: paintO,
  },
};

let canHumanPlay = true;
let gameOver = false;
let currentPlayer = player.human;

function humanTurn() {
  let i = floor(mouseY / tileSize);
  let j = floor(mouseX / tileSize);

  if (!board[i][j]) {
    board[i][j] = player.human.sign;
    paintBoard();
    currentPlayer = player.ai;
    canHumanPlay = false;
  } else {
    return null;
  }
}

const minimaxScores = {
  x: 10,
  o: -10,
  tie: 0,
};

function minimax(brd, depth, isMaximizing) {
  let shadowBoard = forkBoard(brd);
  const winner = evaluateBoard(shadowBoard, true);
  if (winner) {
    return minimaxScores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!shadowBoard[i][j]) {
          shadowBoard[i][j] = player.human.sign;
          bestScore = max(
            minimax(shadowBoard, depth + 1, !isMaximizing),
            bestScore
          );
          shadowBoard[i][j] = "";
        }
      }
    }
    return bestScore - depth;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (!shadowBoard[i][j]) {
          shadowBoard[i][j] = player.ai.sign;
          bestScore = min(
            minimax(shadowBoard, depth + 1, !isMaximizing),
            bestScore
          );
          shadowBoard[i][j] = "";
        }
      }
    }
    return bestScore + depth;
  }
}

function aiTurn(firstTurn) {
  // RULES FOR AI TO BE ABLE TO PLAY
  if (firstTurn) currentPlayer = player.ai;
  let canAIPlay = !canHumanPlay && !gameOver;

  // Scan the board
  if (canAIPlay || firstTurn) {
    let available = [];
    let bestMove = { i: -1, j: -1 };
    let bestScore = Infinity;
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (!board[i][j]) {
          available.push({
            i,
            j,
          });
          board[i][j] = player.ai.sign;
          let score = minimax(board, 0, true);
          console.log(score);
          board[i][j] = "";

          if (score < bestScore) {
            bestScore = score;
            bestMove = {
              i,
              j,
            };
          }
        }
      }
    }

    // Play random if it's the first turn
    if (firstTurn) {
      bestMove = random(available);
    }

    // If there is no available space, don't do anything
    if (!available.length) return null;

    // Do necessary actions for moving the turn to next player
    board[bestMove.i][bestMove.j] = player.ai.sign;
    currentPlayer = player.human;
    paintBoard();
    canHumanPlay = true;
  }
}

function equal(a, b, c) {
  return a === b && (b === c) & (a !== "");
}

function evaluateBoard(b, passive) {
  let winner = null;
  const noAvailable = !b.flat().includes("");

  // CHECK ROWS
  for (let i = 0; i < 3; ++i) {
    if (equal(b[i][0], b[i][1], b[i][2])) {
      winner = b[i][0];
    }
    // CHECK COLUMNS
    if (equal(b[0][i], b[1][i], b[2][i])) {
      winner = b[0][i];
    }
  }

  // CHECK DIAGONALS
  if (equal(b[0][0], b[1][1], b[2][2])) {
    winner = b[1][1];
  }
  if (equal(b[0][2], b[1][1], b[2][0])) {
    winner = b[1][1];
  }

  if (noAvailable && !winner) {
    winner = "tie";
  }

  if (!passive && winner) {
    gameOver = true;
    printResult(winner);
  }

  return winner;
}

function printResult(winner) {
  const result = document.querySelector(".result");
  if (winner === "tie") {
    result.innerText = "Tie!";
  } else {
    result.innerText = `Winner is ${winner.toUpperCase()}`;
    result.style.backgroundColor =
      winner === "x" ? "lightseagreen" : "mediumpurple";
    result.style.color = "whitesmoke";
  }
}

function paintBoard() {
  console.log(board);
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (board[i][j] === player.human.sign) {
        player.human.paint([i, j]);
      } else if (board[i][j] === player.ai.sign) {
        player.ai.paint([i, j]);
      }
    }
  }
}

function paintX(cellPosition) {
  const [x, y] = getTileXY(cellPosition);
  let size = tileSize * 0.5;
  stroke("lightseagreen");
  strokeWeight(40);
  line(x, y, x + size, y + size);
  line(x, y + size, x + size, y);
}

function paintO(cellPosition) {
  const [x, y] = getTileXY(cellPosition);
  let size = tileSize * 0.5;
  stroke("mediumpurple");
  strokeWeight(40);
  ellipseMode(CORNER);
  ellipse(x, y, size);
}

function getTileXY(cellPosition) {
  let x, y;
  x = (cellPosition[1] + 0.25) * tileSize;
  y = (cellPosition[0] + 0.25) * tileSize;
  return [x, y];
}

function paintGrid(size) {
  strokeWeight(1);
  stroke(200);
  line(0, size, width, size);
  line(0, 2 * size, width, 2 * size);
  line(size, 0, size, height);
  line(2 * size, 0, 2 * size, height);
}

function forkBoard(b) {
  return b.reduce((acc, curr) => [...acc, [...curr]], []);
}
