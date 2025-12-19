/**
 * ===========================
 * Turbo Clicker - TypeScript 
 * ===========================
 */

export {};

// 1. Enums & Interfaces
enum AudioConfig {
    QUIET = 0.1,
    FADE_STEP = 0.01,
    FADE_INTERVAL = 100
}

enum GameStatus {
    IDLE = 'IDLE',
    PLAYING = 'PLAYING',
    GAMEOVER = 'GAMEOVER'
}

interface PlayerScore {
    name: string;
    score: number;
    date: string;
}

/**
 * ============================
 * 👆 Turbo Clicker Game Logic
 * ============================
 */
function initTurboClickerGame() {
    // --- 2. DOM Elements ---
    const startClickerBtn = document.getElementById('start-clicker-btn') as HTMLButtonElement;
    const startRoundBtn = document.getElementById('start-round-btn') as HTMLButtonElement;
    const mainClickBtn = document.getElementById('main-click-btn') as HTMLButtonElement;
    const playAgainBtn = document.getElementById('play-again-clicker-btn') as HTMLButtonElement;
    const clickerMusic = document.getElementById('gameMusic') as HTMLAudioElement;
    const nicknameInput = document.getElementById('nickname-input') as HTMLInputElement;
    const musicToggle = document.getElementById('musicToggle') as HTMLButtonElement;
    const musicIcon = document.getElementById('musicIcon');

    // Safety Check
    if (!startClickerBtn || !clickerMusic || !mainClickBtn || !nicknameInput) {
        console.warn("Important DOM elements missing.");
        return;
    }

    const currentPlayerNameSpan = document.getElementById('current-player-name');
    const setupDiv = document.getElementById('nickname-setup');
    const instructionsDiv = document.getElementById('clicker-instructions');
    const gameDisplayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('clicker-game-over');
    const timerSpan = document.getElementById('clicker-timer');
    const scoreSpan = document.getElementById('clicker-score');
    const highScoreSpan = document.getElementById('clicker-high-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('clicker-leaderboard-list');

    // Set Volume Awal
    clickerMusic.volume = AudioConfig.QUIET;

    // --- 3. Game Constants & State ---
    const GAME_DURATION = 10; // dalam detik

    let clickerState = {
        score: 0,
        timeLeft: GAME_DURATION,
        status: GameStatus.IDLE,
        nickname: '',
        timerInterval: null as any
    };

    // --- 4. Leaderboard Functions ---
    function getLeaderboard(): PlayerScore[] {
        const board = localStorage.getItem('turboClickerLeaderboard');
        return board ? JSON.parse(board) : [];
    }

    function renderLeaderboard() {
        if (!leaderboardList || !highScoreSpan) return;
        const board = getLeaderboard();
        leaderboardList.innerHTML = ''; 
        board.forEach((entry, index) => {
            const listItem = `
                <li class="flex justify-between p-2 border-b">
                    <span>${index + 1}. <strong>${entry.name}</strong></span>
                    <span>Clicks: ${entry.score}</span>
                </li>`;
            leaderboardList.innerHTML += listItem;
        });
        highScoreSpan.textContent = board.length > 0 ? board[0].score.toString() : "0";
    }

    // --- 5. Game Core Logic ---
    function setupGame() {
        clickerState.score = 0;
        clickerState.timeLeft = GAME_DURATION;
        if (scoreSpan) scoreSpan.textContent = "0";
        if (timerSpan) timerSpan.textContent = GAME_DURATION.toString();

        if (gameOverDiv) gameOverDiv.classList.add('hidden');
        if (gameDisplayDiv) gameDisplayDiv.classList.remove('hidden');
    }
    
    function startGameRound() {
        setupGame();
        clickerState.status = GameStatus.PLAYING;
        
        // Timer Logic
        clickerState.timerInterval = setInterval(() => {
            clickerState.timeLeft--;
            if (timerSpan) timerSpan.textContent = clickerState.timeLeft.toString();

            if (clickerState.timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        if (clickerState.status !== GameStatus.PLAYING) return;
        
        clickerState.status = GameStatus.GAMEOVER;
        clearInterval(clickerState.timerInterval);

        // Save Score
        let board = getLeaderboard();
        board.push({ 
            name: clickerState.nickname, 
            score: clickerState.score, 
            date: new Date().toLocaleDateString() 
        });
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem('turboClickerLeaderboard', JSON.stringify(board.slice(0, 10)));

        renderLeaderboard(); 
        if (finalScoreMsg) finalScoreMsg.textContent = `You clicked ${clickerState.score} times in 10 seconds!`;
        if (gameDisplayDiv) gameDisplayDiv.classList.add('hidden');
        if (gameOverDiv) gameOverDiv.classList.remove('hidden');
    }

    function handleClick() {
        if (clickerState.status !== GameStatus.PLAYING) return;
        
        clickerState.score++;
        if (scoreSpan) scoreSpan.textContent = clickerState.score.toString();
        
        // Efek visual kecil saat klik (opsional)
        mainClickBtn.style.transform = 'scale(0.95)';
        setTimeout(() => mainClickBtn.style.transform = 'scale(1)', 50);
    }

    // --- 6. Event Listeners ---
    startClickerBtn.addEventListener('click', () => {
        const nick = nicknameInput.value.trim();
        if (nick.length < 2) {
            alert('Please enter a nickname of at least 2 characters!');
            return;
        }

        // Music Fade-in
        if (clickerMusic) {
            clickerMusic.volume = 0; 
            clickerMusic.play().catch(() => console.log("Audio blocked"));
            let fadeIn = setInterval(() => {
                if (clickerMusic.volume < AudioConfig.QUIET) {
                    clickerMusic.volume = Math.min(AudioConfig.QUIET, clickerMusic.volume + AudioConfig.FADE_STEP);
                } else {
                    clearInterval(fadeIn);
                }
            }, AudioConfig.FADE_INTERVAL);
        }

        clickerState.nickname = nick;
        setupDiv?.classList.add('hidden');
        instructionsDiv?.classList.remove('hidden');
        if (currentPlayerNameSpan) currentPlayerNameSpan.textContent = nick;
    });

    startRoundBtn.addEventListener('click', () => {
        instructionsDiv?.classList.add('hidden');
        startGameRound();
    });

    mainClickBtn.addEventListener('click', handleClick);

    playAgainBtn.addEventListener('click', () => {
        gameOverDiv?.classList.add('hidden');
        instructionsDiv?.classList.remove('hidden');
    });

    if (musicToggle && clickerMusic) {
        musicToggle.addEventListener('click', () => {
            if (clickerMusic.paused) {
                clickerMusic.play();
                if (musicIcon) musicIcon.className = 'fas fa-volume-up'; 
            } else {
                clickerMusic.pause();
                if (musicIcon) musicIcon.className = 'fas fa-volume-mute'; 
            }
        });
    }

    renderLeaderboard();
}

// Inisialisasi
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTurboClickerGame);
} else {
    initTurboClickerGame();
}