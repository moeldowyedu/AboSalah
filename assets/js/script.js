/* ==========================================================================
   Eldowy — site behaviour
   ========================================================================== */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1. Loader ------------------------------------------------------- */
    const hideLoader = () => {
        const loader = document.getElementById('loader');
        if (!loader) return;
        loader.classList.add('fade-out');
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    };

    // Run on load; if the page is already loaded (cache/back-nav), run immediately.
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 300);
    } else {
        window.addEventListener('load', () => setTimeout(hideLoader, 300));
    }
    // Safety net: never leave the loader covering the page.
    setTimeout(hideLoader, 4000);

    document.addEventListener('DOMContentLoaded', () => {

        /* --- 2. Navbar state on scroll ----------------------------------- */
        const navbar = document.getElementById('mainNavbar');
        if (navbar) {
            const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        /* --- 3. Close mobile menu after choosing a link ------------------- */
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse) {
            navCollapse.querySelectorAll('.nav-link[href^="#"], .btn[href^="#"]').forEach(link => {
                link.addEventListener('click', () => {
                    if (navCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
                    }
                });
            });
        }

        /* --- 4. Role rotator (typewriter) -------------------------------- */
        const roleText = document.getElementById('roleText');
        const roles = [
            'Founder & CEO — False Negative & OBSOLIO',
            'Agentic AI systems architect',
            'Laravel & enterprise engineer',
            'Lecturer at ITI since 2013'
        ];

        if (roleText) {
            if (reduceMotion) {
                roleText.textContent = roles[0];
            } else {
                let roleIndex = 0;
                let charIndex = 0;
                let deleting = false;

                const tick = () => {
                    const current = roles[roleIndex];
                    charIndex += deleting ? -1 : 1;
                    roleText.textContent = current.slice(0, charIndex);

                    let delay = deleting ? 28 : 55;

                    if (!deleting && charIndex === current.length) {
                        delay = 2200;            // hold the finished line
                        deleting = true;
                    } else if (deleting && charIndex === 0) {
                        deleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                        delay = 320;
                    }
                    setTimeout(tick, delay);
                };
                tick();
            }
        }

        /* --- 5. Scroll reveal -------------------------------------------- */
        const animated = document.querySelectorAll('.animate-on-scroll');

        if (reduceMotion || !('IntersectionObserver' in window)) {
            animated.forEach(el => el.classList.add('in-view'));
        } else {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);   // reveal once, then stop watching
                    }
                });
            }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

            animated.forEach(el => observer.observe(el));
        }

        /* --- 6. Footer year ---------------------------------------------- */
        const yearElement = document.getElementById('currentYear');
        if (yearElement) yearElement.textContent = new Date().getFullYear();

        /* --- 7. Theme toggle --------------------------------------------- */
        const toggleBtn = document.getElementById('themeToggle');
        const body = document.body;

        const applyTheme = theme => {
            body.setAttribute('data-bs-theme', theme);
            const icon = toggleBtn ? toggleBtn.querySelector('i') : null;
            if (icon) {
                icon.classList.toggle('fa-sun', theme === 'light');
                icon.classList.toggle('fa-moon', theme !== 'light');
            }
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#05070b');
        };

        // Stored choice wins; otherwise follow the OS, defaulting to dark.
        const stored = localStorage.getItem('theme');
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(stored || (prefersLight ? 'light' : 'dark'));

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const next = body.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
                applyTheme(next);
                localStorage.setItem('theme', next);
            });
        }
    });
})();
