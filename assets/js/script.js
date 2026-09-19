/* ==========================================================================
   Mo Eldowy — site behaviour
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
            'Founder & CEO — False Negative & Scorit',
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

        /* --- 5. Hero portrait: reveal + pointer parallax ------------------ */
        const portrait = document.getElementById('heroPortrait');

        if (portrait) {
            const img = portrait.querySelector('.hp-img');

            // Start the entrance once the photo itself is decoded, so the wipe
            // never uncovers an empty frame.
            const reveal = () => portrait.classList.add('is-revealed');
            if (img && !img.complete) {
                img.addEventListener('load', () => setTimeout(reveal, 450), { once: true });
                img.addEventListener('error', reveal, { once: true });
            } else {
                setTimeout(reveal, 450);
            }

            // Parallax only where there's a real pointer, and never past 5deg.
            const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

            if (finePointer && !reduceMotion) {
                const MAX = 5;
                let frame = null;

                const onMove = event => {
                    if (frame) return;
                    frame = requestAnimationFrame(() => {
                        frame = null;
                        const box = portrait.getBoundingClientRect();
                        const px = (event.clientX - box.left) / box.width - 0.5;
                        const py = (event.clientY - box.top) / box.height - 0.5;
                        portrait.style.setProperty('--ry', (px * MAX * 2).toFixed(2) + 'deg');
                        portrait.style.setProperty('--rx', (-py * MAX * 2).toFixed(2) + 'deg');
                    });
                };

                const onLeave = () => {
                    portrait.style.setProperty('--rx', '0deg');
                    portrait.style.setProperty('--ry', '0deg');
                };

                portrait.setAttribute('data-tilt', '');
                portrait.addEventListener('mousemove', onMove);
                portrait.addEventListener('mouseleave', onLeave);
            }
        }

        /* --- 6. Scroll reveal -------------------------------------------- */
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

            // A deep link (#contact), a restored scroll position, or any jump
            // lands past sections that then never intersect — they would stay
            // invisible forever. Reveal anything at or above the fold outright.
            const revealPassed = () => {
                animated.forEach(el => {
                    if (el.getBoundingClientRect().top < window.innerHeight) {
                        el.classList.add('in-view');
                        observer.unobserve(el);
                    }
                });
            };
            window.addEventListener('load', revealPassed);
            window.addEventListener('hashchange', () => setTimeout(revealPassed, 60));
            setTimeout(revealPassed, 120);
        }

        /* --- 7. Footer year ---------------------------------------------- */
        const yearElement = document.getElementById('currentYear');
        if (yearElement) yearElement.textContent = new Date().getFullYear();

        /* --- 8. Theme toggle --------------------------------------------- */
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
