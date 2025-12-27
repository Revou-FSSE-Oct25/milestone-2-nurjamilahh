/**
 * =======================
 * ✂️ Rock Paper Scissors
 * =======================
 */
var AudioConfig;
(function (AudioConfig) {
    AudioConfig[AudioConfig["QUIET"] = 0.1] = "QUIET";
    AudioConfig[AudioConfig["FADE_STEP"] = 0.01] = "FADE_STEP";
    AudioConfig[AudioConfig["FADE_INTERVAL"] = 100] = "FADE_INTERVAL";
})(AudioConfig || (AudioConfig = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["IDLE"] = "IDLE";
    GameStatus["PLAYING"] = "PLAYING";
})(GameStatus || (GameStatus = {}));
/**
 * ==================
 * ✂️ RPS Game Logic
 * ==================
 */
function initRPSGame() {
    // --- 2. DOM Elements ---
    const startRPSBtn = document.getElementById('start-rps-btn');
    const startRoundBtn = document.getElementById('start-round-btn');
    const resetBtn = document.getElementById('rps-reset-btn');
    const rpsMusic = document.getElementById('gameMusic');
    const nicknameInput = document.getElementById('nickname-input');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon'); // ID di HTML adalah musicIcon
    const setupDiv = document.getElementById('nickname-setup');
    const instructionsDiv = document.getElementById('rps-instructions');
    const gameDisplayDiv = document.getElementById('game-display');
    const currentPlayerNameSpan = document.getElementById('current-player-name');
    const playerScoreSpan = document.getElementById('player-score');
    const computerScoreSpan = document.getElementById('computer-score');
    const roundResultMsg = document.getElementById('rps-round-result');
    const leaderboardList = document.getElementById('rps-leaderboard-list');
    const choiceBtns = document.querySelectorAll('.choice-btn');
    if (!startRPSBtn || !rpsMusic || !nicknameInput) {
        console.warn("Important DOM elements missing.");
        return;
    }
    // Set Volume Awal
    rpsMusic.volume = AudioConfig.QUIET;
    // --- 3. Game State ---
    let rpsState = {
        playerScore: 0,
        computerScore: 0,
        status: GameStatus.IDLE,
        nickname: ''
    };
    // --- 4. Leaderboard Functions ---
    function getLeaderboard() {
        const board = localStorage.getItem('rpsLeaderboard');
        return board ? JSON.parse(board) : [];
    }
    function saveToLeaderboard() {
        if (rpsState.playerScore === 0)
            return;
        let board = getLeaderboard();
        // Cek apakah user sudah ada di board
        const existingIdx = board.findIndex(entry => entry.name === rpsState.nickname);
        if (existingIdx !== -1) {
            // Update jika skor baru lebih tinggi
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
        localStorage.setItem('rpsLeaderboard', JSON.stringify(board.slice(0, 10)));
        renderLeaderboard();
    }
    function renderLeaderboard() {
        if (!leaderboardList)
            return;
        const board = getLeaderboard();
        leaderboardList.innerHTML = '';
        board.forEach((entry, index) => {
            const listItem = `
                <li>
                    <span>${index + 1}. <strong>${entry.name}</strong></span>
                    <span>Wins: ${entry.score}</span>
                </li>`;
            leaderboardList.innerHTML += listItem;
        });
    }
    // --- 5. Game Core Logic ---
    function playRound(playerChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        const icons = { rock: '✊', paper: '🖐️', scissors: '✌️' };
        let result = "";
        let resultClass = "message-box";
        if (playerChoice === computerChoice) {
            result = "DRAW! 🤝";
        }
        else if ((playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')) {
            rpsState.playerScore++;
            result = "YOU WIN! 🎉";
            resultClass = "message-box winner";
            saveToLeaderboard(); // Simpan setiap kali menang
        }
        else {
            rpsState.computerScore++;
            result = "COMPUTER WINS! 🤖";
            resultClass = "message-box loser";
        }
        // Update UI
        if (roundResultMsg) {
            roundResultMsg.innerHTML = `${icons[playerChoice]} vs ${icons[computerChoice]}<br><strong>${result}</strong>`;
            roundResultMsg.className = resultClass;
        }
        if (playerScoreSpan)
            playerScoreSpan.textContent = rpsState.playerScore.toString();
        if (computerScoreSpan)
            computerScoreSpan.textContent = rpsState.computerScore.toString();
    }
    // --- 6. Event Listeners ---
    startRPSBtn.addEventListener('click', () => {
        const nick = nicknameInput.value.trim();
        if (nick.length < 2) {
            alert('Please enter a nickname of at least 2 characters!');
            return;
        }
        // Music Fade-in
        if (rpsMusic) {
            rpsMusic.volume = 0;
            rpsMusic.play().catch(() => console.log("Audio blocked"));
            let fadeIn = setInterval(() => {
                if (rpsMusic.volume < AudioConfig.QUIET) {
                    rpsMusic.volume = Math.min(AudioConfig.QUIET, rpsMusic.volume + AudioConfig.FADE_STEP);
                }
                else {
                    clearInterval(fadeIn);
                }
            }, AudioConfig.FADE_INTERVAL);
        }
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
// Inisialisasi
window.addEventListener('load', initRPSGame);
export {};
//# sourceMappingURL=rps-logic.js.map