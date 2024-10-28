// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game setup
const gridSize = 20;
const tileCountX = 30;
const tileCountY = 20;
canvas.width = gridSize * tileCountX;
canvas.height = gridSize * tileCountY;

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let snakeColor = "#fff";
let foodColor = "#0f0";

// Display high score
document.getElementById('highScore').innerText = highScore;

// 3D effect function for snake
function draw3DEffect(x, y, size) {
    let gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, '#ccc');
    gradient.addColorStop(1, '#fff');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, size, size);
}

// Draw grid, snake, and food
function drawGrid() {
    ctx.strokeStyle = "#333";
    for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach(part => draw3DEffect(part.x * gridSize, part.y * gridSize, gridSize));
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Update snake position
function updateSnakePosition() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('currentScore').innerText = score;
        food = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
    } else {
        snake.pop();
    }
    snake.unshift(head);
}

// Collision check
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        endGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// End game function
function endGame() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
    document.getElementById('gameOverPopup').style.display = 'flex';
    document.getElementById('finalScore').innerText = score;
}

// Restart game
function restartGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    document.getElementById('currentScore').innerText = score;
    document.getElementById('gameOverPopup').style.display = 'none';
}

function clearCanvas() {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    updateSnakePosition();
    checkCollision();
    clearCanvas();
    drawGrid();
    drawSnake();
    drawFood();
}

// Key control
window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Restart button event listener
document.getElementById('restartButton').addEventListener('click', restartGame);

// Start game loop
setInterval(gameLoop, 100);

// Extra setup for New Game and Continue Game
document.addEventListener('DOMContentLoaded', () => {
    const newGameBtn = document.getElementById('newGameBtn');
    const continueGameBtn = document.getElementById('continueGameBtn');
    const highScoreDisplay = document.getElementById('highScoreDisplay');

    highScoreDisplay.textContent = `Your High Score: ${highScore}`;

    newGameBtn.addEventListener('click', () => {
        localStorage.setItem('newGame', 'true');
        localStorage.setItem('score', '0');
        window.location.href = 'game.html';
    });

    continueGameBtn.addEventListener('click', () => {
        localStorage.setItem('newGame', 'false');
        window.location.href = 'game.html';
    });
});
