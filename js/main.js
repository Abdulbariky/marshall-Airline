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

/* ============================================
   INTEGRATED NAVIGATION FIX 
   Add this to the END of your main.js file
   ============================================ */

// Navigation functions - Add these to your main.js
window.navigateToPage = function(pageName) {
    try {
        const currentPath = window.location.pathname;
        const isInPagesDirectory = currentPath.includes('/pages/');
        
        let targetPath;
        
        if (pageName === 'home') {
            targetPath = isInPagesDirectory ? '../index.html' : 'index.html';
        } else {
            targetPath = isInPagesDirectory ? `${pageName}.html` : `pages/${pageName}.html`;
        }
        
        console.log(`Navigating from ${currentPath} to ${targetPath}`);
        window.location.href = targetPath;
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation
        window.location.href = 'index.html';
    }
};

window.goHome = function() {
    try {
        const currentPath = window.location.pathname;
        const isInPagesDirectory = currentPath.includes('/pages/');
        
        if (isInPagesDirectory) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Home navigation error:', error);
        window.location.href = 'index.html';
    }
};

// Fix the querySelector error in smooth scroll
function fixSmoothScrollError() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just '#' or empty
            if (href === '#' || href === '' || href === null) {
                e.preventDefault();
                return false;
            }
            
            // Skip if it's a navigation function call
            if (this.getAttribute('onclick')) {
                return; // Let the onclick handler manage it
            }
            
            // Fix problematic paths
            if (href.includes('pages/pages/')) {
                e.preventDefault();
                const fixedHref = href.replace('pages/pages/', 'pages/');
                this.setAttribute('href', fixedHref);
                window.location.href = fixedHref;
                return false;
            }
        });
    });
}

// Auto-fix navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Fix smooth scroll errors
    fixSmoothScrollError();
    
    // Fix any existing problematic links
    const problematicLinks = document.querySelectorAll('a[href*="pages/pages/"]');
    problematicLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.setAttribute('href', href.replace('pages/pages/', 'pages/'));
    });
    
    // Set active navigation states
    setActiveNavigation();
    
    console.log('Navigation system initialized successfully');
});

// Set active navigation item
function setActiveNavigation() {
    try {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link[data-page], .nav-link');
        
        navLinks.forEach(link => {
            const onclick = link.getAttribute('onclick');
            const href = link.getAttribute('href');
            
            link.classList.remove('active');
            
            if (onclick) {
                // Check onclick for page names
                if (onclick.includes("'home'") && (currentPath.includes('index') || currentPath === '/')) {
                    link.classList.add('active');
                } else if (onclick.includes("'about'") && currentPath.includes('about')) {
                    link.classList.add('active');
                } else if (onclick.includes("'fleet'") && currentPath.includes('fleet')) {
                    link.classList.add('active');
                } else if (onclick.includes("'contact'") && currentPath.includes('contact')) {
                    link.classList.add('active');
                } else if (onclick.includes("'gallery'") && currentPath.includes('gallery')) {
                    link.classList.add('active');
                } else if (onclick.includes("'booking'") && currentPath.includes('booking')) {
                    link.classList.add('active');
                }
            }
        });
    } catch (error) {
        console.log('Active navigation setting skipped:', error);
    }
}

// Override any existing handleSmoothScroll to prevent querySelector errors
window.handleSmoothScroll = function(element) {
    try {
        const href = element.getAttribute('href');
        
        // Skip if href is problematic
        if (!href || href === '#' || href === '') {
            return false;
        }
        
        // Check if it's an anchor link
        if (href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.log('Smooth scroll skipped for problematic selector');
        return false;
    }
};

// Emergency fix function - call if navigation breaks
window.emergencyNavigationFix = function() {
    try {
        // Fix all problematic links
        const allLinks = document.querySelectorAll('a[href]');
        const currentPath = window.location.pathname;
        const isInPagesDirectory = currentPath.includes('/pages/');
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                // Fix double pages/ in URL
                if (href.includes('pages/pages/')) {
                    link.setAttribute('href', href.replace('pages/pages/', 'pages/'));
                }
                
                // Fix relative paths based on current location
                if (isInPagesDirectory && href.startsWith('pages/') && !href.includes('../')) {
                    link.setAttribute('href', href.replace('pages/', ''));
                } else if (!isInPagesDirectory && !href.includes('pages/') && href.includes('.html')) {
                    if (!href.includes('index.html') && !href.startsWith('../')) {
                        link.setAttribute('href', 'pages/' + href);
                    }
                }
            }
        });
        
        console.log('Emergency navigation fix applied successfully!');
        return true;
    } catch (error) {
        console.error('Emergency fix failed:', error);
        return false;
    }
};

// Auto-run emergency fix every 3 seconds if needed
setInterval(function() {
    const problematicLinks = document.querySelectorAll('a[href*="pages/pages/"]');
    if (problematicLinks.length > 0) {
        emergencyNavigationFix();
    }
}, 3000);

// Add global error handler for navigation
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('querySelector') && e.message.includes('#')) {
        console.log('Prevented querySelector error with invalid selector');
        e.preventDefault();
        return true;
    }
});

console.log('✅ Navigation fix integrated successfully!');

/* ============================================
   MOBILE MENU FUNCTIONALITY
   ============================================ */

// Mobile menu toggle
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Dropdown functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        initializeMobileMenu();
        initializeDropdowns();
    }, 100);
});

/* ============================================
   QUICK TEST FUNCTIONS (for browser console)
   ============================================ */

