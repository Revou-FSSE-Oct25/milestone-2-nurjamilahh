/**
 * ===================================
 * RevoFun: Number Guessing Game Logic
 * English Version - Soft Lilac Theme
 * ===================================
 */

function initNumberGuessingGame() {
    const dom = {
        setup: document.getElementById('nickname-setup'),
        instructions: document.getElementById('guess-instructions'),
        display: document.getElementById('game-display'),
        gameOver: document.getElementById('guess-game-over'),
        nicknameInput: document.getElementById('nickname-input'),
        currentPlayerName: document.getElementById('current-player-name'),
        guessInput: document.getElementById('guess-input'),
        message: document.getElementById('guess-message'),
        attempts: document.getElementById('guess-attempts'),
        finalScore: document.getElementById('final-score-message'),
        resultTitle: document.getElementById('result-title'),
        bgMusic: document.getElementById('gameMusic'), 
        musicBtn: document.getElementById('musicToggle'),
        musicIcon: document.getElementById('musicIcon'),
        hallOfFameList: document.getElementById('guess-leaderboard-list')
    };

    let state = { 
        secretNumber: 0, 
        attemptsLeft: 5, 
        playerName: "", 
        isMusicPlaying: false 
    };

    // --- MUSIC TOGGLE ---
    dom.musicBtn.onclick = () => {
        if (dom.bgMusic.paused) {
            dom.bgMusic.play().catch(() => console.log("Audio play deferred"));
            dom.musicIcon.className = "fas fa-volume-up";
        } else {
            dom.bgMusic.pause();
            dom.musicIcon.className = "fas fa-volume-mute";
        }
    };

    // --- HALL OF FAME LOGIC (Limit 5) ---
    const updateLeaderboard = (name, score) => {
        let scores = JSON.parse(localStorage.getItem('guessScores')) || [];
        scores.push({ name, score });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5); // Keep top 5 only
        localStorage.setItem('guessScores', JSON.stringify(scores));
        
        renderLeaderboard(scores);
    };

    const renderLeaderboard = (scores) => {
        if (!dom.hallOfFameList) return;
        dom.hallOfFameList.innerHTML = scores.map((s, i) => {
            let medal = `#${i+1}`;
            if (i === 0) medal = "🥇";
            return `<li style="color: #333; margin-bottom: 5px;">${medal} ${s.name} - ${s.score} pts</li>`;
        }).join('');
    };

    // Load leaderboard on start
    renderLeaderboard(JSON.parse(localStorage.getItem('guessScores')) || []);

    // --- CORE GAME FLOW ---
    document.getElementById('start-guess-btn').onclick = () => {
        state.playerName = dom.nicknameInput.value.trim() || "Genius";
        dom.currentPlayerName.textContent = state.playerName;
        dom.setup.classList.add('hidden');
        dom.instructions.classList.remove('hidden');
    };

    document.getElementById('start-round-btn').onclick = () => {
        dom.instructions.classList.add('hidden');
        dom.display.classList.remove('hidden');
        state.secretNumber = Math.floor(Math.random() * 100) + 1;
        state.attemptsLeft = 5;
        dom.attempts.textContent = state.attemptsLeft;
        dom.message.textContent = "Good Luck! Pick a number...";
    };

    document.getElementById('guess-form').onsubmit = (e) => {
        e.preventDefault();
        const guess = parseInt(dom.guessInput.value);
        
        if (isNaN(guess)) return;

        state.attemptsLeft--;
        dom.attempts.textContent = state.attemptsLeft;

        if (guess === state.secretNumber) {
            showResult(true);
        } else if (state.attemptsLeft <= 0) {
            showResult(false);
        } else {
            // Using "Aim Higher/Lower" as requested
            const hint = guess < state.secretNumber ? "AIM HIGHER! ⬆️" : "AIM LOWER! ⬇️";
            dom.message.textContent = `${guess} is wrong. ${hint}`;
            dom.guessInput.value = "";
            dom.guessInput.focus();
        }
    };

    function showResult(isWin) {
        dom.display.classList.add('hidden');
        dom.gameOver.classList.remove('hidden');
        
        if (isWin) {
            // Updated to English & Lilac Icon
            dom.resultTitle.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles" style="color: #C8A2C8;"></i> YOU WON!`;
            // dom.finalScore.style.color = "#333"; 
            dom.finalScore.innerHTML = `Great job <strong>${state.playerName}</strong>!<br>The magic number was ${state.secretNumber}.`;
            updateLeaderboard(state.playerName, state.attemptsLeft + 1);
        } else {
            dom.resultTitle.innerHTML = `<i class="fas fa-skull-crossbones"></i> GAME OVER`;
            // dom.finalScore.style.color = "#333";
            dom.finalScore.innerHTML = `Nice try <strong>${state.playerName}</strong>,<br>the correct answer was ${state.secretNumber}.`;
        }
    }

    document.getElementById('play-again-guess-btn').onclick = () => location.reload();
}

window.onload = initNumberGuessingGame;