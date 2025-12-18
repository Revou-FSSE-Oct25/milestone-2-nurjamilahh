/**
 * ==============================
 * 👆 Turbo Clicker Game Setup
 * ==============================
 */

// 1. Fungsi untuk memasukkan struktur HTML ke dalam wadah
function injectClickerHTML() {
    const gameContainer = document.getElementById('clicker-game-area');

    // Struktur HTML yang dibutuhkan oleh logika initClickerGame()
    const clickerHTML = `
        <div class="game-box">
            <h2 class="game-title">Turbo Clicker Challenge</h2>
            
            <div class="stats-area">
                <p>Waktu Tersisa: <span id="clicker-timer">10</span>s</p>
                <p>Skor Anda: <span id="clicker-score">0</span> klik</p>
            </div>

            <button id="click-button" class="game-btn hidden">KLIK SAYA SECEPATNYA!</button>
            
            <button id="clicker-start-btn" class="game-btn">MULAI GAME</button>

            <div id="clicker-message" class="message-box">Tekan MULAI untuk bermain!</div>
            
            <a href="index.html" class="btn-small btn-home">Home</a>
        </div>
    `;

    // Memasukkan HTML ke dalam <main>
    if (gameContainer) {
        gameContainer.innerHTML = clickerHTML;
    } else {
        console.error("Wadah game dengan ID 'clicker-game-area' tidak ditemukan.");
        return; // Hentikan jika wadah tidak ada
    }
}

/**
 * ==============================
 * 👆 Turbo Clicker Game Logic
 * ==============================
 */
function initClickerGame() {
    // Sekarang, elemen-elemen ini sudah ada karena di-inject oleh injectClickerHTML()
    const startBtn = document.getElementById('clicker-start-btn');
    const clickBtn = document.getElementById('click-button');
    const scoreSpan = document.getElementById('clicker-score');
    const timerSpan = document.getElementById('clicker-timer');
    const messageBox = document.getElementById('clicker-message');

    // ... (Sisa kode logika Anda tetap sama) ...
    // ... (Fungsi handleClick, startTimer, startGame, endGame) ...
    
    // (Lanjutkan dengan kode logika Anda di sini...)

    let clickerState = {
        score: 0,
        timeLeft: 10,
        timerInterval: null
    };
    
    const GAME_DURATION = 10; 

    function handleClick() {
        clickerState.score++;
        scoreSpan.textContent = clickerState.score;
    }

    function startTimer() {
        clickerState.timeLeft = GAME_DURATION;
        timerSpan.textContent = clickerState.timeLeft;
        
        clickerState.timerInterval = setInterval(() => {
            clickerState.timeLeft--;
            timerSpan.textContent = clickerState.timeLeft;

            if (clickerState.timeLeft <= 0) {
                clearInterval(clickerState.timerInterval);
                endGame();
            }
        }, 1000);
    }
    
    function startGame() {
        clickerState.score = 0;
        scoreSpan.textContent = clickerState.score;
        messageBox.textContent = '';
        messageBox.classList.remove('winner');
        
        startBtn.classList.add('hidden');
        clickBtn.classList.remove('hidden');
        
        clickBtn.addEventListener('click', handleClick);
        
        startTimer();
    }
    
    function endGame() {
        clickBtn.classList.add('hidden');
        clickBtn.removeEventListener('click', handleClick);
        
        startBtn.classList.remove('hidden');

        messageBox.innerHTML = `✅ Time's up! Your final score is ${clickerState.score} clicks!`;
        messageBox.classList.add('winner');
    }

    startBtn.addEventListener('click', startGame);
}

/**
 * ==============================
 * Panggil Fungsi Utama Saat Halaman Selesai Dimuat
 * ==============================
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Masukkan HTML
    injectClickerHTML();
    // 2. Inisialisasi Logika Game
    initClickerGame();
});



