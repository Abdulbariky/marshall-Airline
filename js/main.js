/* ===============================================
   Rotorjet Aviation - Main JavaScript
   =============================================== */

(function() {
    'use strict';

    // DOM Elements
    const loadingScreen = document.getElementById('loading-screen');
    const scrollTopBtn = document.getElementById('scroll-top');
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeLoading();
        initializeNavigation();
        initializeScrollEffects();
        initializeAnimations();
        initializeUtilities();
    });

    // Loading Screen
    function initializeLoading() {
        window.addEventListener('load', function() {
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1000); // Show loading for at least 1 second
        });
    }

    // Navigation Functions
    function initializeNavigation() {
        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target)) {
                closeMobileMenu();
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', handleNavbarScroll);

        // Active link highlighting
        highlightActiveLink();
    }

    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Animate hamburger icon
        animateHamburgerIcon();
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function animateHamburgerIcon() {
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    function handleNavbarScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }

    function highlightActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
                link.classList.add('active');
            }
        });
    }

    // Scroll Effects
    function initializeScrollEffects() {
        // Scroll to top button
        window.addEventListener('scroll', handleScrollTop);
        
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', scrollToTop);
        }

        // Smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Parallax effects
        window.addEventListener('scroll', handleParallaxEffects);
    }

    function handleScrollTop() {
        const scrollY = window.scrollY;
        
        if (scrollTopBtn) {
            if (scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function handleSmoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    function handleParallaxEffects() {
        const scrollY = window.scrollY;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }

    // Animations
    function initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('[data-aos], .service-card, .feature-item, .stat-item');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Counter animations
        animateCounters();
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered delay for grid items
                if (entry.target.classList.contains('service-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });
    }

    // Utility Functions
    function initializeUtilities() {
        // Form validation
        initializeFormValidation();
        
        // Image lazy loading
        initializeLazyLoading();
        
        // Tooltip initialization
        initializeTooltips();
        
        // Modal functionality
        initializeModals();
    }

    function initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!validateForm(this)) {
                    event.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Show/hide error
        showFieldError(field, isValid ? '' : errorMessage);
        
        return isValid;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            field.parentNode.appendChild(errorElement);
        }
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    function showTooltip(event) {
        const element = event.target;
        const text = element.dataset.tooltip;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        element._tooltip = tooltip;
    }

    function hideTooltip(event) {
        const element = event.target;
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }

    function initializeModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.modal');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(event) {
                event.preventDefault();
                const modalId = this.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                    showModal(modal);
                }
            });
        });
        
        modals.forEach(modal => {
            const closeButtons = modal.querySelectorAll('.modal-close, .modal-overlay');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => hideModal(modal));
            });
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    hideModal(activeModal);
                }
            }
        });
    }

    function showModal(modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Performance optimizations
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

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

    // Optimize scroll events
    window.addEventListener('scroll', throttle(function() {
        handleNavbarScroll();
        handleScrollTop();
        handleParallaxEffects();
    }, 10));

    // Optimize resize events
    window.addEventListener('resize', debounce(function() {
        // Handle responsive adjustments
        closeMobileMenu();
    }, 250));

    // Error handling
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
    });

    // Accessibility improvements
    function initializeAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Focus management for mobile menu
        if (navToggle) {
            navToggle.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleMobileMenu();
                }
            });
        }
        
        // Ensure proper focus order
        const focusableElements = document.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('focused');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('focused');
            });
        });
    }

    // Initialize accessibility features
    initializeAccessibility();

    // Public API
    window.RotorjetApp = {
        toggleMobileMenu,
        scrollToTop,
        showModal,
        hideModal,
        validateForm
    };

})();

class EnhancedNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.quickBookForm = document.getElementById('nav-quick-book');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Scroll handling
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Quick book form
        if (this.quickBookForm) {
            this.quickBookForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickBook();
            });
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add sticky class when scrolled
        if (currentScrollY > 100) {
            this.navbar.classList.add('sticky');
        } else {
            this.navbar.classList.remove('sticky');
        }
        
        // Hide/show navigation on scroll (mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    handleQuickBook() {
        const formData = new FormData(this.quickBookForm);
        const service = formData.get('service');
        const passengers = formData.get('passengers');
        
        if (!service || !passengers) {
            this.showNotification('Please select service and passenger count', 'error');
            return;
        }
        
        // Redirect to booking page with pre-filled data
        const params = new URLSearchParams({ service, passengers });
        window.location.href = `pages/booking.html?${params.toString()}`;
    }
    
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    handleKeyboardNavigation(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            if (this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
            this.closeAllDropdowns();
        }
        
        // Enter key on dropdown toggles
        if (e.key === 'Enter' && e.target.classList.contains('dropdown-toggle')) {
            e.preventDefault();
            e.target.closest('.dropdown').classList.toggle('active');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `nav-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize enhanced navigation
document.addEventListener('DOMContentLoaded', function() {
    new EnhancedNavigation();
});