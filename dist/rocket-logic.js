import { fadeInAudio } from './utils/audio-helper.js';
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PLAYER_SIZE = 40;
const OBSTACLE_SIZE = 30;
const PLAYER_SPEED = 7;
const OBSTACLE_SPEED_MIN = 3;
const OBSTACLE_SPEED_MAX = 6;
const SPAWN_RATE = 0.02;
const MAX_LEADERBOARD = 5;
let score = 0;
let isGameRunning = false;
let animationId;
let player = { x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, y: CANVAS_HEIGHT - 60, width: PLAYER_SIZE, height: PLAYER_SIZE };
let obstacles = [];
let nickname = "";
let keys = {};
function initRocketGame() {
    const canvas = document.getElementById('rocket-canvas');
    const rawCtx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    if (!canvas || !rawCtx)
        return;
    const ctx = rawCtx;
    const setupDiv = document.getElementById('nickname-setup');
    const instructDiv = document.getElementById('rocket-instructions');
    const displayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('dodge-game-over');
    const nickInput = document.getElementById('nickname-input');
    const startBtn = document.getElementById('start-rocket-btn');
    const roundBtn = document.getElementById('start-round-btn');
    const playAgainBtn = document.getElementById('play-again-dodge-btn');
    const scoreSpan = document.getElementById('rocket-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('rocket-leaderboard-list');
    const musicElement = document.getElementById('gameMusic');
    if (musicElement) {
        musicElement.volume = 0;
    }
    if (!canvas || !ctx)
        return;
    function spawnObstacle() {
        if (Math.random() < SPAWN_RATE) {
            obstacles.push({
                x: Math.random() * (CANVAS_WIDTH - OBSTACLE_SIZE),
                y: -OBSTACLE_SIZE,
                width: OBSTACLE_SIZE,
                height: OBSTACLE_SIZE,
                speed: Math.random() * (OBSTACLE_SPEED_MAX - OBSTACLE_SPEED_MIN) + OBSTACLE_SPEED_MIN
            });
        }
    }
    function update() {
        if (!isGameRunning)
            return;
        if ((keys['ArrowLeft'] || keys['a']) && player.x > 0)
            player.x -= PLAYER_SPEED;
        if ((keys['ArrowRight'] || keys['d']) && player.x < CANVAS_WIDTH - player.width)
            player.x += PLAYER_SPEED;
        spawnObstacle();
        obstacles.forEach((obs, index) => {
            obs.y += obs.speed;
            if (player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y) {
                endGame();
            }
            if (obs.y > CANVAS_HEIGHT)
                obstacles.splice(index, 1);
        });
        score += 0.1;
        if (scoreSpan)
            scoreSpan.textContent = Math.floor(score).toString();
        draw(ctx);
        animationId = requestAnimationFrame(update);
    }
    function draw(ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = '#ef4444';
        obstacles.forEach(obs => {
            ctx.beginPath();
            ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    function endGame() {
        isGameRunning = false;
        cancelAnimationFrame(animationId);
        saveScore();
        if (displayDiv)
            displayDiv.classList.add('hidden');
        if (gameOverDiv) {
            gameOverDiv.classList.remove('hidden');
            if (finalScoreMsg)
                finalScoreMsg.textContent = `Survival Time: ${Math.floor(score)}s`;
        }
    }
    function saveScore() {
        const board = JSON.parse(localStorage.getItem('rocketLeaderboard') || '[]');
        board.push({ name: nickname, score: Math.floor(score) });
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem('rocketLeaderboard', JSON.stringify(board.slice(0, MAX_LEADERBOARD)));
        renderLeaderboard();
    }
    function renderLeaderboard() {
        if (!leaderboardList)
            return;
        const board = JSON.parse(localStorage.getItem('rocketLeaderboard') || '[]');
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
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);
    startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', () => {
        console.log("Tombol diklik, mencoba memutar musik...");
        nickname = nickInput.value.trim() || "Commander";
        setupDiv === null || setupDiv === void 0 ? void 0 : setupDiv.classList.add('hidden');
        instructDiv === null || instructDiv === void 0 ? void 0 : instructDiv.classList.remove('hidden');
        const nameDisplay = document.getElementById('current-player-name');
        if (nameDisplay)
            nameDisplay.textContent = nickname;
        if (musicElement) {
            musicElement.play().catch(err => console.error("Audio failed:", err));
            fadeInAudio(musicElement, 0.1);
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
    function resetGameState() {
        score = 0;
        obstacles = [];
        player.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
        if (scoreSpan)
            scoreSpan.textContent = "0";
    }
    renderLeaderboard();
}
window.addEventListener('load', initRocketGame);
//# sourceMappingURL=rocket-logic.js.map