// Test functions - use these in browser console to debug
window.testNavigation = function() {
    console.log('Testing navigation functions...');
    console.log('Current path:', window.location.pathname);
    console.log('Is in pages directory:', window.location.pathname.includes('/pages/'));
    console.log('Navigate to fleet:', 'navigateToPage("fleet")');
    console.log('Go home:', 'goHome()');
    return 'Navigation test complete - check console for details';
};

window.fixAllLinks = function() {
    emergencyNavigationFix();
    return 'All links fixed!';
};

/* ============================================
   JAVASCRIPT TO REMOVE BREADCRUMB NAVIGATION
   Add this to your main.js file
   ============================================ */

// Function to remove all breadcrumb elements
function removeBreadcrumbNavigation() {
    try {
        // Remove by common breadcrumb classes and IDs
        const breadcrumbSelectors = [
            '.breadcrumb-container',
            '.breadcrumb',
            '.breadcrumbs',
            '.page-breadcrumb',
            '.navigation-breadcrumb',
            '.breadcrumb-nav',
            '.breadcrumb-wrapper',
            '.breadcrumb-navigation',
            '#breadcrumb',
            '#breadcrumbs',
            'nav.breadcrumb',
            'ol.breadcrumb',
            'ul.breadcrumb'
        ];
        
        breadcrumbSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                element.style.height = '0';
                element.style.width = '0';
                element.style.margin = '0';
                element.style.padding = '0';
                element.style.overflow = 'hidden';
                element.remove(); // Completely remove from DOM
            });
        });
        
        // Remove elements by class pattern
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const className = element.className;
            if (className && typeof className === 'string' && className.includes('breadcrumb')) {
                element.style.display = 'none';
                element.remove();
            }
        });
        
        // Remove elements containing "Home / " pattern
        const textElements = document.querySelectorAll('*');
        textElements.forEach(element => {
            const text = element.textContent || element.innerText;
            if (text && (
                text.includes('Home / Contact') ||
                text.includes('Home / About') ||
                text.includes('Home / Fleet') ||
                text.includes('Home / Gallery') ||
                text.includes('Home / Booking') ||
                text.includes('Home / Services') ||
                text.trim().match(/^Home\s*\/\s*\w+$/)
            )) {
                // Check if this element is likely a breadcrumb
                const parent = element.parentElement;
                const elementClasses = (element.className || '').toLowerCase();
                const parentClasses = (parent?.className || '').toLowerCase();
                
                if (
                    elementClasses.includes('breadcrumb') ||
                    parentClasses.includes('breadcrumb') ||
                    elementClasses.includes('navigation') ||
                    parentClasses.includes('navigation') ||
                    element.tagName === 'NAV' ||
                    parent?.tagName === 'NAV'
                ) {
                    element.style.display = 'none';
                    element.remove();
                }
            }
        });
        
        console.log('✅ Breadcrumb navigation removed successfully');
        
    } catch (error) {
        console.log('Breadcrumb removal completed with minor issues:', error);
    }
}

// Function to continuously monitor and remove breadcrumbs
function monitorAndRemoveBreadcrumbs() {
    // Remove immediately
    removeBreadcrumbNavigation();
    
    // Remove after DOM content loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeBreadcrumbNavigation);
    }
    
    // Remove after window loads
    window.addEventListener('load', removeBreadcrumbNavigation);
    
    // Monitor for dynamically added breadcrumbs
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const element = node;
                        const className = (element.className || '').toLowerCase();
                        const text = element.textContent || element.innerText || '';
                        
                        // Check if the added element is a breadcrumb
                        if (
                            className.includes('breadcrumb') ||
                            text.includes('Home /') ||
                            element.querySelector && element.querySelector('.breadcrumb')
                        ) {
                            setTimeout(() => {
                                element.style.display = 'none';
                                element.remove();
                            }, 100);
                        }
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Periodic cleanup every 2 seconds
    setInterval(removeBreadcrumbNavigation, 2000);
}

// Initialize breadcrumb removal
monitorAndRemoveBreadcrumbs();

// Manual function to remove breadcrumbs (can be called from console)
window.removeBreadcrumbs = function() {
    removeBreadcrumbNavigation();
    return 'Breadcrumbs removed!';
};

// Emergency breadcrumb removal function
window.emergencyRemoveBreadcrumbs = function() {
    try {
        // Nuclear option - remove any element containing breadcrumb text
        const allElements = document.getElementsByTagName('*');
        
        for (let i = allElements.length - 1; i >= 0; i--) {
            const element = allElements[i];
            const text = element.textContent || element.innerText || '';
            const className = (element.className || '').toLowerCase();
            const id = (element.id || '').toLowerCase();
            
            if (
                text.includes('Home /') ||
                className.includes('breadcrumb') ||
                id.includes('breadcrumb') ||
                text.trim().match(/^Home\s*\/\s*\w+$/)
            ) {
                element.style.display = 'none';
                element.remove();
            }
        }
        
        console.log('🚨 Emergency breadcrumb removal completed');
        return 'Emergency removal completed!';
        
    } catch (error) {
        console.log('Emergency removal error:', error);
        return 'Emergency removal had issues but completed';
    }
};

// Add CSS removal as backup
function addBreadcrumbRemovalCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .breadcrumb-container,
        .breadcrumb,
        .breadcrumbs,
        .page-breadcrumb,
        .navigation-breadcrumb,
        [class*="breadcrumb"],
        [id*="breadcrumb"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);
}

// Apply CSS removal immediately
addBreadcrumbRemovalCSS();

console.log('🚁 Breadcrumb removal system activated!');