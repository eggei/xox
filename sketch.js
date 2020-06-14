const canvasSize = 400
let tileSize = canvasSize / 3

function setup() {
  createCanvas(canvasSize, canvasSize);
  createP(`<p class="result">Good luck!!!</p>`)
  // createButton(`Restart`).mousePressed(resetBoard)
  background('whitesmoke');
  cursor('pointer')
  paintGrid(tileSize);
  // aiTurn(true)
}

function draw() {
  noLoop()
}

let timeoutID;

function mousePressed() {
  const clickOutsideCanvas = 
        mouseX > canvasSize || 
        mouseX < 0 || 
        mouseY > canvasSize || 
        mouseY < 0

  if (clickOutsideCanvas || gameOver) return null
  if (canHumanPlay) {
    humanTurn()
    evaluateBoard(board)
  }
  
  if (!gameOver) {
    aiTurn()
    evaluateBoard(board)
  }
}