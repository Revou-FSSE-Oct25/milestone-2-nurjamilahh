/**
 * ==========================================
 * 🚀 RevoFun Main Navigation & Page Handler
 * ==========================================
 */
window.onload = function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    function showPage(targetId) {
    if (!targetId.startsWith('#')) return;

    allPages.forEach(page => {
        page.classList.add('hidden');
    });
    
    try {
        const targetPage = document.querySelector(targetId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        if (targetId === '#home') {
            const hero = document.querySelector('.hero-section');
            const overview = document.querySelector('.games-overview');
            const whyUs = document.querySelector('#why-us'); 

            if (hero) hero.classList.remove('hidden');
            if (overview) overview.classList.remove('hidden');
            if (whyUs) whyUs.classList.remove('hidden'); 
        }

    } catch (e) {
        console.error("Invalid selector:", targetId);
    }
}

    // Handle initial page load
    const initialHash = window.location.hash || '#home';
    showPage(initialHash);

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const target = link.getAttribute('href');

            // Jika link mengarah ke file .html lain (bukan ID internal)
            if (!target.startsWith('#')) {
                // Browser to another page
                return; 
            }

            // Jika link internal (#home, dll)
            event.preventDefault();
            window.location.hash = target;
            showPage(target);
        });
    });

    // --- Initialize Game Logic dengan Safety Check ---
    if (typeof initNumberGuessingGame === 'function') initNumberGuessingGame();
    if (typeof initRPSGame === 'function') initRPSGame();
    if (typeof initClickerGame === 'function') initClickerGame();
    if (typeof initCosmicDodgeGame === 'function') initCosmicDodgeGame();
};