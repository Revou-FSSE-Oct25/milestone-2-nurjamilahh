/**
 * ==============================
 * 🔢 Number Guessing Game Logic 
 * ==============================
 */

interface GameState {
    playerName: string;
    secretNumber: number;
    attemptsLeft: number;
    totalAttemptsUsed: number;
    gameActive: boolean;
    highScore: number;
}

interface LeaderboardEntry {
    name: string;
    score: number;
}

// 1. DEKLARASI VARIABEL GLOBAL (Wajib di paling atas)
let gameState: GameState;

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
    const nicknameSetup = document.getElementById('nickname-setup') as HTMLElement;
    const nicknameInput = document.getElementById('nickname-input') as HTMLInputElement;
    const startGuessBtn = document.getElementById('start-guess-btn') as HTMLButtonElement;
    const instructionBox = document.getElementById('guess-instructions') as HTMLElement;
    const startRoundBtn = document.getElementById('start-round-btn') as HTMLButtonElement;
    const currentPlayerName = document.getElementById('current-player-name') as HTMLElement;
    
    const gameDisplay = document.getElementById('game-display') as HTMLElement;
    const guessForm = document.getElementById('guess-form') as HTMLFormElement;
    const guessInput = document.getElementById('guess-input') as HTMLInputElement;
    const guessMessage = document.getElementById('guess-message') as HTMLElement;
    const attemptsSpan = document.getElementById('guess-attempts') as HTMLElement;
    const highScoreSpan = document.getElementById('guess-high-score') as HTMLElement;
    
    const gameOverSection = document.getElementById('guess-game-over') as HTMLElement;
    const statusTitle = document.getElementById('status-title') as HTMLElement;
    const finalScoreMsg = document.getElementById('final-score-message') as HTMLElement;
    const resetBtn = document.getElementById('guess-reset-btn') as HTMLButtonElement;
    const leaderboardList = document.getElementById('guess-leaderboard-list') as HTMLUListElement;

    const gameMusic = document.getElementById('gameMusic') as HTMLAudioElement;
    const musicToggle = document.getElementById('musicToggle') as HTMLButtonElement;
    const musicIcon = document.getElementById('musicIcon') as HTMLElement;

    // C. UPDATE TAMPILAN AWAL
    if (highScoreSpan) highScoreSpan.textContent = gameState.highScore.toString();
    updateLeaderboard();

    /** 1. Handle Nickname Setup */
    startGuessBtn?.addEventListener('click', () => {
        const name = nicknameInput.value.trim();
        if (name) {
            gameState.playerName = name;
            if (currentPlayerName) currentPlayerName.textContent = name;
            nicknameSetup.classList.add('hidden');
            instructionBox.classList.remove('hidden');
        } else {
            alert("Please enter your name!");
        }
    });

    /** 2. Start Round */
    startRoundBtn?.addEventListener('click', () => {
        instructionBox.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });

    /** 3. Initialize Game Logic */
    function initGame(): void {
        gameState.secretNumber = Math.floor(Math.random() * 100) + 1;
        gameState.attemptsLeft = 5;
        gameState.totalAttemptsUsed = 0;
        gameState.gameActive = true;

        if (attemptsSpan) attemptsSpan.textContent = gameState.attemptsLeft.toString();
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
    guessForm?.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        if (!gameState.gameActive) return;

        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) return;

        gameState.attemptsLeft--;
        gameState.totalAttemptsUsed++;
        if (attemptsSpan) attemptsSpan.textContent = gameState.attemptsLeft.toString();

        if (guess === gameState.secretNumber) {
            endGame(true);
        } else if (gameState.attemptsLeft === 0) {
            endGame(false);
        } else {
            if (guessMessage) {
                guessMessage.textContent = guess < gameState.secretNumber ? "📉 Too Low!" : "📈 Too High!";
            }
        }
        guessInput.value = '';
    });

    /** 5. End Game Logic */
    function endGame(isWin: boolean): void {
        gameState.gameActive = false;
        guessInput.disabled = true;
        gameDisplay.classList.add('hidden');
        gameOverSection.classList.remove('hidden');

        if (isWin) {
            statusTitle.textContent = "🎉 Excellent Guess!";
            statusTitle.style.color = "#22c55e"; 
            finalScoreMsg.innerHTML = `The number was <b>${gameState.secretNumber}</b>.<br>You found it in ${gameState.totalAttemptsUsed} attempts!`;
            saveScore(gameState.playerName, gameState.totalAttemptsUsed);
        } else {
            statusTitle.textContent = "😭 Mission Failed!";
            statusTitle.style.color = "#ef4444"; 
            finalScoreMsg.textContent = `You ran out of juice! The number was ${gameState.secretNumber}.`;
        }
    }

    /** 6. Leaderboard & Storage */
    function saveScore(name: string, score: number): void {
        let leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('guessLeaderboard') || '[]');
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => a.score - b.score);
        leaderboard = leaderboard.slice(0, 5); 
        localStorage.setItem('guessLeaderboard', JSON.stringify(leaderboard));
        
        if (gameState.highScore === 0 || score < gameState.highScore) {
            localStorage.setItem('guessHighScore', score.toString());
            gameState.highScore = score;
            if (highScoreSpan) highScoreSpan.textContent = score.toString();
        }
        updateLeaderboard(); 
    }

    function updateLeaderboard(): void {
        const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('guessLeaderboard') || '[]');
        if (leaderboardList) {
            if (leaderboard.length === 0) {
                leaderboardList.innerHTML = `<li style="color: #ccc; list-style: none; text-align: center;">No scores yet...</li>`;
            } else {
                leaderboardList.innerHTML = leaderboard
                    .map(entry => `<li style="color: #ffeb3b; list-style: none; margin-bottom: 5px; text-align: center;">
                                    🌟 ${entry.name}: ${entry.score} attempts
                                  </li>`)
                    .join('');
            }
        }
    }

    /** 7. Music & Reset */
    musicToggle?.addEventListener('click', () => {
        if (gameMusic.paused) {
            gameMusic.play();
            musicIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        } else {
            gameMusic.pause();
            musicIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
        }
    });

    resetBtn?.addEventListener('click', () => {
        gameOverSection.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });

    // Menempelkan fungsi ke window agar bisa dipanggil dari Console (F12)
    (window as any).endGame = endGame;
});