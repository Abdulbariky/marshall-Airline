/* ============================================
   NAVIGATION PATH FIX - JavaScript Solution
   ============================================ */

// Fix navigation paths for seamless page-to-page navigation
class NavigationPathFixer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.fixAllNavigationLinks());
        } else {
            this.fixAllNavigationLinks();
        }
    }

    // Get the correct base path based on current location
    getBasePath() {
        const currentPath = window.location.pathname;
        const isInPagesDirectory = currentPath.includes('/pages/');
        
        if (isInPagesDirectory) {
            // We're in pages/ directory, so links should be relative to pages/
            return '';
        } else {
            // We're in root directory, so links should include pages/
            return 'pages/';
        }
    }

    // Fix all navigation links on the page
    fixAllNavigationLinks() {
        const basePath = this.getBasePath();
        
        // Define all page mappings
        const pageMap = {
            'home': basePath === '' ? '../index.html' : 'index.html',
            'about': basePath + 'about.html',
            'helicopter-charter': basePath + 'helicopter-charter.html',
            'jet-charter': basePath + 'jet-charter.html',
            'maintenance': basePath + 'maintenance.html',
            'fleet': basePath + 'fleet.html',
            'gallery': basePath + 'gallery.html',
            'contact': basePath + 'contact.html',
            'booking': basePath + 'booking.html',
            'quote': basePath + 'quote.html',
            'booking-confirmation': basePath + 'booking-confirmation.html',
            'booking-lookup': basePath + 'booking-lookup.html',
            'my-bookings': basePath + 'my-bookings.html'
        };

        // Fix navigation links
        this.fixNavigationLinks(pageMap);
        
        // Fix breadcrumb links
        this.fixBreadcrumbLinks(pageMap);
        
        // Fix footer links
        this.fixFooterLinks(pageMap);
        
        // Fix any other links
        this.fixMiscellaneousLinks(pageMap);
    }

    // Fix main navigation links
    fixNavigationLinks(pageMap) {
        const navLinks = document.querySelectorAll('.nav-link, .navbar a, .navigation a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Check for each page type and fix the link
                Object.keys(pageMap).forEach(page => {
                    if (href.includes(page + '.html') || href.includes('/' + page) || this.isPageLink(href, page)) {
                        link.setAttribute('href', pageMap[page]);
                        console.log(`Fixed navigation link: ${href} → ${pageMap[page]}`);
                    }
                });
                
                // Handle home links specifically
                if (href === '/' || href === './index.html' || href === 'index.html' || href.includes('home')) {
                    link.setAttribute('href', pageMap['home']);
                    console.log(`Fixed home link: ${href} → ${pageMap['home']}`);
                }
            }
        });
    }

    // Fix breadcrumb navigation
    fixBreadcrumbLinks(pageMap) {
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a, .breadcrumbs a');
        
        breadcrumbLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.toLowerCase().trim();
            
            if (text === 'home') {
                link.setAttribute('href', pageMap['home']);
            } else if (pageMap[text]) {
                link.setAttribute('href', pageMap[text]);
            }
        });
    }

    // Fix footer links
    fixFooterLinks(pageMap) {
        const footerLinks = document.querySelectorAll('footer a, .footer a, .footer-section a');
        
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                Object.keys(pageMap).forEach(page => {
                    if (href.includes(page + '.html') || this.isPageLink(href, page)) {
                        link.setAttribute('href', pageMap[page]);
                    }
                });
            }
        });
    }

    // Fix miscellaneous links (buttons, CTAs, etc.)
    fixMiscellaneousLinks(pageMap) {
        const allLinks = document.querySelectorAll('a[href]');
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                Object.keys(pageMap).forEach(page => {
                    if (this.isPageLink(href, page)) {
                        link.setAttribute('href', pageMap[page]);
                    }
                });
            }
        });
    }

    // Helper function to check if a link refers to a specific page
    isPageLink(href, page) {
        const patterns = [
            new RegExp(page + '\\.html$'),
            new RegExp('/' + page + '$'),
            new RegExp('/' + page + '\\.html$'),
            new RegExp('pages/' + page + '\\.html$')
        ];
        
        return patterns.some(pattern => pattern.test(href));
    }

    // Add click event listeners for additional safety
    addClickListeners() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')) {
                const href = link.getAttribute('href');
                
                // If it's still a problematic link, fix it on the fly
                if (href.includes('/pages/pages/') || href.includes('pages/pages/')) {
                    e.preventDefault();
                    const fixedHref = href.replace('/pages/pages/', '/pages/').replace('pages/pages/', 'pages/');
                    link.setAttribute('href', fixedHref);
                    window.location.href = fixedHref;
                }
            }
        });
    }
}

// Initialize the navigation fixer
const navigationFixer = new NavigationPathFixer();

// Also add click listeners for extra safety
document.addEventListener('DOMContentLoaded', () => {
    navigationFixer.addClickListeners();
});

/* ============================================
   ADDITIONAL NAVIGATION HELPERS
   ============================================ */

// Function to manually navigate to a page (can be called from anywhere)
function navigateToPage(pageName) {
    const currentPath = window.location.pathname;
    const isInPagesDirectory = currentPath.includes('/pages/');
    
    let targetPath;
    
    if (pageName === 'home') {
        targetPath = isInPagesDirectory ? '../index.html' : 'index.html';
    } else {
        targetPath = isInPagesDirectory ? `${pageName}.html` : `pages/${pageName}.html`;
    }
    
    window.location.href = targetPath;
}

// Function to go back to home from any page
function goHome() {
    const currentPath = window.location.pathname;
    const isInPagesDirectory = currentPath.includes('/pages/');
    
    if (isInPagesDirectory) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Emergency navigation fix - call this if navigation is still broken
function emergencyNavigationFix() {
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
            if (isInPagesDirectory && href.startsWith('pages/')) {
                link.setAttribute('href', href.replace('pages/', ''));
            } else if (!isInPagesDirectory && !href.includes('pages/') && href.includes('.html')) {
                if (!href.includes('index.html')) {
                    link.setAttribute('href', 'pages/' + href);
                }
            }
        }
    });
    
    console.log('Emergency navigation fix applied!');
}

// Auto-fix navigation every 2 seconds as a fallback
setInterval(() => {
    if (document.querySelector('a[href*="pages/pages/"]')) {
        emergencyNavigationFix();
    }
}, 2000);

console.log('Navigation Path Fixer loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    const currentPageElement = document.getElementById('current-page-name');
    if (currentPageElement) {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop().replace('.html', '');
        
        const pageNames = {
            'index': 'Home',
            'about': 'About Us',
            'helicopter-charter': 'Helicopter Charter',
            'jet-charter': 'Private Jet Charter',
            'maintenance': 'Aircraft Maintenance',
            'fleet': 'Our Fleet',
            'gallery': 'Gallery',
            'contact': 'Contact Us',
            'booking': 'Book Flight',
            'booking-lookup': 'Find Booking',
            'my-bookings': 'My Bookings',
            'quote': 'Request Quote'
        };
        
        currentPageElement.textContent = pageNames[pageName] || 'Page';
    }
    
    // Set active navigation item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (currentPath.includes(page) || (page === 'home' && currentPath.includes('index'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});

// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });
});