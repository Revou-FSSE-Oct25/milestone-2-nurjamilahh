/**
 * ==============================
 * 🔢 Number Guessing Game Logic
 * ==============================
 */
function initNumberGuessingGame() {
    const guessForm = document.getElementById('guess-form');
    const guessInput = document.getElementById('guess-input');
    const guessMessage = document.getElementById('guess-message');
    const attemptsSpan = document.getElementById('guess-attempts');
    const submitBtn = document.getElementById('guess-submit-btn');
    const resetBtn = document.getElementById('guess-reset-btn');

    // Uses arrays and objects to store and manipulate game data
    let gameState = {
        secretNumber: 0,
        attemptsLeft: 5,
        min: 1,
        max: 100,
        gameActive: true
    };

    /** Generates a new random secret number and resets the game state. */
    function startGame() {
        // Implements simple mathematical operations
        gameState.secretNumber = Math.floor(Math.random() * gameState.max) + gameState.min;
        gameState.attemptsLeft = 5;
        gameState.gameActive = true;
        
        // Updates textContent and uses class toggling
        attemptsSpan.textContent = gameState.attemptsLeft;
        guessMessage.textContent = 'Guess a number...';
        guessMessage.className = 'message-box';
        guessInput.value = '';
        guessInput.disabled = false;
        submitBtn.disabled = false;
        resetBtn.classList.add('hidden');
    }

    /** Handles the player's guess submission. */
    function handleGuess(event) {
        event.preventDefault();
        
        if (!gameState.gameActive) return;

        // Handles form inputs and retrieves values correctly
        const guess = parseInt(guessInput.value.trim());

        // Uses logical operators correctly in decision-making
        if (isNaN(guess) || guess < gameState.min || guess > gameState.max) {
            guessMessage.textContent = `Please enter a number between ${gameState.min} and ${gameState.max}.`;
            return;
        }

        gameState.attemptsLeft--;

        // Uses basic conditional statements
        if (guess === gameState.secretNumber) {
            // Uses template literals for dynamic string construction
            guessMessage.textContent = `🎉 You WIN! The number was ${gameState.secretNumber}.`;
            endGame(true);
        } else if (gameState.attemptsLeft === 0) {
            guessMessage.textContent = `😭 Game Over! The number was ${gameState.secretNumber}.`;
            endGame(false);
        } else if (guess < gameState.secretNumber) {
            guessMessage.textContent = `📉 Too LOW. Attempts left: ${gameState.attemptsLeft}`;
        } else {
            guessMessage.textContent = `📈 Too HIGH. Attempts left: ${gameState.attemptsLeft}`;
        }

        attemptsSpan.textContent = gameState.attemptsLeft;
        guessInput.value = '';
    }

    /** Ends the game, updates message style, and handles button visibility. */
    function endGame(isWin) {
        gameState.gameActive = false;
        guessInput.disabled = true;
        submitBtn.disabled = true;
        
        guessMessage.classList.add(isWin ? 'winner' : 'loser');
        resetBtn.classList.remove('hidden'); // Changes element visibility dynamically
    }

    // Adds event listeners (click, submit)
    guessForm.addEventListener('submit', handleGuess);
    resetBtn.addEventListener('click', startGame);

    startGame();
}

