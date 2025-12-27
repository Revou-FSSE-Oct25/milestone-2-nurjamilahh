/**
 * ==========================================
 *   RevoFun Main Navigation & Page Handler
 * ==========================================
 */
window.onload = function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    // --- 1. Fungsi Navigasi Halaman ---
    function showPage(targetId) {
        if (!targetId.startsWith('#')) return;
        allPages.forEach(page => page.classList.add('hidden'));
        const targetPage = document.querySelector(targetId);
        if (targetPage) targetPage.classList.remove('hidden');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                showPage(target);
            }
        });
    });

    // --- 2. Logika Slider Games (Auto-Play & Infinite Loop) ---
    const slider = document.querySelector('.slider-container');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.card');
    
    if (slider && dots.length > 0) {
        let currentIndex = 0;
        const totalCards = cards.length;
        const intervalTime = 4000; // Berpindah setiap 4 detik

        const getCardWidth = () => cards[0].offsetWidth + 20;

        const scrollToCard = (index) => {
            slider.scrollTo({
                left: index * getCardWidth(),
                behavior: 'smooth'
            });
        };

        // Fungsi Auto Play
        let autoPlay = setInterval(() => {
            currentIndex++;
            if (currentIndex >= totalCards) {
                currentIndex = 0; // Balik ke awal
            }
            scrollToCard(currentIndex);
        }, intervalTime);

        // Berhenti Auto Play saat user menyentuh/scroll manual
        slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
        slider.addEventListener('touchstart', () => clearInterval(autoPlay));

        // Update dot saat scroll (manual atau otomatis)
        slider.addEventListener('scroll', () => {
            const scrollLeft = slider.scrollLeft;
            const activeIndex = Math.round(scrollLeft / getCardWidth());
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === (activeIndex % totalCards));
            });
            currentIndex = activeIndex % totalCards;
        });

        // Klik dot untuk pindah manual
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoPlay); // Stop auto play jika dot diklik
                currentIndex = index;
                scrollToCard(index);
            });
        });
    }

    // --- 3. Logika Active State (Indicator Dot) ---
    const navItems = document.querySelectorAll('.nav-item'); // Pastikan di HTML ada class 'nav-item'
    const currentPath = window.location.pathname;

    navItems.forEach(link => {
        // Cek apakah href link cocok dengan URL saat ini
        if (currentPath.includes(link.getAttribute('href'))) {
            // Berikan warna terang
            link.classList.add('text-white');
            link.classList.remove('text-white/60');
            
            // Buat elemen titik secara dinamis
            const dot = document.createElement('span');
            // Class Tailwind untuk titik menyala
            dot.className = "block mx-auto mt-1 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_#FFD700]";
            link.appendChild(dot);
        }
    });
}