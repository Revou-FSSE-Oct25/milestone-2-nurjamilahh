const CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 500,
    PLAYER_SIZE: 40,
    OBSTACLE_SIZE: 30,
    PLAYER_SPEED: 7,
    OBSTACLE_SPEED_MIN: 3,
    OBSTACLE_SPEED_MAX: 6,
    SPAWN_RATE: 0.02,
    MAX_LEADERBOARD: 5,
    SCORE_INCREMENT: 0.1,
    COLORS: {
        PLAYER: '#60a5fa',
        OBSTACLE: '#ef4444'
    }
};
let score = 0;
let isGameRunning = false;
let animationId = null;
let nickname = "Commander";
const keys = {};
const player = {
    x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2,
    y: CONFIG.CANVAS_HEIGHT - 60,
    width: CONFIG.PLAYER_SIZE,
    height: CONFIG.PLAYER_SIZE
};
let obstacles = [];
function initRocketGame() {
    const canvas = document.getElementById('rocket-canvas');
    const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    if (!canvas || !ctx)
        return;
    const setupDiv = document.getElementById('nickname-setup');
    const instructDiv = document.getElementById('rocket-instructions');
    const displayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('dodge-game-over');
    const nickInput = document.getElementById('nickname-input');
    const startBtn = document.getElementById('start-rocket-btn');
    const roundBtn = document.getElementById('start-round-btn');
    const playAgainBtn = document.getElementById('play-again-rocket-btn');
    const scoreSpan = document.getElementById('rocket-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('rocket-leaderboard-list');
    const musicElement = document.getElementById('gameMusic');
    function spawnObstacle() {
        if (Math.random() < CONFIG.SPAWN_RATE) {
            obstacles.push({
                x: Math.random() * (CONFIG.CANVAS_WIDTH - CONFIG.OBSTACLE_SIZE),
                y: -CONFIG.OBSTACLE_SIZE,
                width: CONFIG.OBSTACLE_SIZE,
                height: CONFIG.OBSTACLE_SIZE,
                speed: Math.random() * (CONFIG.OBSTACLE_SPEED_MAX - CONFIG.OBSTACLE_SPEED_MIN) + CONFIG.OBSTACLE_SPEED_MIN
            });
        }
    }
    function update() {
        if (!isGameRunning)
            return;
        if ((keys['ArrowLeft'] || keys['a']) && player.x > 0) {
            player.x -= CONFIG.PLAYER_SPEED;
        }
        if ((keys['ArrowRight'] || keys['d']) && player.x < CONFIG.CANVAS_WIDTH - player.width) {
            player.x += CONFIG.PLAYER_SPEED;
        }
        spawnObstacle();
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.y += obs.speed;
            if (player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y) {
                endGame();
                return;
            }
            if (obs.y > CONFIG.CANVAS_HEIGHT) {
                obstacles.splice(i, 1);
            }
        }
        score += CONFIG.SCORE_INCREMENT;
        if (scoreSpan)
            scoreSpan.textContent = Math.floor(score).toString();
        draw();
        animationId = requestAnimationFrame(update);
    }
    function draw() {
        if (!ctx)
            return;
        ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        ctx.fillStyle = CONFIG.COLORS.PLAYER;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = CONFIG.COLORS.OBSTACLE;
        obstacles.forEach(obs => {
            ctx.beginPath();
            ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    function endGame() {
        isGameRunning = false;
        if (animationId)
            cancelAnimationFrame(animationId);
        saveScore();
        if (displayDiv)
            displayDiv.classList.add('hidden');
        if (gameOverDiv) {
            gameOverDiv.classList.remove('hidden');
            if (finalScoreMsg) {
                finalScoreMsg.textContent = `Survival Time: ${Math.floor(score)}s`;
            }
        }
    }
    function saveScore() {
        const rawData = localStorage.getItem('rocketLeaderboard');
        const board = rawData ? JSON.parse(rawData) : [];
        board.push({ name: nickname, score: Math.floor(score) });
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem('rocketLeaderboard', JSON.stringify(board.slice(0, CONFIG.MAX_LEADERBOARD)));
        renderLeaderboard();
    }
    function renderLeaderboard() {
        if (!leaderboardList)
            return;
        const rawData = localStorage.getItem('rocketLeaderboard');
        const board = rawData ? JSON.parse(rawData) : [];
        leaderboardList.innerHTML = '';
        board.forEach((entry, idx) => {
            const li = document.createElement('li');
            li.className = "flex justify-between p-2 border-b border-white/5";
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${idx + 1}. ${entry.name}`;
            const scoreSpan = document.createElement('strong');
            scoreSpan.textContent = `${entry.score}s`;
            li.append(nameSpan, scoreSpan);
            leaderboardList.appendChild(li);
        });
    }
    function resetGameState() {
        score = 0;
        obstacles = [];
        player.x = CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2;
        if (scoreSpan)
            scoreSpan.textContent = "0";
    }
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);
    startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', () => {
        nickname = nickInput.value.trim().substring(0, 15) || "Commander";
        setupDiv === null || setupDiv === void 0 ? void 0 : setupDiv.classList.add('hidden');
        instructDiv === null || instructDiv === void 0 ? void 0 : instructDiv.classList.remove('hidden');
        const nameDisplay = document.getElementById('current-player-name');
        if (nameDisplay)
            nameDisplay.textContent = nickname;
        if (musicElement) {
            musicElement.volume = 0.2;
            musicElement.play().catch(() => console.log("Audio interaction required"));
        }
    });
    roundBtn === null || roundBtn === void 0 ? void 0 : roundBtn.addEventListener('click', () => {
        instructDiv === null || instructDiv === void 0 ? void 0 : instructDiv.classList.add('hidden');
        displayDiv === null || displayDiv === void 0 ? void 0 : displayDiv.classList.remove('hidden');
        resetGameState();
        isGameRunning = true;
        update();
    });
    playAgainBtn === null || playAgainBtn === void 0 ? void 0 : playAgainBtn.addEventListener('click', () => {
        gameOverDiv === null || gameOverDiv === void 0 ? void 0 : gameOverDiv.classList.add('hidden');
        displayDiv === null || displayDiv === void 0 ? void 0 : displayDiv.classList.remove('hidden');
        resetGameState();
        isGameRunning = true;
        update();
    });
    renderLeaderboard();
}
window.addEventListener('load', initRocketGame);
export {};
//# sourceMappingURL=rocket-logic.js.map