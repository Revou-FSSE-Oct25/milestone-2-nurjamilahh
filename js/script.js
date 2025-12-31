window.onload = function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const allPages = document.querySelectorAll('.page-section');

    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        centeredSlides: true,
        loop: false,
        autoplay: false,
        observer: true,
        observeParents: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
        320: {
            slidesPerView: 1.1,
            spaceBetween: 10
        },    
        768: {
            slidesPerView: 2, 
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 3, 
            spaceBetween: 30
        }
    }
});

    function showPage(targetId) {
        if (!targetId || !targetId.startsWith('#')) return;
        
        allPages.forEach(page => page.classList.add('hidden'));
        const targetPage = document.querySelector(targetId);
        
        if (targetPage) {
            targetPage.classList.remove('hidden');
            
            if(targetId === '#games') {
                setTimeout(() => {
                    swiper.update(); 
                    swiper.slideTo(0, 0); 
                }, 100);
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