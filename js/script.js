/* --- SCRIPT.JS --- */

window.onload = function() {

    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');
    const slider = document.querySelector('.slider-container');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.card');

    function showPage(targetId) {
        if (!targetId || !targetId.startsWith('#')) return;
        
        allPages.forEach(page => page.classList.add('hidden'));
        const targetPage = document.querySelector(targetId);
        
        if (targetPage) {
            targetPage.classList.remove('hidden');
        
            if(targetId === '#games' && typeof scrollToCard === "function") {
                scrollToCard(0);
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target && target.startsWith('#')) {
                e.preventDefault();
                showPage(target);
            }
        });
    });

    if (slider && cards.length > 0) {
        let currentIndex = 0;
        const totalCards = cards.length;
        const intervalTime = 4000; 

        const getCardWidth = () => {
            return cards[0].offsetWidth > 0 ? cards[0].offsetWidth + 20 : 570;
        };

        const scrollToCard = (index) => {
            slider.scrollTo({
                left: index * getCardWidth(),
                behavior: 'smooth'
            });
        };

        let autoPlay = setInterval(() => {
            currentIndex++;
            if (currentIndex >= totalCards) currentIndex = 0;
            scrollToCard(currentIndex);
        }, intervalTime);

        slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
        
        slider.addEventListener('scroll', () => {
            const activeIndex = Math.round(slider.scrollLeft / getCardWidth());
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === (activeIndex % totalCards));
            });
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoPlay); 
                currentIndex = index;
                scrollToCard(index);
            });
        });
    }
}