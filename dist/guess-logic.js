import { fadeInAudio } from './utils/audio-helper.js';
const GAME_CONFIG = {
    MAX_ATTEMPTS: 5,
    MIN_NUMBER: 1,
    MAX_NUMBER: 100,
    STORAGE_KEYS: {
        HIGH_SCORE: 'guessHighScore',
        LEADERBOARD: 'guessLeaderboard'
    }
};
let gameState;
document.addEventListener('DOMContentLoaded', () => {
    gameState = {
        playerName: '',
        secretNumber: 0,
        attemptsLeft: GAME_CONFIG.MAX_ATTEMPTS,
        totalAttemptsUsed: 0,
        gameActive: false,
        highScore: Number(localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.HIGH_SCORE)) || 0
    };
    const nicknameSetup = document.getElementById('nickname-setup');
    const nicknameInput = document.getElementById('nickname-input');
    const startGuessBtn = document.getElementById('start-guess-btn');
    const instructionBox = document.getElementById('guess-instructions');
    const startRoundBtn = document.getElementById('start-round-btn');
    const currentPlayerName = document.getElementById('current-player-name');
    const gameDisplay = document.getElementById('game-display');
    const guessForm = document.getElementById('guess-form');
    const guessInput = document.getElementById('guess-input');
    const guessMessage = document.getElementById('guess-message');
    const attemptsSpan = document.getElementById('guess-attempts');
    const highScoreSpan = document.getElementById('guess-high-score');
    const gameOverSection = document.getElementById('guess-game-over');
    const resultTitle = document.getElementById('result-title');
    const finalScoreMsg = document.getElementById('final-score-message');
    const resetBtn = document.getElementById('guess-reset-btn');
    const leaderboardList = document.getElementById('guess-leaderboard-list');
    const gameMusic = document.getElementById('gameMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    if (highScoreSpan)
        highScoreSpan.textContent = gameState.highScore.toString();
    updateLeaderboard();
    startGuessBtn === null || startGuessBtn === void 0 ? void 0 : startGuessBtn.addEventListener('click', () => {
        const name = nicknameInput.value.trim();
        if (name) {
            gameState.playerName = name;
            if (currentPlayerName)
                currentPlayerName.textContent = name;
            nicknameSetup.classList.add('hidden');
            instructionBox.classList.remove('hidden');
            try {
                fadeInAudio(gameMusic, 1000);
            }
            catch (_a) {
            }
        }
    });
    startRoundBtn === null || startRoundBtn === void 0 ? void 0 : startRoundBtn.addEventListener('click', () => {
        instructionBox.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });
    function initGame() {
        gameState.secretNumber = Math.floor(Math.random() * GAME_CONFIG.MAX_NUMBER) + GAME_CONFIG.MIN_NUMBER;
        gameState.attemptsLeft = GAME_CONFIG.MAX_ATTEMPTS;
        gameState.totalAttemptsUsed = 0;
        gameState.gameActive = true;
        if (attemptsSpan)
            attemptsSpan.textContent = gameState.attemptsLeft.toString();
        if (guessMessage) {
            guessMessage.textContent = 'Waiting for your guess...';
            guessMessage.className = 'message-box';
        }
        if (guessInput) {
            guessInput.value = '';
            guessInput.disabled = false;
        }
        gameOverSection.classList.add('hidden');
    }
    guessForm === null || guessForm === void 0 ? void 0 : guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!gameState.gameActive)
            return;
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < GAME_CONFIG.MIN_NUMBER || guess > GAME_CONFIG.MAX_NUMBER)
            return;
        gameState.attemptsLeft--;
        gameState.totalAttemptsUsed++;
        if (attemptsSpan)
            attemptsSpan.textContent = gameState.attemptsLeft.toString();
        if (guess === gameState.secretNumber) {
            endGame(true);
        }
        else if (gameState.attemptsLeft === 0) {
            endGame(false);
        }
        else {
            if (guessMessage) {
                guessMessage.textContent = guess < gameState.secretNumber ? "📉 Too Low!" : "📈 Too High!";
            }
        }
        guessInput.value = '';
    });
    function endGame(isWin) {
        gameState.gameActive = false;
        guessInput.disabled = true;
        gameDisplay.classList.add('hidden');
        gameOverSection.classList.remove('hidden');
        if (isWin) {
            resultTitle.textContent = "🎉 Excellent Guess!";
            resultTitle.style.color = "#22c55e";
            finalScoreMsg.textContent = `The number was ${gameState.secretNumber}. You found it in ${gameState.totalAttemptsUsed} attempts!`;
            saveScore(gameState.playerName, gameState.totalAttemptsUsed);
        }
        else {
            resultTitle.textContent = "😭 Mission Failed!";
            resultTitle.style.color = "#ef4444";
            finalScoreMsg.textContent = `You ran out of juice! The number was ${gameState.secretNumber}.`;
        }
    }
    function saveScore(name, score) {
        const rawData = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.LEADERBOARD);
        let leaderboard = JSON.parse(rawData || '[]');
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => a.score - b.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
        if (gameState.highScore === 0 || score < gameState.highScore) {
            localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.HIGH_SCORE, score.toString());
            gameState.highScore = score;
            if (highScoreSpan)
                highScoreSpan.textContent = score.toString();
        }
        updateLeaderboard();
    }
    function updateLeaderboard() {
        if (!leaderboardList)
            return;
        const rawData = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.LEADERBOARD);
        const leaderboard = JSON.parse(rawData || '[]');
        leaderboardList.innerHTML = '';
        if (leaderboard.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.style.color = "#ccc";
            emptyMsg.style.listStyle = "none";
            emptyMsg.style.textAlign = "center";
            emptyMsg.textContent = "No scores yet...";
            leaderboardList.appendChild(emptyMsg);
            return;
        }
        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.style.color = "#ffeb3b";
            li.style.listStyle = "none";
            li.style.marginBottom = "5px";
            li.style.textAlign = "center";
            const icon = document.createElement('i');
            icon.className = "fas fa-star mr-2";
            li.appendChild(icon);
            const textNode = document.createTextNode(`${entry.name}: ${entry.score} attempts`);
            li.appendChild(textNode);
            leaderboardList.appendChild(li);
        });
    }
    musicToggle === null || musicToggle === void 0 ? void 0 : musicToggle.addEventListener('click', () => {
        if (gameMusic.paused) {
            try {
                fadeInAudio(gameMusic, 1000);
            }
            catch (_a) {
            }
            musicIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        }
        else {
            gameMusic.pause();
            musicIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
        }
    });
    resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener('click', () => {
        gameOverSection.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });
});
//# sourceMappingURL=guess-logic.js.map