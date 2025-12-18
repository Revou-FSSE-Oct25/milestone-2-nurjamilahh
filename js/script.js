/**
 * ==========================================
 * 🚀 RevoFun Main Navigation & Page Handler
 * ==========================================
 */
window.onload = function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    function showPage(targetId) {
        // PROTEKSI: Jika targetId bukan berupa ID (misal: path file .html), jangan jalankan querySelector
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
                if (hero) hero.classList.remove('hidden');
                if (overview) overview.classList.remove('hidden');
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
                // Biarkan browser pindah halaman secara normal
                return; 
            }

            // Jika link internal (#home, dll)
            event.preventDefault();
            window.location.hash = target;
            showPage(target);
        });
    });

    // --- Initialize Game Logic dengan Safety Check ---
    // Pastikan fungsi ini ada sebelum dipanggil agar tidak error jika file JS tidak dimuat
    if (typeof initNumberGuessingGame === 'function') initNumberGuessingGame();
    if (typeof initRPSGame === 'function') initRPSGame();
    if (typeof initClickerGame === 'function') initClickerGame();
    if (typeof initCosmicDodgeGame === 'function') initCosmicDodgeGame();
};