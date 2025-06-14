// Booking Lookup System JavaScript
class BookingLookup {
    constructor() {
        this.currentTab = 'reference';
        this.searchResults = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecentSearches();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form submissions
        document.getElementById('reference-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchByReference();
        });

        document.getElementById('email-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchByEmail();
        });

        document.getElementById('phone-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchByPhone();
        });

        // New search button
        document.getElementById('new-search')?.addEventListener('click', () => {
            this.resetSearch();
        });

        // Format booking reference input
        document.getElementById('booking-ref')?.addEventListener('input', (e) => {
            this.formatBookingReference(e);
        });

        // Phone number formatting
        document.getElementById('booking-phone')?.addEventListener('input', (e) => {
            this.formatPhoneNumber(e);
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.search-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }

    formatBookingReference(e) {
        let value = e.target.value.toUpperCase();
        
        // Remove any non-alphanumeric characters except hyphens
        value = value.replace(/[^A-Z0-9-]/g, '');
        
        // Add hyphens in correct positions for RJA-YYYY-XXXXXX format
        if (value.length > 3 && value.charAt(3) !== '-') {
            value = value.substring(0, 3) + '-' + value.substring(3);
        }
        if (value.length > 8 && value.charAt(8) !== '-') {
            value = value.substring(0, 8) + '-' + value.substring(8);
        }
        
        // Limit length to RJA-YYYY-XXXXXX format (14 characters)
        if (value.length > 14) {
            value = value.substring(0, 14);
        }
        
        e.target.value = value;
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as +254 XXX XXX XXX
        if (value.startsWith('254')) {
            value = '+254 ' + value.substring(3, 6) + ' ' + value.substring(6, 9) + ' ' + value.substring(9, 12);
        } else if (value.startsWith('0')) {
            // Convert 0XXX format to +254 XXX
            value = '+254 ' + value.substring(1, 4) + ' ' + value.substring(4, 7) + ' ' + value.substring(7, 10);
        } else if (value.length > 0) {
            value = '+254 ' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 9);
        }
        
        e.target.value = value.trim();
    }

    searchByReference() {
        const bookingRef = document.getElementById('booking-ref').value.trim();
        const lastName = document.getElementById('ref-last-name').value.trim();

        if (!bookingRef || !lastName) {
            this.showError('Please fill in all required fields');
            return;
        }

        if (!this.isValidBookingReference(bookingRef)) {
            this.showError('Please enter a valid booking reference (e.g., RJA-2025-001234)');
            return;
        }

        this.performSearch('reference', { bookingRef, lastName });
    }

    searchByEmail() {
        const email = document.getElementById('booking-email').value.trim();
        const lastName = document.getElementById('email-last-name').value.trim();

        if (!email || !lastName) {
            this.showError('Please fill in all required fields');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        this.performSearch('email', { email, lastName });
    }

    searchByPhone() {
        const phone = document.getElementById('booking-phone').value.trim();
        const lastName = document.getElementById('phone-last-name').value.trim();

        if (!phone || !lastName) {
            this.showError('Please fill in all required fields');
            return;
        }

        this.performSearch('phone', { phone, lastName });
    }

    performSearch(searchType, searchData) {
        this.showLoading('Searching for your booking...');

        // Save search to recent searches
        this.saveRecentSearch(searchType, searchData);

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            
            // Get mock results based on search type
            const results = this.getMockResults(searchType, searchData);
            
            if (results.length === 0) {
                this.showNoResults(searchData);
            } else {
                this.displayResults(results);
                this.showStatusTracker(results[0]);
            }
        }, 2000);
    }

    getMockResults(searchType, searchData) {
        // Mock booking data for demonstration
        const mockBookings = [
            {
                id: 'RJA-2025-001234',
                email: 'john.doe@email.com',
                phone: '+254 712 345 678',
                lastName: 'Doe',
                status: 'confirmed',
                date: '2025-06-20',
                time: '10:00',
                from: 'Nairobi (Wilson)',
                fromCode: 'NBO',
                to: 'Masai Mara',
                toCode: 'MSA',
                aircraft: 'AS350 Helicopter',
                passengers: 4,
                type: 'Round Trip',
                price: 4234,
                bookingDate: '2025-06-14'
            },
            {
                id: 'RJA-2025-001245',
                email: 'john.doe@email.com',
                phone: '+254 712 345 678',
                lastName: 'Doe',
                status: 'confirmed',
                date: '2025-07-15',
                time: '08:30',
                from: 'Nairobi (JKIA)',
                fromCode: 'NBO',
                to: 'Zanzibar',
                toCode: 'ZNZ',
                aircraft: 'Citation CJ3+',
                passengers: 6,
                type: 'Round Trip',
                price: 8500,
                bookingDate: '2025-06-10'
            }
        ];

        // Filter results based on search criteria
        return mockBookings.filter(booking => {
            const lastNameMatch = booking.lastName.toLowerCase() === searchData.lastName.toLowerCase();
            
            switch (searchType) {
                case 'reference':
                    return booking.id === searchData.bookingRef && lastNameMatch;
                case 'email':
                    return booking.email.toLowerCase() === searchData.email.toLowerCase() && lastNameMatch;
                case 'phone':
                    return booking.phone === searchData.phone && lastNameMatch;
                default:
                    return false;
            }
        });
    }

    displayResults(results) {
        this.searchResults = results;
        
        const resultsSection = document.getElementById('search-results');
        const resultsContainer = document.getElementById('results-container');
        
        resultsContainer.innerHTML = '';
        
        results.forEach(booking => {
            const resultHtml = this.createBookingResultHtml(booking);
            resultsContainer.insertAdjacentHTML('beforeend', resultHtml);
        });
        
        // Hide search form and show results
        document.querySelector('.lookup-form-section').style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    createBookingResultHtml(booking) {
        const statusClass = this.getStatusClass(booking.status);
        const statusText = this.getStatusText(booking.status);
        const daysUntil = this.calculateDaysUntil(booking.date);
        
        return `
            <div class="result-card">
                <div class="result-header">
                    <div class="result-ref">
                        <h3>${booking.id}</h3>
                        <span class="result-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="result-date">
                        <span class="date-text">${this.formatDate(booking.date)}</span>
                        <span class="days-text">${daysUntil}</span>
                    </div>
                </div>
                
                <div class="result-content">
                    <div class="flight-info">
                        <div class="route">
                            <span class="route-from">${booking.from}</span>
                            <i class="fas fa-${booking.type === 'Round Trip' ? 'exchange-alt' : 'arrow-right'}"></i>
                            <span class="route-to">${booking.to}</span>
                        </div>
                        <div class="flight-details">
                            <span><i class="fas fa-plane"></i> ${booking.aircraft}</span>
                            <span><i class="fas fa-users"></i> ${booking.passengers} Passengers</span>
                            <span><i class="fas fa-clock"></i> ${booking.time}</span>
                            <span><i class="fas fa-tag"></i> ${booking.type}</span>
                        </div>
                    </div>
                    
                    <div class="result-actions">
                        <button class="btn btn-primary" onclick="viewFullDetails('${booking.id}')">
                            <i class="fas fa-eye"></i>
                            View Full Details
                        </button>
                        <button class="btn btn-outline" onclick="downloadTicket('${booking.id}')">
                            <i class="fas fa-download"></i>
                            Download Ticket
                        </button>
                        ${booking.status === 'confirmed' ? `
                            <button class="btn btn-outline" onclick="modifyBooking('${booking.id}')">
                                <i class="fas fa-edit"></i>
                                Modify
                            </button>
                        ` : ''}
                        <button class="btn btn-outline" onclick="emailDetails('${booking.id}')">
                            <i class="fas fa-envelope"></i>
                            Email Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showStatusTracker(booking) {
        const statusSection = document.getElementById('status-tracker');
        statusSection.style.display = 'block';
        
        // Update status timeline based on booking status
        this.updateStatusTimeline(booking);
    }

    updateStatusTimeline(booking) {
        // This would be customized based on the actual booking status
        // For now, we'll show a sample timeline
    }

    showNoResults(searchData) {
        const resultsSection = document.getElementById('search-results');
        const resultsContainer = document.getElementById('results-container');
        
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No Bookings Found</h3>
                    <p>We couldn't find any bookings matching your search criteria.</p>
                    <div class="search-suggestions">
                        <h4>Please check:</h4>
                        <ul>
                            <li>Booking reference number is correct</li>
                            <li>Last name matches exactly as entered during booking</li>
                            <li>Email address is correct</li>
                            <li>Phone number includes country code</li>
                        </ul>
                    </div>
                    <div class="help-actions">
                        <button class="btn btn-primary" onclick="contactSupport()">
                            <i class="fas fa-headset"></i>
                            Contact Support
                        </button>
                        <button class="btn btn-outline" onclick="window.bookingLookup.resetSearch()">
                            <i class="fas fa-search"></i>
                            Try Different Search
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.lookup-form-section').style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    resetSearch() {
        document.querySelector('.lookup-form-section').style.display = 'block';
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('status-tracker').style.display = 'none';
        
        // Clear form fields
        document.querySelectorAll('.lookup-form input').forEach(input => {
            input.value = '';
        });
        
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    saveRecentSearch(searchType, searchData) {
        let recentSearches = JSON.parse(localStorage.getItem('recentBookingSearches') || '[]');
        
        const searchEntry = {
            type: searchType,
            data: searchData,
            timestamp: new Date().toISOString()
        };
        
        // Add to beginning of array and limit to 5 recent searches
        recentSearches.unshift(searchEntry);
        recentSearches = recentSearches.slice(0, 5);
        
        localStorage.setItem('recentBookingSearches', JSON.stringify(recentSearches));
    }

    loadRecentSearches() {
        const recentSearches = JSON.parse(localStorage.getItem('recentBookingSearches') || '[]');
        
        if (recentSearches.length === 0) {
            return;
        }

        // For demo purposes, we'll show sample recent searches
        // In a real app, this would be populated from the actual recent searches
    }

    // Quick search function for recent searches
    quickSearch(bookingRef) {
        document.getElementById('booking-ref').value = bookingRef;
        document.getElementById('ref-last-name').value = 'Doe'; // Sample last name
        this.searchByReference();
    }

    // Utility functions
    isValidBookingReference(ref) {
        return /^RJA-\d{4}-\d{6}$/.test(ref);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    getStatusClass(status) {
        const statusMap = {
            'confirmed': 'status-confirmed',
            'completed': 'status-completed',
            'pending': 'status-pending',
            'cancelled': 'status-cancelled'
        };
        return statusMap[status] || 'status-unknown';
    }

    getStatusText(status) {
        const statusMap = {
            'confirmed': 'Confirmed',
            'completed': 'Completed',
            'pending': 'Pending',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || 'Unknown';
    }

    calculateDaysUntil(dateString) {
        const flightDate = new Date(dateString);
        const today = new Date();
        const diffTime = flightDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
        } else if (diffDays === 0) {
            return 'Today';
        } else {
            return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.classList.add('active');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const iconClass = type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        const toastHtml = `
            <div id="${toastId}" class="toast toast-${type}">
                <div class="toast-content">
                    <i class="fas fa-${iconClass}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close">&times;</button>
            </div>
        `;

        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        container.insertAdjacentHTML('beforeend', toastHtml);

        const toast = document.getElementById(toastId);
        const closeBtn = toast.querySelector('.toast-close');

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        const autoHide = setTimeout(() => {
            this.hideToast(toastId);
        }, 5000);

        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHide);
            this.hideToast(toastId);
        });
    }

    hideToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }
}

// Global functions for booking actions
function viewFullDetails(bookingId) {
    window.location.href = `booking-confirmation.html?ref=${bookingId}`;
}

function downloadTicket(bookingId) {
    const lookup = window.bookingLookup;
    lookup.showSuccess('Downloading e-ticket...');
    
    setTimeout(() => {
        lookup.showSuccess('E-ticket downloaded successfully!');
    }, 1500);
}

function modifyBooking(bookingId) {
    window.location.href = `booking.html?modify=${bookingId}`;
}

function emailDetails(bookingId) {
    const lookup = window.bookingLookup;
    lookup.showSuccess('Booking details sent to your email address.');
}

function contactSupport() {
    window.location.href = 'contact.html';
}

function quickSearch(bookingRef) {
    if (window.bookingLookup) {
        window.bookingLookup.quickSearch(bookingRef);
    }
}

// Initialize booking lookup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bookingLookup = new BookingLookup();
});

// Add styles for booking lookup
const lookupStyles = `
    .lookup-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .lookup-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .lookup-header h2 {
        color: #111827;
        margin-bottom: 10px;
    }

    .option-tabs {
        display: flex;
        border-bottom: 2px solid #e5e7eb;
        margin-bottom: 30px;
    }

    .tab-btn {
        flex: 1;
        padding: 15px 20px;
        border: none;
        background: none;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-weight: 500;
    }

    .tab-btn.active {
        color: #dc2626;
        border-bottom: 2px solid #dc2626;
        margin-bottom: -2px;
    }

    .tab-btn:hover {
        color: #dc2626;
        background: #fef2f2;
    }

    .search-tab {
        display: none;
    }

    .search-tab.active {
        display: block;
    }

    .lookup-form {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .form-help {
        color: #6b7280;
        font-size: 12px;
        margin-top: 5px;
    }

    .quick-access {
        margin-top: 40px;
        padding: 30px;
        background: #f9fafb;
        border-radius: 12px;
    }

    .quick-access h3 {
        color: #111827;
        margin-bottom: 10px;
    }

    .quick-access p {
        color: #6b7280;
        margin-bottom: 20px;
    }

    .recent-searches {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .recent-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .recent-item:hover {
        background: #fef2f2;
        border-color: #dc2626;
    }

    .recent-item .ref {
        font-weight: 600;
        color: #111827;
    }

    .recent-item .route {
        color: #6b7280;
    }

    .recent-item .date {
        color: #dc2626;
        font-size: 14px;
    }

    .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .results-header h2 {
        color: #111827;
    }

    .result-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #10b981;
    }

    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .result-ref h3 {
        color: #111827;
        margin: 0 0 10px 0;
        font-size: 20px;
    }

    .result-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .status-confirmed {
        background: #d1fae5;
        color: #065f46;
    }

    .status-completed {
        background: #f3f4f6;
        color: #374151;
    }

    .status-pending {
        background: #fef3c7;
        color: #92400e;
    }

    .status-cancelled {
        background: #fee2e2;
        color: #991b1b;
    }

    .result-date {
        text-align: right;
    }

    .date-text {
        display: block;
        font-weight: 600;
        color: #111827;
        margin-bottom: 5px;
    }

    .days-text {
        font-size: 12px;
        color: #6b7280;
    }

    .flight-info {
        margin-bottom: 25px;
    }

    .route {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
        font-size: 18px;
    }

    .route i {
        color: #dc2626;
    }

    .route-from,
    .route-to {
        font-weight: 600;
        color: #111827;
    }

    .flight-details {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
        color: #6b7280;
        font-size: 14px;
    }

    .flight-details span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .result-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .no-results {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .no-results-content i {
        font-size: 64px;
        color: #d1d5db;
        margin-bottom: 20px;
    }

    .no-results-content h3 {
        color: #111827;
        margin-bottom: 15px;
    }

    .search-suggestions {
        background: #f9fafb;
        border-radius: 8px;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
    }

    .search-suggestions h4 {
        color: #111827;
        margin-bottom: 10px;
    }

    .search-suggestions ul {
        color: #6b7280;
        margin: 0;
        padding-left: 20px;
    }

    .search-suggestions li {
        margin-bottom: 5px;
    }

    .help-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
    }

    .status-timeline {
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .status-step {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
        position: relative;
    }

    .status-step:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 19px;
        top: 40px;
        width: 2px;
        height: 30px;
        background: #e5e7eb;
    }

    .status-step.completed::after {
        background: #10b981;
    }

    .status-step.active::after {
        background: linear-gradient(to bottom, #10b981 50%, #e5e7eb 50%);
    }

    .step-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        flex-shrink: 0;
    }

    .status-step.completed .step-icon {
        background: #10b981;
        color: white;
    }

    .status-step.active .step-icon {
        background: #fbbf24;
        color: white;
    }

    .step-content h4 {
        color: #111827;
        margin: 0 0 5px 0;
    }

    .step-content p {
        color: #6b7280;
        margin: 0 0 5px 0;
    }

    .step-time {
        font-size: 12px;
        color: #9ca3af;
    }

    @media (max-width: 768px) {
        .option-tabs {
            flex-direction: column;
        }

        .tab-btn {
            border-bottom: 1px solid #e5e7eb;
        }

        .recent-item {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
        }

        .result-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
        }

        .result-date {
            text-align: left;
        }

        .route {
            flex-wrap: wrap;
            font-size: 16px;
        }

        .flight-details {
            flex-direction: column;
            gap: 10px;
        }

        .result-actions {
            flex-direction: column;
        }

        .help-actions {
            flex-direction: column;
        }
    }
`;

// Inject styles
if (!document.getElementById('lookup-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'lookup-styles';
    styleSheet.textContent = lookupStyles;
    document.head.appendChild(styleSheet);
}