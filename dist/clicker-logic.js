const CONFIG = {
    GAME_DURATION: 10,
    MIN_NICKNAME_LENGTH: 2,
    MAX_LEADERBOARD: 10,
    AUDIO_VOLUME: 0.15,
    FADE_INTERVAL: 100,
    FADE_STEP: 0.02,
    STORAGE_KEY: 'turboClickerLeaderboard'
};
function initTurboClickerGame() {
    const els = {
        setup: document.getElementById('nickname-setup'),
        instructions: document.getElementById('clicker-instructions'),
        display: document.getElementById('game-display'),
        gameOver: document.getElementById('clicker-game-over'),
        btnStart: document.getElementById('start-game-btn'),
        btnRound: document.getElementById('start-round-btn'),
        btnClick: document.getElementById('main-click-btn'),
        btnRetry: document.getElementById('play-again-clicker-btn'),
        inputNick: document.getElementById('nickname-input'),
        spanPlayer: document.getElementById('current-player-name'),
        spanTimer: document.getElementById('clicker-timer'),
        spanScore: document.getElementById('clicker-score'),
        spanHigh: document.getElementById('clicker-high-score'),
        msgFinal: document.getElementById('final-score-message'),
        listBoard: document.getElementById('clicker-leaderboard-list'),
        music: document.getElementById('gameMusic'),
        musicToggle: document.getElementById('musicToggle'),
        musicIcon: document.getElementById('musicIcon')
    };
    if (!els.btnStart || !els.music || !els.btnClick)
        return;
    let score = 0;
    let timeLeft = CONFIG.GAME_DURATION;
    let nickname = '';
    let timer = null;
    let isPlaying = false;
    const getBoard = () => {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };
    const renderBoard = () => {
        var _a;
        if (!els.listBoard)
            return;
        const board = getBoard();
        els.listBoard.innerHTML = '';
        board.forEach((entry, idx) => {
            var _a;
            const li = document.createElement('li');
            li.className = 'flex justify-between text-sm py-1 border-b border-gray-900 last:border-0';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'text-gray-400';
            nameSpan.textContent = `${idx + 1}. ${entry.name}`; // XSS Safe
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'font-mono text-blue-400';
            scoreSpan.textContent = entry.score.toString();
            li.append(nameSpan, scoreSpan);
            (_a = els.listBoard) === null || _a === void 0 ? void 0 : _a.appendChild(li);
        });
        if (els.spanHigh) {
            els.spanHigh.textContent = ((_a = board[0]) === null || _a === void 0 ? void 0 : _a.score.toString()) || '0';
        }
    };
    const handleMusic = (shouldPlay) => {
        if (shouldPlay) {
            els.music.volume = 0;
            els.music.play().catch(() => console.warn("Audio interaction needed"));
            const fadeIn = setInterval(() => {
                if (els.music.volume < CONFIG.AUDIO_VOLUME) {
                    els.music.volume = Math.min(CONFIG.AUDIO_VOLUME, els.music.volume + CONFIG.FADE_STEP);
                }
                else {
                    clearInterval(fadeIn);
                }
            }, CONFIG.FADE_INTERVAL);
        }
    };
    const startRound = () => {
        var _a, _b;
        score = 0;
        timeLeft = CONFIG.GAME_DURATION;
        isPlaying = true;
        if (els.spanScore)
            els.spanScore.textContent = '0';
        if (els.spanTimer)
            els.spanTimer.textContent = timeLeft.toString();
        (_a = els.instructions) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = els.display) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        timer = setInterval(() => {
            timeLeft--;
            if (els.spanTimer)
                els.spanTimer.textContent = timeLeft.toString();
            if (timeLeft <= 0)
                endGame();
        }, 1000);
    };
    const endGame = () => {
        var _a, _b;
        isPlaying = false;
        if (timer)
            clearInterval(timer);
        const board = getBoard();
        board.push({ name: nickname, score, date: new Date().toISOString() });
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(board.slice(0, CONFIG.MAX_LEADERBOARD)));
        if (els.msgFinal)
            els.msgFinal.textContent = `You achieved ${score} clicks!`;
        (_a = els.display) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = els.gameOver) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        renderBoard();
    };
    els.btnStart.addEventListener('click', () => {
        var _a, _b;
        const val = els.inputNick.value.trim();
        if (val.length < CONFIG.MIN_NICKNAME_LENGTH)
            return alert('Nickname too short!');
        nickname = val;
        handleMusic(true);
        if (els.spanPlayer)
            els.spanPlayer.textContent = nickname;
        (_a = els.setup) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = els.instructions) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    });
    els.btnRound.addEventListener('click', startRound);
    els.btnClick.addEventListener('click', () => {
        if (!isPlaying)
            return;
        score++;
        if (els.spanScore)
            els.spanScore.textContent = score.toString();
    });
    els.btnRetry.addEventListener('click', () => {
        var _a, _b;
        (_a = els.gameOver) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = els.instructions) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    });
    els.musicToggle.addEventListener('click', () => {
        var _a, _b;
        if (els.music.paused) {
            els.music.play();
            (_a = els.musicIcon) === null || _a === void 0 ? void 0 : _a.setAttribute('class', 'fas fa-volume-up text-blue-400');
        }
        else {
            els.music.pause();
            (_b = els.musicIcon) === null || _b === void 0 ? void 0 : _b.setAttribute('class', 'fas fa-volume-mute text-gray-500');
        }
    });
    renderBoard();
}
document.addEventListener('DOMContentLoaded', initTurboClickerGame);
export {};
//# sourceMappingURL=clicker-logic.js.map