/**
 * ==============================
 * 🌠 Cosmic Dodge - TypeScript 
 * ==============================
 */

// 1. Enums & Interfaces (Mencegah error 'any' dan mempermudah kontrol)
export {};

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

interface FallingObject {
    element: HTMLDivElement;
    y: number;
    speed: number;
    width: number;
    x: number;
}

/**
 * ============================
 * 🌠 Cosmic Dodge Game Logic
 * ============================
 */
function initCosmicDodgeGame() {
    // --- 2. DOM Elements (Dengan Type Casting agar .volume/.value tidak merah) ---
    const gameScreen = document.getElementById('game-screen') as HTMLDivElement;
    const startDodgeBtn = document.getElementById('start-dodge-btn') as HTMLButtonElement;
    const startRoundBtn = document.getElementById('start-round-btn') as HTMLButtonElement;
    const playAgainBtn = document.getElementById('play-again-dodge-btn') as HTMLButtonElement;
    const dodgeMusic = document.getElementById('gameMusic') as HTMLAudioElement;
    const nicknameInput = document.getElementById('nickname-input') as HTMLInputElement;
    const musicToggle = document.getElementById('musicToggle') as HTMLButtonElement;
    const musicIcon = document.getElementById('music-icon');

    // Safety Check: Hentikan jika elemen kritikal tidak ada
    if (!startDodgeBtn || !dodgeMusic || !gameScreen || !nicknameInput) {
        console.warn("Important DOM elements missing.");
        return;
    }

    const currentPlayerNameSpan = document.getElementById('current-player-name');
    const setupDiv = document.getElementById('nickname-setup');
    const instructionsDiv = document.getElementById('dodge-instructions');
    const gameDisplayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('dodge-game-over');
    const scoreSpan = document.getElementById('dodge-score');
    const highScoreSpan = document.getElementById('dodge-high-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('dodge-leaderboard-list');

    // Set Volume Awal (0.1)
    dodgeMusic.volume = AudioConfig.QUIET;

    // --- 3. Game Constants & State ---
    const GAME_WIDTH = 480;
    const GAME_HEIGHT = 320;
    const PLAYER_SPEED = 10;
    const OBSTACLE_INTERVAL = 800;

    let dodgeState = {
        player: null as HTMLDivElement | null,
        playerX: GAME_WIDTH / 2 - 20,
        score: 0,
        gameLoop: 0,
        objectTimer: null as any,
        status: GameStatus.IDLE,
        nickname: ''
    };
    let objects: FallingObject[] = [];

    // --- 4. Leaderboard Functions ---
    function getLeaderboard(): PlayerScore[] {
        const board = localStorage.getItem('cosmicDodgeLeaderboard');
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
                    <span>Score: ${entry.score}</span>
                </li>`;
            leaderboardList.innerHTML += listItem;
        });
        highScoreSpan.textContent = board.length > 0 ? board[0].score.toString() : "0";
    }

    // --- 5. Game Core Logic ---
    function setupGame() {
        gameScreen.innerHTML = '';
        objects = [];
        dodgeState.score = 0;
        if (scoreSpan) scoreSpan.textContent = "0";

        const p = document.createElement('div');
        p.classList.add('player');
        p.textContent = '🚀'; 
        gameScreen.appendChild(p);
        dodgeState.player = p;
        
        dodgeState.playerX = GAME_WIDTH / 2 - 20;
        p.style.left = `${dodgeState.playerX}px`;

        if (gameOverDiv) gameOverDiv.classList.add('hidden');
        if (gameDisplayDiv) gameDisplayDiv.classList.remove('hidden');
    }
    
    function startGameRound() {
        setupGame();
        dodgeState.status = GameStatus.PLAYING;
        dodgeState.objectTimer = setInterval(createFallingObject, OBSTACLE_INTERVAL);
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
        document.addEventListener('keydown', handleKeyDown);
    }

    function endGame() {
        if (dodgeState.status !== GameStatus.PLAYING) return;
        
        dodgeState.status = GameStatus.GAMEOVER;
        cancelAnimationFrame(dodgeState.gameLoop);
        clearInterval(dodgeState.objectTimer);
        document.removeEventListener('keydown', handleKeyDown);

        // Save Score
        let board = getLeaderboard();
        board.push({ name: dodgeState.nickname, score: dodgeState.score, date: new Date().toLocaleDateString() });
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem('cosmicDodgeLeaderboard', JSON.stringify(board.slice(0, 10)));

        renderLeaderboard(); 
        if (finalScoreMsg) finalScoreMsg.textContent = `You scored an amazing ${dodgeState.score} points!`;
        if (gameDisplayDiv) gameDisplayDiv.classList.add('hidden');
        if (gameOverDiv) gameOverDiv.classList.remove('hidden');
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (dodgeState.status !== GameStatus.PLAYING) return;
        let newX = dodgeState.playerX;
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            newX = Math.max(0, dodgeState.playerX - PLAYER_SPEED);
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            newX = Math.min(GAME_WIDTH - 40, dodgeState.playerX + PLAYER_SPEED);
        }
        dodgeState.playerX = newX;
        if (dodgeState.player) dodgeState.player.style.left = `${dodgeState.playerX}px`;
    }

    function createFallingObject() {
        const objEl = document.createElement('div');
        objEl.classList.add('object');
        const startX = Math.floor(Math.random() * (GAME_WIDTH - 20));
        objEl.style.left = `${startX}px`;
        
        objects.push({
            element: objEl,
            y: -20, 
            speed: Math.random() * 2 + 1.5,
            width: 20,
            x: startX
        });
        gameScreen.appendChild(objEl);
    }

    function gameLoop() {
        if (dodgeState.status !== GameStatus.PLAYING) return;
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            obj.y += obj.speed; 
            obj.element.style.top = `${obj.y}px`;

            // Collision Detection
            const pLeft = dodgeState.playerX;
            const pRight = dodgeState.playerX + 40;
            const pTop = GAME_HEIGHT - 40; 
            
            if (obj.y + obj.width > pTop && obj.y < GAME_HEIGHT &&
                obj.x + obj.width > pLeft && obj.x < pRight) {
                endGame();
                return; 
            }

            if (obj.y > GAME_HEIGHT) {
                obj.element.remove(); 
                objects.splice(i, 1); 
                i--; 
                dodgeState.score++;
                if (scoreSpan) scoreSpan.textContent = dodgeState.score.toString();
            }
        }
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
    }
    
    // --- 6. Event Listeners ---
    startDodgeBtn.addEventListener('click', () => {
        const nick = nicknameInput.value.trim();
        if (nick.length < 2) {
            alert('Please enter a nickname of at least 2 characters!');
            return;
        }

        // Music Fade-in Logic
        if (dodgeMusic) {
            dodgeMusic.volume = 0; 
            dodgeMusic.play().catch(() => console.log("Audio blocked"));
            let fadeIn = setInterval(() => {
                if (dodgeMusic.volume < AudioConfig.QUIET) {
                    dodgeMusic.volume = Math.min(AudioConfig.QUIET, dodgeMusic.volume + AudioConfig.FADE_STEP);
                } else {
                    clearInterval(fadeIn);
                }
            }, AudioConfig.FADE_INTERVAL);
        }

        dodgeState.nickname = nick;
        setupDiv?.classList.add('hidden');
        instructionsDiv?.classList.remove('hidden');
        if (currentPlayerNameSpan) currentPlayerNameSpan.textContent = nick;
    });

    startRoundBtn.addEventListener('click', () => {
        instructionsDiv?.classList.add('hidden');
        startGameRound();
    });

    playAgainBtn.addEventListener('click', () => {
        gameOverDiv?.classList.add('hidden');
        instructionsDiv?.classList.remove('hidden');
    });

    if (musicToggle && dodgeMusic) {
        musicToggle.addEventListener('click', () => {
            if (dodgeMusic.paused) {
                dodgeMusic.play();
                if (musicIcon) musicIcon.className = 'fas fa-volume-up'; 
            } else {
                dodgeMusic.pause();
                if (musicIcon) musicIcon.className = 'fas fa-volume-mute'; 
            }
        });
    }

    renderLeaderboard();
}

// Inisialisasi
window.addEventListener('load', initCosmicDodgeGame);