/**
 * ===============================
 * 🔢 Number Guessing Game Logic 
 * ===============================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements: Setup & Navigation
    const nicknameSetup = document.getElementById('nickname-setup');
    const nicknameInput = document.getElementById('nickname-input');
    const startGuessBtn = document.getElementById('start-guess-btn');
    const instructionBox = document.getElementById('guess-instructions');
    const startRoundBtn = document.getElementById('start-round-btn');
    const currentPlayerName = document.getElementById('current-player-name');
    
    // Elements: Game Display
    const gameDisplay = document.getElementById('game-display');
    const guessForm = document.getElementById('guess-form');
    const guessInput = document.getElementById('guess-input');
    const guessMessage = document.getElementById('guess-message');
    const attemptsSpan = document.getElementById('guess-attempts');
    const highScoreSpan = document.getElementById('guess-high-score');
    
    // Elements: Game Over & Leaderboard
    const gameOverSection = document.getElementById('guess-game-over');
    const statusTitle = document.getElementById('status-title');
    const finalScoreMsg = document.getElementById('final-score-message');
    const resetBtn = document.getElementById('guess-reset-btn');
    const leaderboardList = document.getElementById('guess-leaderboard-list');

    // Music Elements
    const gameMusic = document.getElementById('gameMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    let gameState = {
        playerName: '',
        secretNumber: 0,
        attemptsLeft: 5,
        totalAttemptsUsed: 0,
        gameActive: false,
        highScore: localStorage.getItem('guessHighScore') || 0
    };

    // Initialize High Score Display
    highScoreSpan.textContent = gameState.highScore;

    /** 1. Handle Nickname Setup */
    startGuessBtn.addEventListener('click', () => {
        const name = nicknameInput.value.trim();
        if (name) {
            gameState.playerName = name;
            currentPlayerName.textContent = name;
            nicknameSetup.classList.add('hidden');
            instructionBox.classList.remove('hidden');
        } else {
            alert("Please enter your name, Commander!");
        }
    });

    /** 2. Start Round (Show Game Canvas) */
    startRoundBtn.addEventListener('click', () => {
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

        attemptsSpan.textContent = gameState.attemptsLeft;
        guessMessage.textContent = 'Waiting for your guess...';
        guessMessage.className = 'message-box';
        guessInput.value = '';
        guessInput.disabled = false;
        gameOverSection.classList.add('hidden');
        updateLeaderboard();
    }

    /** 4. Handle Guess Submission */
    guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!gameState.gameActive) return;

        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) return;

        gameState.attemptsLeft--;
        gameState.totalAttemptsUsed++;
        attemptsSpan.textContent = gameState.attemptsLeft;

        if (guess === gameState.secretNumber) {
            endGame(true);
        } else if (gameState.attemptsLeft === 0) {
            endGame(false);
        } else {
            guessMessage.textContent = guess < gameState.secretNumber ? "📉 Too Low!" : "📈 Too High!";
            guessMessage.classList.add('shake'); // Optional: add animation
            setTimeout(() => guessMessage.classList.remove('shake'), 500);
        }
        guessInput.value = '';
    });

    /** 5. End Game Logic */
    function endGame(isWin) {
        gameState.gameActive = false;
        guessInput.disabled = true;
        gameDisplay.classList.add('hidden');
        gameOverSection.classList.remove('hidden');

        /* TEST STO SOLVE THE PROBLEM */

        console.log("Win detected! Player:", gameState.playerName, "Score:", gameState.totalAttemptsUsed);

        if (isWin) {
            statusTitle.textContent = "🎉 Excellent Guess!";
            statusTitle.className = "text-2xl font-bold text-green-500";
            finalScoreMsg.innerHTML = `The number was <b>${gameState.secretNumber}</b>.<br>You found it in ${gameState.totalAttemptsUsed} attempts!`;
            saveScore(gameState.playerName, gameState.totalAttemptsUsed);
        } else {
            statusTitle.textContent = "😭 Mission Failed!";
            statusTitle.className = "text-2xl font-bold text-red-500";
            finalScoreMsg.textContent = `You ran out of juice! The number was ${gameState.secretNumber}.`;
        }
    }

    /** 6. Leaderboard & Storage */
    function saveScore(name, score) {
        let leaderboard = JSON.parse(localStorage.getItem('guessLeaderboard')) || [];
        leaderboard.push({ name, score });
        // Sort by fewest attempts (ascending)
        leaderboard.sort((a, b) => a.score - b.score);
        leaderboard = leaderboard.slice(0, 5); 
        localStorage.setItem('guessLeaderboard', JSON.stringify(leaderboard));
        
        // Update High Score if better
        if (gameState.highScore === 0 || score < gameState.highScore) {
            localStorage.setItem('guessHighScore', score);
            gameState.highScore = score;
            highScoreSpan.textContent = score;
        }
        updateLeaderboard();
    }

    function updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('guessLeaderboard')) || [];
        leaderboardList.innerHTML = leaderboard
            .map(entry => `<li>${entry.name}: ${entry.score} attempts</li>`)
            .join('');
    }

    /** 7. Music Controls */
    musicToggle.addEventListener('click', () => {
        if (gameMusic.paused) {
            gameMusic.play();
            musicIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        } else {
            gameMusic.pause();
            musicIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
        }
    });

    resetBtn.addEventListener('click', () => {
        gameOverSection.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });
});