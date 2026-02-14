// VALENTINE'S DAY MUSEUM - SCRIPT

// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------------------
    // 1. INITIAL SETUP
    // ----------------------------------------------------
    const body = document.body;

    // Simple fade-in on load
    window.onload = () => {
        body.classList.add('loaded');
        initAnimations();
    };

    // ----------------------------------------------------
    // 2. SMOOTH SCROLL (LENIS)
    // ----------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth linear-like ease
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Link Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // ----------------------------------------------------
    // 3. GSAP ANIMATIONS
    // ----------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    function initAnimations() {

        // A. Hero Animation
        // ------------------------------------------------
        gsap.to('.intro-content', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.5
        });

        // B. Gallery Animations (Scroll-Driven)
        // ------------------------------------------------
        const gallerySections = document.querySelectorAll('.gallery-section');

        gallerySections.forEach((section) => {
            const frameWrapper = section.querySelector('.frame-wrapper');
            const textWrapper = section.querySelector('.text-wrapper');

            // 1. Frame Parallax & Fade
            gsap.fromTo(frameWrapper,
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.95
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%', // Start animation when section is 80% down viewport
                        end: 'top 50%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // 2. Text Reveal (Staggered)
            gsap.fromTo(textWrapper,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 0.2, // Text comes slightly after image
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                        end: 'top 40%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // C. Quote Parallax
        // ------------------------------------------------
        gsap.fromTo('.quote-container',
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.quote-section',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // D. Closing Section Reveal
        // ------------------------------------------------
        gsap.from('.closing-content > *', {
            y: 30,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            scrollTrigger: {
                trigger: '.closing-section',
                start: 'top 70%',
            }
        });
    }

    // ----------------------------------------------------
    // 4. MUSIC CONTROL
    // ----------------------------------------------------
    const musicBtn = document.getElementById('music-btn');
    const audio = document.getElementById('bg-music');
    const musicText = musicBtn.querySelector('.music-text');
    const musicIcon = musicBtn.querySelector('.music-icon');

    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicText.textContent = "Play Music";
            musicIcon.textContent = "🎵";
            isPlaying = false;
        } else {
            // Attempt to play audio
            // Note: Browsers may block autoplay without user interaction first
            audio.play().then(() => {
                musicText.textContent = "Pause Music";
                musicIcon.textContent = "⏸";
                isPlaying = true;
            }).catch(error => {
                console.log("Audio playback failed:", error);
                alert("Please click anywhere on the page first to enable audio!");
            });
        }
    });

});
