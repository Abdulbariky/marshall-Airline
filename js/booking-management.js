// Booking Management System JavaScript
class BookingManagement {
    constructor() {
        this.currentUser = null;
        this.bookings = [];
        this.filteredBookings = [];
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
        this.loadSampleData();
    }

    bindEvents() {
        // Login form submission
        document.getElementById('booking-login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Filter events
        document.getElementById('status-filter')?.addEventListener('change', (e) => {
            this.filterBookings();
        });

        document.getElementById('date-filter')?.addEventListener('change', (e) => {
            this.filterBookings();
        });

        document.getElementById('booking-search')?.addEventListener('input', (e) => {
            this.searchBookings(e.target.value);
        });

        // Search button
        document.querySelector('.search-btn')?.addEventListener('click', () => {
            const searchTerm = document.getElementById('booking-search').value;
            this.searchBookings(searchTerm);
        });
    }

    checkLoginStatus() {
        // In a real application, this would check authentication status
        // For demo purposes, we'll check if there are URL parameters indicating login
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const ref = urlParams.get('ref');

        if (email || ref) {
            this.simulateLogin(email || 'john.doe@email.com');
        }
    }

    handleLogin() {
        const email = document.getElementById('booking-email').value;
        const reference = document.getElementById('booking-reference').value;

        if (!email) {
            this.showError('Email address is required');
            return;
        }

        this.showLoading('Verifying your details...');

        // Simulate login process
        setTimeout(() => {
            this.hideLoading();
            this.simulateLogin(email);
        }, 2000);
    }

    simulateLogin(email) {
        this.currentUser = {
            email: email,
            name: 'John Doe',
            id: 'user_001'
        };
        
        this.isLoggedIn = true;
        this.showDashboard();
        this.updateUserInfo();
        this.filterBookings();
    }

    handleLogout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.showLoginSection();
    }

    showDashboard() {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('bookings-dashboard').style.display = 'block';
    }

    showLoginSection() {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('bookings-dashboard').style.display = 'none';
    }

    updateUserInfo() {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
    }

    loadSampleData() {
        // Sample booking data for demonstration
        this.bookings = [
            {
                id: 'RJA-2025-001234',
                status: 'upcoming',
                date: '2025-06-20',
                time: '10:00',
                from: 'Nairobi (Wilson)',
                to: 'Masai Mara',
                aircraft: 'AS350 Helicopter',
                passengers: 4,
                type: 'Round Trip',
                price: 4234,
                bookingDate: '2025-06-14',
                category: 'helicopter'
            },
            {
                id: 'RJA-2025-001245',
                status: 'upcoming',
                date: '2025-07-15',
                time: '08:30',
                from: 'Nairobi (JKIA)',
                to: 'Zanzibar',
                aircraft: 'Citation CJ3+',
                passengers: 6,
                type: 'Round Trip',
                price: 8500,
                bookingDate: '2025-06-10',
                category: 'jet'
            },
            {
                id: 'RJA-2025-001198',
                status: 'completed',
                date: '2025-05-10',
                time: '09:15',
                from: 'Nairobi (Wilson)',
                to: 'Samburu',
                aircraft: 'Bell 429',
                passengers: 5,
                type: 'One Way',
                price: 3200,
                bookingDate: '2025-05-05',
                category: 'helicopter'
            },
            {
                id: 'RJA-2025-001267',
                status: 'pending',
                date: '2025-08-05',
                time: '11:00',
                from: 'Nairobi (Wilson)',
                to: 'Kigali',
                aircraft: 'King Air 350',
                passengers: 8,
                type: 'One Way',
                price: 6800,
                bookingDate: '2025-06-12',
                category: 'jet'
            },
            {
                id: 'RJA-2025-001156',
                status: 'cancelled',
                date: '2025-04-22',
                time: '14:30',
                from: 'Nairobi (Wilson)',
                to: 'Lamu',
                aircraft: 'AS355 Helicopter',
                passengers: 3,
                type: 'Round Trip',
                price: 2800,
                bookingDate: '2025-04-15',
                category: 'helicopter'
            }
        ];

        this.filteredBookings = [...this.bookings];
        this.updateStats();
    }

    updateStats() {
        const stats = this.calculateStats();
        
        document.getElementById('total-bookings').textContent = stats.total;
        document.getElementById('upcoming-flights').textContent = stats.upcoming;
        document.getElementById('flight-hours').textContent = stats.hours;
        document.getElementById('loyalty-points').textContent = stats.points.toLocaleString();
    }

    calculateStats() {
        const total = this.bookings.length;
        const upcoming = this.bookings.filter(b => b.status === 'upcoming').length;
        const completed = this.bookings.filter(b => b.status === 'completed').length;
        
        // Estimate flight hours (simplified calculation)
        const hours = completed * 2.5; // Average 2.5 hours per flight
        
        // Calculate loyalty points (simplified)
        const totalSpent = this.bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + b.price, 0);
        const points = Math.round(totalSpent * 0.5); // 0.5 points per dollar spent

