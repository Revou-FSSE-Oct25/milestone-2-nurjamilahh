/**
 * ======================================
 *  ✂️ Rock, Paper, Scissors Game Logic
 * ======================================
 */
function initRPSGame() {
    const choiceBtns = document.querySelectorAll('.rps-choices .choice-btn');
    const roundResult = document.getElementById('rps-round-result');
    const playerScoreSpan = document.getElementById('player-score');
    const computerScoreSpan = document.getElementById('computer-score');
    const resetBtn = document.getElementById('rps-reset-btn');

    let score = { player: 0, computer: 0 };
    const choices = ['rock', 'paper', 'scissors']; // Uses arrays

    /** Updates the score display in the DOM. */
    function updateScoreDisplay() {
        playerScoreSpan.textContent = score.player;
        computerScoreSpan.textContent = score.computer;
    }

    /** Gets a random choice for the computer. */
    function getComputerChoice() {
        return choices[Math.floor(Math.random() * choices.length)];
    }

    /** Determines the winner of the round. */
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'draw';
        
        // Applies switch statements where appropriate
        switch (playerChoice) {
            case 'rock': return (computerChoice === 'scissors') ? 'win' : 'lose';
            case 'paper': return (computerChoice === 'rock') ? 'win' : 'lose';
            case 'scissors': return (computerChoice === 'paper') ? 'win' : 'lose';
        }
    }

    /** Handles a player's choice click. */
    function playRound(event) {
        const playerChoice = event.currentTarget.getAttribute('data-choice');
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);

        let message = `You chose ${playerChoice}. Computer chose ${computerChoice}.`;
        
        switch (result) {
            case 'win': score.player++; message += '<br>YOU WIN!'; roundResult.className = 'winner message-box'; break;
            case 'lose': score.computer++; message += '<br>YOU LOSE!'; roundResult.className = 'loser message-box'; break;
            case 'draw': message += '<br>IT\'S A DRAW!'; roundResult.className = 'draw message-box'; break;
        }

        // Uses innerHTML to allow for bolding (styling)
        roundResult.innerHTML = message; 
        updateScoreDisplay(); // Reusing code/function
    }
    
    /** Resets the score to zero. */
    function resetScore() {
        score.player = 0;
        score.computer = 0;
        updateScoreDisplay();
        roundResult.innerHTML = 'Score reset. Make your move!';
        roundResult.classList.remove('winner', 'loser', 'draw');
    }

    // Add event listeners (loop for multiple elements)
    choiceBtns.forEach(btn => btn.addEventListener('click', playRound));
    resetBtn.addEventListener('click', resetScore);

    updateScoreDisplay();
}

