// JavaScript Fixes for Rotorjet Aviation Website
class WebsiteFixes {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.applyFixes();
            });
        } else {
            this.applyFixes();
        }
    }
    
    applyFixes() {
        this.fixSupportText();
        this.enhanceFleetAvailability();
        this.removeOfficeCards();
        this.enhanceBookingForms();
        this.fixCallNowButtons();
        this.hideBookingConfirmation();
        this.removeSpinners();
        this.enhanceFormValidation();
        this.fixNavigationPaths();
        this.addDatePickerEnhancements();
    }
    
    // Fix 5: Support text from 247/ to 24/7
    fixSupportText() {
        const supportElements = document.querySelectorAll('*');
        supportElements.forEach(element => {
            if (element.textContent && element.textContent.includes('247/')) {
                element.innerHTML = element.innerHTML.replace(/247\//g, '24/7');
            }
        });
    }
    
    // Fix 9: Enhance Fleet Availability Section
    enhanceFleetAvailability() {
        const availabilitySection = document.querySelector('.availability-section, .fleet-availability');
        if (availabilitySection) {
            // Add enhanced styling class
            availabilitySection.classList.add('enhanced-availability');
            
            // Enhance date inputs
            const dateInputs = availabilitySection.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                // Create wrapper for better styling
                if (!input.parentElement.classList.contains('date-picker-container')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'date-picker-container';
                    input.parentNode.insertBefore(wrapper, input);
                    wrapper.appendChild(input);
                }
                
                // Set minimum date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                input.min = tomorrow.toISOString().split('T')[0];
                
                // Add color styling
                input.style.color = '#dc2626';
                input.style.fontWeight = '600';
            });
            
            // Enhance aircraft select dropdowns
            const aircraftSelects = availabilitySection.querySelectorAll('select');
            aircraftSelects.forEach(select => {
                select.classList.add('aircraft-select');
                
                // Add aircraft options if empty or generic
                if (select.name && select.name.includes('aircraft') || select.id && select.id.includes('aircraft')) {
                    this.populateAircraftOptions(select);
                }
                
                // Add visibility improvements
                select.style.color = '#374151';
                select.style.backgroundColor = 'white';
                
                // Enhance options visibility
                const options = select.querySelectorAll('option');
                options.forEach(option => {
                    option.style.color = '#374151';
                    option.style.backgroundColor = 'white';
                    option.style.padding = '12px';
                });
            });
        }
    }
    
    populateAircraftOptions(select) {
        // Clear existing options except the first placeholder
        const placeholder = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (placeholder) {
            select.appendChild(placeholder);
        } else {
            const newPlaceholder = document.createElement('option');
            newPlaceholder.value = '';
            newPlaceholder.textContent = 'Select Aircraft Type';
            select.appendChild(newPlaceholder);
        }
        
        // Add aircraft categories
        const aircraftTypes = [
            { value: 'any', text: 'Any Available Aircraft', group: 'all' },
            { value: 'helicopter', text: 'Helicopter Charter', group: 'rotorcraft' },
            { value: 'helicopter-light', text: '• Light Helicopter (2-4 pax)', group: 'rotorcraft' },
            { value: 'helicopter-medium', text: '• Medium Helicopter (5-6 pax)', group: 'rotorcraft' },
            { value: 'helicopter-heavy', text: '• Heavy Helicopter (7+ pax)', group: 'rotorcraft' },
            { value: 'private-jet', text: 'Private Jet Charter', group: 'fixed-wing' },
            { value: 'jet-light', text: '• Light Jet (4-6 pax)', group: 'fixed-wing' },
            { value: 'jet-midsize', text: '• Midsize Jet (6-8 pax)', group: 'fixed-wing' },
            { value: 'jet-heavy', text: '• Heavy Jet (8+ pax)', group: 'fixed-wing' }
        ];
        
        aircraftTypes.forEach(aircraft => {
            const option = document.createElement('option');
            option.value = aircraft.value;
            option.textContent = aircraft.text;
            option.style.color = '#374151';
            option.style.backgroundColor = 'white';
            option.style.fontWeight = aircraft.text.startsWith('•') ? '500' : '600';
            select.appendChild(option);
        });
    }
    
    // Fix 11: Remove Office Cards from Contact Page
    removeOfficeCards() {
        const officeSelectors = [
            '.office-card',
            '.visit-office',
            '.office-visit-card',
            '.contact-office',
            '.office-location-card',
            '.office-info',
            '[class*="office"]',
            '[id*="office"]'
        ];
        
        officeSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Check if it's actually an office-related element
                if (element.textContent && 
                    (element.textContent.toLowerCase().includes('visit') ||
                     element.textContent.toLowerCase().includes('office'))) {
                    element.style.display = 'none';
                }
            });
        });
        
        // Remove elements containing office-related text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.textContent && 
                element.children.length === 0 && // Only text nodes
                (element.textContent.toLowerCase().includes('visit our office') ||
                 element.textContent.toLowerCase().includes('office hours') ||
                 element.textContent.toLowerCase().includes('office location'))) {
                const parent = element.closest('.card, .section, .contact-item, .info-card');
                if (parent) {
                    parent.style.display = 'none';
                }
            }
        });
    }
    
    // Fix 12: Enhance Booking Forms
    enhanceBookingForms() {
        const formSelectors = [
            '.booking-form',
            '.passenger-form',
            '.payment-form',
            '.lookup-form',
            '.quote-form',
            '.contact-form'
        ];
        
        formSelectors.forEach(selector => {
            const forms = document.querySelectorAll(selector);
            forms.forEach(form => {
                this.enhanceFormFields(form);
                this.addFormAnimations(form);
            });
        });
    }
    
    enhanceFormFields(form) {
        // Enhance all input fields
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Add enhanced styling classes
            input.classList.add('enhanced-field');
            
            // Add focus animations
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('field-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('field-focused');
                if (input.value) {
                    input.parentElement.classList.add('field-filled');
                } else {
                    input.parentElement.classList.remove('field-filled');
                }
            });
            
            // Enhance select dropdowns
            if (input.tagName === 'SELECT') {
                this.enhanceSelectDropdown(input);
            }
        });
        
        // Enhance form sections
        const sections = form.querySelectorAll('.form-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
            section.classList.add('fade-in');
        });
    }
    
    enhanceSelectDropdown(select) {
        // Ensure options are visible
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            option.style.display = 'block';
            option.style.color = '#374151';
            option.style.backgroundColor = 'white';
            option.style.padding = '12px';
        });
        
        // Add custom dropdown arrow if not present
        if (!select.style.backgroundImage) {
            select.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`;
            select.style.backgroundRepeat = 'no-repeat';
            select.style.backgroundPosition = 'right 16px center';
            select.style.backgroundSize = '20px';
            select.style.paddingRight = '50px';
        }
    }
    
    addFormAnimations(form) {
        // Add subtle animations to form elements
        const elements = form.querySelectorAll('.form-group');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.animationDelay = `${index * 0.1}s`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Fix 7: Fix Call Now Buttons
    fixCallNowButtons() {
        const callButtons = document.querySelectorAll('.call-now, .btn-call, [href*="tel:"]');
        callButtons.forEach(button => {
            // Update href to use footer phone number
            const footerPhone = this.getFooterPhoneNumber();
            if (footerPhone && button.tagName === 'A') {
                button.href = `tel:${footerPhone.replace(/\D/g, '')}`;
            }
            
            // Add enhanced styling
            button.classList.add('enhanced-call-btn');
        });
    }
    
    getFooterPhoneNumber() {
        const footer = document.querySelector('footer');
        if (footer) {
            const phoneElement = footer.querySelector('[href*="tel:"], .phone, .phone-number');
            if (phoneElement) {
                return phoneElement.textContent || phoneElement.href.replace('tel:', '');
            }
        }
        return '+254700000000'; // Fallback phone number
    }
    
    // Fix 13: Hide Booking Confirmation
    hideBookingConfirmation() {
        // Only show confirmation on actual confirmation pages
        const currentPath = window.location.pathname;
        const isConfirmationPage = currentPath.includes('confirmation') || 
                                 currentPath.includes('success') ||
                                 document.body.classList.contains('confirmation-page');
        
        if (!isConfirmationPage) {
            const confirmationElements = document.querySelectorAll(
                '.booking-confirmation-preview, .confirmation-placeholder, .fake-confirmation'
            );
            confirmationElements.forEach(element => {
                element.style.display = 'none';
            });
        }
    }
    
    // Fix 14: Remove Spinning Elements
    removeSpinners() {
        const spinnerSelectors = [
            '.lookup-spinner',
            '.booking-lookup .spinner',
            '.booking-lookup .loading-spinner',
            '.booking-lookup-page .spinner',
            '.page-bottom .spinner',
            '.footer-loading',
            '.bottom-spinner'
        ];
        
        spinnerSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });
        
        // Remove persistent loading states
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            if (!element.closest('.loading-overlay')) {
                element.classList.remove('loading');
            }
        });
    }
    
    // Enhanced Form Validation
    enhanceFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }
    
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        // Date validation
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Please select a future date';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
    }
    
    // Fix Navigation Paths
    fixNavigationPaths() {
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        
        // Fix all links
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//') && !href.includes('://')) {
                let newHref = href.substring(1); // Remove leading slash
                
                if (isInPagesFolder) {
                    if (newHref === 'index.html') {
                        newHref = '../index.html';
                    } else if (newHref.startsWith('pages/')) {
                        newHref = newHref.replace('pages/', '');
                    }
                }
                
                link.setAttribute('href', newHref);
            }
        });
    }
    
    // Add Date Picker Enhancements
    addDatePickerEnhancements() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            // Set minimum date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            input.min = tomorrow.toISOString().split('T')[0];
            
            // Add calendar icon enhancement
            input.addEventListener('click', () => {
                input.showPicker?.();
            });
            
            // Style enhancements
            input.style.cursor = 'pointer';
            input.style.position = 'relative';
        });
    }
}

// Initialize fixes when page loads
const websiteFixes = new WebsiteFixes();

// Additional utility functions
function updateViewFleetButton() {
    const viewFleetButtons = document.querySelectorAll('[href*="fleet"], .fleet-btn, .view-fleet');
    viewFleetButtons.forEach(button => {
        button.style.backgroundColor = '#1f2937';
        button.style.color = 'white';
        button.style.borderColor = '#1f2937';
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#111827';
            button.style.borderColor = '#111827';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#1f2937';
            button.style.borderColor = '#1f2937';
        });
    });
}

// Call utility functions
document.addEventListener('DOMContentLoaded', () => {
    updateViewFleetButton();
});

// Add CSS animations
const styles = `
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .field-focused {
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }
    
    .enhanced-field {
        transition: all 0.3s ease;
    }
    
    .enhanced-call-btn {
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    
    .enhanced-availability {
        animation: slideUp 0.8s ease-out;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject the styles
if (!document.getElementById('website-fixes-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'website-fixes-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}