        return {
            total,
            upcoming,
            hours,
            points
        };
    }

    filterBookings() {
        const statusFilter = document.getElementById('status-filter')?.value || 'all';
        const dateFilter = document.getElementById('date-filter')?.value || 'all';
        const searchTerm = document.getElementById('booking-search')?.value || '';

        let filtered = [...this.bookings];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(booking => {
                const bookingDate = new Date(booking.date);
                
                switch (dateFilter) {
                    case 'this-month':
                        return bookingDate.getMonth() === now.getMonth() && 
                               bookingDate.getFullYear() === now.getFullYear();
                    case 'last-month':
                        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        return bookingDate.getMonth() === lastMonth.getMonth() && 
                               bookingDate.getFullYear() === lastMonth.getFullYear();
                    case 'this-year':
                        return bookingDate.getFullYear() === now.getFullYear();
                    case 'last-year':
                        return bookingDate.getFullYear() === (now.getFullYear() - 1);
                    default:
                        return true;
                }
            });
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(booking => 
                booking.id.toLowerCase().includes(term) ||
                booking.from.toLowerCase().includes(term) ||
                booking.to.toLowerCase().includes(term) ||
                booking.aircraft.toLowerCase().includes(term)
            );
        }

        this.filteredBookings = filtered;
        this.displayBookings();
    }

    searchBookings(term) {
        this.filterBookings();
    }

    displayBookings() {
        const container = document.getElementById('bookings-list');
        const noBookingsMessage = document.getElementById('no-bookings');

        if (this.filteredBookings.length === 0) {
            container.style.display = 'none';
            noBookingsMessage.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        noBookingsMessage.style.display = 'none';

        // The bookings are already in HTML, so we just need to show/hide them
        const bookingCards = document.querySelectorAll('.booking-card');
        
        bookingCards.forEach(card => {
            const refNumber = card.querySelector('.ref-number').textContent;
            const booking = this.filteredBookings.find(b => b.id === refNumber);
            
            if (booking) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
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
        // Create error toast
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

// Global functions for booking actions (called from HTML onclick)
function viewBooking(bookingId) {
    window.location.href = `booking-confirmation.html?ref=${bookingId}`;
}

function modifyBooking(bookingId) {
    window.location.href = `booking.html?modify=${bookingId}`;
}

function downloadTicket(bookingId) {
    // Simulate ticket download
    const management = window.bookingManagement;
    management.showSuccess('Downloading e-ticket...');
    
    // In a real application, this would download the actual ticket
    setTimeout(() => {
        management.showSuccess('E-ticket downloaded successfully!');
    }, 1500);
}

function cancelBooking(bookingId) {
    const management = window.bookingManagement;
    
    if (confirm('Are you sure you want to cancel this booking? Cancellation fees may apply.')) {
        management.showLoading('Cancelling booking...');
        
        setTimeout(() => {
            management.hideLoading();
            management.showSuccess('Booking cancelled successfully. Refund will be processed within 3-5 business days.');
            
            // Update booking status in the display
            const bookingCard = document.querySelector(`[data-booking-id="${bookingId}"]`);
            if (bookingCard) {
                const statusElement = bookingCard.querySelector('.booking-status');
                statusElement.textContent = 'Cancelled';
                statusElement.className = 'booking-status status-cancelled';
                bookingCard.className = 'booking-card cancelled';
            }
        }, 2000);
    }
}

function completePayment(bookingId) {
    window.location.href = `booking.html?payment=${bookingId}`;
}

function rebookFlight(bookingId) {
    window.location.href = `booking.html?rebook=${bookingId}`;
}

function rateFlight(bookingId) {
    // Show rating modal
    showRatingModal(bookingId);
}

function viewRefund(bookingId) {
    const management = window.bookingManagement;
    management.showSuccess('Refund status: Processing. Expected completion: 2-3 business days.');
}

function showRatingModal(bookingId) {
    const modalHtml = `
        <div id="rating-modal" class="modal active">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Rate Your Flight Experience</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="rating-section">
                        <h4>Overall Experience</h4>
                        <div class="star-rating" data-rating="0">
                            <span class="star" data-value="1">★</span>
                            <span class="star" data-value="2">★</span>
                            <span class="star" data-value="3">★</span>
                            <span class="star" data-value="4">★</span>
                            <span class="star" data-value="5">★</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="review-text">Your Review (Optional)</label>
                        <textarea id="review-text" rows="4" placeholder="Tell us about your experience..."></textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-outline" onclick="closeRatingModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="submitRating('${bookingId}')">Submit Rating</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Bind star rating events
    const stars = document.querySelectorAll('.star');
    const ratingContainer = document.querySelector('.star-rating');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.value);
            ratingContainer.dataset.rating = rating;
            
            stars.forEach((s, index) => {
                s.classList.toggle('active', index < rating);
            });
        });
        
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.value);
            stars.forEach((s, index) => {
                s.classList.toggle('hover', index < rating);
            });
        });
    });

    document.querySelector('.star-rating').addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hover'));
    });

    // Bind close events
    const modal = document.getElementById('rating-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

function closeRatingModal() {
    const modal = document.getElementById('rating-modal');
    if (modal) {
        modal.remove();
    }
}

function submitRating(bookingId) {
    const rating = document.querySelector('.star-rating').dataset.rating;
    const review = document.getElementById('review-text').value;
    
    if (rating === '0') {
        alert('Please select a rating');
        return;
    }

    const management = window.bookingManagement;
    management.showLoading('Submitting your rating...');
    
    setTimeout(() => {
        management.hideLoading();
        management.showSuccess('Thank you for your feedback! Your rating has been submitted.');
        closeRatingModal();
    }, 1500);
}

// Initialize booking management when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bookingManagement = new BookingManagement();
});

// Add styles for booking management
const managementStyles = `
    .login-card {
        max-width: 500px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .login-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .login-header h2 {
        color: #111827;
        margin-bottom: 10px;
    }

    .login-help {
        text-align: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
    }

    .login-help p {
        margin: 5px 0;
        font-size: 14px;
        color: #6b7280;
    }

    .login-help a {
        color: #dc2626;
        text-decoration: none;
    }

    .login-help a:hover {
        text-decoration: underline;
    }

    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding: 20px 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .user-info h2 {
        color: #111827;
        margin-bottom: 5px;
    }

    .user-info p {
        color: #6b7280;
        margin: 0;
    }

    .dashboard-actions {
        display: flex;
        gap: 15px;
    }

    .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .stat-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        background: linear-gradient(135deg, #dc2626, #ef4444);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
    }

    .stat-info h3 {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 5px 0;
    }

    .stat-info p {
        color: #6b7280;
        margin: 0;
        font-size: 14px;
    }

    .booking-filters {
        display: flex;
        gap: 20px;
        align-items: end;
        margin-bottom: 30px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .filter-group label {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
    }

    .filter-group select {
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
    }

    .search-group {
        display: flex;
        gap: 10px;
        margin-left: auto;
    }

    .search-group input {
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        width: 250px;
    }

    .search-btn {
        padding: 10px 15px;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    .search-btn:hover {
        background: #b91c1c;
    }

    .booking-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #e5e7eb;
    }

    .booking-card.upcoming {
        border-left-color: #10b981;
    }

    .booking-card.completed {
        border-left-color: #6b7280;
    }

    .booking-card.pending {
        border-left-color: #f59e0b;
    }

    .booking-card.cancelled {
        border-left-color: #ef4444;
    }

    .booking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .booking-ref {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .ref-number {
        font-weight: 700;
        font-size: 18px;
        color: #111827;
    }

    .booking-status {
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

    .booking-date {
        text-align: right;
    }

    .date-text {
        font-weight: 600;
        color: #111827;
        display: block;
    }

    .days-until {
        font-size: 12px;
        color: #6b7280;
    }

    .flight-route {
        margin-bottom: 20px;
    }

    .route-info {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }

    .route-info i {
        color: #dc2626;
    }

    .route-from,
    .route-to {
        font-weight: 600;
        color: #111827;
    }

    .flight-details {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: #6b7280;
    }

    .booking-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .action-btn {
        padding: 8px 16px;
        border: 1px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .action-btn:hover {
        background: #f9fafb;
        border-color: #dc2626;
        color: #dc2626;
    }

    .action-btn.primary {
        background: #dc2626;
        color: white;
        border-color: #dc2626;
    }

    .action-btn.primary:hover {
        background: #b91c1c;
    }

    .action-btn.danger {
        color: #ef4444;
        border-color: #ef4444;
    }

    .action-btn.danger:hover {
        background: #fee2e2;
    }

    .no-bookings {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .no-bookings-content i {
        font-size: 64px;
        color: #d1d5db;
        margin-bottom: 20px;
    }

    .no-bookings-content h3 {
        color: #111827;
        margin-bottom: 10px;
    }

    .no-bookings-content p {
        color: #6b7280;
        margin-bottom: 30px;
    }

    .star-rating {
        display: flex;
        gap: 5px;
        justify-content: center;
        margin: 15px 0;
    }

    .star {
        font-size: 32px;
        color: #d1d5db;
        cursor: pointer;
        transition: color 0.2s ease;
    }

    .star:hover,
    .star.hover,
    .star.active {
        color: #fbbf24;
    }

    .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }

    @media (max-width: 768px) {
        .dashboard-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }

        .booking-filters {
            flex-direction: column;
            gap: 15px;
        }

        .search-group {
            margin-left: 0;
        }

        .search-group input {
            width: 100%;
        }

        .booking-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
        }

        .booking-date {
            text-align: left;
        }

        .route-info {
            flex-wrap: wrap;
        }

        .flight-details {
            flex-direction: column;
            gap: 5px;
        }

        .action-btn {
            font-size: 11px;
            padding: 6px 12px;
        }
    }
`;

// Inject styles
if (!document.getElementById('management-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'management-styles';
    styleSheet.textContent = managementStyles;
    document.head.appendChild(styleSheet);
}