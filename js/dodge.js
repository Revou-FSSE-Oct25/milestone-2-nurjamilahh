/**
 * ================================================
 * 4. 🌠 Cosmic Dodge (Falling Objects) Game Logic
 * ================================================
 */
// The initialization for this game is called from games-basic.js window.onload
function initCosmicDodgeGame() {
    // 1. DOM Elements
    const gameScreen = document.getElementById('game-screen');
    const startDodgeBtn = document.getElementById('start-dodge-btn');
    const startRoundBtn = document.getElementById('start-round-btn');
    const playAgainBtn = document.getElementById('play-again-dodge-btn');

    const nicknameInput = document.getElementById('nickname-input');
    const currentPlayerNameSpan = document.getElementById('current-player-name');
    const setupDiv = document.getElementById('nickname-setup');
    const instructionsDiv = document.getElementById('dodge-instructions');
    const gameDisplayDiv = document.getElementById('game-display');
    const gameOverDiv = document.getElementById('dodge-game-over');
    
    const scoreSpan = document.getElementById('dodge-score');
    const highScoreSpan = document.getElementById('dodge-high-score');
    const finalScoreMsg = document.getElementById('final-score-message');
    const leaderboardList = document.getElementById('dodge-leaderboard-list');

    // 2. Game Constants 
    const GAME_WIDTH = 480;
    const GAME_HEIGHT = 320;
    const PLAYER_SPEED = 10;
    const OBSTACLE_INTERVAL = 800; // ms between object creation

    // 3. Game Data (State Object and Array)
    let dodgeState = {
        player: null,
        playerX: GAME_WIDTH / 2 - 20,
        score: 0,
        gameLoop: null,
        objectTimer: null,
        gameActive: false,
        nickname: ''
    };
    let objects = []; // Uses arrays to store falling object data

    // --- LocalStorage and Leaderboard Functions ---

    /** Retrieves or initializes the leaderboard from LocalStorage. */
    function getLeaderboard() {
        const board = localStorage.getItem('cosmicDodgeLeaderboard');
        return board ? JSON.parse(board) : [];
    }

    /** Saves the updated leaderboard to LocalStorage. */
    function saveLeaderboard(board) {
        localStorage.setItem('cosmicDodgeLeaderboard', JSON.stringify(board));
    }

    /** Adds the current score to the leaderboard. */
    function addScoreToLeaderboard() {
        let board = getLeaderboard();
        
        // Uses objects to store player data
        board.push({
            name: dodgeState.nickname,
            score: dodgeState.score,
            date: new Date().toLocaleDateString()
        });
        
        // Sorts by score (descending)
        board.sort((a, b) => b.score - a.score);
        board = board.slice(0, 10);
        saveLeaderboard(board);
    }

    /** Renders the leaderboard in the DOM. */
    function renderLeaderboard() {
        const board = getLeaderboard();
        // Uses innerHTML for efficiency in clearing/repopulating a list
        leaderboardList.innerHTML = ''; 
        
        board.forEach((entry, index) => {
            // Uses template literals for dynamic string construction
            const listItem = `
                <li>
                    <span>${index + 1}. **${entry.name}**</span>
                    <span>Score: ${entry.score}</span>
                </li>
            `;
            leaderboardList.innerHTML += listItem;
        });
        
        const highScore = board.length > 0 ? board[0].score : 0;
        highScoreSpan.textContent = highScore;
    }

    // --- Game Setup and Control Functions ---

    /** Initializes the player element and resets the game screen. */
    function setupGame() {
        gameScreen.innerHTML = '';
        objects = [];
        dodgeState.score = 0;
        scoreSpan.textContent = 0;

        // Creates and appends Player Element (DOM manipulation)
        dodgeState.player = document.createElement('div');
        dodgeState.player.classList.add('player');
        dodgeState.player.textContent = '🚀'; 
        gameScreen.appendChild(dodgeState.player);
        
        dodgeState.playerX = GAME_WIDTH / 2 - 20;
        dodgeState.player.style.left = `${dodgeState.playerX}px`;

        gameOverDiv.classList.add('hidden');
        gameDisplayDiv.classList.remove('hidden');
    }
    
    /** Starts the main gameplay loop. */
    function startGameRound() {
        setupGame();
        dodgeState.gameActive = true;
        
        // Uses loops (setInterval) to create falling objects
        dodgeState.objectTimer = setInterval(createFallingObject, OBSTACLE_INTERVAL);

        // Uses loops (requestAnimationFrame) for smooth animation
        dodgeState.gameLoop = requestAnimationFrame(gameLoop);

        // Adds event listeners to handle user interactions (keydown)
        document.addEventListener('keydown', handleKeyDown);
    }

    /** Ends the game, stops loops, and updates leaderboard. */
    function endGame() {
        if (!dodgeState.gameActive) return;

        dodgeState.gameActive = false;
        
        cancelAnimationFrame(dodgeState.gameLoop);
        clearInterval(dodgeState.objectTimer);
        
        document.removeEventListener('keydown', handleKeyDown);

        addScoreToLeaderboard();
        renderLeaderboard();
        
        finalScoreMsg.textContent = `You scored an amazing ${dodgeState.score} points!`;
        // Changes element visibility dynamically
        gameDisplayDiv.classList.add('hidden');
        gameOverDiv.classList.remove('hidden');
    }


    // --- Gameplay Mechanics ---

    /** Handles player movement based on arrow keys. */
    function handleKeyDown(event) {
        if (!dodgeState.gameActive) return;
        
        let newX = dodgeState.playerX;
        
        // Uses basic conditional statements and mathematical operations
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            newX = Math.max(0, dodgeState.playerX - PLAYER_SPEED);
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            newX = Math.min(GAME_WIDTH - 40, dodgeState.playerX + PLAYER_SPEED);
        }

        dodgeState.playerX = newX;
        // Updates styles dynamically using JavaScript
        dodgeState.player.style.left = `${dodgeState.playerX}px`;
    }

    /** Creates a new falling object element. */
    function createFallingObject() {
        const objectElement = document.createElement('div');
        objectElement.classList.add('object');
        
        const startX = Math.floor(Math.random() * (GAME_WIDTH - 20));
        objectElement.style.left = `${startX}px`;
        
        const objectData = {
            element: objectElement,
            y: -20, 
            speed: Math.random() * 2 + 1.5, // Random speed
            width: 20,
            x: startX
        };

        gameScreen.appendChild(objectElement);
        objects.push(objectData); // Uses array to store object data
    }

    /** Main update loop for game logic. */
    function gameLoop(timestamp) {
        if (!dodgeState.gameActive) return;

        // Uses loops (for) to iterate over game objects
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            
            // Mathematical operations for movement
            obj.y += obj.speed; 
            obj.element.style.top = `${obj.y}px`;

            // Collision check (simplified for responsiveness)
            const playerLeft = dodgeState.playerX;
            const playerRight = dodgeState.playerX + 40;
            const playerTop = GAME_HEIGHT - 40; 
            const playerBottom = GAME_HEIGHT;
            
            // Uses logical operators (&&) in decision-making
            if (
                obj.y + obj.width > playerTop && // Vertical overlap
                obj.y < playerBottom &&
                obj.x + obj.width > playerLeft && // Horizontal overlap
                obj.x < playerRight
            ) {
                endGame();
                return; 
            }

            // Remove objects that fall off the bottom of the screen
            if (obj.y > GAME_HEIGHT) {
                obj.element.remove(); 
                objects.splice(i, 1); 
                i--; 
                
                dodgeState.score++;
                scoreSpan.textContent = dodgeState.score;
            }
        }

        dodgeState.gameLoop = requestAnimationFrame(gameLoop);
    }
    
    // --- Event Handling ---
    
    // Adds event listener (click)
    startDodgeBtn.addEventListener('click', () => {
        // Handles form inputs and retrieves values correctly
        const nickname = nicknameInput.value.trim();
        if (nickname.length < 2) {
            alert('Please enter a nickname of at least 2 characters!');
            return;
        }
        dodgeState.nickname = nickname;
        
        // Changes element visibility dynamically
        setupDiv.classList.add('hidden');
        instructionsDiv.classList.remove('hidden');
        currentPlayerNameSpan.textContent = nickname;
    });

    startRoundBtn.addEventListener('click', () => {
        instructionsDiv.classList.add('hidden');
        startGameRound();
    });

    playAgainBtn.addEventListener('click', () => {
        gameOverDiv.classList.add('hidden');
        instructionsDiv.classList.remove('hidden');
    });

    // Initial load: Render the leaderboard
    renderLeaderboard();
}