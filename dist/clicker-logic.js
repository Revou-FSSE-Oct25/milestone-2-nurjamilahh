import { fadeInAudio } from './utils/audio-helper.js';
const gameConfig = {
    duration: 10,
    minNameLength: 2,
    maxEntries: 5
};
const uiIcons = {
    medal: 'fas fa-medal',
    volOn: 'fa-volume-up',
    volOff: 'fa-volume-mute'
};
const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
var AudioConfig;
(function (AudioConfig) {
    AudioConfig[AudioConfig["targetVolume"] = 0.5] = "targetVolume";
    AudioConfig[AudioConfig["fadeStep"] = 0.01] = "fadeStep";
    AudioConfig[AudioConfig["fadeInterval"] = 100] = "fadeInterval";
})(AudioConfig || (AudioConfig = {}));
const storageKeys = {
    leaderboard: 'clickerLeaderboard'
};
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d;
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
    const gameMusic = getEl('gameMusic');
    const musicToggle = getEl('musicToggle');
    const musicIcon = getEl('musicIcon');
    const refreshLeaderboard = () => {
        if (!ui.leadList)
            return;
        const data = localStorage.getItem(storageKeys.leaderboard);
        let list;
        try {
            list = JSON.parse(data || '[]');
        }
        catch (error) {
            console.error("Leaderboard parsing failed", error);
            list = [];
        }
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
            if (index < medalColors.length) {
                const medal = document.createElement('i');
                medal.className = uiIcons.medal;
                medal.style.color = medalColors[index];
                medal.style.marginRight = '12px';
                nameWrap.appendChild(medal);
                li.style.color = medalColors[index];
                li.style.borderColor = `${medalColors[index]}44`;
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
        let timeLeft = gameConfig.duration;
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
        const data = localStorage.getItem(storageKeys.leaderboard);
        let list;
        try {
            list = JSON.parse(data || '[]');
        }
        catch (error) {
            console.error("Failed to update leaderboard", error);
            list = [];
        }
        list.push({ name: playerName, score });
        list.sort((a, b) => b.score - a.score);
        localStorage.setItem(storageKeys.leaderboard, JSON.stringify(list.slice(0, gameConfig.maxEntries)));
        refreshLeaderboard();
    };
    (_a = ui.startBtn) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b, _c;
        const val = ((_a = ui.nickInput) === null || _a === void 0 ? void 0 : _a.value.trim()) || '';
        if (val.length >= gameConfig.minNameLength) {
            playerName = val;
            (_b = sections.setup) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
            (_c = sections.instructions) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
            try {
                if (gameMusic)
                    fadeInAudio(gameMusic, 1000);
            }
            catch (error) {
                console.warn("Audio fade-in failed", error);
            }
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
    musicToggle === null || musicToggle === void 0 ? void 0 : musicToggle.addEventListener('click', () => {
        if (!gameMusic || !musicIcon)
            return;
        switch (gameMusic.paused) {
            case true:
                try {
                    fadeInAudio(gameMusic, 1000);
                }
                catch (error) {
                    console.error("Music playback error", error);
                    gameMusic.play().catch(() => { });
                }
                musicIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
                break;
            case false:
                gameMusic.pause();
                musicIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
                break;
        }
    });
    refreshLeaderboard();
});
//# sourceMappingURL=clicker-logic.js.map