// Booking System JavaScript
class BookingSystem {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 5;
        this.bookingData = {
            flight: {},
            aircraft: {},
            passengers: {},
            payment: {}
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeDateInputs();
        this.initializeFormValidation();
        this.initializePaymentMethods();
    }

    bindEvents() {
        // Flight type change to show/hide return fields
        document.getElementById('flight-type').addEventListener('change', (e) => {
            this.toggleReturnFields(e.target.value);
        });

        // Check availability button
        document.getElementById('check-availability').addEventListener('click', () => {
            this.checkAvailability();
        });

        // Step navigation buttons
        document.getElementById('back-to-step1')?.addEventListener('click', () => {
            this.goToStep(1);
        });

        document.getElementById('continue-to-step3')?.addEventListener('click', () => {
            this.goToStep(3);
        });

        document.getElementById('back-to-step2')?.addEventListener('click', () => {
            this.goToStep(2);
        });

        document.getElementById('continue-to-payment')?.addEventListener('click', () => {
            this.validatePassengerInfo() && this.goToStep(4);
        });

        document.getElementById('back-to-step3')?.addEventListener('click', () => {
            this.goToStep(3);
        });

        document.getElementById('complete-booking')?.addEventListener('click', () => {
            this.completeBooking();
        });

        // Passenger count change
        document.getElementById('passengers').addEventListener('change', (e) => {
            this.generatePassengerFields(parseInt(e.target.value));
        });

        // Payment method change
        document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentFields(e.target.value);
            });
        });

        // Card number formatting
        document.getElementById('card-number')?.addEventListener('input', (e) => {
            this.formatCardNumber(e);
        });

        // Expiry date formatting
        document.getElementById('expiry-date')?.addEventListener('input', (e) => {
            this.formatExpiryDate(e);
        });
    }

    initializeDateInputs() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const departureDateInput = document.getElementById('departure-date');
        const returnDateInput = document.getElementById('return-date');
        
        if (departureDateInput) {
            departureDateInput.min = tomorrow.toISOString().split('T')[0];
        }
        
        if (returnDateInput) {
            returnDateInput.min = tomorrow.toISOString().split('T')[0];
        }

        // Update return date minimum when departure date changes
        departureDateInput?.addEventListener('change', (e) => {
            if (returnDateInput) {
                returnDateInput.min = e.target.value;
                if (returnDateInput.value && returnDateInput.value < e.target.value) {
                    returnDateInput.value = e.target.value;
                }
            }
        });
    }

    toggleReturnFields(flightType) {
        const returnFields = document.getElementById('return-fields');
        const returnDateInput = document.getElementById('return-date');
        const returnTimeInput = document.getElementById('return-time');

        if (flightType === 'round-trip' || flightType === 'multi-city') {
            returnFields.style.display = 'grid';
            returnDateInput.required = true;
            returnTimeInput.required = true;
        } else {
            returnFields.style.display = 'none';
            returnDateInput.required = false;
            returnTimeInput.required = false;
            returnDateInput.value = '';
            returnTimeInput.value = '';
        }
    }

    checkAvailability() {
        if (!this.validateFlightDetails()) {
            return;
        }

        this.showLoading();
        this.saveFlightData();

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.generateAircraftOptions();
            this.goToStep(2);
        }, 2000);
    }

    validateFlightDetails() {
        const form = document.getElementById('flight-details-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Additional validation
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        const flightType = document.getElementById('flight-type').value;

        if (flightType === 'round-trip' && returnDate && returnDate <= departureDate) {
            this.showFieldError(document.getElementById('return-date'), 'Return date must be after departure date');
            isValid = false;
        }

        return isValid;
    }

    saveFlightData() {
        const form = document.getElementById('flight-details-form');
        const formData = new FormData(form);
        
        this.bookingData.flight = {};
        for (let [key, value] of formData.entries()) {
            this.bookingData.flight[key] = value;
        }
    }

    generateAircraftOptions() {
        const serviceType = this.bookingData.flight['service-type'];
        const passengers = parseInt(this.bookingData.flight.passengers);
        const aircraftContainer = document.getElementById('aircraft-options');

        let aircraftOptions = [];

        if (serviceType === 'helicopter-charter' || serviceType === 'scenic-flight') {
            aircraftOptions = [
                {
                    id: 'as350',
                    name: 'Airbus AS350',
                    type: 'Single Engine Helicopter',
                    capacity: '5 passengers',
                    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop',
                    features: ['Air Conditioning', 'Leather Seats', 'Panoramic Windows', 'Noise Reduction'],
                    price: 1800,
                    available: passengers <= 5
                },
                {
                    id: 'as355',
                    name: 'Airbus AS355',
                    type: 'Twin Engine Helicopter',
                    capacity: '6 passengers',
                    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=200&fit=crop',
                    features: ['Twin Engine Safety', 'Executive Interior', 'Advanced Avionics', 'Weather Radar'],
                    price: 2400,
                    available: passengers <= 6
                },
                {
                    id: 'bell429',
                    name: 'Bell 429',
                    type: 'Light Twin Helicopter',
                    capacity: '7 passengers',
                    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
                    features: ['Premium Comfort', 'Large Cabin', 'Advanced Safety', 'Quiet Operation'],
                    price: 2800,
                    available: passengers <= 7
                }
            ];
        } else if (serviceType === 'private-jet') {
            aircraftOptions = [
                {
                    id: 'citation-cj3',
                    name: 'Citation CJ3+',
                    type: 'Light Business Jet',
                    capacity: '6 passengers',
                    image: 'https://images.unsplash.com/photo-1583500178690-d2071269d43d?w=300&h=200&fit=crop',
                    features: ['WiFi', 'Refreshment Center', 'Executive Seating', 'Baggage Compartment'],
                    price: 3200,
                    available: passengers <= 6
                },
                {
                    id: 'king-air-350',
                    name: 'King Air 350',
                    type: 'Turboprop Aircraft',
                    capacity: '8 passengers',
                    image: 'https://images.unsplash.com/photo-1512699355324-f07f7010d990?w=300&h=200&fit=crop',
                    features: ['Spacious Cabin', 'Club Seating', 'Galley', 'Lavatory'],
                    price: 2800,
                    available: passengers <= 8
                },
                {
                    id: 'citation-sovereign',
                    name: 'Citation Sovereign',
                    type: 'Mid-Size Business Jet',
                    capacity: '9 passengers',
                    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=300&h=200&fit=crop',
                    features: ['Stand-up Cabin', 'Full Galley', 'Private Lavatory', 'Entertainment System'],
                    price: 4500,
                    available: passengers <= 9
                }
            ];
        }

        // Filter available aircraft
        const availableAircraft = aircraftOptions.filter(aircraft => aircraft.available);

        // Generate HTML
        aircraftContainer.innerHTML = availableAircraft.map(aircraft => `
            <div class="aircraft-option" data-aircraft-id="${aircraft.id}">
                <div class="aircraft-image">
                    <img src="${aircraft.image}" alt="${aircraft.name}" loading="lazy">
                </div>
                <div class="aircraft-info">
                    <h3>${aircraft.name}</h3>
                    <p class="aircraft-type">${aircraft.type}</p>
                    <p class="aircraft-capacity">${aircraft.capacity}</p>
                    
                    <div class="aircraft-features">
                        ${aircraft.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    
                    <div class="aircraft-price">
                        <span class="price-label">From</span>
                        <span class="price-amount">$${aircraft.price.toLocaleString()}</span>
                        <span class="price-period">per flight</span>
                    </div>
                    
                    <button class="btn btn-outline select-aircraft" data-aircraft-id="${aircraft.id}">
                        Select Aircraft
                    </button>
                </div>
            </div>
        `).join('');

        // Bind aircraft selection events
        this.bindAircraftSelection();
    }

    bindAircraftSelection() {
        document.querySelectorAll('.select-aircraft').forEach(button => {
            button.addEventListener('click', (e) => {
                const aircraftId = e.target.dataset.aircraftId;
                this.selectAircraft(aircraftId);
            });
        });
    }

    selectAircraft(aircraftId) {
        // Remove previous selections
        document.querySelectorAll('.aircraft-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked aircraft
        const selectedOption = document.querySelector(`[data-aircraft-id="${aircraftId}"]`);
        selectedOption.classList.add('selected');

        // Update button text
        const button = selectedOption.querySelector('.select-aircraft');
        button.textContent = 'Selected';
        button.classList.remove('btn-outline');
        button.classList.add('btn-success');

        // Save aircraft data
        this.bookingData.aircraft = {
            id: aircraftId,
            element: selectedOption
        };

        // Enable continue button
        document.getElementById('continue-to-step3').disabled = false;
    }

    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.booking-step').forEach(stepElement => {
            stepElement.classList.remove('active');
        });

        // Show target step
        document.getElementById(`step-${step}`).classList.add('active');

        // Update progress
        this.updateProgress(step);
        this.currentStep = step;

        // Special handling for step 3
        if (step === 3) {
            this.initializePassengerForm();
        }

        // Special handling for step 4
        if (step === 4) {
            this.generateBookingSummary();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    updateProgress(step) {
        document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
            if (index + 1 <= step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
    }

    initializePassengerForm() {
        const passengerCount = parseInt(this.bookingData.flight.passengers);
        this.generatePassengerFields(passengerCount);
    }

    generatePassengerFields(count) {
        const container = document.getElementById('additional-passengers');
        if (!container) return;

        // Clear existing fields
        container.innerHTML = '';

        // Generate fields for additional passengers (excluding primary contact)
        for (let i = 2; i <= count; i++) {
            const passengerHtml = `
                <div class="passenger-group">
                    <h4>Passenger ${i}</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="passenger-${i}-title">Title *</label>
                            <select id="passenger-${i}-title" name="passenger-${i}-title" required>
                                <option value="">Select Title</option>
                                <option value="mr">Mr.</option>
                                <option value="mrs">Mrs.</option>
                                <option value="ms">Ms.</option>
                                <option value="dr">Dr.</option>
                                <option value="prof">Prof.</option>
                                <option value="master">Master</option>
                                <option value="miss">Miss</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="passenger-${i}-first-name">First Name *</label>
                            <input type="text" id="passenger-${i}-first-name" name="passenger-${i}-first-name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="passenger-${i}-last-name">Last Name *</label>
                            <input type="text" id="passenger-${i}-last-name" name="passenger-${i}-last-name" required>
                        </div>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="passenger-${i}-age">Age</label>
                            <select id="passenger-${i}-age" name="passenger-${i}-age">
                                <option value="">Select Age Group</option>
                                <option value="adult">Adult (18+)</option>
                                <option value="child">Child (2-17)</option>
                                <option value="infant">Infant (0-2)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="passenger-${i}-special-needs">Special Requirements</label>
                            <input type="text" id="passenger-${i}-special-needs" name="passenger-${i}-special-needs" placeholder="Dietary restrictions, accessibility needs, etc.">
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += passengerHtml;
        }
    }

    validatePassengerInfo() {
        const form = document.getElementById('passenger-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validate email format
        const emailField = document.getElementById('contact-email');
        if (emailField.value && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    generateBookingSummary() {
        const summaryContainer = document.getElementById('booking-summary');
        const flightData = this.bookingData.flight;
        const aircraftData = this.bookingData.aircraft;

        // Get aircraft details
        const aircraftElement = aircraftData.element;
        const aircraftName = aircraftElement.querySelector('h3').textContent;
        const aircraftPrice = parseInt(aircraftElement.querySelector('.price-amount').textContent.replace(/[$,]/g, ''));

        // Calculate pricing
        const basePrice = aircraftPrice;
        const airportFees = 150;
        const fuelSurcharge = Math.round(basePrice * 0.1);
        const serviceFee = 100;
        const subtotal = basePrice + airportFees + fuelSurcharge + serviceFee;
        const vat = Math.round(subtotal * 0.16);
        const total = subtotal + vat;

        const summaryHtml = `
            <div class="summary-section">
                <h4>Flight Details</h4>
                <div class="summary-item">
                    <span>Route:</span>
                    <span>${this.getLocationName(flightData['departure-location'])} → ${this.getLocationName(flightData['destination-location'])}</span>
                </div>
                <div class="summary-item">
                    <span>Date:</span>
                    <span>${this.formatDate(flightData['departure-date'])} at ${this.formatTime(flightData['departure-time'])}</span>
                </div>
                <div class="summary-item">
                    <span>Passengers:</span>
                    <span>${flightData.passengers} passenger(s)</span>
                </div>
                <div class="summary-item">
                    <span>Aircraft:</span>
                    <span>${aircraftName}</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4>Pricing Breakdown</h4>
                <div class="summary-item">
                    <span>Base Charter Fee:</span>
                    <span>$${basePrice.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span>Airport Fees:</span>
                    <span>$${airportFees}</span>
                </div>
                <div class="summary-item">
                    <span>Fuel Surcharge:</span>
                    <span>$${fuelSurcharge}</span>
                </div>
                <div class="summary-item">
                    <span>Service Fee:</span>
                    <span>$${serviceFee}</span>
                </div>
                <div class="summary-item subtotal">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span>VAT (16%):</span>
                    <span>$${vat.toLocaleString()}</span>
                </div>
                <div class="summary-item total">
                    <span>Total:</span>
                    <span>$${total.toLocaleString()}</span>
                </div>
            </div>
        `;

        summaryContainer.innerHTML = summaryHtml;

        // Save pricing data
        this.bookingData.pricing = {
            basePrice,
            airportFees,
            fuelSurcharge,
            serviceFee,
            subtotal,
            vat,
            total
        };
    }

    initializePaymentMethods() {
        // Set up payment method switching
        this.togglePaymentFields('card'); // Default to card
    }

    togglePaymentFields(method) {
        const cardDetails = document.getElementById('card-details');
        
        if (method === 'card') {
            cardDetails.style.display = 'block';
            this.setCardFieldsRequired(true);
        } else {
            cardDetails.style.display = 'none';
            this.setCardFieldsRequired(false);
        }
    }

    setCardFieldsRequired(required) {
        const cardFields = ['card-number', 'expiry-date', 'cvv', 'cardholder-name'];
        cardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = required;
            }
        });
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') ?? value;
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    completeBooking() {
        if (!this.validatePayment()) {
            return;
        }

        this.showLoading('Processing your booking...');

        // Simulate payment processing
        setTimeout(() => {
            this.hideLoading();
            this.generateBookingReference();
            this.goToStep(5);
        }, 3000);
    }

    validatePayment() {
        const termsCheckbox = document.getElementById('terms-agreement');
        if (!termsCheckbox.checked) {
            alert('Please accept the Terms and Conditions to proceed.');
            return false;
        }

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (paymentMethod === 'card') {
            const cardFields = ['card-number', 'expiry-date', 'cvv', 'cardholder-name'];
            for (let fieldId of cardFields) {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    this.showFieldError(field, 'This field is required');
                    return false;
                }
            }

            // Basic card validation
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                this.showFieldError(document.getElementById('card-number'), 'Invalid card number');
                return false;
            }

            const expiryDate = document.getElementById('expiry-date').value;
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                this.showFieldError(document.getElementById('expiry-date'), 'Invalid expiry date format');
                return false;
            }

            const cvv = document.getElementById('cvv').value;
            if (cvv.length < 3 || cvv.length > 4) {
                this.showFieldError(document.getElementById('cvv'), 'Invalid CVV');
                return false;
            }
        }

        return true;
    }

    generateBookingReference() {
        const reference = 'RJA-' + new Date().getFullYear() + '-' + 
                         Math.random().toString(36).substr(2, 6).toUpperCase();
        
        this.bookingData.reference = reference;
        
        // Display confirmation details
        const confirmationContainer = document.getElementById('confirmation-details');
        const flightData = this.bookingData.flight;
        
        confirmationContainer.innerHTML = `
            <div class="confirmation-card">
                <h3>Booking Reference: ${reference}</h3>
                <p>Your flight from ${this.getLocationName(flightData['departure-location'])} to ${this.getLocationName(flightData['destination-location'])} has been confirmed.</p>
                <p>A confirmation email has been sent to your registered email address.</p>
            </div>
        `;
    }

    // Utility functions
    getLocationName(code) {
        const locations = {
            'nairobi-wilson': 'Nairobi (Wilson)',
            'nairobi-jkia': 'Nairobi (JKIA)',
            'mombasa': 'Mombasa',
            'kisumu': 'Kisumu',
            'malindi': 'Malindi',
            'lamu': 'Lamu',
            'masai-mara': 'Masai Mara',
            'samburu': 'Samburu',
            'zanzibar': 'Zanzibar',
            'serengeti': 'Serengeti',
            'kigali': 'Kigali',
            'kampala': 'Kampala'
        };
        return locations[code] || code;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showLoading(message = 'Processing...') {
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

    initializeFormValidation() {
        // Real-time validation for required fields
        document.querySelectorAll('input[required], select[required]').forEach(field => {
            field.addEventListener('blur', () => {
                if (!field.value.trim()) {
                    this.showFieldError(field, 'This field is required');
                } else {
                    this.clearFieldError(field);
                }
            });

            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    this.clearFieldError(field);
                }
            });
        });
    }
}

// Initialize booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new BookingSystem();
});

// Add styles for booking system
const bookingStyles = `
    .aircraft-option {
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .aircraft-option:hover {
        border-color: #dc2626;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
    }

    .aircraft-option.selected {
        border-color: #dc2626;
        background-color: #fef2f2;
    }

    .aircraft-image img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .aircraft-features {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 15px 0;
    }

    .feature-tag {
        background-color: #f3f4f6;
        color: #374151;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }

    .aircraft-price {
        display: flex;
        align-items: baseline;
        gap: 5px;
        margin: 15px 0;
    }

    .price-amount {
        font-size: 24px;
        font-weight: 700;
        color: #dc2626;
    }

    .field-error {
        color: #dc2626;
        font-size: 12px;
        margin-top: 4px;
    }

    .form-group input.error,
    .form-group select.error {
        border-color: #dc2626;
    }

    .passenger-group {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .booking-summary {
        background-color: #f9fafb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .summary-item.subtotal,
    .summary-item.total {
        font-weight: 600;
        border-top: 2px solid #dc2626;
        margin-top: 10px;
        padding-top: 10px;
    }

    .summary-item.total {
        font-size: 18px;
        color: #dc2626;
    }

    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .loading-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .loading-spinner {
        background-color: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
    }

    .spinner {
        border: 4px solid #f3f4f6;
        border-top: 4px solid #dc2626;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .progress-steps {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin: 40px 0;
    }

    .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }

    .progress-step.active {
        opacity: 1;
    }

    .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #e5e7eb;
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-bottom: 8px;
        transition: all 0.3s ease;
    }

    .progress-step.active .step-number {
        background-color: #dc2626;
        color: white;
    }

    .step-label {
        font-size: 12px;
        text-align: center;
        color: #6b7280;
    }

    .progress-step.active .step-label {
        color: #dc2626;
        font-weight: 600;
    }

    .payment-options {
        display: grid;
        gap: 15px;
        margin-bottom: 30px;
    }

    .payment-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .payment-option:hover {
        border-color: #dc2626;
    }

    .payment-option input[type="radio"]:checked + label {
        color: #dc2626;
    }

    .terms-conditions {
        margin: 20px 0;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .confirmation-icon {
        font-size: 80px;
        color: #10b981;
        text-align: center;
        margin-bottom: 20px;
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .progress-steps {
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .aircraft-option {
            padding: 15px;
        }
    }
`;

// Inject styles
if (!document.getElementById('booking-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'booking-styles';
    styleSheet.textContent = bookingStyles;
    document.head.appendChild(styleSheet);
}