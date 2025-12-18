/**
 * ================================================
 * 🌠 Cosmic Dodge - TypeScript Final Clean Version
 * ================================================
 */
// 1. Enums & Interfaces 
var AudioConfig;
(function (AudioConfig) {
    AudioConfig[AudioConfig["QUIET"] = 0.1] = "QUIET";
    AudioConfig[AudioConfig["FADE_STEP"] = 0.01] = "FADE_STEP";
    AudioConfig[AudioConfig["FADE_INTERVAL"] = 100] = "FADE_INTERVAL";
})(AudioConfig || (AudioConfig = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["IDLE"] = "IDLE";
    GameStatus["PLAYING"] = "PLAYING";
    GameStatus["GAMEOVER"] = "GAMEOVER";
})(GameStatus || (GameStatus = {}));

/**
 * ============================
 * 🌠 Cosmic Dodge Game Logic
 * ============================
 */
function initCosmicDodgeGame() {
    // --- 2. DOM Elements (Dengan Type Casting agar .volume/.value tidak merah) ---
    var gameScreen = document.getElementById('game-screen');
    var startDodgeBtn = document.getElementById('start-dodge-btn');
    var startRoundBtn = document.getElementById('start-round-btn');
    var playAgainBtn = document.getElementById('play-again-dodge-btn');
    var dodgeMusic = document.getElementById('gameMusic');
    var nicknameInput = document.getElementById('nickname-input');
    var musicToggle = document.getElementById('musicToggle');
    var musicIcon = document.getElementById('music-icon');
    // Safety Check
    if (!startDodgeBtn || !dodgeMusic || !gameScreen || !nicknameInput) {
        console.warn("Important DOM elements missing.");
        return;
    }
    
    // const ctx = gameScreen.getContext('2d');
    // gameScreen.width = 480;   
    // gameScreen.height = 320;
    
    var currentPlayerNameSpan = document.getElementById('current-player-name');
    var setupDiv = document.getElementById('nickname-setup');
    var instructionsDiv = document.getElementById('dodge-instructions');
    var gameDisplayDiv = document.getElementById('game-display');
    var gameOverDiv = document.getElementById('dodge-game-over');
    var scoreSpan = document.getElementById('dodge-score');
    var highScoreSpan = document.getElementById('dodge-high-score');
    var finalScoreMsg = document.getElementById('final-score-message');
    var leaderboardList = document.getElementById('dodge-leaderboard-list');
    // Set Volume Awal (0.1)
    dodgeMusic.volume = AudioConfig.QUIET;
    // --- 3. Game Constants & State ---
    var GAME_WIDTH = 480;
    var GAME_HEIGHT = 320;
    var PLAYER_SPEED = 10;
    var OBSTACLE_INTERVAL = 800;
    var dodgeState = {
        player: null,
        playerX: GAME_WIDTH / 2 - 20,
        score: 0,
        gameLoop: 0,
        objectTimer: null,
        status: GameStatus.IDLE,
        nickname: ''
    };
    var objects = [];
    // --- 4. Leaderboard Functions ---
    function getLeaderboard() {
        var board = localStorage.getItem('cosmicDodgeLeaderboard');
        return board ? JSON.parse(board) : [];
    }
    function renderLeaderboard() {
        if (!leaderboardList || !highScoreSpan)
            return;
        var board = getLeaderboard();
        leaderboardList.innerHTML = '';
        board.forEach(function (entry, index) {
            var listItem = "\n                <li class=\"flex justify-between p-2 border-b\">\n                    <span>".concat(index + 1, ". <strong>").concat(entry.name, "</strong></span>\n                    <span>Score: ").concat(entry.score, "</span>\n                </li>");
            leaderboardList.innerHTML += listItem;
        });
        highScoreSpan.textContent = board.length > 0 ? board[0].score.toString() : "0";
    }
    // --- 5. Game Core Logic ---
    function setupGame() {
        gameScreen.innerHTML = '';
        objects = [];
        dodgeState.score = 0;
        if (scoreSpan)
            scoreSpan.textContent = "0";
        var p = document.createElement('div');
        p.classList.add('player');
        p.textContent = '🚀';
        gameScreen.appendChild(p);
        dodgeState.player = p;
        dodgeState.playerX = GAME_WIDTH / 2 - 20;
        p.style.left = "".concat(dodgeState.playerX, "px");
        if (gameOverDiv)
            gameOverDiv.classList.add('hidden');
        if (gameDisplayDiv)
            gameDisplayDiv.classList.remove('hidden');
    }
    function startGameRound() {
        setupGame();
        dodgeState.status = GameStatus.PLAYING;
        dodgeState.objectTimer = setInterval(createFallingObject, OBSTACLE_INTERVAL);
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
        document.addEventListener('keydown', handleKeyDown);
    }
    function endGame() {
        if (dodgeState.status !== GameStatus.PLAYING)
            return;
        dodgeState.status = GameStatus.GAMEOVER;
        cancelAnimationFrame(dodgeState.gameLoop);
        clearInterval(dodgeState.objectTimer);
        document.removeEventListener('keydown', handleKeyDown);
        // Save Score
        var board = getLeaderboard();
        board.push({ name: dodgeState.nickname, score: dodgeState.score, date: new Date().toLocaleDateString() });
        board.sort(function (a, b) { return b.score - a.score; });
        localStorage.setItem('cosmicDodgeLeaderboard', JSON.stringify(board.slice(0, 10)));
        renderLeaderboard();
        if (finalScoreMsg)
            finalScoreMsg.textContent = "You scored an amazing ".concat(dodgeState.score, " points!");
        if (gameDisplayDiv)
            gameDisplayDiv.classList.add('hidden');
        if (gameOverDiv)
            gameOverDiv.classList.remove('hidden');
    }
    function handleKeyDown(event) {
        if (dodgeState.status !== GameStatus.PLAYING)
            return;
        var newX = dodgeState.playerX;
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            newX = Math.max(0, dodgeState.playerX - PLAYER_SPEED);
        }
        else if (event.key === 'ArrowRight' || event.key === 'd') {
            newX = Math.min(GAME_WIDTH - 40, dodgeState.playerX + PLAYER_SPEED);
        }
        dodgeState.playerX = newX;
        if (dodgeState.player)
            dodgeState.player.style.left = "".concat(dodgeState.playerX, "px");
    }
    function createFallingObject() {
        var objEl = document.createElement('div');
        objEl.classList.add('object');
        var startX = Math.floor(Math.random() * (GAME_WIDTH - 20));
        objEl.style.left = "".concat(startX, "px");
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
        if (dodgeState.status !== GameStatus.PLAYING)
            return;
        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            obj.y += obj.speed;
            obj.element.style.top = "".concat(obj.y, "px");
            // Collision Detection
            var pLeft = dodgeState.playerX;
            var pRight = dodgeState.playerX + 40;
            var pTop = GAME_HEIGHT - 40;
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
                if (scoreSpan)
                    scoreSpan.textContent = dodgeState.score.toString();
            }
        }
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
    }
    // --- 6. Event Listeners ---
    startDodgeBtn.addEventListener('click', function () {
        var nick = nicknameInput.value.trim();
        if (nick.length < 2) {
            alert('Please enter a nickname of at least 2 characters!');
            return;
        }
        // Music Fade-in Logic
        if (dodgeMusic) {
            dodgeMusic.volume = 0;
            dodgeMusic.play().catch(function () { return console.log("Audio blocked"); });
            var fadeIn_1 = setInterval(function () {
                if (dodgeMusic.volume < AudioConfig.QUIET) {
                    dodgeMusic.volume = Math.min(AudioConfig.QUIET, dodgeMusic.volume + AudioConfig.FADE_STEP);
                }
                else {
                    clearInterval(fadeIn_1);
                }
            }, AudioConfig.FADE_INTERVAL);
        }
        dodgeState.nickname = nick;
        setupDiv === null || setupDiv === void 0 ? void 0 : setupDiv.classList.add('hidden');
        instructionsDiv === null || instructionsDiv === void 0 ? void 0 : instructionsDiv.classList.remove('hidden');
        if (currentPlayerNameSpan)
            currentPlayerNameSpan.textContent = nick;
    });
    startRoundBtn.addEventListener('click', function () {
        instructionsDiv === null || instructionsDiv === void 0 ? void 0 : instructionsDiv.classList.add('hidden');
        startGameRound();
    });
    playAgainBtn.addEventListener('click', function () {
        gameOverDiv === null || gameOverDiv === void 0 ? void 0 : gameOverDiv.classList.add('hidden');
        instructionsDiv === null || instructionsDiv === void 0 ? void 0 : instructionsDiv.classList.remove('hidden');
    });
    if (musicToggle && dodgeMusic) {
        musicToggle.addEventListener('click', function () {
            if (dodgeMusic.paused) {
                dodgeMusic.play();
                if (musicIcon)
                    musicIcon.className = 'fas fa-volume-up';
            }
            else {
                dodgeMusic.pause();
                if (musicIcon)
                    musicIcon.className = 'fas fa-volume-mute';
            }
        });
    }
    renderLeaderboard();
}

window.addEventListener('load', initCosmicDodgeGame);
