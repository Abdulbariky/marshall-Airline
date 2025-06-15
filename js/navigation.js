/* ===============================================
   marshallairline Aviation - Navigation System
   =============================================== */

(function() {
    'use strict';

    // Navigation state
    let currentPage = getCurrentPage();
    let navigationHistory = [];
    let isNavigating = false;

    // Initialize navigation when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        initializeBreadcrumbs();
        initializePageTransitions();
    });

    // Main navigation initialization
    function initializeNavigation() {
        setupNavigationEvents();
        highlightActiveNavigation();
        initializeMobileNavigation();
        setupKeyboardNavigation();
    }

    // Get current page from URL
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '') || 'index';
    }

    // Setup navigation event listeners
    function setupNavigationEvents() {
        // Handle all navigation links
        const navLinks = document.querySelectorAll('a[href]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                link.addEventListener('click', handleNavigation);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', handlePopState);

        // Handle navigation keyboard shortcuts
        document.addEventListener('keydown', handleNavigationShortcuts);
    }

    // Handle navigation clicks
    function handleNavigation(event) {
        // Don't intercept if modifier keys are pressed
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }

        const link = event.currentTarget;
        const href = link.getAttribute('href');

        // Handle anchor links
        if (href.startsWith('#')) {
            handleAnchorNavigation(event, href);
            return;
        }

        // Handle page navigation
        if (href.includes('.html') || href.startsWith('pages/')) {
            event.preventDefault();
            navigateToPage(href, link.textContent.trim());
        }
    }

    // Handle anchor link navigation
    function handleAnchorNavigation(event, href) {
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            smoothScrollToElement(targetElement);
            updateURL(href);
        }
    }

    // Navigate to a new page
    function navigateToPage(href, title = '') {
        if (isNavigating) return;
        
        isNavigating = true;
        
        // Add to navigation history
        addToHistory(currentPage, document.title);
        
        // Show loading state
        showPageLoadingState();
        
        // Simulate page transition delay for smooth experience
        setTimeout(() => {
            window.location.href = href;
        }, 150);
    }

    // Add page to navigation history
    function addToHistory(page, title) {
        navigationHistory.push({
            page: page,
            title: title,
            timestamp: Date.now(),
            scrollPosition: window.scrollY
        });
        
        // Limit history size
        if (navigationHistory.length > 50) {
            navigationHistory.shift();
        }
    }

    // Show page loading state
    function showPageLoadingState() {
        // Add loading class to body
        document.body.classList.add('page-loading');
        
        // Show loading indicator
        const loadingIndicator = createLoadingIndicator();
        document.body.appendChild(loadingIndicator);
        
        // Fade out current content
        const mainContent = document.querySelector('main') || document.body;
        mainContent.style.opacity = '0.7';
    }

    // Create loading indicator
    function createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'page-loading-indicator';
        indicator.innerHTML = `
            <div class="loading-spinner-small"></div>
            <span>Loading...</span>
        `;
        return indicator;
    }

    // Highlight active navigation items
    function highlightActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        const currentPage = getCurrentPage();
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.split('/').pop().replace('.html', '') || 'index';
                
                if (linkPage === currentPage || 
                    (currentPage === 'index' && (href === 'index.html' || href === '/'))) {
                    link.classList.add('active');
                }
            }
        });
        
        // Update page title and meta
        updatePageMeta();
    }

    // Update page metadata
    function updatePageMeta() {
        const pageConfig = getPageConfig(currentPage);
        
        if (pageConfig) {
            // Update page title
            document.title = pageConfig.title;
            
            // Update meta description
            updateMetaTag('description', pageConfig.description);
            
            // Update meta keywords
            updateMetaTag('keywords', pageConfig.keywords);
            
            // Update Open Graph tags
            updateMetaTag('og:title', pageConfig.title);
            updateMetaTag('og:description', pageConfig.description);
        }
    }

    // Update meta tag content
    function updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="${name}"]`);
        
        if (meta) {
            meta.setAttribute('content', content);
        }
    }

    // Get page configuration
    function getPageConfig(page) {
        const configs = {
            'index': {
                title: 'marshallairline Aviation - Premier Aviation Services',
                description: 'Kenya\'s leading helicopter and private jet charter services. Professional aviation solutions for business and leisure.',
                keywords: 'helicopter charter, private jet, aviation, Kenya, aircraft maintenance'
            },
            'about': {
                title: 'About Us - marshallairline Aviation',
                description: 'Learn about marshallairline Aviation\'s history, mission, and commitment to excellence in aviation services.',
                keywords: 'about marshallairline, aviation company, helicopter services, aviation history'
            },
            'fleet': {
                title: 'Our Fleet - marshallairline Aviation',
                description: 'Explore our modern fleet of helicopters and private jets available for charter services.',
                keywords: 'aircraft fleet, helicopters, private jets, charter aircraft'
            },
            'contact': {
                title: 'Contact Us - marshallairline Aviation',
                description: 'Get in touch with marshallairline Aviation for aviation services, bookings, and inquiries.',
                keywords: 'contact marshallairline, aviation services contact, helicopter booking'
            },
            'gallery': {
                title: 'Photo Gallery - marshallairline Aviation',
                description: 'View our gallery of aircraft, destinations, and aviation services.',
                keywords: 'aviation photos, aircraft gallery, helicopter images'
            },
            'helicopter-charter': {
                title: 'Helicopter Charter Services - marshallairline Aviation',
                description: 'Premium helicopter charter services for tourism, business travel, and special occasions.',
                keywords: 'helicopter charter, helicopter rental, safari tours, helicopter services'
            },
            'jet-charter': {
                title: 'Private Jet Charter - marshallairline Aviation',
                description: 'Luxury private jet charter services for domestic and international travel.',
                keywords: 'private jet charter, jet rental, business jet, luxury travel'
            },
            'maintenance': {
                title: 'Aircraft Maintenance - marshallairline Aviation',
                description: 'Professional aircraft maintenance and inspection services by certified technicians.',
                keywords: 'aircraft maintenance, helicopter maintenance, aviation repair, aircraft inspection'
            },
            'quote': {
                title: 'Request Quote - marshallairline Aviation',
                description: 'Get a personalized quote for helicopter or private jet charter services.',
                keywords: 'aviation quote, charter quote, helicopter booking, jet rental quote'
            }
        };
        
        return configs[page] || configs['index'];
    }

    // Mobile navigation functionality
    function initializeMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navOverlay = createMobileNavOverlay();
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => toggleMobileNav(navMenu, navOverlay));
            
            // Close mobile nav when clicking on links
            const mobileNavLinks = navMenu.querySelectorAll('.nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => closeMobileNav(navMenu, navOverlay));
            });
        }
        
        // Handle mobile nav swipe gestures
        initializeMobileGestures(navMenu);
    }

    // Create mobile navigation overlay
    function createMobileNavOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            closeMobileNav(navMenu, overlay);
        });
        return overlay;
    }

    // Toggle mobile navigation
    function toggleMobileNav(navMenu, overlay) {
        const isOpen = navMenu.classList.contains('active');
        
        if (isOpen) {
            closeMobileNav(navMenu, overlay);
        } else {
            openMobileNav(navMenu, overlay);
        }
    }

    // Open mobile navigation
    function openMobileNav(navMenu, overlay) {
        navMenu.classList.add('active');
        document.body.classList.add('mobile-nav-open');
        document.body.appendChild(overlay);
        
        // Animate menu items
        const menuItems = navMenu.querySelectorAll('.nav-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in');
        });
    }

    // Close mobile navigation
    function closeMobileNav(navMenu, overlay) {
        navMenu.classList.remove('active');
        document.body.classList.remove('mobile-nav-open');
        
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        
        // Remove animation classes
        const menuItems = navMenu.querySelectorAll('.nav-item');
        menuItems.forEach(item => {
            item.classList.remove('animate-slide-in');
            item.style.animationDelay = '';
        });
    }

    // Initialize mobile gestures
    function initializeMobileGestures(navMenu) {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Check for horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX < 0 && touchStartX < 50) {
                    // Swipe left from edge - open menu
                    const overlay = createMobileNavOverlay();
                    openMobileNav(navMenu, overlay);
                } else if (deltaX > 0 && navMenu.classList.contains('active')) {
                    // Swipe right - close menu
                    const overlay = document.querySelector('.mobile-nav-overlay');
                    closeMobileNav(navMenu, overlay);
                }
            }
        });
    }

    // Keyboard navigation
    function setupKeyboardNavigation() {
        // Handle tab navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Remove keyboard navigation class on mouse click
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Handle navigation keyboard shortcuts
    function handleNavigationShortcuts(event) {
        // Alt + H - Home
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            navigateToPage('index.html', 'Home');
        }
        
        // Alt + A - About
        if (event.altKey && event.key === 'a') {
            event.preventDefault();
            navigateToPage('pages/about.html', 'About');
        }
        
        // Alt + C - Contact
        if (event.altKey && event.key === 'c') {
            event.preventDefault();
            navigateToPage('pages/contact.html', 'Contact');
        }
        
        // Alt + F - Fleet
        if (event.altKey && event.key === 'f') {
            event.preventDefault();
            navigateToPage('pages/fleet.html', 'Fleet');
        }
        
        // Escape - Close mobile menu
        if (event.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const overlay = document.querySelector('.mobile-nav-overlay');
            if (navMenu && navMenu.classList.contains('active')) {
                closeMobileNav(navMenu, overlay);
            }
        }
    }

    // Handle browser back/forward
    function handlePopState(event) {
        currentPage = getCurrentPage();
        highlightActiveNavigation();
        
        // Restore scroll position if available
        if (event.state && event.state.scrollPosition) {
            setTimeout(() => {
                window.scrollTo(0, event.state.scrollPosition);
            }, 100);
        }
    }

    // Initialize breadcrumbs
    function initializeBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (breadcrumbContainer) {
            generateBreadcrumbs(breadcrumbContainer);
        }
    }

    // Generate breadcrumb navigation
    function generateBreadcrumbs(container) {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        let breadcrumbs = [{
            name: 'Home',
            url: '../index.html'
        }];
        
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += '/' + segment;
            
            if (segment.includes('.html')) {
                const pageName = segment.replace('.html', '').replace('-', ' ');
                breadcrumbs.push({
                    name: capitalizeWords(pageName),
                    url: index === segments.length - 1 ? null : currentPath,
                    active: index === segments.length - 1
                });
            }
        });
        
        renderBreadcrumbs(container, breadcrumbs);
    }

    // Render breadcrumb HTML
    function renderBreadcrumbs(container, breadcrumbs) {
        const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
            if (crumb.active || !crumb.url) {
                return `<span class="breadcrumb-item">${crumb.name}</span>`;
            } else {
                const separator = index < breadcrumbs.length - 1 ? '<span class="breadcrumb-separator">/</span>' : '';
                return `<a href="${crumb.url}" class="breadcrumb-item">${crumb.name}</a>${separator}`;
            }
        }).join(' ');
        
        container.innerHTML = breadcrumbHTML;
    }

    // Page transition effects
    function initializePageTransitions() {
        // Add page load animation
        document.body.classList.add('page-loaded');
        
        // Remove loading state when page is fully loaded
        window.addEventListener('load', () => {
            document.body.classList.remove('page-loading');
            isNavigating = false;
            
            // Remove any loading indicators
            const loadingIndicators = document.querySelectorAll('.page-loading-indicator');
            loadingIndicators.forEach(indicator => indicator.remove());
        });
    }

    // Smooth scroll to element
    function smoothScrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Update hash without jumping
        history.replaceState(null, null, `#${element.id}`);
    }

    // Update URL without page reload
    function updateURL(url) {
        history.replaceState({
            scrollPosition: window.scrollY
        }, document.title, url);
    }

    // Utility function to capitalize words
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    // Search functionality
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(e.target.value, searchResults);
                }, 300);
            });
            
            // Close search results when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && searchResults) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    // Perform search
    function performSearch(query, resultsContainer) {
        if (!query.trim() || !resultsContainer) return;
        
        // Simple search implementation
        const searchableContent = getSearchableContent();
        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(results, resultsContainer, query);
    }

    // Get searchable content
    function getSearchableContent() {
        return [
            {
                title: 'Helicopter Charter',
                content: 'Premium helicopter services for tourism and business travel',
                url: 'pages/helicopter-charter.html'
            },
            {
                title: 'Private Jet Charter',
                content: 'Luxury private jet services for domestic and international travel',
                url: 'pages/jet-charter.html'
            },
            {
                title: 'Aircraft Maintenance',
                content: 'Professional aircraft maintenance and inspection services',
                url: 'pages/maintenance.html'
            },
            {
                title: 'Our Fleet',
                content: 'Modern fleet of helicopters and private jets',
                url: 'pages/fleet.html'
            },
            {
                title: 'About Us',
                content: 'Learn about our company history and mission',
                url: 'pages/about.html'
            },
            {
                title: 'Contact',
                content: 'Get in touch for bookings and inquiries',
                url: 'pages/contact.html'
            }
        ];
    }

    // Display search results
    function displaySearchResults(results, container, query) {
        if (results.length === 0) {
            container.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
        } else {
            const resultsHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <h4 class="search-result-title">${highlightSearchTerm(result.title, query)}</h4>
                    <p class="search-result-content">${highlightSearchTerm(result.content, query)}</p>
                </a>
            `).join('');
            
            container.innerHTML = resultsHTML;
        }
        
        container.style.display = 'block';
    }

    // Highlight search terms
    function highlightSearchTerm(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Initialize search if elements exist
    initializeSearch();

    // Public API
    window.marshallairlineNavigation = {
        navigateToPage,
        highlightActiveNavigation,
        smoothScrollToElement,
        getCurrentPage,
        getNavigationHistory: () => [...navigationHistory]
    };

})();