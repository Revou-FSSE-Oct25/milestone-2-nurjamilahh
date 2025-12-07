/**
 * ==========================================
 * 🚀 RevoFun Main Navigation & Page Handler
 * ==========================================
 */
// Use window.onload for initialization, as requested
window.onload = function() {
    // 1. Get all page sections and navigation links
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    /**
     * Hides all game pages and shows the selected section.
     * @param {string} targetId - The ID of the section to show (e.g., '#home', '#guess-game-page').
     */
    function showPage(targetId) {
        allPages.forEach(page => {
            page.classList.add('hidden');
        });
        
        const targetPage = document.querySelector(targetId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // For the home page, we show both the hero and the games overview
        if (targetId === '#home') {
            document.querySelector('.hero-section').classList.remove('hidden');
            document.querySelector('.games-overview').classList.remove('hidden');
        }
    }

    // Handle initial page load and navigation clicks
    const initialHash = window.location.hash || '#home';
    showPage(initialHash);

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href');
            window.location.hash = targetId;
            showPage(targetId);
        });
    });


    // --- Initialize Game Logic ---
    initNumberGuessingGame();
    initRPSGame();
    initClickerGame();
};

