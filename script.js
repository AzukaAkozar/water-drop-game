let score = 0;
let timeLeft = 30;
let gameInterval;
let dropInterval;
let isPlaying = false;

const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const playArea = document.getElementById('play-area');
const feedbackMsg = document.getElementById('feedback-msg');

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    updateDisplay();
    feedbackMsg.style.color = 'black';
    feedbackMsg.textContent = "Go!";
    
    // Start timers
    gameInterval = setInterval(updateTimer, 1000);
    dropInterval = setInterval(createDrop, 800); 
}

function resetGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    playArea.innerHTML = ''; // Clear drops
    score = 0;
    timeLeft = 30;
    updateDisplay();
    feedbackMsg.textContent = "Game reset. Click Start!";
    feedbackMsg.style.color = 'black';
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    playArea.innerHTML = ''; // Clear remaining drops
    
    if (score > 0) {
        feedbackMsg.textContent = "Time's up! Great job!";
        feedbackMsg.style.color = 'green';
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); // Celebrate Win LevelUp
    } else {
        feedbackMsg.textContent = "Time's up! Try again.";
    }
}

function createDrop() {
    const drop = document.createElement('div');
    drop.classList.add('drop');
    
    // 70% chance of clean water, 30% chance of dirty water
    const isClean = Math.random() > 0.3; 
    
    if (isClean) {
        drop.classList.add('clean');
    } else {
        drop.classList.add('dirty');
    }
    
    // Random horizontal position
    const randomX = Math.floor(Math.random() * (playArea.offsetWidth - 30));
    drop.style.left = `${randomX}px`;
    
    // Random fall speed between 2s and 4s
    const fallDuration = Math.random() * 2 + 2;
    drop.style.animationDuration = `${fallDuration}s`;
    
    // Add click event to collect drop
    drop.addEventListener('click', () => {
        if (isClean) {
            score += 10;
            feedbackMsg.textContent = "+10 points!";
            feedbackMsg.style.color = 'blue';
        } else {
            score -= 5; // Challenge LevelUp: Penalty
            feedbackMsg.textContent = "Oh no! Dirty water! -5 points";
            feedbackMsg.style.color = 'red';
        }
        updateDisplay();
        drop.remove(); // Remove drop when clicked
    });
    
    // Remove drop if it hits the bottom without being clicked
    drop.addEventListener('animationend', () => {
        drop.remove();
    });
    
    playArea.appendChild(drop);
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
}
