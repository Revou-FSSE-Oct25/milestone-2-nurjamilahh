import { fadeInAudio } from './utils/audio-helper.js';

interface LeaderboardEntry {
    name: string;
    score: number;
}

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

enum AudioConfig {
    TARGET_VOLUME = 0.5, 
    FADE_STEP = 0.01,
    FADE_INTERVAL = 100
}

const STORAGE = {
    LEADERBOARD: 'turbo_click_safe_v3'
};

document.addEventListener('DOMContentLoaded', () => {
    let playerName = '';
    let score = 0;
    let timer: number | null = null;
    let isGameActive = false;

    const getEl = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

    const sections = {
        setup: getEl<HTMLElement>('nickname-setup'),
        instructions: getEl<HTMLElement>('clicker-instructions'),
        display: getEl<HTMLElement>('game-display'),
        gameOver: getEl<HTMLElement>('clicker-game-over')
    };

    const ui = {
        nickInput: getEl<HTMLInputElement>('nickname-input'),
        startBtn: getEl<HTMLButtonElement>('start-game-btn'),
        readyBtn: getEl<HTMLButtonElement>('start-round-btn'),
        clickBtn: getEl<HTMLButtonElement>('main-click-btn'),
        retryBtn: getEl<HTMLButtonElement>('play-again-clicker-btn'),
        timerSpan: getEl<HTMLElement>('clicker-timer'),
        scoreSpan: getEl<HTMLElement>('clicker-score'),
        leadList: getEl<HTMLUListElement>('rps-leaderboard-list'),
        finalMsg: getEl<HTMLElement>('final-score-message')
    };

    const audio = {
        music: getEl<HTMLAudioElement>('gameMusic'),
        toggle: getEl<HTMLButtonElement>('musicToggle'),
        icon: getEl<HTMLElement>('musicIcon')
    };

    const refreshLeaderboard = (): void => {
        if (!ui.leadList) return;
        const data = localStorage.getItem(STORAGE.LEADERBOARD);
        const list: LeaderboardEntry[] = JSON.parse(data || '[]');

        while (ui.leadList.firstChild) ui.leadList.removeChild(ui.leadList.firstChild);

        if (list.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No Titans Yet";
            li.className = "text-center opacity-50";
            ui.leadList.appendChild(li);
            return;
        }

        list.forEach((entry, index) => {
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
            ui.leadList?.appendChild(li);
        });
    };

    const startGame = (): void => {
        score = 0;
        let timeLeft = GAME_CONFIG.DURATION;
        isGameActive = true;

        if (ui.scoreSpan) ui.scoreSpan.textContent = '0';
        if (ui.timerSpan) ui.timerSpan.textContent = timeLeft.toString();

        if (timer) clearInterval(timer);
        timer = window.setInterval(() => {
            timeLeft--;
            if (ui.timerSpan) ui.timerSpan.textContent = timeLeft.toString();
            if (timeLeft <= 0) stopGame();
        }, 1000);
    };

    const stopGame = (): void => {
        isGameActive = false;
        if (timer) clearInterval(timer);
        sections.display?.classList.add('hidden');
        sections.gameOver?.classList.remove('hidden');
        if (ui.finalMsg) ui.finalMsg.textContent = `Score: ${score} Clicks!`;

        const data = localStorage.getItem(STORAGE.LEADERBOARD);
        let list: LeaderboardEntry[] = JSON.parse(data || '[]');
        list.push({ name: playerName, score });
        list.sort((a, b) => b.score - a.score);
        localStorage.setItem(STORAGE.LEADERBOARD, JSON.stringify(list.slice(0, GAME_CONFIG.MAX_ENTRIES)));
        refreshLeaderboard();
    };

    ui.startBtn?.addEventListener('click', () => {
        const val = ui.nickInput?.value.trim() || '';
        if (val.length >= GAME_CONFIG.MIN_NAME_LENGTH) {
            playerName = val;
            sections.setup?.classList.add('hidden');
            sections.instructions?.classList.remove('hidden');
            try { if (audio.music) fadeInAudio(audio.music, 1000); } catch {}
        }
    });

    ui.readyBtn?.addEventListener('click', () => {
        sections.instructions?.classList.add('hidden');
        sections.display?.classList.remove('hidden');
        startGame();
    });

    ui.clickBtn?.addEventListener('click', () => {
        if (!isGameActive) return;
        score++;
        if (ui.scoreSpan) ui.scoreSpan.textContent = score.toString();
    });

    ui.retryBtn?.addEventListener('click', () => {
        sections.gameOver?.classList.add('hidden');
        sections.display?.classList.remove('hidden');
        startGame();
    });

    audio.toggle?.addEventListener('click', () => {
        if (!audio.music || !audio.icon) return;
        if (audio.music.paused) {
            audio.music.play().catch(() => {});
            audio.icon.classList.replace(UI_ICONS.VOL_OFF, UI_ICONS.VOL_ON);
        } else {
            audio.music.pause();
            audio.icon.classList.replace(UI_ICONS.VOL_ON, UI_ICONS.VOL_OFF);
        }
    });

    refreshLeaderboard();
});