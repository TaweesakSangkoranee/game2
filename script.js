const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const goodSound = document.getElementById('goodSound');
const badSound = document.getElementById('badSound');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');

let score = 0;
let timeLeft = 60;
let gameOver = false;
let fallInterval = 600;

let comboCount = 0;
let lastClickTime = 0;
const comboWindow = 1000;

const fruits = [
  'https://cdn-icons-png.flaticon.com/512/590/590685.png',
  'https://cdn-icons-png.flaticon.com/512/135/135620.png',
  'https://cdn-icons-png.flaticon.com/512/590/590690.png',
  'https://cdn-icons-png.flaticon.com/512/590/590686.png',
  'https://cdn-icons-png.flaticon.com/512/590/590688.png',
];

const bombFruits = [
  'https://cdn-icons-png.flaticon.com/128/112/112683.png',
];

function spawnItem() {
  if (gameOver) return;

  const item = document.createElement('img');
  const isBomb = Math.random() < 0.2;

  item.src = isBomb
    ? bombFruits[Math.floor(Math.random() * bombFruits.length)]
    : fruits[Math.floor(Math.random() * fruits.length)];

  item.classList.add('item');
  item.style.left = Math.random() * (gameArea.clientWidth - 90) + 'px';
  gameArea.appendChild(item);

  item.addEventListener('click', () => {
    if (gameOver) return;
    gameArea.removeChild(item);

    if (isBomb) {
      badSound.play();
      // Deduct 1 point but not below 0
      score = Math.max(0, score - 1);
      scoreDisplay.textContent = `Score: ${score} (-1)`;
      comboCount = 0; // Reset combo when hit bomb
    } else {
      goodSound.play();

      const now = Date.now();
      if (now - lastClickTime <= comboWindow) {
        comboCount++;
      } else {
        comboCount = 0;
      }
      lastClickTime = now;

      let point = 1;
      if (comboCount >= 10) point = 3;
      else if (comboCount >= 5) point = 2;

      score += point;
      scoreDisplay.textContent = `Score: ${score} (+${point})`;

      if (fallInterval > 200) fallInterval -= 10;
    }
  });

  setTimeout(() => {
    if (gameArea.contains(item)) {
      gameArea.removeChild(item);
    }
  }, 5000);
}

let countdown;

function startCountdown() {
  countdown = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `⏱ Time: ${timeLeft}`;
    } else {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function gameLoop() {
  if (!gameOver) {
    spawnItem();
    setTimeout(gameLoop, fallInterval);
  }
}

function endGame() {
  gameOver = true;
  finalScoreDisplay.textContent = `Your score: ${score}`;
  gameOverScreen.classList.remove('hidden');
}

function restartGame() {
  score = 0;
  timeLeft = 60;
  gameOver = false;
  fallInterval = 600;
  comboCount = 0;
  lastClickTime = 0;
  scoreDisplay.textContent = 'Score: 0';
  timerDisplay.textContent = '⏱ Time: 60';
  gameOverScreen.classList.add('hidden');

  // Remove remaining items
  document.querySelectorAll('.item').forEach(item => item.remove());

  gameLoop();
  startCountdown();
}

// Start game for the first time
gameLoop();
startCountdown();
