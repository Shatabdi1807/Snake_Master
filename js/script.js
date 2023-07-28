// Game constants and variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("snake_eating_food.mp3");
const gameOverSound = new Audio("game_over.mp3");
const moveSound = new Audio("snake_move.mp3");
let speed = 5;
let lastPaintTime = 0;
let score = 0;
let snakeArr = [{ x: 6, y: 7 }];
let food = { x: 13, y: 15 };
let bigFood;
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
document.getElementById("easy").style.backgroundColor = "rgb(218, 183, 118)";

// Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  //console.log(ctime)
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  //If snake overlaps it's body
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      gameOverSound.play();
      return true;
    }
  }
  //If snake collides with the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    gameOverSound.play();
    return true;
  }
}

function gameEngine() {
  //part 1: Update snake array and food
  if (isCollide(snakeArr)) {
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 6, y: 7 }];
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    alert("Game Over. Press any key to play again!");
  }

  //If snake has eaten the food, then increment the score and regenerate the food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreVal));
      highScoreBox.innerHTML = "High Score: " + highScoreVal;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  //Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; // Create a new object which contains only snakeArr[i] to avoid reference problem
  }

  //To move the head of snake(1st element of array)
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  //part 2: Display snake array and food
  //Display snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  //Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Main logic starts here(game loop)
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScoreVal = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(highScore);
  highScoreBox.innerHTML = "High Score: " + highScore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y !== 1) {
        // Disallow moving up if the current direction is down
        inputDir.x = 0;
        inputDir.y = -1;
      }
      break;
    case "ArrowDown":
      if (inputDir.y !== -1) {
        // Disallow moving down if the current direction is up
        inputDir.x = 0;
        inputDir.y = 1;
      }
      break;
    case "ArrowLeft":
      if (inputDir.x !== 1) {
        // Disallow moving left if the current direction is right
        inputDir.x = -1;
        inputDir.y = 0;
      }
      break;
    case "ArrowRight":
      if (inputDir.x !== -1) {
        // Disallow moving right if the current direction is left
        inputDir.x = 1;
        inputDir.y = 0;
      }
      break;
    default:
      break;
  }
});

// Add event listeners to the buttons
easyButton.addEventListener("click", function () {
  speed = 5;
  document.getElementById("easy").style.backgroundColor = "rgb(218, 183, 118)";
  document.getElementById("medium").style.backgroundColor = "rgb(226, 107, 107)";
  document.getElementById("hard").style.backgroundColor = "rgb(226, 107, 107)";
});

mediumButton.addEventListener("click", function () {
  speed = 10;
  document.getElementById("easy").style.backgroundColor = "rgb(226, 107, 107)";
  document.getElementById("medium").style.backgroundColor = "rgb(218, 183, 118)";
  document.getElementById("hard").style.backgroundColor = "rgb(226, 107, 107)";
});

hardButton.addEventListener("click", function () {
  speed = 15;
  document.getElementById("easy").style.backgroundColor = "rgb(226, 107, 107)";
  document.getElementById("medium").style.backgroundColor ="rgb(226, 107, 107)";
  document.getElementById("hard").style.backgroundColor = "rgb(218, 183, 118)";
});
