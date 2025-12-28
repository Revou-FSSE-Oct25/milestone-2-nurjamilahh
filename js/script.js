window.onload = function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    // --- 1. Fungsi Navigasi Halaman ---
    function showPage(targetId) {
        if (!targetId.startsWith('#')) return;
        allPages.forEach(page => page.classList.add('hidden'));
        const targetPage = document.querySelector(targetId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            // Jika pindah ke page games, refresh posisi slider
            if(targetId === '#games') scrollToCard(0);
        }
    }

     navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target && target.startsWith('#')) {
                    e.preventDefault();
                    showPage(target);
                    updateNavDots(target);
                }
            });
        });
        
    function updateNavDots(targetId) {
    const navLinks = document.querySelectorAll('.navbar a');

        navLinks.forEach(link => {
        const oldDot = link.querySelector('.nav-dot');
        if (oldDot) oldDot.remove();

        if (link.getAttribute('href') === targetId) {
            const dot = document.createElement('span');
            dot.className = "nav-dot block mx-auto mt-1 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#FFD700]";
            link.appendChild(dot);
        }
    });
}

    // --- 2. Logika Slider Games ---
    const slider = document.querySelector('.slider-container');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.card');
    
    if (slider && cards.length > 0) {
        let currentIndex = 0;
        const totalCards = cards.length;
        const intervalTime = 4000; 

        // Fungsi ambil lebar kartu (Lebih aman)
        const getCardWidth = () => {
            return cards[0].offsetWidth > 0 ? cards[0].offsetWidth + 20 : 570; // 570 adalah fallback (550px lebar + 20px gap)
        };

        const scrollToCard = (index) => {
            slider.scrollTo({
                left: index * getCardWidth(),
                behavior: 'smooth'
            });
        };

        // Fungsi Auto Play
        let autoPlay = setInterval(() => {
            currentIndex++;
            if (currentIndex >= totalCards) currentIndex = 0;
            scrollToCard(currentIndex);
        }, intervalTime);

        // Berhenti Auto Play saat interaksi
        slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
        
        // Update dot saat scroll
        slider.addEventListener('scroll', () => {
            const activeIndex = Math.round(slider.scrollLeft / getCardWidth());
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === (activeIndex % totalCards));
            });
        });

        // Klik dot (Navigasi manual)
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoPlay); 
                currentIndex = index;
                scrollToCard(index);
            });
        });
    }

    // --- 3. Indicator Navigasi ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(link => {
        if (window.location.pathname.includes(link.getAttribute('href'))) {
            link.classList.add('text-white');
            const dot = document.createElement('span');
            dot.className = "block mx-auto mt-1 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_#FFD700]";
            link.appendChild(dot);
        }
    });
}