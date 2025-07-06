const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const player = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#0f0", // Green
  speed: 7,
  dy: 0
};

const ai = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#f00", // Red
  speed: 5
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speed: 5,
  dx: 5,
  dy: 5,
  color: "#fff"
};

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

function drawText(text, x, y, color = "#fff") {
  ctx.fillStyle = color;
  ctx.font = "16px Arial";
  ctx.fillText(text, x, y);
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 15) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "#fff");
  }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, "#222");
  drawNet();

  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);

  drawText("You", 20, 20, "#0f0");
  drawText("Computer", canvas.width - 100, 20, "#f00");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.dy = -player.speed;
  if (e.key === "ArrowDown") player.dy = player.speed;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
});

function update() {
  player.y += player.dy;
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Player collision
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx *= -1;
  }

  // AI collision
  if (
    ball.x + ball.radius > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.height
  ) {
    ball.dx *= -1;
  }

  // AI movement
  if (ai.y + ai.height / 2 < ball.y) ai.y += ai.speed;
  else ai.y -= ai.speed;

  ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));

  // Ball reset
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
