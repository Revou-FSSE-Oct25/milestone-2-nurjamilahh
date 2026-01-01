export {};

const CONFIG = {
    GAME_DURATION: 10,
    MIN_NICKNAME_LENGTH: 2,
    MAX_LEADERBOARD: 10,
    AUDIO_VOLUME: 0.15,
    FADE_INTERVAL: 100,
    FADE_STEP: 0.02,
    STORAGE_KEY: 'turboClickerLeaderboard'
} as const;

interface PlayerScore {
    name: string;
    score: number;
    date: string;
}

function initTurboClickerGame(): void {
   
    const els = {
        setup: document.getElementById('nickname-setup'),
        instructions: document.getElementById('clicker-instructions'),
        display: document.getElementById('game-display'),
        gameOver: document.getElementById('clicker-game-over'),
        
        btnStart: document.getElementById('start-game-btn') as HTMLButtonElement,
        btnRound: document.getElementById('start-round-btn') as HTMLButtonElement,
        btnClick: document.getElementById('main-click-btn') as HTMLButtonElement,
        btnRetry: document.getElementById('play-again-clicker-btn') as HTMLButtonElement,
        
        inputNick: document.getElementById('nickname-input') as HTMLInputElement,
        spanPlayer: document.getElementById('current-player-name'),
        spanTimer: document.getElementById('clicker-timer'),
        spanScore: document.getElementById('clicker-score'),
        spanHigh: document.getElementById('clicker-high-score'),
        msgFinal: document.getElementById('final-score-message'),
        listBoard: document.getElementById('clicker-leaderboard-list'),
        
        music: document.getElementById('gameMusic') as HTMLAudioElement,
        musicToggle: document.getElementById('musicToggle') as HTMLButtonElement,
        musicIcon: document.getElementById('musicIcon')
    };

    if (!els.btnStart || !els.music || !els.btnClick) return;

    let score = 0;
    let timeLeft = CONFIG.GAME_DURATION;
    let nickname = '';
    let timer: ReturnType<typeof setInterval> | null = null;
    let isPlaying = false;

    const getBoard = (): PlayerScore[] => {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    const renderBoard = (): void => {
        if (!els.listBoard) return;
        const board = getBoard();
        els.listBoard.innerHTML = '';

        board.forEach((entry, idx) => {
            const li = document.createElement('li');
            li.className = 'flex justify-between text-sm py-1 border-b border-gray-900 last:border-0';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'text-gray-400';
            nameSpan.textContent = `${idx + 1}. ${entry.name}`; // XSS Safe

            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'font-mono text-blue-400';
            scoreSpan.textContent = entry.score.toString();

            li.append(nameSpan, scoreSpan);
            els.listBoard?.appendChild(li);
        });

        if (els.spanHigh) {
            els.spanHigh.textContent = board[0]?.score.toString() || '0';
        }
    };

    const handleMusic = (shouldPlay: boolean): void => {
        if (shouldPlay) {
            els.music.volume = 0;
            els.music.play().catch(() => console.warn("Audio interaction needed"));
            const fadeIn = setInterval(() => {
                if (els.music.volume < CONFIG.AUDIO_VOLUME) {
                    els.music.volume = Math.min(CONFIG.AUDIO_VOLUME, els.music.volume + CONFIG.FADE_STEP);
                } else {
                    clearInterval(fadeIn);
                }
            }, CONFIG.FADE_INTERVAL);
        }
    };

    const startRound = (): void => {
        score = 0;
        timeLeft = CONFIG.GAME_DURATION;
        isPlaying = true;

        if (els.spanScore) els.spanScore.textContent = '0';
        if (els.spanTimer) els.spanTimer.textContent = timeLeft.toString();
        
        els.instructions?.classList.add('hidden');
        els.display?.classList.remove('hidden');

        timer = setInterval(() => {
            timeLeft--;
            if (els.spanTimer) els.spanTimer.textContent = timeLeft.toString();
            
            if (timeLeft <= 0) endGame();
        }, 1000);
    };

    const endGame = (): void => {
        isPlaying = false;
        if (timer) clearInterval(timer);

        const board = getBoard();
        board.push({ name: nickname, score, date: new Date().toISOString() });
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(board.slice(0, CONFIG.MAX_LEADERBOARD)));

        if (els.msgFinal) els.msgFinal.textContent = `You achieved ${score} clicks!`;
        els.display?.classList.add('hidden');
        els.gameOver?.classList.remove('hidden');
        renderBoard();
    };

    els.btnStart.addEventListener('click', () => {
        const val = els.inputNick.value.trim();
        if (val.length < CONFIG.MIN_NICKNAME_LENGTH) return alert('Nickname too short!');
        
        nickname = val;
        handleMusic(true);
        if (els.spanPlayer) els.spanPlayer.textContent = nickname;
        
        els.setup?.classList.add('hidden');
        els.instructions?.classList.remove('hidden');
    });

    els.btnRound.addEventListener('click', startRound);

    els.btnClick.addEventListener('click', () => {
        if (!isPlaying) return;
        score++;
        if (els.spanScore) els.spanScore.textContent = score.toString();
    });

    els.btnRetry.addEventListener('click', () => {
        els.gameOver?.classList.add('hidden');
        els.instructions?.classList.remove('hidden');
    });

    els.musicToggle.addEventListener('click', () => {
        if (els.music.paused) {
            els.music.play();
            els.musicIcon?.setAttribute('class', 'fas fa-volume-up text-blue-400');
        } else {
            els.music.pause();
            els.musicIcon?.setAttribute('class', 'fas fa-volume-mute text-gray-500');
        }
    });

    renderBoard();
}

document.addEventListener('DOMContentLoaded', initTurboClickerGame);