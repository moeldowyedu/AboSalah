document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Loader --- */
    const loader = document.getElementById('loader');
    // Hide loader slightly after fully loaded for effect
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 300);
    });

    /* --- 2. Navbar Glassmorphism on Scroll --- */
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });



    /* --- 4. Scroll Animations using Intersection Observer --- */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Observer Options
    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before it comes fully into view
        threshold: 0.1 // 10% of the element visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once animated if we only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    /* --- 5. Dynamic Current Year in Footer --- */
    const yearElement = document.getElementById('currentYear');
    if(yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
