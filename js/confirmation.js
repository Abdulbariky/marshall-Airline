// Confirmation Page JavaScript
class BookingConfirmation {
    constructor() {
        this.bookingData = this.getBookingData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadBookingDetails();
        this.updateBookingReference();
    }

    bindEvents() {
        // Download ticket button
        document.getElementById('download-ticket')?.addEventListener('click', () => {
            this.downloadTicket();
        });

        // Email confirmation button
        document.getElementById('email-confirmation')?.addEventListener('click', () => {
            this.emailConfirmation();
        });

        // Add to calendar button
        document.getElementById('add-to-calendar')?.addEventListener('click', () => {
            this.addToCalendar();
        });

        // Share booking button
        document.getElementById('share-booking')?.addEventListener('click', () => {
            this.shareBooking();
        });
    }

    getBookingData() {
        // In a real application, this would fetch data from the server
        // For demo purposes, we'll use sample data
        return {
            reference: 'RJA-2025-001234',
            flight: {
                serviceType: 'Helicopter Charter',
                flightType: 'Round Trip',
                departure: {
                    location: 'Nairobi (Wilson)',
                    code: 'NBO',
                    date: '2025-06-20',
                    time: '10:00'
                },
                arrival: {
                    location: 'Masai Mara',
                    code: 'MSA',
                    date: '2025-06-20',
                    time: '12:30'
                },
                return: {
                    location: 'Masai Mara',
                    code: 'MSA',
                    date: '2025-06-20',
                    time: '16:00',
                    arrivalLocation: 'Nairobi (Wilson)',
                    arrivalCode: 'NBO',
                    arrivalTime: '18:30'
                },
                aircraft: 'AS350 Helicopter',
                duration: '2h 30m',
                passengers: 4
            },
            passengers: [
                { name: 'Mr. John Doe', type: 'Primary Contact', email: 'john.doe@email.com', phone: '+254 712 345 678' },
                { name: 'Mrs. Jane Doe', type: 'Passenger' },
                { name: 'Master Mike Doe', type: 'Passenger' },
                { name: 'Miss Sarah Doe', type: 'Passenger' }
            ],
            emergencyContact: {
                name: 'Robert Smith',
                relationship: 'Brother',
                phone: '+254 722 987 654'
            },
            payment: {
                basePrice: 3200,
                airportFees: 150,
                fuelSurcharge: 200,
                serviceFee: 100,
                subtotal: 3650,
                vat: 584,
                total: 4234,
                method: 'Visa Card ending in 1234',
                status: 'Confirmed'
            },
            bookingDate: new Date().toISOString()
        };
    }

    loadBookingDetails() {
        // This function can populate dynamic content if needed
        // For now, the HTML contains static sample data
        console.log('Booking details loaded:', this.bookingData);
    }

    updateBookingReference() {
        const referenceElement = document.getElementById('booking-reference');
        if (referenceElement) {
            referenceElement.textContent = this.bookingData.reference;
        }
    }

    downloadTicket() {
        this.showLoadingButton('download-ticket', 'Generating PDF...');
        
        // Simulate PDF generation
        setTimeout(() => {
            this.hideLoadingButton('download-ticket', 'Download E-Ticket');
            this.generatePDF();
        }, 2000);
    }

