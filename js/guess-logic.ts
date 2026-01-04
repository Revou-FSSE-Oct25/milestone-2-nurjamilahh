import { fadeInAudio } from './utils/audio-helper.js';

interface GameState {
    playerName: string;
    secretNumber: number;
    attemptsLeft: number;
    totalAttemptsUsed: number;
    gameActive: boolean;
    highScore: number;
}

interface LeaderboardEntry {
    name: string;
    score: number;
}

const gameConfig = {
    maxAttempts: 5,
    minNumber: 1,
    maxNumber: 100,
    storageKeys: {
        highScore: 'guessHighScore',
        leaderboard: 'guessLeaderboard'
    }
} as const;

let gameState: GameState;

document.addEventListener('DOMContentLoaded', () => {
    gameState = {
        playerName: '',
        secretNumber: 0,
        attemptsLeft: gameConfig.maxAttempts,
        totalAttemptsUsed: 0,
        gameActive: false,
        highScore: Number(localStorage.getItem(gameConfig.storageKeys.highScore)) || 0
    };

    const nicknameSetup = document.getElementById('nickname-setup') as HTMLElement;
    const nicknameInput = document.getElementById('nickname-input') as HTMLInputElement;
    const startGuessBtn = document.getElementById('start-guess-btn') as HTMLButtonElement;
    const instructionBox = document.getElementById('guess-instructions') as HTMLElement;
    const startRoundBtn = document.getElementById('start-round-btn') as HTMLButtonElement;
    const currentPlayerName = document.getElementById('current-player-name') as HTMLElement;
    
    const gameDisplay = document.getElementById('game-display') as HTMLElement;
    const guessForm = document.getElementById('guess-form') as HTMLFormElement;
    const guessInput = document.getElementById('guess-input') as HTMLInputElement;
    const guessMessage = document.getElementById('guess-message') as HTMLElement;
    const attemptsSpan = document.getElementById('guess-attempts') as HTMLElement;
    const highScoreSpan = document.getElementById('guess-high-score') as HTMLElement;
    
    const gameOverSection = document.getElementById('guess-game-over') as HTMLElement;
    const resultTitle = document.getElementById('result-title') as HTMLElement;
    const finalScoreMsg = document.getElementById('final-score-message') as HTMLElement;
    const resetBtn = document.getElementById('guess-reset-btn') as HTMLButtonElement;
    const leaderboardList = document.getElementById('guess-leaderboard-list') as HTMLUListElement;

    const gameMusic = document.getElementById('gameMusic') as HTMLAudioElement;
    const musicToggle = document.getElementById('musicToggle') as HTMLButtonElement;
    const musicIcon = document.getElementById('musicIcon') as HTMLElement;

    if (highScoreSpan) highScoreSpan.textContent = gameState.highScore.toString();
    updateLeaderboard();

    startGuessBtn?.addEventListener('click', () => {
        const name = nicknameInput.value.trim();
        if (name) {
            gameState.playerName = name;
            if (currentPlayerName) currentPlayerName.textContent = name;
            nicknameSetup.classList.add('hidden');
            instructionBox.classList.remove('hidden');
            
            try {
                fadeInAudio(gameMusic, 1000); 
            } catch {

            } 
        }
});

    startRoundBtn?.addEventListener('click', () => {
        instructionBox.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });

    function initGame(): void {
        gameState.secretNumber = Math.floor(Math.random() * gameConfig.maxNumber) + gameConfig.minNumber;
        gameState.attemptsLeft = gameConfig.maxAttempts;
        gameState.totalAttemptsUsed = 0;
        gameState.gameActive = true;

        if (attemptsSpan) attemptsSpan.textContent = gameState.attemptsLeft.toString();
        if (guessMessage) {
            guessMessage.textContent = 'Waiting for your guess...';
            guessMessage.className = 'message-box';
        }
        if (guessInput) {
            guessInput.value = '';
            guessInput.disabled = false;
        }
        gameOverSection.classList.add('hidden');
    }

    guessForm?.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        if (!gameState.gameActive) return;

        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < gameConfig.minNumber || guess > gameConfig.maxNumber) return;

        gameState.attemptsLeft--;
        gameState.totalAttemptsUsed++;
        if (attemptsSpan) attemptsSpan.textContent = gameState.attemptsLeft.toString();

        if (guess === gameState.secretNumber) {
            endGame(true);
        } else if (gameState.attemptsLeft === 0) {
            endGame(false);
        } else {
            if (guessMessage) {
                guessMessage.textContent = guess < gameState.secretNumber ? "📉 Too Low!" : "📈 Too High!";
            }
        }
        guessInput.value = '';
    });

    function endGame(isWin: boolean): void {
        gameState.gameActive = false;
        guessInput.disabled = true;
        gameDisplay.classList.add('hidden');
        gameOverSection.classList.remove('hidden');

        if (isWin) {
            resultTitle.textContent = "🎉 Excellent Guess!";
            resultTitle.style.color = "#22c55e"; 
            finalScoreMsg.textContent = `The number was ${gameState.secretNumber}. You found it in ${gameState.totalAttemptsUsed} attempts!`;
            saveScore(gameState.playerName, gameState.totalAttemptsUsed);
        } else {
            resultTitle.textContent = "😭 Mission Failed!";
            resultTitle.style.color = "#ef4444"; 
            finalScoreMsg.textContent = `You ran out of juice! The number was ${gameState.secretNumber}.`;
        }
    }

    function saveScore(name: string, score: number): void {
        const rawData = localStorage.getItem(gameConfig.storageKeys.leaderboard);
        let leaderboard: LeaderboardEntry[] = JSON.parse(rawData || '[]');
        
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => a.score - b.score);
        leaderboard = leaderboard.slice(0, 5); 
        
        localStorage.setItem(gameConfig.storageKeys.leaderboard, JSON.stringify(leaderboard));
        
        if (gameState.highScore === 0 || score < gameState.highScore) {
            localStorage.setItem(gameConfig.storageKeys.highScore, score.toString());
            gameState.highScore = score;
            if (highScoreSpan) highScoreSpan.textContent = score.toString();
        }
        updateLeaderboard(); 
    }

    function updateLeaderboard(): void {
        if (!leaderboardList) return;
        
        const rawData = localStorage.getItem(gameConfig.storageKeys.leaderboard);
        const leaderboard: LeaderboardEntry[] = JSON.parse(rawData || '[]');
        
        leaderboardList.innerHTML = '';

        if (leaderboard.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.style.color = "#ccc";
            emptyMsg.style.listStyle = "none";
            emptyMsg.style.textAlign = "center";
            emptyMsg.textContent = "No scores yet...";
            leaderboardList.appendChild(emptyMsg);
            return;
        }

        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.style.color = "#ffeb3b";
            li.style.listStyle = "none";
            li.style.marginBottom = "5px";
            li.style.textAlign = "center";
            
            const icon = document.createElement('i');
            icon.className = "fas fa-star mr-2";
            li.appendChild(icon);

            const textNode = document.createTextNode(`${entry.name}: ${entry.score} attempts`);
            li.appendChild(textNode);
            
            leaderboardList.appendChild(li);
        });
    }

    musicToggle?.addEventListener('click', () => {
    if (gameMusic.paused) {
        try {
            fadeInAudio(gameMusic, 1000);
        } catch {
        }
        musicIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    } else {
        gameMusic.pause();
        musicIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    }
});

    resetBtn?.addEventListener('click', () => {
        gameOverSection.classList.add('hidden');
        gameDisplay.classList.remove('hidden');
        initGame();
    });
});