import { fadeInAudio } from './utils/audio-helper.js';

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
} as const;

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Obstacle extends GameObject {
    speed: number;
}

interface PlayerScore {
    name: string;
    score: number;
}

let score = 0;
let isGameRunning = false;
let animationId: number | null = null;
let nickname = "Commander";
const keys: Record<string, boolean> = {};

const player: GameObject = {
    x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2,
    y: CONFIG.CANVAS_HEIGHT - 60,
    width: CONFIG.PLAYER_SIZE,
    height: CONFIG.PLAYER_SIZE
};

let obstacles: Obstacle[] = [];

function initRocketGame(): void {
    const canvas = document.getElementById('rocket-canvas') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const setupDiv = document.getElementById('nickname-setup');
    const instructDiv = document.getElementById('rocket-instructions');
    const displayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('dodge-game-over');
    
    const nickInput = document.getElementById('nickname-input') as HTMLInputElement;
    const startBtn = document.getElementById('start-rocket-btn');
    const roundBtn = document.getElementById('start-round-btn');
    const playAgainBtn = document.getElementById('play-again-rocket-btn');
    
    const scoreSpan = document.getElementById('rocket-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('rocket-leaderboard-list');
    const musicElement = document.getElementById('gameMusic') as HTMLAudioElement | null;

    function spawnObstacle(): void {
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

    function update(): void {
        if (!isGameRunning) return;

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

            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                endGame();
                return;
            }

            if (obs.y > CONFIG.CANVAS_HEIGHT) {
                obstacles.splice(i, 1);
            }
        }

        score += CONFIG.SCORE_INCREMENT;
        if (scoreSpan) scoreSpan.textContent = Math.floor(score).toString();

        draw();
        animationId = requestAnimationFrame(update);
    }

    function draw(): void {
        if (!ctx) return;
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

    function endGame(): void {
        isGameRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
        saveScore();
        
        if (displayDiv) displayDiv.classList.add('hidden');
        if (gameOverDiv) {
            gameOverDiv.classList.remove('hidden');
            if (finalScoreMsg) {
                finalScoreMsg.textContent = `Survival Time: ${Math.floor(score)}s`;
            }
        }
    }

    function saveScore(): void {
        const rawData = localStorage.getItem('rocketLeaderboard');
        const board: PlayerScore[] = rawData ? JSON.parse(rawData) : [];
        
        board.push({ name: nickname, score: Math.floor(score) });
        board.sort((a, b) => b.score - a.score);
        
        localStorage.setItem('rocketLeaderboard', JSON.stringify(board.slice(0, CONFIG.MAX_LEADERBOARD)));
        renderLeaderboard();
    }

    function renderLeaderboard(): void {
        if (!leaderboardList) return;
        const rawData = localStorage.getItem('rocketLeaderboard');
        const board: PlayerScore[] = rawData ? JSON.parse(rawData) : [];
        
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

    function resetGameState(): void {
        score = 0;
        obstacles = [];
        player.x = CONFIG.CANVAS_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2;
        if (scoreSpan) scoreSpan.textContent = "0";
    }

    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);

    startBtn?.addEventListener('click', () => {
        nickname = nickInput.value.trim().substring(0, 15) || "Commander";
        setupDiv?.classList.add('hidden');
        instructDiv?.classList.remove('hidden');
        
        const nameDisplay = document.getElementById('current-player-name');
        if (nameDisplay) nameDisplay.textContent = nickname;

        if (musicElement) {
            musicElement.volume = 0.2;
            musicElement.play().catch(() => console.log("Audio interaction required"));
        }
    });

    roundBtn?.addEventListener('click', () => {
        instructDiv?.classList.add('hidden');
        displayDiv?.classList.remove('hidden');
        resetGameState();
        isGameRunning = true;
        update();
    });

    playAgainBtn?.addEventListener('click', () => {
        gameOverDiv?.classList.add('hidden');
        displayDiv?.classList.remove('hidden');
        resetGameState();
        isGameRunning = true;
        update();
    });

    renderLeaderboard();
}

window.addEventListener('load', initRocketGame);