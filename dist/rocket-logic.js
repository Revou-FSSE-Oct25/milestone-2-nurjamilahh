import { fadeInAudio } from './utils/audio-helper.js';
const rocketConfig = {
    canvasWidth: 400,
    canvasHeight: 500,
    playerSize: 40,
    meteorSize: 35,
    playerSpeed: 8,
    initialMeteorSpeed: 3,
    speedIncrement: 0.05,
    meteorSpawnRate: 0.02,
    storageKeys: {
        leaderboard: 'rocketLeaderboard'
    },
    fadeDuration: 1500
};
class RocketGame {
    constructor() {
        this.score = 0;
        this.isRunning = false;
        this.animationId = 0;
        this.nickname = '';
        this.meteors = [];
        this.keys = {};
        this.gameLoop = () => {
            if (!this.isRunning)
                return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.keys['ArrowLeft'] && this.playerX > 25) {
                this.playerX -= rocketConfig.playerSpeed;
            }
            if (this.keys['ArrowRight'] && this.playerX < this.canvas.width - 25) {
                this.playerX += rocketConfig.playerSpeed;
            }
            if (Math.random() < rocketConfig.meteorSpawnRate) {
                this.meteors.push({
                    x: Math.random() * (this.canvas.width - 40) + 20,
                    y: -40,
                    speed: rocketConfig.initialMeteorSpeed + (this.score * rocketConfig.speedIncrement)
                });
            }
            this.ctx.font = '40px serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🚀', this.playerX, this.canvas.height - 50);
            for (let i = this.meteors.length - 1; i >= 0; i--) {
                const m = this.meteors[i];
                m.y += m.speed;
                this.ctx.fillText('☄️', m.x, m.y);
                const dx = this.playerX - m.x;
                const dy = (this.canvas.height - 50) - m.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 30) {
                    this.endGame();
                }
                if (m.y > this.canvas.height + 50) {
                    this.meteors.splice(i, 1);
                    this.score++;
                    const scoreEl = document.getElementById('rocket-score');
                    if (scoreEl)
                        scoreEl.textContent = this.score.toString();
                }
            }
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        };
        this.canvas = document.getElementById('rocket-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.playerX = this.canvas.width / 2;
        this.gameMusic = document.getElementById('gameMusic');
        this.musicToggle = document.getElementById('musicToggle');
        this.musicIcon = document.getElementById('musicIcon');
        this.initEventListeners();
        this.renderLeaderboard();
    }
    initEventListeners() {
        var _a, _b, _c;
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
        (_a = document.getElementById('start-rocket-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.setupNickname());
        (_b = document.getElementById('start-round-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.startGame());
        (_c = document.getElementById('play-again-rocket-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.resetGame());
        this.musicToggle.addEventListener('click', () => this.toggleMusic());
    }
    setupNickname() {
        var _a, _b;
        const input = document.getElementById('nickname-input');
        this.nickname = this.sanitize(input.value.trim()) || 'Commander';
        (_a = document.getElementById('nickname-setup')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('rocket-instructions')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        const display = document.getElementById('current-player-name');
        if (display)
            display.textContent = this.nickname;
    }
    startGame() {
        var _a, _b;
        (_a = document.getElementById('rocket-instructions')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('game-display')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        this.isRunning = true;
        fadeInAudio(this.gameMusic, rocketConfig.fadeDuration);
        this.musicIcon.className = 'fas fa-volume-up';
        this.gameLoop();
    }
    toggleMusic() {
        if (this.gameMusic.paused) {
            this.gameMusic.play();
            this.musicIcon.className = 'fas fa-volume-up';
        }
        else {
            this.gameMusic.pause();
            this.musicIcon.className = 'fas fa-volume-mute';
        }
    }
    endGame() {
        var _a;
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        this.saveScore();
        (_a = document.getElementById('game-display')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        const gameOverSection = document.getElementById('dodge-game-over');
        if (gameOverSection) {
            gameOverSection.classList.remove('hidden');
            const title = gameOverSection.querySelector('h2');
            if (title)
                title.style.color = '#ef4444';
        }
        const msg = document.getElementById('final-score-message');
        if (msg)
            msg.textContent = `FINAL SCORE: ${this.score}`;
    }
    resetGame() {
        var _a;
        this.score = 0;
        this.meteors = [];
        this.playerX = this.canvas.width / 2;
        const scoreEl = document.getElementById('rocket-score');
        if (scoreEl)
            scoreEl.textContent = '0';
        (_a = document.getElementById('dodge-game-over')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        this.startGame();
    }
    saveScore() {
        const scores = JSON.parse(localStorage.getItem(rocketConfig.storageKeys.leaderboard) || '[]');
        scores.push({ name: this.nickname, score: this.score });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem(rocketConfig.storageKeys.leaderboard, JSON.stringify(scores.slice(0, 5)));
        this.renderLeaderboard();
    }
    renderLeaderboard() {
        const list = document.getElementById('rocket-leaderboard-list');
        if (!list)
            return;
        const scores = JSON.parse(localStorage.getItem(rocketConfig.storageKeys.leaderboard) || '[]');
        const medals = ['🥇', '🥈', '🥉'];
        list.innerHTML = scores.map((s, i) => `
            <li class="flex items-center justify-between p-2 border-b border-white/5">
                <span>
                    ${i < 3 ? medals[i] : `<span class="inline-block w-6 text-center mr-1">${i + 1}.</span>`} 
                    ${this.sanitize(s.name)}
                </span>
                <span class="font-mono text-blue-400 font-bold">${s.score}</span>
            </li>
        `).join('');
    }
    sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
new RocketGame();
//# sourceMappingURL=rocket-logic.js.map