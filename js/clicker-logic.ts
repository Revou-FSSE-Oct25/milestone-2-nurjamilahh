import { fadeInAudio } from './utils/audio-helper.js';

interface LeaderboardEntry {
    name: string;
    score: number;
}

const gameConfig = {
    duration: 10,
    minNameLength: 2,
    maxEntries: 5
};

const uiIcons = {
    medal: 'fas fa-medal',
    volOn: 'fa-volume-up',
    volOff: 'fa-volume-mute'
} as const;

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

enum AudioConfig {
    targetVolume = 0.5, 
    fadeStep = 0.01,
    fadeInterval = 100
}

const storageKeys = {
    leaderboard: 'clickerLeaderboard'
} as const;

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

    const gameMusic = getEl<HTMLAudioElement>('gameMusic');
    const musicToggle = getEl<HTMLButtonElement>('musicToggle');
    const musicIcon = getEl<HTMLElement >('musicIcon');

    const refreshLeaderboard = (): void => {
        if (!ui.leadList) return;
        const data = localStorage.getItem(storageKeys.leaderboard);
        
        let list: LeaderboardEntry[];
        try {
            list = JSON.parse(data || '[]');
        } catch (error) {
            console.error("Leaderboard parsing failed", error);
            list = [];
        }

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
            ui.leadList?.appendChild(li);
        });
    };

    const startGame = (): void => {
        score = 0;
        let timeLeft = gameConfig.duration;
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

        const data = localStorage.getItem(storageKeys.leaderboard);
        
        let list: LeaderboardEntry[];
        try {
            list = JSON.parse(data || '[]');
        } catch (error) {
            console.error("Failed to update leaderboard", error);
            list = [];
        }

        list.push({ name: playerName, score });
        list.sort((a, b) => b.score - a.score);
        localStorage.setItem(storageKeys.leaderboard, JSON.stringify(list.slice(0, gameConfig.maxEntries)));
        refreshLeaderboard();
    };

    ui.startBtn?.addEventListener('click', () => {
        const val = ui.nickInput?.value.trim() || '';
        if (val.length >= gameConfig.minNameLength) {
            playerName = val;
            sections.setup?.classList.add('hidden');
            sections.instructions?.classList.remove('hidden');
            try { 
                if (gameMusic) fadeInAudio(gameMusic, 1000); 
            } catch (error) {
                console.warn("Audio fade-in failed", error);
            }
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

    musicToggle?.addEventListener('click', () => {
        if (!gameMusic || !musicIcon) return;
        switch (gameMusic.paused) {
            case true:
                try {
                    fadeInAudio(gameMusic, 1000);
                } catch (error) {
                    console.error("Music playback error", error);    
                    gameMusic.play().catch(() => {});
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