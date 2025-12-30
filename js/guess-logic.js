"use strict";
/**
 * ==============================
 * 🔢 Number Guessing Game Logic
 * ==============================
 */
// 1. DEKLARASI VARIABEL GLOBAL (Wajib di paling atas)
let gameState;
// 2. SEMUA LOGIKA HARUS DI DALAM DOMContentLoaded AGAR ELEMEN HTML TERBACA
document.addEventListener('DOMContentLoaded', () => {
    // A. INISIALISASI gameState (Harus paling pertama!)
    gameState = {
        playerName: '',
        secretNumber: 0,
        attemptsLeft: 5,
        totalAttemptsUsed: 0,
        gameActive: false,
        highScore: Number(localStorage.getItem('guessHighScore')) || 0
    };
    // B. AMBIL ELEMEN HTML
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
    const statusTitle = document.getElementById('status-title');
    const finalScoreMsg = document.getElementById('final-score-message');
    const resetBtn = document.getElementById('guess-reset-btn');
    const leaderboardList = document.getElementById('guess-leaderboard-list');
    const gameMusic = document.getElementById('gameMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    // C. UPDATE TAMPILAN AWAL
    if (highScoreSpan)
        highScoreSpan.textContent = gameState.highScore.toString();
    updateLeaderboard();
    /** 1. Handle Nickname Setup */
    startGuessBtn === null || startGuessBtn === void 0 ? void 0 : startGuessBtn.addEventListener('click', () => {
        const name = nicknameInput.value.trim();
        if (name) {
            gameState.playerName = name;
            if (currentPlayerName)
                currentPlayerName.textContent = name;
            nicknameSetup.classList.add('hidden');
            instructionBox.classList.remove('hidden');
        }
        else {
            alert("Please enter your name!");
        }
    });
    /** 2. Start Round */
    startRoundBtn === null || startRoundBtn === void 0 ? void 0 : startRoundBtn.addEventListener('click', () => {
        instructionBox.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });
    /** 3. Initialize Game Logic */
    function initGame() {
        gameState.secretNumber = Math.floor(Math.random() * 100) + 1;
        gameState.attemptsLeft = 5;
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
    /** 4. Handle Guess Submission */
    guessForm === null || guessForm === void 0 ? void 0 : guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!gameState.gameActive)
            return;
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100)
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
    /** 5. End Game Logic */
    function endGame(isWin) {
        gameState.gameActive = false;
        guessInput.disabled = true;
        gameDisplay.classList.add('hidden');
        gameOverSection.classList.remove('hidden');
        if (isWin) {
            statusTitle.textContent = "🎉 Excellent Guess!";
            statusTitle.style.color = "#22c55e";
            finalScoreMsg.innerHTML = `The number was <b>${gameState.secretNumber}</b>.<br>You found it in ${gameState.totalAttemptsUsed} attempts!`;
            saveScore(gameState.playerName, gameState.totalAttemptsUsed);
        }
        else {
            statusTitle.textContent = "😭 Mission Failed!";
            statusTitle.style.color = "#ef4444";
            finalScoreMsg.textContent = `You ran out of juice! The number was ${gameState.secretNumber}.`;
        }
    }
    /** 6. Leaderboard & Storage */
    function saveScore(name, score) {
        let leaderboard = JSON.parse(localStorage.getItem('guessLeaderboard') || '[]');
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => a.score - b.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem('guessLeaderboard', JSON.stringify(leaderboard));
        if (gameState.highScore === 0 || score < gameState.highScore) {
            localStorage.setItem('guessHighScore', score.toString());
            gameState.highScore = score;
            if (highScoreSpan)
                highScoreSpan.textContent = score.toString();
        }
        updateLeaderboard();
    }
    function updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('guessLeaderboard') || '[]');
        if (leaderboardList) {
            if (leaderboard.length === 0) {
                leaderboardList.innerHTML = `<li style="color: #ccc; list-style: none; text-align: center;">No scores yet...</li>`;
            }
            else {
                leaderboardList.innerHTML = leaderboard
                    .map(entry => `<li style="color: #ffeb3b; list-style: none; margin-bottom: 5px; text-align: center;">
                                    🌟 ${entry.name}: ${entry.score} attempts
                                  </li>`)
                    .join('');
            }
        }
    }
    /** 7. Music & Reset */
    musicToggle === null || musicToggle === void 0 ? void 0 : musicToggle.addEventListener('click', () => {
        if (gameMusic.paused) {
            gameMusic.play();
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
    // Menempelkan fungsi ke window agar bisa dipanggil dari Console (F12)
    window.endGame = endGame;
});
//# sourceMappingURL=guess-logic.js.map