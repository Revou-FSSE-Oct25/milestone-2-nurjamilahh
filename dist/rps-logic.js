import { fadeInAudio } from './utils/audio-helper.js';
const MIN_NICKNAME_LENGTH = 2;
const MAX_LEADERBOARD_ENTRIES = 5;
const ICONS = {
    rock: 'fas fa-hand-rock',
    paper: 'fas fa-hand-paper',
    scissors: 'fas fa-hand-scissors'
};
const STATUS_ICONS = {
    winner: 'fas fa-trophy',
    loser: 'fas fa-robot',
    draw: 'fas fa-handshake'
};
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
var AudioConfig;
(function (AudioConfig) {
    AudioConfig[AudioConfig["TARGET_VOLUME"] = 0.1] = "TARGET_VOLUME";
    AudioConfig[AudioConfig["FADE_STEP"] = 0.01] = "FADE_STEP";
    AudioConfig[AudioConfig["FADE_INTERVAL"] = 100] = "FADE_INTERVAL";
})(AudioConfig || (AudioConfig = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["IDLE"] = "IDLE";
    GameStatus["PLAYING"] = "PLAYING";
})(GameStatus || (GameStatus = {}));
function initRPSGame() {
    const startRPSBtn = document.getElementById('start-rps-btn');
    const startRoundBtn = document.getElementById('start-round-btn');
    const resetBtn = document.getElementById('rps-reset-btn');
    const rpsMusic = document.getElementById('gameMusic');
    const nicknameInput = document.getElementById('nickname-input');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const setupDiv = document.getElementById('nickname-setup');
    const instructionsDiv = document.getElementById('rps-instructions');
    const gameDisplayDiv = document.getElementById('game-display');
    const currentPlayerNameSpan = document.getElementById('current-player-name');
    const playerScoreSpan = document.getElementById('player-score');
    const computerScoreSpan = document.getElementById('computer-score');
    const roundResultMsg = document.getElementById('rps-round-result');
    const leaderboardList = document.getElementById('rps-leaderboard-list');
    const choiceBtns = document.querySelectorAll('.choice-btn');
    if (!startRPSBtn || !rpsMusic || !nicknameInput)
        return;
    let rpsState = {
        playerScore: 0,
        computerScore: 0,
        status: GameStatus.IDLE,
        nickname: ''
    };
    function getLeaderboard() {
        const board = localStorage.getItem('rpsLeaderboard');
        return board ? JSON.parse(board) : [];
    }
    function saveToLeaderboard() {
        if (rpsState.playerScore === 0)
            return;
        let board = getLeaderboard();
        const existingIdx = board.findIndex(entry => entry.name === rpsState.nickname);
        if (existingIdx !== -1) {
            if (rpsState.playerScore > board[existingIdx].score) {
                board[existingIdx].score = rpsState.playerScore;
                board[existingIdx].date = new Date().toLocaleDateString();
            }
        }
        else {
            board.push({
                name: rpsState.nickname,
                score: rpsState.playerScore,
                date: new Date().toLocaleDateString()
            });
        }
        board.sort((a, b) => b.score - a.score);
        localStorage.setItem('rpsLeaderboard', JSON.stringify(board.slice(0, MAX_LEADERBOARD_ENTRIES)));
        renderLeaderboard();
    }
    function renderLeaderboard() {
        if (!leaderboardList)
            return;
        const board = getLeaderboard();
        leaderboardList.innerHTML = '';
        board.forEach((entry, index) => {
            const li = document.createElement('li');
            const rankSpan = document.createElement('span');
            if (index < 3) {
                const medal = document.createElement('i');
                medal.className = 'fas fa-medal';
                medal.style.color = MEDAL_COLORS[index];
                medal.style.marginRight = '8px';
                rankSpan.appendChild(medal);
            }
            rankSpan.append(`${index + 1}. `);
            const nameBold = document.createElement('strong');
            nameBold.textContent = entry.name;
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = ` Wins: ${entry.score}`;
            li.append(rankSpan, nameBold, scoreSpan);
            leaderboardList.appendChild(li);
        });
    }
    function playRound(playerChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        let result = "";
        let resultClass = "message-box";
        let statusIcon = "";
        if (playerChoice === computerChoice) {
            result = "DRAW!";
            statusIcon = STATUS_ICONS.draw;
        }
        else if ((playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')) {
            rpsState.playerScore++;
            result = "YOU WIN!";
            resultClass = "message-box winner";
            statusIcon = STATUS_ICONS.winner;
            saveToLeaderboard();
        }
        else {
            rpsState.computerScore++;
            result = "COMPUTER WINS!";
            resultClass = "message-box loser";
            statusIcon = STATUS_ICONS.loser;
        }
        if (roundResultMsg) {
            roundResultMsg.textContent = "";
            const battleDiv = document.createElement('div');
            battleDiv.style.fontSize = '2rem';
            battleDiv.style.marginBottom = '8px';
            const pIcon = document.createElement('i');
            pIcon.className = ICONS[playerChoice];
            const cIcon = document.createElement('i');
            cIcon.className = ICONS[computerChoice];
            battleDiv.append(pIcon, " vs ", cIcon);
            const statusDiv = document.createElement('div');
            const sIcon = document.createElement('i');
            sIcon.className = statusIcon;
            sIcon.style.marginRight = '8px';
            if (result === "YOU WIN!")
                sIcon.style.color = MEDAL_COLORS[0];
            const statusText = document.createElement('strong');
            statusText.textContent = result;
            statusDiv.append(sIcon, statusText);
            roundResultMsg.append(battleDiv, statusDiv);
            roundResultMsg.className = resultClass;
        }
        if (playerScoreSpan)
            playerScoreSpan.textContent = rpsState.playerScore.toString();
        if (computerScoreSpan)
            computerScoreSpan.textContent = rpsState.computerScore.toString();
    }
    startRPSBtn.addEventListener('click', () => {
        const nick = nicknameInput.value.trim();
        if (nick.length < MIN_NICKNAME_LENGTH) {
            alert(`Nickname minimal ${MIN_NICKNAME_LENGTH} karakter!`);
            return;
        }
        if (rpsMusic)
            fadeInAudio(rpsMusic, AudioConfig.TARGET_VOLUME);
        rpsState.nickname = nick;
        setupDiv === null || setupDiv === void 0 ? void 0 : setupDiv.classList.add('hidden');
        instructionsDiv === null || instructionsDiv === void 0 ? void 0 : instructionsDiv.classList.remove('hidden');
        if (currentPlayerNameSpan)
            currentPlayerNameSpan.textContent = nick;
    });
    startRoundBtn.addEventListener('click', () => {
        instructionsDiv === null || instructionsDiv === void 0 ? void 0 : instructionsDiv.classList.add('hidden');
        gameDisplayDiv === null || gameDisplayDiv === void 0 ? void 0 : gameDisplayDiv.classList.remove('hidden');
        rpsState.status = GameStatus.PLAYING;
    });
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (rpsState.status !== GameStatus.PLAYING)
                return;
            const choice = btn.getAttribute('data-choice');
            playRound(choice);
        });
    });
    resetBtn.addEventListener('click', () => {
        rpsState.playerScore = 0;
        rpsState.computerScore = 0;
        if (playerScoreSpan)
            playerScoreSpan.textContent = "0";
        if (computerScoreSpan)
            computerScoreSpan.textContent = "0";
        if (roundResultMsg) {
            roundResultMsg.textContent = "Score reset! Pick your weapon!";
            roundResultMsg.className = "message-box";
        }
    });
    if (musicToggle && rpsMusic) {
        musicToggle.addEventListener('click', () => {
            if (rpsMusic.paused) {
                rpsMusic.play();
                if (musicIcon)
                    musicIcon.className = 'fas fa-volume-up';
            }
            else {
                rpsMusic.pause();
                if (musicIcon)
                    musicIcon.className = 'fas fa-volume-mute';
            }
        });
    }
    renderLeaderboard();
}
window.addEventListener('load', initRPSGame);
//# sourceMappingURL=rps-logic.js.map