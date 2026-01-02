import { fadeInAudio } from './utils/audio-helper.js';
const GAME_CONFIG = {
    DURATION: 10,
    MIN_NAME_LENGTH: 2,
    MAX_ENTRIES: 5
};
const UI_ICONS = {
    MEDAL: 'fas fa-medal',
    VOL_ON: 'fa-volume-up',
    VOL_OFF: 'fa-volume-mute'
};
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
var AudioConfig;
(function (AudioConfig) {
    AudioConfig[AudioConfig["TARGET_VOLUME"] = 0.5] = "TARGET_VOLUME";
    AudioConfig[AudioConfig["FADE_STEP"] = 0.01] = "FADE_STEP";
    AudioConfig[AudioConfig["FADE_INTERVAL"] = 100] = "FADE_INTERVAL";
})(AudioConfig || (AudioConfig = {}));
const STORAGE = {
    LEADERBOARD: 'turbo_click_safe_v3'
};
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d, _e;
    let playerName = '';
    let score = 0;
    let timer = null;
    let isGameActive = false;
    const getEl = (id) => document.getElementById(id);
    const sections = {
        setup: getEl('nickname-setup'),
        instructions: getEl('clicker-instructions'),
        display: getEl('game-display'),
        gameOver: getEl('clicker-game-over')
    };
    const ui = {
        nickInput: getEl('nickname-input'),
        startBtn: getEl('start-game-btn'),
        readyBtn: getEl('start-round-btn'),
        clickBtn: getEl('main-click-btn'),
        retryBtn: getEl('play-again-clicker-btn'),
        timerSpan: getEl('clicker-timer'),
        scoreSpan: getEl('clicker-score'),
        leadList: getEl('rps-leaderboard-list'),
        finalMsg: getEl('final-score-message')
    };
    const audio = {
        music: getEl('gameMusic'),
        toggle: getEl('musicToggle'),
        icon: getEl('musicIcon')
    };
    const refreshLeaderboard = () => {
        if (!ui.leadList)
            return;
        const data = localStorage.getItem(STORAGE.LEADERBOARD);
        const list = JSON.parse(data || '[]');
        while (ui.leadList.firstChild)
            ui.leadList.removeChild(ui.leadList.firstChild);
        if (list.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No Titans Yet";
            li.className = "text-center opacity-50";
            ui.leadList.appendChild(li);
            return;
        }
        list.forEach((entry, index) => {
            var _a;
            const li = document.createElement('li');
            const nameWrap = document.createElement('span');
            const scoreWrap = document.createElement('span');
            li.className = "flex justify-between items-center p-3 mb-2 rounded-lg bg-white/5 border border-white/10";
            if (index < MEDAL_COLORS.length) {
                const medal = document.createElement('i');
                medal.className = UI_ICONS.MEDAL;
                medal.style.color = MEDAL_COLORS[index];
                medal.style.marginRight = '12px';
                nameWrap.appendChild(medal);
                li.style.color = MEDAL_COLORS[index];
                li.style.borderColor = `${MEDAL_COLORS[index]}44`;
            }
            const nameTxt = document.createTextNode(entry.name);
            nameWrap.appendChild(nameTxt);
            scoreWrap.textContent = `${entry.score} PTS`;
            li.appendChild(nameWrap);
            li.appendChild(scoreWrap);
            (_a = ui.leadList) === null || _a === void 0 ? void 0 : _a.appendChild(li);
        });
    };
    const startGame = () => {
        score = 0;
        let timeLeft = GAME_CONFIG.DURATION;
        isGameActive = true;
        if (ui.scoreSpan)
            ui.scoreSpan.textContent = '0';
        if (ui.timerSpan)
            ui.timerSpan.textContent = timeLeft.toString();
        if (timer)
            clearInterval(timer);
        timer = window.setInterval(() => {
            timeLeft--;
            if (ui.timerSpan)
                ui.timerSpan.textContent = timeLeft.toString();
            if (timeLeft <= 0)
                stopGame();
        }, 1000);
    };
    const stopGame = () => {
        var _a, _b;
        isGameActive = false;
        if (timer)
            clearInterval(timer);
        (_a = sections.display) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = sections.gameOver) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        if (ui.finalMsg)
            ui.finalMsg.textContent = `Score: ${score} Clicks!`;
        const data = localStorage.getItem(STORAGE.LEADERBOARD);
        let list = JSON.parse(data || '[]');
        list.push({ name: playerName, score });
        list.sort((a, b) => b.score - a.score);
        localStorage.setItem(STORAGE.LEADERBOARD, JSON.stringify(list.slice(0, GAME_CONFIG.MAX_ENTRIES)));
        refreshLeaderboard();
    };
    (_a = ui.startBtn) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b, _c;
        const val = ((_a = ui.nickInput) === null || _a === void 0 ? void 0 : _a.value.trim()) || '';
        if (val.length >= GAME_CONFIG.MIN_NAME_LENGTH) {
            playerName = val;
            (_b = sections.setup) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
            (_c = sections.instructions) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
            try {
                if (audio.music)
                    fadeInAudio(audio.music, 1000);
            }
            catch (_d) { }
        }
    });
    (_b = ui.readyBtn) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        var _a, _b;
        (_a = sections.instructions) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = sections.display) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        startGame();
    });
    (_c = ui.clickBtn) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        if (!isGameActive)
            return;
        score++;
        if (ui.scoreSpan)
            ui.scoreSpan.textContent = score.toString();
    });
    (_d = ui.retryBtn) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
        var _a, _b;
        (_a = sections.gameOver) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = sections.display) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        startGame();
    });
    (_e = audio.toggle) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        if (!audio.music || !audio.icon)
            return;
        if (audio.music.paused) {
            audio.music.play().catch(() => { });
            audio.icon.classList.replace(UI_ICONS.VOL_OFF, UI_ICONS.VOL_ON);
        }
        else {
            audio.music.pause();
            audio.icon.classList.replace(UI_ICONS.VOL_ON, UI_ICONS.VOL_OFF);
        }
    });
    refreshLeaderboard();
});
//# sourceMappingURL=clicker-logic.js.map