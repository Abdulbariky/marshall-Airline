/* ===============================================
   Rotorjet Aviation - Animation System
   =============================================== */

(function() {
    'use strict';

    // Animation configuration
    const config = {
        animationDuration: 1000,
        staggerDelay: 100,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        counterSpeed: 50,
        parallaxFactor: 0.5
    };

    // Animation state
    let scrollTop = 0;
    let isReducedMotion = false;
    let animatedElements = new Set();

    // Initialize animations when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        checkReducedMotion();
        initializeScrollAnimations();
        initializeCounterAnimations();
        initializeParallaxEffects();
        initializeHoverAnimations();
        initializeLoadingAnimations();
        initializeGSAPAnimations();
    });

    // Check for reduced motion preference
    function checkReducedMotion() {
        isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isReducedMotion) {
            document.body.classList.add('reduced-motion');
            config.animationDuration = 0;
            config.staggerDelay = 0;
        }
    }

    // Initialize scroll-triggered animations
    function initializeScrollAnimations() {
        if ('IntersectionObserver' in window && !isReducedMotion) {
            const observer = new IntersectionObserver(handleIntersection, {
                threshold: config.threshold,
                rootMargin: config.rootMargin
            });

            // Observe elements for animation
            const animatableElements = document.querySelectorAll([
                '[data-animate]',
                '.animate-on-scroll',
                '.service-card',
                '.team-member',
                '.aircraft-card',
                '.gallery-item',
                '.feature-item',
                '.stat-item',
                '.contact-info-card',
                '.maintenance-service'
            ].join(', '));

            animatableElements.forEach((element, index) => {
                // Add initial state
                if (!element.classList.contains('animated')) {
                    element.style.opacity = '0';
                    element.style.transform = getInitialTransform(element);
                }
                
                observer.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            showAllElements();
        }
    }

    // Get initial transform based on element type or data attribute
    function getInitialTransform(element) {
        const animationType = element.dataset.animate || 'fadeUp';
        
        switch (animationType) {
            case 'fadeUp':
                return 'translateY(30px)';
            case 'fadeDown':
                return 'translateY(-30px)';
            case 'fadeLeft':
                return 'translateX(-30px)';
            case 'fadeRight':
                return 'translateX(30px)';
            case 'zoomIn':
                return 'scale(0.8)';
            case 'zoomOut':
                return 'scale(1.2)';
            case 'rotateIn':
                return 'rotate(-10deg) scale(0.8)';
            default:
                return 'translateY(30px)';
        }
    }

    // Handle intersection observer callback
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                animateElement(entry.target);
                animatedElements.add(entry.target);
            }
        });
    }

    // Animate individual element
    function animateElement(element) {
        if (isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        // Get stagger delay for grid items
        const delay = getStaggerDelay(element);
        
        // Apply animation
        setTimeout(() => {
            element.style.transition = `opacity ${config.animationDuration}ms ease-out, transform ${config.animationDuration}ms ease-out`;
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('animated');
            
            // Add completion callback
            setTimeout(() => {
                element.style.transition = '';
                onAnimationComplete(element);
            }, config.animationDuration);
            
        }, delay);
    }

    // Get stagger delay for grid items
    function getStaggerDelay(element) {
        const container = element.closest('.services-grid, .team-grid, .fleet-grid, .gallery-grid');
        if (container) {
            const siblings = Array.from(container.children);
            const index = siblings.indexOf(element);
            return index * config.staggerDelay;
        }
        return 0;
    }

    // Animation completion callback
    function onAnimationComplete(element) {
        element.dispatchEvent(new CustomEvent('animationComplete', {
            bubbles: true,
            detail: { element }
        }));
    }

    // Show all elements (fallback)
    function showAllElements() {
        const elements = document.querySelectorAll([
            '[data-animate]',
            '.animate-on-scroll',
            '.service-card',
            '.team-member',
            '.aircraft-card'
        ].join(', '));

        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    // Initialize counter animations
    function initializeCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number, [data-counter]');
        
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.counted) {
                        animateCounter(entry.target);
                        entry.target.dataset.counted = 'true';
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => counterObserver.observe(counter));
        }
    }

    // Animate counter
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, '')) || 0;
        const suffix = element.textContent.replace(/\d/g, '');
        const prefix = element.dataset.prefix || '';
        const duration = parseInt(element.dataset.duration) || 2000;
        
        if (isReducedMotion) {
            element.textContent = prefix + target + suffix;
            return;
        }
        
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = prefix + target + suffix;
                clearInterval(timer);
                element.classList.add('counter-complete');
            } else {
                element.textContent = prefix + Math.floor(current) + suffix;
            }
        }, 16);
    }

    // Initialize parallax effects
    function initializeParallaxEffects() {
        if (isReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('[data-parallax], .parallax');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', throttle(updateParallax, 16));
        }
    }

    // Update parallax elements
    function updateParallax() {
        scrollTop = window.pageYOffset;
        
        const parallaxElements = document.querySelectorAll('[data-parallax], .parallax');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || config.parallaxFactor;
            const yPos = -(scrollTop * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Initialize hover animations
    function initializeHoverAnimations() {
        if (isReducedMotion) return;
        
        // Service cards hover effect
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                animateServiceCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                animateServiceCardHover(card, false);
            });
        });
        
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                animateButtonHover(button, true);
            });
            
            button.addEventListener('mouseleave', () => {
                animateButtonHover(button, false);
            });
        });
        
        // Image hover effects
        const images = document.querySelectorAll('.hover-zoom img');
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    }

    // Animate service card hover
    function animateServiceCardHover(card, isHover) {
        const icon = card.querySelector('.service-icon');
        const title = card.querySelector('.service-title');
        
        if (isHover) {
            if (icon) icon.style.transform = 'scale(1.1) rotateY(10deg)';
            if (title) title.style.color = 'var(--primary-red)';
        } else {
            if (icon) icon.style.transform = 'scale(1) rotateY(0deg)';
            if (title) title.style.color = '';
        }
    }

    // Animate button hover
    function animateButtonHover(button, isHover) {
        const icon = button.querySelector('i');
        
        if (isHover) {
            if (icon) icon.style.transform = 'translateX(3px)';
        } else {
            if (icon) icon.style.transform = 'translateX(0)';
        }
    }

    // Initialize loading animations
    function initializeLoadingAnimations() {
        // Animate page load
        window.addEventListener('load', () => {
            animatePageLoad();
        });
        
        // Animate section load
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Animate page load
    function animatePageLoad() {
        if (isReducedMotion) return;
        
        document.body.classList.add('page-loaded');
        
        // Animate hero content
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-fade-up');
            }, index * 200);
        });
        
        // Animate navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            setTimeout(() => {
                navbar.classList.add('navbar-loaded');
            }, 500);
        }
    }

    // GSAP-style animations (if GSAP is loaded)
    function initializeGSAPAnimations() {
        if (typeof gsap !== 'undefined' && !isReducedMotion) {
            initializeGSAPScrollTrigger();
            initializeGSAPTimelines();
        }
    }

    // Initialize GSAP ScrollTrigger animations
    function initializeGSAPScrollTrigger() {
        // Hero section animation
        gsap.from('.hero-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out'
        });
        
        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power2.out'
        });
        
        gsap.from('.hero-actions', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.6,
            ease: 'power2.out'
        });
        
        // Service cards animation
        gsap.from('.service-card', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.services',
                start: 'top 80%'
            }
        });
    }

    // Initialize GSAP timelines
    function initializeGSAPTimelines() {
        // Loading timeline
        const loadingTl = gsap.timeline();
        
        loadingTl
            .from('.loading-logo i', {
                duration: 0.5,
                scale: 0,
                rotation: -180,
                ease: 'back.out(1.7)'
            })
            .from('.loading-logo h2', {
                duration: 0.5,
                opacity: 0,
                y: 20
            }, '-=0.2')
            .from('.loading-spinner', {
                duration: 0.3,
                scale: 0,
                opacity: 0
            }, '-=0.1');
    }

    // Utility functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Custom animation helpers
    function fadeIn(element, duration = 500, delay = 0) {
        if (isReducedMotion) {
            element.style.opacity = '1';
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.transition = `opacity ${duration}ms ease-out`;
                element.style.opacity = '1';
                
                setTimeout(resolve, duration);
            }, delay);
        });
    }

    function slideUp(element, duration = 500, delay = 0) {
        if (isReducedMotion) {
            element.style.display = 'none';
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                const height = element.offsetHeight;
                element.style.transition = `all ${duration}ms ease-out`;
                element.style.height = '0';
                element.style.padding = '0';
                element.style.margin = '0';
                element.style.overflow = 'hidden';
                
                setTimeout(() => {
                    element.style.display = 'none';
                    resolve();
                }, duration);
            }, delay);
        });
    }

    function slideDown(element, duration = 500, delay = 0) {
        if (isReducedMotion) {
            element.style.display = 'block';
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'block';
                const height = element.scrollHeight;
                element.style.height = '0';
                element.style.overflow = 'hidden';
                
                requestAnimationFrame(() => {
                    element.style.transition = `height ${duration}ms ease-out`;
                    element.style.height = height + 'px';
                    
                    setTimeout(() => {
                        element.style.height = 'auto';
                        element.style.overflow = 'visible';
                        resolve();
                    }, duration);
                });
            }, delay);
        });
    }

    // Progress bar animation
    function animateProgressBar(progressBar, targetWidth, duration = 1000) {
        if (isReducedMotion) {
            progressBar.style.width = targetWidth + '%';
            return;
        }
        
        let currentWidth = 0;
        const increment = targetWidth / (duration / 16);
        
        const timer = setInterval(() => {
            currentWidth += increment;
            
            if (currentWidth >= targetWidth) {
                progressBar.style.width = targetWidth + '%';
                clearInterval(timer);
            } else {
                progressBar.style.width = currentWidth + '%';
            }
        }, 16);
    }

    // Typing animation
    function typeWriter(element, text, speed = 50) {
        if (isReducedMotion) {
            element.textContent = text;
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            element.textContent = '';
            let i = 0;
            
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    // Morphing animation
    function morphShape(element, newPath, duration = 1000) {
        if (isReducedMotion) return;
        
        const currentPath = element.getAttribute('d');
        element.style.transition = `d ${duration}ms ease-in-out`;
        element.setAttribute('d', newPath);
    }

    // Particle system (simple)
    function createParticles(container, count = 20) {
        if (isReducedMotion) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(particle);
        }
    }

    // Public API
    window.RotorjetAnimations = {
        fadeIn,
        slideUp,
        slideDown,
        animateProgressBar,
        typeWriter,
        morphShape,
        createParticles,
        animateCounter,
        config
    };

    // Listen for animation events
    document.addEventListener('animationComplete', (e) => {
        console.log('Animation completed:', e.detail.element);
    });

    // Handle resize events
    window.addEventListener('resize', debounce(() => {
        // Recalculate parallax on resize
        if (!isReducedMotion) {
            updateParallax();
        }
    }, 250));

})();