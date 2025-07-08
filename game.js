const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12;
const paddleHeight = 80;
const ballRadius = 10;

const player = {
    x: 0 + 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#0ff"
};

const ai = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#f00"
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#fff"
};

let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "40px Arial";
    ctx.fillText(text, x, y);
}

function drawNet() {
    ctx.fillStyle = "#fff";
    for (let i = 0; i <= canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 20);
    }
}

// Control left paddle with mouse
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Prevent paddle from leaving canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height)
        player.y = canvas.height - player.height;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = (Math.random() - 0.5) * 8;
    ball.speed = 5;
}

// Collision detection
function collision(b, p) {
    return (
        b.x + b.radius > p.x &&
        b.x - b.radius < p.x + p.width &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + p.height
    );
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Top and bottom collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Left paddle collision
    if (collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = 1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.25;
    }

    // Right paddle collision (AI)
    if (collision(ball, ai)) {
        let collidePoint = ball.y - (ai.y + ai.height / 2);
        collidePoint = collidePoint / (ai.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.25;
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement: follow ball with a bit of smoothing
    let aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y - 20) {
        ai.y += 5;
    } else if (aiCenter > ball.y + 20) {
        ai.y -= 5;
    }
    // Prevent AI paddle from leaving canvas
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height)
        ai.y = canvas.height - ai.height;
}

// Render everything
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#111");
    drawNet();

    // Scores
    drawText(playerScore, canvas.width / 4, 50, "#0ff");
    drawText(aiScore, (canvas.width * 3) / 4, 50, "#f00");

    // Paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();