// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Screen dimensions
const SCREEN_WIDTH = 300;
const SCREEN_HEIGHT = 600;
const BLOCK_SIZE = 30;
const COLUMNS = SCREEN_WIDTH / BLOCK_SIZE;
const ROWS = SCREEN_HEIGHT / BLOCK_SIZE;

// Colors
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const RED = '#FF0000';
const GREEN = '#00FF00';
const BLUE = '#0000FF';
const CYAN = '#00FFFF';
const YELLOW = '#FFFF00';
const MAGENTA = '#FF00FF';
const ORANGE = '#FFA500';

const COLORS = [CYAN, BLUE, ORANGE, YELLOW, GREEN, MAGENTA, RED];

// Shapes
const SHAPES = [
    [[1, 1, 1], [0, 1, 0]], // T-shape
    [[0, 1, 1], [1, 1, 0]], // Z-shape
    [[1, 1, 0], [0, 1, 1]], // S-shape
    [[1, 1, 1, 1]],         // I-shape
    [[1, 1], [1, 1]],       // O-shape
    [[1, 1, 1], [1, 0, 0]], // L-shape
    [[1, 1, 1], [0, 0, 1]]  // J-shape
];

// Tetrimino Class
class Tetrimino {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = Math.floor(COLUMNS / 2) - Math.floor(shape[0].length / 2);
        this.y = 0;
    }

    rotate() {
        this.shape = this.shape[0].map((_, i) => this.shape.map(row => row[i])).reverse();
    }
}

// Initialize grid with empty (black) blocks
let grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(BLACK));

// Draw the grid (for debug or visual assistance)
function drawGrid() {
    for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {
            ctx.strokeStyle = WHITE;
            ctx.strokeRect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

// Draw a tetrimino on the grid
function drawTetrimino(tetrimino) {
    ctx.fillStyle = tetrimino.color;
    for (let y = 0; y < tetrimino.shape.length; y++) {
        for (let x = 0; x < tetrimino.shape[y].length; x++) {
            if (tetrimino.shape[y][x]) {
                ctx.fillRect(
                    (tetrimino.x + x) * BLOCK_SIZE,
                    (tetrimino.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
            }
        }
    }
}

// Check for collision
function checkCollision(tetrimino) {
    for (let y = 0; y < tetrimino.shape.length; y++) {
        for (let x = 0; x < tetrimino.shape[y].length; x++) {
            if (
                tetrimino.shape[y][x] && // if the block is part of the tetrimino
                (tetrimino.x + x < 0 || // check if it goes out of bounds
                 tetrimino.x + x >= COLUMNS ||
                 tetrimino.y + y >= ROWS ||
                 grid[tetrimino.y + y][tetrimino.x + x] !== BLACK) // check if it hits another block
            ) {
                return true;
            }
        }
    }
    return false;
}

// Lock the tetrimino in place on the grid
function lockTetrimino(tetrimino) {
    for (let y = 0; y < tetrimino.shape.length; y++) {
        for (let x = 0; x < tetrimino.shape[y].length; x++) {
            if (tetrimino.shape[y][x]) {
                grid[tetrimino.y + y][tetrimino.x + x] = tetrimino.color;
            }
        }
    }
}

// Clear full rows and shift the remaining down
function clearRows() {
    let clearedRows = 0;
    grid = grid.filter(row => {
        if (row.every(cell => cell !== BLACK)) {
            clearedRows++;
            return false;
        }
        return true;
    });

    // Add cleared rows at the top of the grid
    while (clearedRows > 0) {
        grid.unshift(Array(COLUMNS).fill(BLACK));
        clearedRows--;
    }
}

// Variables
let currentTetrimino = new Tetrimino(randomShape(), randomColor());
let nextTetrimino = new Tetrimino(randomShape(), randomColor());
let fallSpeed = 1000; // 1 second per block fall
let fallTime = 0;
let score = 0;

// Randomize shape and color
function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}
function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Game loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // Clear the screen
    drawGrid(); // Draw grid for assistance

    // Handle automatic falling
    if (timestamp - fallTime > fallSpeed) {
        currentTetrimino.y++;
        if (checkCollision(currentTetrimino)) {
            currentTetrimino.y--; // revert position
            lockTetrimino(currentTetrimino); // lock the tetrimino
            clearRows(); // check for and clear rows
            currentTetrimino = nextTetrimino; // move to the next tetrimino
            nextTetrimino = new Tetrimino(randomShape(), randomColor());

            if (checkCollision(currentTetrimino)) {
                // Game over condition (collision at the top)
                alert("Game Over!");
                document.location.reload();
                return;
            }
        }
        fallTime = timestamp;
    }

    drawTetrimino(currentTetrimino); // Draw current tetrimino
    drawLockedGrid(); // Draw locked pieces
    requestAnimationFrame(gameLoop);
}

// Draw locked pieces from the grid
function drawLockedGrid() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLUMNS; x++) {
            if (grid[y][x] !== BLACK) {
                ctx.fillStyle = grid[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Handle keyboard inputs for movement
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        currentTetrimino.x--;
        if (checkCollision(currentTetrimino)) currentTetrimino.x++;
    } else if (event.key === "ArrowRight") {
        currentTetrimino.x++;
        if (checkCollision(currentTetrimino)) currentTetrimino.x--;
    } else if (event.key === "ArrowDown") {
        currentTetrimino.y++;
        if (checkCollision(currentTetrimino)) currentTetrimino.y--;
    } else if (event.key === "ArrowUp") {
        currentTetrimino.rotate();
        if (checkCollision(currentTetrimino)) {
            for (let i = 0; i < 3; i++) currentTetrimino.rotate(); // revert rotation
        }
    }
});

// Start the game
requestAnimationFrame(gameLoop);