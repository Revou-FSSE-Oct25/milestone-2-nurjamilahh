/**
 * ================================================
 * 🌠 Cosmic Dodge (Falling Objects) Game Logic
 * ================================================
 */
function initCosmicDodgeGame() {
    // 1. DOM Elements
    const gameScreen = document.getElementById('game-screen');
    const startDodgeBtn = document.getElementById('start-dodge-btn');
    const startRoundBtn = document.getElementById('start-round-btn');
    const playAgainBtn = document.getElementById('play-again-dodge-btn');

    const nicknameInput = document.getElementById('nickname-input');
    const currentPlayerNameSpan = document.getElementById('current-player-name');
    const setupDiv = document.getElementById('nickname-setup');
    const instructionsDiv = document.getElementById('dodge-instructions');
    const gameDisplayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('dodge-game-over');
    
    const scoreSpan = document.getElementById('dodge-score');
    const highScoreSpan = document.getElementById('dodge-high-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('dodge-leaderboard-list');

    const music = document.getElementById('gameMusic');
    const startBtn = document.getElementById('start-dodge-btn');
    const musicToggle = document.getElementById('musicToggle');

    // 2. Game Constants 
    const GAME_WIDTH = 480;
    const GAME_HEIGHT = 320;
    const PLAYER_SPEED = 10;
    const OBSTACLE_INTERVAL = 800;

    // 3. Game Data
    let dodgeState = {
        player: null,
        playerX: GAME_WIDTH / 2 - 20,
        score: 0,
        gameLoop: null,
        objectTimer: null,
        gameActive: false,
        nickname: ''
    };
    let objects = [];

    // --- LocalStorage and Leaderboard Functions ---
    function getLeaderboard() {
        const board = localStorage.getItem('cosmicDodgeLeaderboard');
        return board ? JSON.parse(board) : [];
    }

    function saveLeaderboard(board) {
        localStorage.setItem('cosmicDodgeLeaderboard', JSON.stringify(board));
    }

    function addScoreToLeaderboard() {
        let board = getLeaderboard();
        board.push({
            name: dodgeState.nickname,
            score: dodgeState.score,
            date: new Date().toLocaleDateString()
        });
        board.sort((a, b) => b.score - a.score);
        board = board.slice(0, 10);
        saveLeaderboard(board);
    }

    function renderLeaderboard() {
        const board = getLeaderboard();
        leaderboardList.innerHTML = ''; 
        board.forEach((entry, index) => {
            const listItem = `
                <li class="flex justify-between p-2 border-b">
                    <span>${index + 1}. <strong>${entry.name}</strong></span>
                    <span>Score: ${entry.score}</span>
                </li>
            `;
            leaderboardList.innerHTML += listItem;
        });
        const highScore = board.length > 0 ? board[0].score : 0;
        highScoreSpan.textContent = highScore;
    }

    // --- Game Setup and Control Functions ---
    function setupGame() {
        gameScreen.innerHTML = '';
        objects = [];
        dodgeState.score = 0;
        scoreSpan.textContent = 0;

        dodgeState.player = document.createElement('div');
        dodgeState.player.classList.add('player');
        dodgeState.player.textContent = '🚀'; 
        gameScreen.appendChild(dodgeState.player);
        
        dodgeState.playerX = GAME_WIDTH / 2 - 20;
        dodgeState.player.style.left = `${dodgeState.playerX}px`;

        gameOverDiv.classList.add('hidden');
        gameDisplayDiv.classList.remove('hidden');
    }
    
    function startGameRound() {
        setupGame();
        dodgeState.gameActive = true;
        dodgeState.objectTimer = setInterval(createFallingObject, OBSTACLE_INTERVAL);
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
        document.addEventListener('keydown', handleKeyDown);
    }

    function endGame() {
    if (!dodgeState.gameActive) return;
    
    dodgeState.gameActive = false;
    cancelAnimationFrame(dodgeState.gameLoop);
    clearInterval(dodgeState.objectTimer);
    document.removeEventListener('keydown', handleKeyDown);

    addScoreToLeaderboard(); 
    renderLeaderboard(); 

    finalScoreMsg.textContent = `You scored an amazing ${dodgeState.score} points!`;
    
    gameDisplayDiv.classList.add('hidden');
    gameOverDiv.classList.remove('hidden');
}

    function handleKeyDown(event) {
        if (!dodgeState.gameActive) return;
        let newX = dodgeState.playerX;
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            newX = Math.max(0, dodgeState.playerX - PLAYER_SPEED);
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            newX = Math.min(GAME_WIDTH - 40, dodgeState.playerX + PLAYER_SPEED);
        }
        dodgeState.playerX = newX;
        dodgeState.player.style.left = `${dodgeState.playerX}px`;
    }

    function createFallingObject() {
        const objectElement = document.createElement('div');
        objectElement.classList.add('object');
        const startX = Math.floor(Math.random() * (GAME_WIDTH - 20));
        objectElement.style.left = `${startX}px`;
        const objectData = {
            element: objectElement,
            y: -20, 
            speed: Math.random() * 2 + 1.5,
            width: 20,
            x: startX
        };
        gameScreen.appendChild(objectElement);
        objects.push(objectData);
    }

    function gameLoop() {
        if (!dodgeState.gameActive) return;
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            obj.y += obj.speed; 
            obj.element.style.top = `${obj.y}px`;

            const playerLeft = dodgeState.playerX;
            const playerRight = dodgeState.playerX + 40;
            const playerTop = GAME_HEIGHT - 40; 
            const playerBottom = GAME_HEIGHT;
            
            if (
                obj.y + obj.width > playerTop && 
                obj.y < playerBottom &&
                obj.x + obj.width > playerLeft && 
                obj.x < playerRight
            ) {
                endGame();
                return; 
            }

            if (obj.y > GAME_HEIGHT) {
                obj.element.remove(); 
                objects.splice(i, 1); 
                i--; 
                dodgeState.score++;
                scoreSpan.textContent = dodgeState.score;
            }
        }
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
    }
    
    // --- Event Handling ---
    startDodgeBtn.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        if (nickname.length < 2) {
            alert('Please enter a nickname of at least 2 characters!');
            return;
        }

        if (music) {
        music.volume = 0.3; // Volume 
        music.play().catch(e => console.log("Audio play blocked"));
    }

        dodgeState.nickname = nickname;
        setupDiv.classList.add('hidden');
        instructionsDiv.classList.remove('hidden');
        currentPlayerNameSpan.textContent = nickname;
    });

    startRoundBtn.addEventListener('click', () => {
        instructionsDiv.classList.add('hidden');
        startGameRound();
    });

    playAgainBtn.addEventListener('click', () => {
        gameOverDiv.classList.add('hidden');
        instructionsDiv.classList.remove('hidden');
    });

    renderLeaderboard();

    // --- MUTE/UNMUTE ---
    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicIcon.className = 'fas fa-volume-up'; 
        } else {
            music.pause();
            musicIcon.className = 'fas fa-volume-mute'; 
        }
    });
}

window.addEventListener('load', initCosmicDodgeGame);