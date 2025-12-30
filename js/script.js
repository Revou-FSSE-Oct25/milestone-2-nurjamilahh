window.onload = function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    const swiper = new Swiper('.mySwiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' dot w-3 h-3 p-1 bg-gray-400 rounded-full cursor-pointer inline-block"></span>';
            },
        },
        spaceBetween: 20,
    });

    function showPage(targetId) {
        if (!targetId || !targetId.startsWith('#')) return;
        
        allPages.forEach(page => page.classList.add('hidden'));
        const targetPage = document.querySelector(targetId);
        
        if (targetPage) {
            targetPage.classList.remove('hidden');
            
            if(targetId === '#games') {
                swiper.update(); 
                swiper.slideToLoop(0);
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
}