    generatePDF() {
        // In a real application, this would generate an actual PDF
        // For demo purposes, we'll create a simple text file
        const ticketContent = this.generateTicketContent();
        
        const blob = new Blob([ticketContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `marshallairlineAviation_Ticket_${this.bookingData.reference}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        
        // Show success message
        this.showToast('E-Ticket downloaded successfully!', 'success');
    }

    generateTicketContent() {
        const data = this.bookingData;
        return `
marshallairline AVIATION - E-TICKET
===============================

Booking Reference: ${data.reference}
Booking Date: ${new Date(data.bookingDate).toLocaleDateString()}

FLIGHT INFORMATION
------------------
Service: ${data.flight.serviceType}
Flight Type: ${data.flight.flightType}
Aircraft: ${data.flight.aircraft}

OUTBOUND FLIGHT
${data.flight.departure.location} (${data.flight.departure.code}) → ${data.flight.arrival.location} (${data.flight.arrival.code})
Date: ${new Date(data.flight.departure.date).toLocaleDateString()}
Departure: ${this.formatTime(data.flight.departure.time)}
Arrival: ${this.formatTime(data.flight.arrival.time)}
Duration: ${data.flight.duration}

${data.flight.flightType === 'Round Trip' ? `
RETURN FLIGHT
${data.flight.return.location} (${data.flight.return.code}) → ${data.flight.return.arrivalLocation} (${data.flight.return.arrivalCode})
Date: ${new Date(data.flight.return.date).toLocaleDateString()}
Departure: ${this.formatTime(data.flight.return.time)}
Arrival: ${this.formatTime(data.flight.return.arrivalTime)}
Duration: ${data.flight.duration}
` : ''}

PASSENGER INFORMATION
---------------------
${data.passengers.map(p => `${p.name} (${p.type})`).join('\n')}

Emergency Contact: ${data.emergencyContact.name} (${data.emergencyContact.relationship})
Phone: ${data.emergencyContact.phone}

PAYMENT SUMMARY
---------------
Base Charter Fee: $${data.payment.basePrice.toLocaleString()}
Airport Fees: $${data.payment.airportFees}
Fuel Surcharge: $${data.payment.fuelSurcharge}
Service Fee: $${data.payment.serviceFee}
Subtotal: $${data.payment.subtotal.toLocaleString()}
VAT (16%): $${data.payment.vat.toLocaleString()}
Total Paid: $${data.payment.total.toLocaleString()}

Payment Method: ${data.payment.method}
Payment Status: ${data.payment.status}

IMPORTANT INFORMATION
---------------------
- Arrive 30 minutes before departure
- Bring valid photo identification
- Weight limit: 15kg per passenger
- No sharp objects or hazardous materials
- Flights subject to weather conditions

Contact Information:
Phone: +254 700 000 000
Email: info@marshallairline-aviation.com
Website: www.marshallairline-aviation.com

Thank you for choosing marshallairline Aviation!
        `;
    }

    emailConfirmation() {
        this.showLoadingButton('email-confirmation', 'Sending...');
        
        // Simulate email sending
        setTimeout(() => {
            this.hideLoadingButton('email-confirmation', 'Email Confirmation');
            this.showToast('Confirmation email sent successfully!', 'success');
        }, 1500);
    }

    addToCalendar() {
        const data = this.bookingData;
        
        // Create calendar event details
        const event = {
            title: `Flight to ${data.flight.arrival.location} - ${data.bookingData.reference}`,
            startDate: this.createCalendarDate(data.flight.departure.date, data.flight.departure.time),
            endDate: this.createCalendarDate(data.flight.arrival.date, data.flight.arrival.time),
            description: `marshallairline Aviation Flight\nBooking Reference: ${data.reference}\nAircraft: ${data.flight.aircraft}\nPassengers: ${data.flight.passengers}`,
            location: data.flight.departure.location
        };

        // Generate calendar URLs for different providers
        const calendarOptions = [
            {
                name: 'Google Calendar',
                url: this.generateGoogleCalendarUrl(event),
                icon: 'fab fa-google'
            },
            {
                name: 'Outlook',
                url: this.generateOutlookCalendarUrl(event),
                icon: 'fab fa-microsoft'
            },
            {
                name: 'Apple Calendar',
                url: this.generateICalUrl(event),
                icon: 'fab fa-apple'
            }
        ];

        this.showCalendarModal(calendarOptions);
    }

    createCalendarDate(date, time) {
        const [hours, minutes] = time.split(':');
        const eventDate = new Date(date);
        eventDate.setHours(parseInt(hours), parseInt(minutes));
        return eventDate;
    }

    generateGoogleCalendarUrl(event) {
        const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
        const params = new URLSearchParams({
            text: event.title,
            dates: `${this.formatCalendarDate(event.startDate)}/${this.formatCalendarDate(event.endDate)}`,
            details: event.description,
            location: event.location
        });
        return `${baseUrl}&${params.toString()}`;
    }

    generateOutlookCalendarUrl(event) {
        const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
        const params = new URLSearchParams({
            subject: event.title,
            startdt: event.startDate.toISOString(),
            enddt: event.endDate.toISOString(),
            body: event.description,
            location: event.location
        });
        return `${baseUrl}?${params.toString()}`;
    }

    generateICalUrl(event) {
        const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//marshallairline Aviation//EN
BEGIN:VEVENT
UID:${this.bookingData.reference}@marshallairline-aviation.com
DTSTAMP:${this.formatCalendarDate(new Date())}
DTSTART:${this.formatCalendarDate(event.startDate)}
DTEND:${this.formatCalendarDate(event.endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icalContent], { type: 'text/calendar' });
        return window.URL.createObjectURL(blob);
    }

    formatCalendarDate(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    showCalendarModal(options) {
        const modalHtml = `
            <div id="calendar-modal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add to Calendar</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Choose your preferred calendar application:</p>
                        <div class="calendar-options">
                            ${options.map(option => `
                                <a href="${option.url}" class="calendar-option" target="_blank" ${option.name === 'Apple Calendar' ? 'download="flight.ics"' : ''}>
                                    <i class="${option.icon}"></i>
                                    <span>${option.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Bind close events
        const modal = document.getElementById('calendar-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // Auto-close after selection
        modal.querySelectorAll('.calendar-option').forEach(option => {
            option.addEventListener('click', () => {
                setTimeout(closeModal, 1000);
            });
        });
    }

    shareBooking() {
        const shareData = {
            title: 'My Flight Booking - marshallairline Aviation',
            text: `I just booked a flight with marshallairline Aviation! Booking reference: ${this.bookingData.reference}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    this.showToast('Booking shared successfully!', 'success');
                })
                .catch((error) => {
                    console.error('Error sharing:', error);
                    this.showShareModal(shareData);
                });
        } else {
            this.showShareModal(shareData);
        }
    }

    showShareModal(shareData) {
        const currentUrl = window.location.href;
        const encodedText = encodeURIComponent(shareData.text);
        const encodedUrl = encodeURIComponent(currentUrl);

        const shareOptions = [
            {
                name: 'WhatsApp',
                url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
                icon: 'fab fa-whatsapp',
                color: '#25D366'
            },
            {
                name: 'Facebook',
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                icon: 'fab fa-facebook-f',
                color: '#1877F2'
            },
            {
                name: 'Twitter',
                url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
                icon: 'fab fa-twitter',
                color: '#1DA1F2'
            },
            {
                name: 'LinkedIn',
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                icon: 'fab fa-linkedin-in',
                color: '#0A66C2'
            },
            {
                name: 'Email',
                url: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodedText}%20${encodedUrl}`,
                icon: 'fas fa-envelope',
                color: '#6B7280'
            }
        ];

        const modalHtml = `
            <div id="share-modal" class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Share Booking</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="share-options">
                            ${shareOptions.map(option => `
                                <a href="${option.url}" class="share-option" target="_blank" style="color: ${option.color}">
                                    <i class="${option.icon}"></i>
                                    <span>${option.name}</span>
                                </a>
                            `).join('')}
                        </div>
                        <div class="share-link">
                            <label>Or copy link:</label>
                            <div class="link-input-group">
                                <input type="text" value="${currentUrl}" readonly id="share-link-input">
                                <button class="copy-link-btn" id="copy-link-btn">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Bind events
        const modal = document.getElementById('share-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const copyBtn = document.getElementById('copy-link-btn');
        const linkInput = document.getElementById('share-link-input');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        copyBtn.addEventListener('click', () => {
            linkInput.select();
            document.execCommand('copy');
            this.showToast('Link copied to clipboard!', 'success');
            closeModal();
        });
    }

    showLoadingButton(buttonId, loadingText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
            button.disabled = true;
        }
    }

    hideLoadingButton(buttonId, originalText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.innerHTML = button.dataset.originalText || `<i class="fas fa-download"></i> ${originalText}`;
            button.disabled = false;
        }
    }

    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast toast-${type}">
                <div class="toast-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close">&times;</button>
            </div>
        `;

        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        container.insertAdjacentHTML('beforeend', toastHtml);

        const toast = document.getElementById(toastId);
        const closeBtn = toast.querySelector('.toast-close');

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto hide after 5 seconds
        const autoHide = setTimeout(() => {
            this.hideToast(toastId);
        }, 5000);

        // Manual close
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

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
}

// Initialize confirmation system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new BookingConfirmation();
});

// Add styles for confirmation functionality
const confirmationStyles = `
    .calendar-options,
    .share-options {
        display: grid;
        gap: 15px;
        margin: 20px 0;
    }

    .calendar-option,
    .share-option {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        text-decoration: none;
        color: #374151;
        transition: all 0.3s ease;
    }

    .calendar-option:hover,
    .share-option:hover {
        border-color: #dc2626;
        background-color: #fef2f2;
        text-decoration: none;
    }

    .calendar-option i,
    .share-option i {
        font-size: 24px;
        width: 30px;
        text-align: center;
    }

    .share-link {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
    }

    .share-link label {
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
        color: #374151;
    }

    .link-input-group {
        display: flex;
        gap: 10px;
    }

    .link-input-group input {
        flex: 1;
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
    }

    .copy-link-btn {
        padding: 10px 15px;
        background-color: #dc2626;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .copy-link-btn:hover {
        background-color: #b91c1c;
    }

    #toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .toast {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 15px;
        max-width: 350px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        border-left: 4px solid #6b7280;
    }

    .toast.show {
        transform: translateX(0);
        opacity: 1;
    }

    .toast-success {
        border-left-color: #10b981;
    }

    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .toast-success .toast-content i {
        color: #10b981;
    }

    .toast-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6b7280;
        padding: 0 5px;
    }

    .toast-close:hover {
        color: #374151;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .modal.active {
        opacity: 1;
        visibility: visible;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        background-color: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        z-index: 1;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
        margin: 0;
        color: #111827;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        line-height: 1;
    }

    .modal-close:hover {
        color: #374151;
    }

    .modal-body {
        padding: 20px;
    }

    @media (max-width: 768px) {
        .calendar-options,
        .share-options {
            grid-template-columns: 1fr;
        }

        #toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
        }

        .toast {
            max-width: none;
        }

        .link-input-group {
            flex-direction: column;
        }
    }
`;

// Inject styles
if (!document.getElementById('confirmation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'confirmation-styles';
    styleSheet.textContent = confirmationStyles;
    document.head.appendChild(styleSheet);
}